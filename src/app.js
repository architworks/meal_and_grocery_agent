// PlateWise AI - Core Application State & Controller

import { DIET_TYPES, RECIPES, DEFAULT_WEEKLY_PLAN, IMAGE_CATALOG } from './mockData.js';
import { processChatMessage, simulatePhotoScan } from './engine.js';

// Default welcome messaging
const INITIAL_CHAT = [
  {
    sender: "agent",
    text: "👋 **Welcome back to PlateWise!** I am your GenAI Culinary Companion.\n\nI have scaled your weekly meal plan for your **3-person household**. \n\n✨ **New Capabilities Enabled:**\n1. **Individual Macro Logs:** Select your active user in the header. We track macros separately for each housemate!\n2. **Pantry Subtraction:** Upload a picture of your fridge shelves using the camera simulation, or type *'We have 6 eggs'* to automatically subtract existing stocks from your grocery cart!\n3. **Blinkit MCP:** Ready to export your finalized grocery checklist to Blinkit via MCP commands.",
    time: "09:00 AM"
  }
];

export class PlateWiseApp {
  constructor() {
    this.loadState();
    this.isChatTyping = false;
    this.activeTab = "planner"; // planner, analytics, groceries
  }

  /**
   * Initializes state from localStorage or sets high-fidelity defaults
   */
  loadState() {
    const saved = localStorage.getItem("platewise_state_v2");
    if (saved) {
      try {
        this.state = JSON.parse(saved);
        // Clean migration checks
        if (!this.state.userProfiles) {
          this.state.userProfiles = {
            "Dynamite": { name: "Dynamite", loggedMeals: [] },
            "Housemate A": { name: "Housemate A", loggedMeals: [] },
            "Housemate B": { name: "Housemate B", loggedMeals: [] }
          };
        }
        if (!this.state.activeUser) this.state.activeUser = "Dynamite";
        if (!this.state.pantryStock) this.state.pantryStock = [
          { name: "Cabbage head", amount: 1, unit: "whole" },
          { name: "Whole wheat bread slices", amount: 2, unit: "slice" }
        ];
        return;
      } catch (e) {
        console.error("Failed to parse saved state, resetting...", e);
      }
    }

    // Default state for Phase 2
    this.state = {
      householdSize: 3,
      dietPreference: "balanced",
      weeklyPlan: { ...DEFAULT_WEEKLY_PLAN.balanced },
      activeUser: "Dynamite",
      userProfiles: {
        "Dynamite": { name: "Dynamite", loggedMeals: [] },
        "Housemate A": { name: "Housemate A", loggedMeals: [] },
        "Housemate B": { name: "Housemate B", loggedMeals: [] }
      },
      pantryStock: [
        { name: "Cabbage head", amount: 1, unit: "whole" },
        { name: "Whole wheat bread slices", amount: 2, unit: "slice" }
      ],
      chatHistory: [...INITIAL_CHAT],
      groceryList: []
    };
    
    this.regenerateGroceryList();
    this.saveState();
  }

  saveState() {
    localStorage.setItem("platewise_state_v2", JSON.stringify(this.state));
  }

  /**
   * Scales weekly plan ingredients, subtracts pantry stocks, and aggregates lists
   */
  regenerateGroceryList() {
    const scaleFactor = this.state.householdSize;
    const aggregated = {};

    // Keep track of ticked items to preserve check status
    const oldCheckedMap = {};
    if (this.state.groceryList) {
      this.state.groceryList.forEach(item => {
        if (item.checked && !item.alreadyStocked) oldCheckedMap[item.name.toLowerCase()] = true;
      });
    }

    // 1. Gather all required ingredients from the active plan
    Object.keys(this.state.weeklyPlan).forEach(day => {
      const meals = this.state.weeklyPlan[day];
      Object.keys(meals).forEach(mealType => {
        const recipeId = meals[mealType];
        const recipe = RECIPES.find(r => r.id === recipeId);
        
        if (recipe) {
          recipe.ingredients.forEach(ing => {
            const key = ing.name.toLowerCase().trim();
            const scaledAmount = ing.amount * scaleFactor;

            if (aggregated[key]) {
              aggregated[key].amount += scaledAmount;
            } else {
              let category = "Pantry & Spices";
              const name = key;
              if (name.includes("chicken") || name.includes("steak") || name.includes("salmon") || name.includes("beef") || name.includes("egg") || name.includes("tofu")) {
                category = "Proteins & Dairy";
              } else if (name.includes("avocado") || name.includes("broccoli") || name.includes("spinach") || name.includes("asparagus") || name.includes("tomato") || name.includes("cucumber") || name.includes("onion") || name.includes("pepper") || name.includes("berry") || name.includes("raspberries") || name.includes("blueberries")) {
                category = "Fresh Produce";
              } else if (name.includes("bread") || name.includes("oats") || name.includes("quinoa") || name.includes("rice") || name.includes("tortilla") || name.includes("chia")) {
                category = "Grains & Bakery";
              }

              aggregated[key] = {
                name: ing.name,
                amount: scaledAmount,
                unit: ing.unit,
                category,
                checked: false,
                alreadyStocked: false
              };
            }
          });
        }
      });
    });

    // 2. Subtract Pantry Inventory stocks from the required list
    this.state.pantryStock.forEach(pantryItem => {
      const key = pantryItem.name.toLowerCase().trim();
      if (aggregated[key]) {
        // Subtract amounts
        aggregated[key].amount = Math.max(0, aggregated[key].amount - pantryItem.amount);
        
        // If required amount drops to 0, mark as completely stocked!
        if (aggregated[key].amount === 0) {
          aggregated[key].alreadyStocked = true;
          aggregated[key].checked = true;
        }
      }
    });

    // Merge in old checked state
    Object.keys(aggregated).forEach(key => {
      if (oldCheckedMap[key]) {
        aggregated[key].checked = true;
      }
    });

    this.state.groceryList = Object.values(aggregated);
  }

  /**
   * Switches dietary profile and updates plan + groceries
   */
  switchDiet(dietType) {
    if (DIET_TYPES[dietType]) {
      this.state.dietPreference = dietType;
      this.state.weeklyPlan = { ...DEFAULT_WEEKLY_PLAN[dietType] };
      this.regenerateGroceryList();
      this.saveState();
      this.render();
    }
  }

  /**
   * Updates the recipe in a specific day & meal type slot
   */
  updateMeal(day, mealType, recipeId) {
    if (this.state.weeklyPlan[day]) {
      this.state.weeklyPlan[day][mealType] = recipeId;
      this.regenerateGroceryList();
      this.saveState();
      this.render();
    }
  }

  /**
   * Scales household size and re-adjusts ingredient quantities
   */
  updateHouseholdSize(size) {
    this.state.householdSize = Math.max(1, parseInt(size) || 1);
    this.regenerateGroceryList();
    this.saveState();
    this.render();
  }

  /**
   * Switch the active user profile
   */
  switchActiveUser(userName) {
    if (this.state.userProfiles[userName]) {
      this.state.activeUser = userName;
      this.saveState();
      this.render();
    }
  }

  /**
   * Add an item manually to the pantry stock inventory
   */
  addPantryItem(name, amount, unit = "piece") {
    if (!name.trim()) return;
    const key = name.toLowerCase().trim();
    const existing = this.state.pantryStock.find(i => i.name.toLowerCase() === key);
    
    if (existing) {
      existing.amount += parseFloat(amount) || 1;
    } else {
      this.state.pantryStock.push({
        name: name.trim(),
        amount: parseFloat(amount) || 1,
        unit
      });
    }

    this.regenerateGroceryList();
    this.saveState();
    this.render();
  }

  /**
   * Delete a pantry item
   */
  removePantryItem(index) {
    if (index >= 0 && index < this.state.pantryStock.length) {
      this.state.pantryStock.splice(index, 1);
      this.regenerateGroceryList();
      this.saveState();
      this.render();
    }
  }

  /**
   * Toggles item checked state in the grocery cart
   */
  toggleGroceryItem(itemName) {
    const item = this.state.groceryList.find(i => i.name.toLowerCase() === itemName.toLowerCase());
    if (item) {
      item.checked = !item.checked;
      this.saveState();
      this.render();
    }
  }

  /**
   * Adds custom user item to grocery checklist
   */
  addCustomGroceryItem(name, category = "Pantry & Spices") {
    if (name.trim()) {
      this.state.groceryList.push({
        name: name.trim(),
        amount: 1,
        unit: "piece",
        category,
        checked: false,
        alreadyStocked: false
      });
      this.saveState();
      this.render();
    }
  }

  /**
   * Logs a meal to the active user's daily nutritional journal
   */
  logMeal(name, calories, protein, carbs, fat, fiber) {
    const active = this.state.activeUser;
    const meal = {
      name,
      calories,
      macros: { protein, carbs, fat, fiber },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    if (!this.state.userProfiles[active]) {
      this.state.userProfiles[active] = { name: active, loggedMeals: [] };
    }
    this.state.userProfiles[active].loggedMeals.push(meal);

    this.saveState();
    this.render();
  }

  /**
   * Sends a user chat message and triggers simulated LLM processing
   */
  async sendChatMessage(text) {
    if (!text.trim() || this.isChatTyping) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.state.chatHistory.push({ sender: "user", text, time });
    this.saveState();
    this.render();

    this.isChatTyping = true;
    this.render();

    try {
      const response = await processChatMessage(text, this.state);
      this.state.chatHistory.push({
        sender: "agent",
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      if (response.action) {
        this.executeAIAction(response.action);
      }
    } catch (e) {
      console.error(e);
      this.state.chatHistory.push({
        sender: "agent",
        text: "Sorry, I had trouble parsing that. Please try again!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      this.isChatTyping = false;
      this.saveState();
      this.render();
    }
  }

  /**
   * Executes background updates instructed by the GenAI Agent
   */
  executeAIAction(action) {
    if (action.type === "SWITCH_DIET") {
      this.state.dietPreference = action.dietPreference;
      this.state.weeklyPlan = action.weeklyPlan;
      this.regenerateGroceryList();
      this.triggerBannerAlert(action.alert);
    } else if (action.type === "UPDATE_PLANNER") {
      this.state.weeklyPlan = action.weeklyPlan;
      this.regenerateGroceryList();
      this.triggerBannerAlert(action.alert);
    } else if (action.type === "UPDATE_PANTRY") {
      this.addPantryItem(action.itemName, action.amount, action.unit);
      this.triggerBannerAlert(action.alert);
    }
  }

  triggerBannerAlert(msg) {
    const alertDiv = document.createElement("div");
    alertDiv.className = "ai-banner-alert";
    alertDiv.innerHTML = `<span>✨ Agent Sync: ${msg}</span>`;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      alertDiv.classList.add("show");
    }, 100);
    setTimeout(() => {
      alertDiv.classList.remove("show");
      setTimeout(() => alertDiv.remove(), 400);
    }, 4000);
  }

  /**
   * Triggers a visual plate or fridge scanning workflow
   */
  async handlePhotoUpload(fileName) {
    this.state.chatHistory.push({
      sender: "user",
      text: `📷 *Uploaded photo target: ${fileName}*`,
      image: fileName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    this.render();

    this.isChatTyping = true;
    this.render();

    // Trigger visual scanner workflow
    const scan = await simulatePhotoScan(fileName, this.state);
    let details = "";

    if (scan.result.isFridgeScan) {
      // It's a fridge scan! Update pantry stocks rather than user meal logs
      scan.result.detectedIngredients.forEach(item => {
        const key = item.name.toLowerCase().trim();
        const existing = this.state.pantryStock.find(i => i.name.toLowerCase() === key);
        if (existing) {
          existing.amount += item.amount;
        } else {
          this.state.pantryStock.push({
            name: item.name,
            amount: item.amount,
            unit: item.unit
          });
        }
      });

      this.regenerateGroceryList();

      details = `🤖 **PlateVision OCR Fridge Scan Complete!**
Parsed shelving layout and located **${scan.result.detectedIngredients.length} ingredients**:

${scan.result.detectedIngredients.map(i => `• **${i.amount} ${i.unit}** of *${i.name}*`).join("\n")}

*I have successfully updated your Pantry Inventory and subtracted these existing ingredients from your weekly grocery ordering list!*`;

    } else {
      // Standard individual plate scan
      const active = this.state.activeUser;
      details = `🤖 **PlateVision OCR Plate Scan Complete!**
Identified recipe: **${scan.result.name}**

*   **Logged to Profile:** ${active}
*   **Macro estimation:** ${scan.result.calories} kcal | ${scan.result.macros.protein}g Protein | ${scan.result.macros.carbs}g Carbs | ${scan.result.macros.fat}g Fat.
*   **Segmented ingredients:** 
    ${scan.result.detectedIngredients.map(i => `• ${i}`).join("\n    ")}

*I have successfully logged these macros into **${active}'s** personal nutrient diary today!*`;

      // Add to logged meals
      this.logMeal(
        scan.result.name,
        scan.result.calories,
        scan.result.macros.protein,
        scan.result.macros.carbs,
        scan.result.macros.fat,
        scan.result.macros.fiber
      );
    }

    this.state.chatHistory.push({
      sender: "agent",
      text: details,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.isChatTyping = false;
    this.saveState();
    this.render();
  }

  /**
   * Resets all logs for the current day for the active user
   */
  resetDailyLogs() {
    const active = this.state.activeUser;
    if (this.state.userProfiles[active]) {
      this.state.userProfiles[active].loggedMeals = [];
    }
    this.saveState();
    this.render();
  }

  // Bind register hook for render calls
  registerRenderCallback(callback) {
    this.renderCallback = callback;
  }

  render() {
    if (this.renderCallback) {
      this.renderCallback(this.state, this);
    }
  }
}
