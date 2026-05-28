# Kitch: Antigravity SDK Safety Policies

from google.antigravity import Policies

# 1. Establish strict 'deny by default' governance policies
safety_policy = Policies(
    # Allow safe database queries and porting math
    allow=[
        "get_recipes", 
        "scale_ingredients"
    ],
    
    # Block highly sensitive execution actions
    deny=[
        "shell_execute", 
        "network_post",
        "file_delete"
    ],
    
    # Declarative Human-in-the-Loop review policies:
    # Pauses the autonomous running loop and awaits web UI approval before proceeding!
    ask_user=[
        "export_to_delivery"
    ]
)
