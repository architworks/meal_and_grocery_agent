# Technical Implementation Plan: PlateWise AI (Pure Antigravity SDK)

This plan outlines the technical design, backend architecture, and execution blueprint for **PlateWise AI** using the **Google Antigravity SDK** (`google-antigravity`) as our exclusive agentic harness. We have **removed all LangGraph and LangChain dependencies** and decoupled our grocery core from specific delivery platforms.

---

## 1. Technical Architecture & Component Breakdown

The backend is built as a Python microservice wrapping the Antigravity SDK. The frontend communicates with this microservice via asynchronous API routes. We introduce a **Decoupled Delivery Integration Layer (Provider Pattern)** to support pluggable merchant adapters (Blinkit, Zepto, etc.) without impacting our core logic.

```mermaid
graph TD
    subgraph Frontend Interfaces
        WebDash[Web Dashboard]
        ChatBot[Telegram / WhatsApp Bot]
    end
    
    subgraph Python Backend Microservice
        API[FastAPI Gateway]
        
        subgraph Google Antigravity SDK Harness
            Coord[PlateWise Coordinator Agent]
            Coord -->|Dynamic Subagent Spawning| Planner[Culinary Planner Subagent]
            Coord -->|Dynamic Subagent Spawning| Vision[Vision Subagent]
        end
        
        LocalDB[(SQLite / PostgreSQL)]
        
        subgraph Modular Delivery Adapter Layer
            Router[Delivery Provider Router]
            Router -->|Blinkit Adapter| BlinkitMCP[Blinkit MCP Client]
            Router -->|Zepto Adapter| ZeptoMCP[Zepto MCP Client]
            Router -->|Future Adapter| InstacartAPI[Instacart / API Client]
        end
    end

    WebDash & ChatBot <--> API
    API <--> Coord
    Coord <--> LocalDB
    LocalDB -->|Stores Intermediary List| Router
    Router -->|Requires Approval| WebDash & ChatBot
