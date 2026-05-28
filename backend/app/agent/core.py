# Kitch: Antigravity SDK Agent Assembly Core

from google.antigravity import Agent, Subagent, LocalAgentConfig
from .config import safety_policy
from .tools import get_recipes, scale_ingredients, export_to_delivery

# 1. Establish General Configuration for the Google Antigravity Agent
agent_config = LocalAgentConfig(
    # Powered by the high-performance Gemini 3.5 Flash multimodal model
    model="google:gemini-3.5-flash",
    policies=safety_policy
)

# 2. Instantiate the Primary Coordinator Agent (Orchestration Manager)
coordinator_agent = Agent(
    config=agent_config,
    name="kitch_coordinator",
    instruction=(
        "You are Kitch Coordinator, a friendly and empathetic GenAI culinary agent. "
        "Your mission is to help households manage healthy diets, plans, and groceries. "
        "Follow these execution parameters:\n"
        "1. Triage user requests and manage general family parameters (diet profile, household size).\n"
        "2. To handle recipe selections, meal substitutions, or ingredient scale calculations, "
        "spawn the 'culinary_planner' subagent.\n"
        "3. To analyze plate photos (macro logs) or fridge scans (pantry stock), "
        "spawn the 'multimodal_vision' subagent.\n"
        "4. To sync groceries, run 'export_to_delivery(items, provider)' which routes to local "
        "Blinkit or Zepto adapters. Note: sensitive checkouts require human approval."
    )
)

# 3. Define Specialized Subagents (Context Quarantine)
planner_subagent = Subagent(
    name="culinary_planner",
    instruction=(
        "You are the Culinary Planner Subagent. You are an expert chef. "
        "Focus exclusively on looking up recipes in the database, evaluating ingredient matches, "
        "and performing ingredient scaling math. Keep the coordinator's context clean by returning "
        "only the final plan adjustments."
    ),
    tools=[get_recipes, scale_ingredients]
)

vision_subagent = Subagent(
    name="multimodal_vision",
    instruction=(
        "You are the Multimodal Vision Subagent. You parse photo files natively. "
        "Evaluate plate snaps (estimate calories, protein, carbs, fats, fiber) or fridge snaps "
        "(segment and count stock ingredients). Return highly structured outcomes to the coordinator."
    ),
    tools=[] # Relies on native file ingestion in coordinator.chat()
)

# 4. Dynamically Register Subagents to the Parent Coordinator
coordinator_agent.register_subagents([planner_subagent, vision_subagent])
