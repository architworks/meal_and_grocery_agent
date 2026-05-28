# PlateWise AI: Antigravity SDK Decide Lifecycle Hooks

from google.antigravity import Decide

@Decide(tools=["export_to_delivery"])
def verify_checkout_payload(tool_call):
    """
    Decide Lifecycle Hook: Runs synchronously when the 'export_to_delivery' 
    tool is selected by the model. 
    Allows inspecting parameters in transit before executing.
    """
    args = tool_call.arguments
    provider = args.get("provider", "blinkit").lower().strip()
    
    # 1. Enforce supported merchants
    if provider not in ["blinkit", "zepto"]:
        raise ValueError(f"Decide Hook Rejected: Pluggable provider '{provider}' is not supported yet.")
    
    # 2. Check for empty cart list items
    items = args.get("items", [])
    if not items and len(items) == 0:
        raise ValueError("Decide Hook Rejected: Cannot synchronize an empty cart list.")
        
    # Return True to allow execution to proceed to the 'ask_user' policy approval trigger
    return True
