// PlateWise AI - Main Application Wireframe Orchestrator

import './style.css';
import { PlateWiseApp } from './app.js';
import { RECIPES, DIET_TYPES } from './mockData.js';

document.addEventListener("DOMContentLoaded", () => {
  const app = new PlateWiseApp();

  // Selected state for Modal meal swaps
  let activeModalDay = null;
  let activeModalMealType = null;

  // DOM Elements - Header
  const dietSelector = document.getElementById("diet-selector");
  const householdInput = document.getElementById("household-size");
  const profileSelector = document.getElementById("profile-selector");

  // DOM Elements - Tabs
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  // DOM Elements - Planner
  const weeklyPlanGrid = document.getElementById("weekly-plan-grid");
  const plannerHeading = document.getElementById("planner-household-heading");

  // DOM Elements - Analytics
  const calorieDialFill = document.getElementById("calorie-dial-fill");
  const loggedCaloriesNum = document.getElementById("logged-calories-num");
  const targetCaloriesNum = document.getElementById("target-calories-num");
  const caloriePercentageBadge = document.getElementById("calorie-percentage-badge");
  const calorieTrackerUserTitle = document.getElementById("calorie-tracker-user-title");
  const proteinTargetVal = document.getElementById("protein-target-val");
  const proteinLoggedVal = document.getElementById("protein-logged-val");
  const proteinBarFill = document.getElementById("protein-bar-fill");
  const carbsTargetVal = document.getElementById("carbs-target-val");
  const carbsLoggedVal = document.getElementById("carbs-logged-val");
  const carbsBarFill = document.getElementById("carbs-bar-fill");
  const fatTargetVal = document.getElementById("fat-target-val");
  const fatLoggedVal = document.getElementById("fat-logged-val");
  const fatBarFill = document.getElementById("fat-bar-fill");
  const diaryList = document.getElementById("diary-list");
  const diaryUserHeading = document.getElementById("diary-user-heading");
  const clearDiaryBtn = document.getElementById("clear-diary-btn");

  // DOM Elements - Grocery
  const groceryListGrid = document.getElementById("grocery-list-grid");
  const groceryCustomName = document.getElementById("grocery-custom-name");
  const groceryCustomCat = document.getElementById("grocery-custom-cat");
  const groceryAddItemBtn = document.getElementById("grocery-add-item-btn");
  const groceryTotalCount = document.getElementById("grocery-total-count");
  const groceryCheckedCount = document.getElementById("grocery-checked-count");
  const groceryCheckoutBtn = document.getElementById("grocery-checkout-btn");

  // DOM Elements - Pantry Inventory
  const pantryStockList = document.getElementById("pantry-stock-list");
  const pantryAddName = document.getElementById("pantry-add-name");
  const pantryAddAmount = document.getElementById("pantry-add-amount");
  const pantryAddUnit = document.getElementById("pantry-add-unit");
  const pantryAddBtn = document.getElementById("pantry-add-btn");

  // DOM Elements - Chat Simulator
  const chatMessages = document.getElementById("chat-messages");
  const chatInputForm = document.getElementById("chat-input-form");
  const chatUserInput = document.getElementById("chat-user-input");
  const photoButtons = document.querySelectorAll(".photo-btn");
  const visionScanner = document.getElementById("vision-scanner");
  const scanTargetImg = document.getElementById("scan-target-img");
  const scanTerminalLog = document.getElementById("scan-terminal-log");
  const scannerTitleText = document.getElementById("scanner-title-text");

  // DOM Elements - Modal Recipe Swap
  const recipeModal = document.getElementById("recipe-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalRecipeList = document.getElementById("modal-recipe-list");
  const modalHeadingText = document.getElementById("modal-heading-text");

  // DOM Elements - Modal MCP review
  const mcpModal = document.getElementById("mcp-modal");
  const mcpCloseBtn = mcpModal.querySelector("#mcp-close-btn");
  const mcpRejectBtn = document.getElementById("mcp-reject-btn");
  const mcpApproveBtn = document.getElementById("mcp-approve-btn");
  const mcpItemsJson = document.getElementById("mcp-items-json");
  const mcpHouseholdVal = document.getElementById("mcp-household-val");

  /**
   * Main Dynamic UI Rendering Loop
   */
  app.registerRenderCallback((state, controller) => {
    // 1. Sync Header Controls
    dietSelector.value = state.dietPreference;
    householdInput.value = state.householdSize;
    profileSelector.value = state.activeUser;

    // Update Planner panel heading
    plannerHeading.textContent = `Weekly Plan for ${state.householdSize} ${state.householdSize === 1 ? 'Person' : 'People'}`;

    // 2. Render Weekly Planner Grid
    weeklyPlanGrid.innerHTML = "";
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    days.forEach(day => {
      const dayColumn = document.createElement("div");
      dayColumn.className = `day-column ${day === todayName ? 'today' : ''}`;
      
      const dayMeals = state.weeklyPlan[day] || {};
      let dayCalories = 0;

      Object.values(dayMeals).forEach(recipeId => {
        const recipe = RECIPES.find(r => r.id === recipeId);
        if (recipe) dayCalories += recipe.calories;
      });

      const headerDiv = document.createElement("div");
      headerDiv.className = "day-title";
      headerDiv.textContent = day === todayName ? `Today` : day;
      dayColumn.appendChild(headerDiv);

      const caloriesDiv = document.createElement("div");
      caloriesDiv.className = "day-calories";
      caloriesDiv.textContent = `${dayCalories} kcal`;
      dayColumn.appendChild(caloriesDiv);

      const slots = ["breakfast", "lunch", "dinner", "snack"];
      slots.forEach(slot => {
        const recipeId = dayMeals[slot];
        const recipe = RECIPES.find(r => r.id === recipeId);

        const card = document.createElement("div");
        card.className = "meal-card";
        card.setAttribute("data-day", day);
        card.setAttribute("data-slot", slot);

        if (recipe) {
          card.innerHTML = `
            <div>
              <span class="meal-label ${slot}">${slot}</span>
              <div class="meal-name">${recipe.name}</div>
            </div>
            <div class="meal-stats">
              <span>🔥 ${recipe.calories} kcal</span>
              <span>🥩 ${recipe.macros.protein}g P</span>
            </div>
          `;
        } else {
          card.innerHTML = `
            <div>
              <span class="meal-label ${slot}">${slot}</span>
              <div class="meal-name" style="color: var(--text-muted); font-style: italic;">No recipe set</div>
            </div>
            <div class="meal-stats">
              <span>- kcal</span>
            </div>
          `;
        }

        card.addEventListener("click", () => {
          activeModalDay = day;
          activeModalMealType = slot;
          openRecipeSwapModal(slot, state.dietPreference, controller);
        });

        dayColumn.appendChild(card);
      });

      weeklyPlanGrid.appendChild(dayColumn);
    });

    // 3. Render Analytics Dashboard & Intake Logs per activeUser
    const active = state.activeUser;
    calorieTrackerUserTitle.textContent = `Calories Today (${active})`;
    diaryUserHeading.textContent = `Plate Logs (${active})`;

    const dietMeta = DIET_TYPES[state.dietPreference];
    const targetCalories = dietMeta.dailyCalorieTargetPerPerson;

    const targetProtein = Math.round((targetCalories * (dietMeta.targetMacros.protein / 100)) / 4);
    const targetCarbs = Math.round((targetCalories * (dietMeta.targetMacros.carbs / 100)) / 4);
    const targetFat = Math.round((targetCalories * (dietMeta.targetMacros.fat / 100)) / 9);

    proteinTargetVal.textContent = targetProtein;
    carbsTargetVal.textContent = targetCarbs;
    fatTargetVal.textContent = targetFat;

    // Retrieve active user profile logs
    const userProfile = state.userProfiles[active] || { name: active, loggedMeals: [] };
    const loggedMeals = userProfile.loggedMeals;

    let loggedCal = 0;
    let loggedProt = 0;
    let loggedCarb = 0;
    let loggedFat = 0;

    loggedMeals.forEach(meal => {
      loggedCal += meal.calories;
      loggedProt += meal.macros.protein;
      loggedCarb += meal.macros.carbs;
      loggedFat += meal.macros.fat;
    });

    loggedCaloriesNum.textContent = loggedCal;
    targetCaloriesNum.textContent = `/ ${targetCalories} kcal`;

    const percentage = Math.min(100, Math.round((loggedCal / targetCalories) * 100));
    caloriePercentageBadge.textContent = `${percentage}% Met`;
    
    const offset = 471.2 - (471.2 * percentage) / 100;
    calorieDialFill.style.strokeDashoffset = offset;

    proteinLoggedVal.textContent = loggedProt;
    const protPerc = Math.min(100, Math.round((loggedProt / targetProtein) * 100));
    proteinBarFill.style.width = `${protPerc}%`;

    carbsLoggedVal.textContent = loggedCarb;
    const carbPerc = Math.min(100, Math.round((loggedCarb / targetCarbs) * 100));
    carbsBarFill.style.width = `${carbPerc}%`;

    fatLoggedVal.textContent = loggedFat;
    const fatPerc = Math.min(100, Math.round((loggedFat / targetFat) * 100));
    fatBarFill.style.width = `${fatPerc}%`;

    diaryList.innerHTML = "";
    if (loggedMeals.length === 0) {
      diaryList.innerHTML = `
        <div class="diary-empty-state">
          🍳 ${active} has not logged any plates today. Snap a photo in the chat simulator to auto-detect macros!
        </div>
      `;
    } else {
      loggedMeals.forEach(meal => {
        const item = document.createElement("div");
        item.className = "diary-item";
        item.innerHTML = `
          <div class="diary-item-info">
            <h4>${meal.name}</h4>
            <span>Log Time: ${meal.time}</span>
          </div>
          <div class="diary-item-macros">
            🔥 ${meal.calories} kcal
            <span>P: ${meal.macros.protein}g | C: ${meal.macros.carbs}g | F: ${meal.macros.fat}g</span>
          </div>
        `;
        diaryList.appendChild(item);
      });
    }

    // 4. Render Pantry stock lists
    pantryStockList.innerHTML = "";
    state.pantryStock.forEach((pantryItem, idx) => {
      const row = document.createElement("div");
      row.className = "pantry-item-row";
      row.innerHTML = `
        <div class="pantry-item-info">
          <strong style="color:#fff;">${pantryItem.name}</strong>
          <span style="font-size:10px; color:var(--text-muted);">${pantryItem.amount} ${pantryItem.unit} available</span>
        </div>
        <button class="pantry-item-delete" data-idx="${idx}">&times;</button>
      `;

      row.querySelector(".pantry-item-delete").addEventListener("click", () => {
        controller.removePantryItem(idx);
        controller.triggerBannerAlert(`Removed "${pantryItem.name}" from your fridge inventory.`);
      });

      pantryStockList.appendChild(row);
    });

    if (state.pantryStock.length === 0) {
      pantryStockList.innerHTML = `
        <div class="diary-empty-state" style="padding:16px; font-size:11px;">
          ❄️ Fridge inventory is empty! Add items manually or run a simulated Fridge Camera scan.
        </div>
      `;
    }

    // 5. Render Dynamic Grocery Cart List
    groceryListGrid.innerHTML = "";
    
    const groupedGroceries = {};
    let totalItems = 0;
    let checkedItems = 0;

    state.groceryList.forEach(item => {
      totalItems++;
      if (item.checked) checkedItems++;

      if (!groupedGroceries[item.category]) {
        groupedGroceries[item.category] = [];
      }
      groupedGroceries[item.category].push(item);
    });

    groceryTotalCount.textContent = totalItems;
    groceryCheckedCount.textContent = checkedItems;

    Object.keys(groupedGroceries).forEach(category => {
      const catContainer = document.createElement("div");
      catContainer.className = "grocery-category";
      
      const title = document.createElement("div");
      title.className = "grocery-category-title";
      title.textContent = category;
      catContainer.appendChild(title);

      groupedGroceries[category].forEach(item => {
        const row = document.createElement("div");
        
        let stockedClass = item.alreadyStocked ? "stocked-in-pantry completed" : "";
        row.className = `grocery-item-row ${item.checked && !item.alreadyStocked ? 'completed' : ''} ${stockedClass}`;
        
        let displayAmount = Math.round(item.amount * 100) / 100;
        let qtyText = item.alreadyStocked ? 
          `<span class="stocked-badge">Met (Pantry)</span>` : 
          `<span class="grocery-item-qty">${displayAmount} ${item.unit}</span>`;
        
        row.innerHTML = `
          <label class="grocery-checkbox-label">
            <input type="checkbox" ${item.checked ? 'checked' : ''} ${item.alreadyStocked ? 'disabled' : ''} />
            <span class="item-name">${item.name}</span>
          </label>
          ${qtyText}
        `;

        if (!item.alreadyStocked) {
          row.querySelector("input").addEventListener("change", () => {
            controller.toggleGroceryItem(item.name);
          });
        }

        catContainer.appendChild(row);
      });

      groceryListGrid.appendChild(catContainer);
    });

    if (totalItems === 0) {
      groceryListGrid.innerHTML = `
        <div class="diary-empty-state" style="grid-column: span 2;">
          🛒 Your shopping cart is empty! Check back once a meal plan is configured.
        </div>
      `;
    }

    // 6. Render Chat Simulator Messages
    chatMessages.innerHTML = "";
    state.chatHistory.forEach(msg => {
      const bubble = document.createElement("div");
      bubble.className = `msg-bubble ${msg.sender}`;
      
      let imageHTML = "";
      if (msg.image) {
        let emoji = "🥗";
        if (msg.image.includes("salmon")) emoji = "🐟";
        else if (msg.image.includes("chicken")) emoji = "🍗";
        else if (msg.image.includes("salad")) emoji = "🥗";
        else if (msg.image.includes("smoothie")) emoji = "🍓";
        else if (msg.image.includes("fridge")) emoji = "❄️";

        imageHTML = `
          <div style="background: rgba(255,255,255,0.08); width:100%; height:110px; display:flex; align-items:center; justify-content:center; border-radius:8px; margin-bottom:8px; font-size:48px;">
            ${emoji}
          </div>
        `;
      }

      bubble.innerHTML = `
        ${imageHTML}
        <div>${msg.text}</div>
        <span class="msg-time">${msg.time}</span>
      `;
      chatMessages.appendChild(bubble);
    });

    if (controller.isChatTyping) {
      const typingBubble = document.createElement("div");
      typingBubble.className = "msg-bubble agent typing-bubble";
      typingBubble.innerHTML = `
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;
      chatMessages.appendChild(typingBubble);
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  /**
   * Builds and opens the recipe swapper list modal
   */
  function openRecipeSwapModal(mealSlot, dietPreference, controller) {
    modalHeadingText.textContent = `Select ${mealSlot.charAt(0).toUpperCase() + mealSlot.slice(1)} Replacement`;
    modalRecipeList.innerHTML = "";

    const matches = RECIPES.filter(r => r.type === mealSlot);

    matches.forEach(recipe => {
      const option = document.createElement("div");
      option.className = "recipe-select-option";
      
      const dietBadge = recipe.diets.includes(dietPreference) ? 
        `<span style="font-size:9px; background: rgba(16,185,129,0.15); color: var(--accent-primary); padding: 2px 6px; border-radius: 4px; font-weight:600; text-transform:uppercase;">Matches Diet</span>` : '';

      option.innerHTML = `
        <div class="recipe-select-details">
          <div style="display:flex; align-items:center; gap:8px;">
            <h4>${recipe.name}</h4>
            ${dietBadge}
          </div>
          <p>⏳ Prep: ${recipe.prepTime} | P: ${recipe.macros.protein}g, C: ${recipe.macros.carbs}g, F: ${recipe.macros.fat}g</p>
        </div>
        <div class="recipe-select-macros">
          🔥 ${recipe.calories} Cal
        </div>
      `;

      option.addEventListener("click", () => {
        controller.updateMeal(activeModalDay, activeModalMealType, recipe.id);
        recipeModal.classList.remove("active");
        controller.triggerBannerAlert(`Successfully set ${recipe.name} as ${activeModalDay}'s ${activeModalMealType}!`);
      });

      modalRecipeList.appendChild(option);
    });

    recipeModal.classList.add("active");
  }

  // Bind close buttons modal
  modalCloseBtn.addEventListener("click", () => recipeModal.classList.remove("active"));
  
  /**
   * Event Wireframing - Top Header Options
   */
  dietSelector.addEventListener("change", (e) => app.switchDiet(e.target.value));
  householdInput.addEventListener("change", (e) => app.updateHouseholdSize(e.target.value));
  
  profileSelector.addEventListener("change", (e) => {
    app.switchActiveUser(e.target.value);
    app.triggerBannerAlert(`Switched active profile to ${e.target.value}. Viewing macro logs for ${e.target.value}.`);
  });

  /**
   * Event Wireframing - Tabs Navigation
   */
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const targetTab = btn.getAttribute("data-tab");
      tabPanels.forEach(panel => {
        panel.classList.remove("active");
        if (panel.id === `panel-${targetTab}`) {
          panel.classList.add("active");
        }
      });
      app.activeTab = targetTab;
    });
  });

  /**
   * Event Wireframing - Simulated Snap & Log Camera triggers
   */
  photoButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const fileName = btn.getAttribute("data-file");
      const isFridge = fileName.includes("fridge");

      // Adjust title of scanning camera depending on photo type
      scannerTitleText.textContent = isFridge ? "Scanning Fridge Interior Shelves..." : "Analyzing Culinary Plate...";
      
      visionScanner.classList.add("active");
      
      let emoji = isFridge ? "❄️" : "🥗";
      if (fileName.includes("salmon")) emoji = "🐟";
      else if (fileName.includes("chicken")) emoji = "🍗";
      else if (fileName.includes("salad")) emoji = "🥗";
      else if (fileName.includes("smoothie")) emoji = "🍓";

      // Set scanner icon display
      scanTargetImg.style.display = "none";
      let container = scanTargetImg.parentElement;
      let existingLabel = container.querySelector(".scanner-emoji-lbl");
      if (existingLabel) existingLabel.remove();

      let emojiBox = document.createElement("div");
      emojiBox.className = "scanner-emoji-lbl";
      emojiBox.style.fontSize = "72px";
      emojiBox.style.display = "flex";
      emojiBox.style.alignItems = "center";
      emojiBox.style.justifyContent = "center";
      emojiBox.style.height = "100%";
      emojiBox.textContent = emoji;
      container.appendChild(emojiBox);

      scanTerminalLog.innerHTML = "";

      let steps = [];
      if (isFridge) {
        steps = [
          "🔍 Establishing fridge video feed...",
          "⚡ Running multi-shelf ingredient detection...",
          "🍏 Isolating eggs, vegetables, and beverages...",
          "🤖 Estimating stock weights & portions...",
          "✅ Success! Subtracting pantry stock counts from shopping cart."
        ];
      } else {
        steps = [
          "🔍 Loading image payload...",
          "⚡ Segmenting plate elements using Multimodal ViT...",
          "🥩 Core components isolated: estimating density & volume...",
          "🤖 Running regression for calories and macro calculations...",
          "✅ Success! Analysis package dispatched to PlateWise Core."
        ];
      }

      for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 400));
        const line = document.createElement("div");
        line.className = "scan-log-line";
        line.textContent = steps[i];
        scanTerminalLog.appendChild(line);
        scanTerminalLog.scrollTop = scanTerminalLog.scrollHeight;
      }

      await new Promise(r => setTimeout(r, 600));
      
      visionScanner.classList.remove("active");
      emojiBox.remove();
      app.handlePhotoUpload(fileName);
    });
  });

  /**
   * Event Wireframing - Chat Form Submit
   */
  chatInputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const prompt = chatUserInput.value;
    if (prompt.trim()) {
      chatUserInput.value = "";
      app.sendChatMessage(prompt);
    }
  });

  /**
   * Event Wireframing - Pantry Manual Add stock
   */
  pantryAddBtn.addEventListener("click", () => {
    const name = pantryAddName.value;
    const qty = parseFloat(pantryAddAmount.value) || 1;
    const unit = pantryAddUnit.value;

    if (name.trim()) {
      app.addPantryItem(name, qty, unit);
      pantryAddName.value = "";
      app.triggerBannerAlert(`Manually added ${qty} ${unit} of "${name}" to Fridge Stock.`);
    }
  });

  /**
   * Event Wireframing - Custom Ingredient Adder
   */
  groceryAddItemBtn.addEventListener("click", () => {
    const name = groceryCustomName.value;
    const cat = groceryCustomCat.value;
    if (name.trim()) {
      app.addCustomGroceryItem(name, cat);
      groceryCustomName.value = "";
      app.triggerBannerAlert(`Added custom item: "${name}" to ${cat}!`);
    }
  });

  // Clear diary logs button
  clearDiaryBtn.addEventListener("click", () => {
    app.resetDailyLogs();
    app.triggerBannerAlert(`Cleared today's plate logs for ${app.state.activeUser}.`);
  });

  /**
   * Event Wireframing - Human-in-the-Loop Blinkit MCP checkout popup modal
   */
  groceryCheckoutBtn.addEventListener("click", () => {
    // Filter uncompleted required items in checkout checklist
    const checkoutItems = app.state.groceryList
      .filter(item => !item.checked)
      .map(item => ({
        item: item.name,
        quantity: Math.round(item.amount * 100) / 100,
        unit: item.unit
      }));

    mcpHouseholdVal.textContent = app.state.householdSize;
    mcpItemsJson.textContent = JSON.stringify(checkoutItems, null, 2);

    mcpModal.classList.add("active");
  });

  mcpCloseBtn.addEventListener("click", () => mcpModal.classList.remove("active"));
  mcpRejectBtn.addEventListener("click", () => {
    mcpModal.classList.remove("active");
    app.triggerBannerAlert("❌ Blinkit MCP Tool execution aborted by user.");
  });

  mcpApproveBtn.addEventListener("click", () => {
    mcpModal.classList.remove("active");
    app.triggerBannerAlert("✨ MCP Call Successful! 🛒 Blinkit cart populated with ingredients and ready for review.");
    
    // Check all items as completed
    app.state.groceryList.forEach(item => {
      item.checked = true;
    });
    app.saveState();
    app.render();
  });

  // Initial draw
  app.render();
});
