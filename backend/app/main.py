# Kitch: FastAPI Production Gateway Server

import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
from dotenv import load_dotenv

from app.schemas import ChatRequest, ChatResponse, PantryAddRequest
from app.agent.core import coordinator_agent
from app.agent.tools import calculate_intermediary_grocery_list, export_to_delivery

load_dotenv()

app = FastAPI(
    title="Kitch Backend Gateway",
    description="Python microservice running the Google Antigravity SDK agentic loops.",
    version="2.0.0"
)

# Enable CORS for Next.js frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to Vercel domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Conversational Chat Agent Endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest):
    """
    Exposes conversational chat. Interfaces with the Kitch Coordinator
    running the Antigravity SDK loops.
    """
    try:
        # Construct conversational query including current context (plan, stock, household)
        prompt = (
            f"User Profile: {payload.active_user}\n"
            f"Diet Preference: {payload.diet_preference}\n"
            f"Household Size: {payload.household_size}\n"
            f"Current Pantry Stock: {payload.pantry_stock}\n"
            f"Current Weekly Plan: {payload.weekly_plan}\n\n"
            f"User Message: {payload.message}"
        )
        
        # Run autonomous chat turn using Antigravity Agent
        response = await coordinator_agent.chat(prompt)
        text_reply = await response.text()
        
        # Detect if the model triggered grocery lists or plan updates
        action = None
        text_lower = text_reply.lower()
        
        # Simple action detection hooks for visual syncs
        if "swapped" in text_lower or "modified your meal plan" in text_lower:
            action = {"type": "UPDATE_PLANNER"}
        elif "dietary alignment complete" in text_lower or "switched dietary profile" in text_lower:
            action = {"type": "SWITCH_DIET"}
        elif "added" in text_lower and "pantry" in text_lower:
            action = {"type": "UPDATE_PANTRY"}
            
        return ChatResponse(text=text_reply, action=action)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. Visual Photo Ingestion & OCR Scanner Endpoint
@app.post("/api/upload-photo")
async def upload_photo_endpoint(
    file: UploadFile = File(...),
    active_user: str = Form(...),
    is_fridge_scan: bool = Form(False)
):
    """
    Natively ingests food plate or fridge interior images utilizing 
    Antigravity's native file handlers. Logs outcomes to Supabase / client.
    """
    try:
        file_bytes = await file.read()
        file_name = file.filename
        
        prompt = ""
        if is_fridge_scan:
            prompt = "Analyze this fridge shelf photo, segment and list all ingredients present."
        else:
            prompt = f"Identify this meal plate, estimate calories and macronutrients for {active_user}."
            
        # Natively inject file bytes directly to the Antigravity loop
        response = await coordinator_agent.chat(
            prompt,
            files=[{
                "name": file_name,
                "bytes": file_bytes,
                "mime_type": file.content_type
            }]
        )
        text_reply = await response.text()
        
        return {
            "result": text_reply,
            "isFridgeScan": is_fridge_scan,
            "filename": file_name
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. Dynamic Pantry Calculations Route
@app.post("/api/grocery/calculate")
async def calculate_grocery_endpoint(payload: Dict[str, Any]):
    """
    Decoupled Calculations Route:
    Receives current weekly plan, household size, and pantry stock,
    and returns the intermediary platform-agnostic required shopping list.
    """
    try:
        weekly_plan = payload.get("weekly_plan", {})
        household_size = int(payload.get("household_size", 3))
        pantry_stock = payload.get("pantry_stock", [])
        
        grocery_list = calculate_intermediary_grocery_list(
            weekly_plan=weekly_plan,
            household_size=household_size,
            pantry_stock=pantry_stock
        )
        return {"grocery_list": grocery_list}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Blinkit / Zepto MCP Checkout Exporter Route
@app.post("/api/grocery/export")
async def export_grocery_endpoint(payload: Dict[str, Any]):
    """
    Decoupled Checkout: Maps intermediary list items to Blinkit/Zepto adapters
    and returns MCP tool payload results.
    """
    try:
        items = payload.get("items", [])
        provider = payload.get("provider", "blinkit")
        
        result = export_to_delivery(items=items, provider=provider)
        return {"status": "success", "result": result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "engine": "google-antigravity"}
