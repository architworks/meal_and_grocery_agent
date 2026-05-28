// PlateWise AI - GenAI Conversational & Computer Vision Simulation Engine

import { RECIPES, DIET_TYPES, IMAGE_CATALOG, DEFAULT_WEEKLY_PLAN } from './mockData.js';

function normalize(text) {
  return text.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
}

export function processChatMessage(prompt, appState) {
  return new Promise((resolve) => {
    const text = normalize(prompt);
    let reply = "";
    let action = null;

    // SCENARIO 1: Inventory Updates (e.g. "We have 1 cabbage head" or "We have 6 eggs in the fridge")
    if (text.includes("we have") || text.includes("i have") || text.includes("in the fridge") || text.includes("in the pantry") || text.includes("already got")) {
      let matchedQty = 1;
      let matchedName = "";
      let matchedUnit = "piece";

      const qtyMatch = prompt.match(/\b(\d+)\b/);
      if (qtyMatch) {
        matchedQty = parseInt(qtyMatch[1]);
      }

      const words = prompt.toLowerCase().split(" ");
      let matchedIngMeta = null;

      for (const recipe of RECIPES) {
        for (const ing of recipe.ingredients) {
          const ingName = ing.name.toLowerCase();
          const ingWords = ingName.split(" ");
          
          if (ingWords.some(w => w.length > 3 && words.includes(w))) {
            matchedIngMeta = ing;
            matchedName = ing.name;
            matchedUnit = ing.unit;
            break;
          }
        }
        if (matchedIngMeta) break;
      }

      if (!matchedName) {
        const blacklist = ["we", "have", "i", "the", "fridge", "pantry", "already", "got", "in", "some", "of"];
        const candidateWords = words.filter(w => w.length > 2 && !blacklist.includes(w) && isNaN(w));
        if (candidateWords.length > 0) {
          matchedName = candidateWords.join(" ");
        }
      }

      if (matchedName) {
        action = {
          type: "UPDATE_PANTRY",
          itemName: matchedName,
          amount: matchedQty,
          unit: matchedUnit,
          alert: `Added ${matchedQty} ${matchedUnit} of ${matchedName} to Fridge Stock!`
        };

        reply = `🍎 **Inventory Sync Action:** I've noted that you already have **${matchedQty} ${matchedUnit} of ${matchedName}** in your fridge/pantry stock.

I have updated your **Pantry Inventory** and automatically subtracted this amount from your weekly grocery shopping list! 

If the planned weekly recipes needed more than what you have, you will see a reduced order quantity in your cart. If you already have enough, it has been marked as stocked.`;
      } else {
        reply = `I heard that you have some ingredients in stock! Could you tell me exactly what it is? E.g., *"We have 2 avocados"* or *"We have 1 cabbage"*`;
      }
    }
    // SCENARIO 2: Swap recipes / change plans
    else if (text.includes("swap") || text.includes("change") || text.includes("replace") || text.includes("substitute")) {
      let matchedDay = null;
      let matchedMealType = null;
      let matchedRecipe = null;

      const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
      for (const d of days) {
        if (text.includes(d)) {
          matchedDay = d.charAt(0).toUpperCase() + d.slice(1);
          break;
        }
      }

      const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
      for (const m of mealTypes) {
        if (text.includes(m)) {
          matchedMealType = m;
          break;
        }
      }

      for (const recipe of RECIPES) {
        const recipeWords = recipe.name.toLowerCase().split(" ");
        if (recipeWords.some(word => word.length > 3 && text.includes(word))) {
          matchedRecipe = recipe;
          break;
        }
      }

      if (!matchedDay) {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        matchedDay = today;
      }
      if (!matchedMealType) {
        matchedMealType = "dinner";
      }

      if (!matchedRecipe) {
        const diet = appState.dietPreference;
        const choices = RECIPES.filter(r => r.type === matchedMealType && r.diets.includes(diet));
        if (choices.length > 0) {
          matchedRecipe = choices[Math.floor(Math.random() * choices.length)];
        } else {
          matchedRecipe = RECIPES.find(r => r.type === matchedMealType);
        }
      }

      if (matchedRecipe && matchedDay && matchedMealType) {
        const updatedPlan = { ...appState.weeklyPlan };
        if (!updatedPlan[matchedDay]) {
          updatedPlan[matchedDay] = {};
        }
        updatedPlan[matchedDay][matchedMealType] = matchedRecipe.id;

        action = {
          type: "UPDATE_PLANNER",
          weeklyPlan: updatedPlan,
          alert: `Swapped ${matchedDay}'s ${matchedMealType} to ${matchedRecipe.name}!`
        };

        reply = `🎨 **Chef Agent Action:** I have successfully modified your meal plan! 

For **${matchedDay} ${matchedMealType}**, I replaced the previous item with **${matchedRecipe.name}** (${matchedRecipe.calories} kcal, ${matchedRecipe.macros.protein}g Protein). 

I've also:
1. Scaled ingredients for **${appState.householdSize} people**.
2. Dynamically consolidated your **Grocery List** to remove the old ingredients and add the new ones, subtracting any items present in your **Pantry Stock**.
3. Updated your nutritional targets dashboard.

Is there anything else you'd like to adjust in your schedule?`;
      } else {
        reply = `I'd love to swap that for you! Could you please specify which day (e.g., Wednesday) and meal (breakfast, lunch, dinner) you want to adjust? For example: *"Swap Wednesday's dinner to chicken"*`;
      }
    }
    // SCENARIO 3: Switch dietary profile
    else if (text.includes("diet") || text.includes("keto") || text.includes("vegan") || text.includes("balanced") || text.includes("protein")) {
      let chosenDiet = null;
      if (text.includes("keto") || text.includes("low carb")) chosenDiet = "keto";
      else if (text.includes("vegan") || text.includes("plant")) chosenDiet = "vegan";
      else if (text.includes("protein") || text.includes("muscle") || text.includes("active")) chosenDiet = "high-protein";
      else if (text.includes("balanced") || text.includes("standard")) chosenDiet = "balanced";

      if (chosenDiet) {
        const dietMeta = DIET_TYPES[chosenDiet];
        action = {
          type: "SWITCH_DIET",
          dietPreference: chosenDiet,
          weeklyPlan: DEFAULT_WEEKLY_PLAN[chosenDiet],
          alert: `Switched dietary profile to ${dietMeta.name}!`
        };

        reply = `🔄 **Dietary Alignment Complete:** I've converted your household profile to **${dietMeta.name}**! 

*Target:* ~${dietMeta.dailyCalorieTargetPerPerson} calories per person daily.
*Macro splits:* Protein ${dietMeta.targetMacros.protein}%, Carbs ${dietMeta.targetMacros.carbs}%, Fat ${dietMeta.targetMacros.fat}%.

I have also automatically regenerated a whole new balanced weekly calendar for the **3 of you** to fit this target. Open your dashboard to view the refreshed schedule and your newly scaled shopping cart!`;
      } else {
        reply = `I support several tailored dietary profiles:
- **Balanced Diet**: Well-rounded ratios for family wellness.
- **Keto / Low-Carb**: High fats and minimal carbs.
- **Vegan / Plant-Based**: 100% plant protein and organic fibers.
- **High-Protein Active**: Optimized for fitness and high satiety.

Which one would you like to set for your household?`;
      }
    }
    // SCENARIO 4: Grocery check
    else if (text.includes("grocery") || text.includes("cart") || text.includes("shopping") || text.includes("buy")) {
      const pendingItems = appState.groceryList.filter(item => !item.checked).length;
      reply = `🛒 **Smart Grocery Status:** 
You have a total of **${appState.groceryList.length} ingredients** in your consolidated weekly shopping cart (scaled for **${appState.householdSize} people**). 

*   **Pending items:** ${pendingItems} left to source.
*   **Completed:** ${appState.groceryList.length - pendingItems} items checked off.

You can preview the full categorized checklist on the **Grocery Cart** tab of your dashboard, and instantly export it to local online grocery services with one click!`;
    }
    // SCENARIO 5: Macro progress report
    else if (text.includes("macro") || text.includes("nutrition") || text.includes("progress") || text.includes("calorie") || text.includes("eat")) {
      const activeUser = appState.activeUser;
      const logged = (appState.userProfiles[activeUser] && appState.userProfiles[activeUser].loggedMeals) || [];
      const totalCal = logged.reduce((acc, m) => acc + m.calories, 0);
      const totalProt = logged.reduce((acc, m) => acc + m.macros.protein, 0);
      const totalCarb = logged.reduce((acc, m) => acc + m.macros.carbs, 0);
      const totalFat = logged.reduce((acc, m) => acc + m.macros.fat, 0);

      const targetCal = DIET_TYPES[appState.dietPreference].dailyCalorieTargetPerPerson;

      reply = `📊 **Daily Nutrition Log for ${activeUser}:**
Here is what you have tracked so far today:

*   **Energy Intake:** ${totalCal} / ${targetCal} kcal (${Math.round((totalCal/targetCal)*100)}% of target)
*   **Protein:** ${totalProt}g logged
*   **Carbohydrates:** ${totalCarb}g logged
*   **Fats:** ${totalFat}g logged

${logged.length === 0 ? "You haven't logged any meals today! Simply snap a photo of your next meal and upload it here in our chat, and I will analyze the macros for you instantly." : `Nice work! You logged ${logged.length} meals today. Keep snapping photos to complete your diary.`}`;
    }
    // SCENARIO 6: Proactive recipe advice / Hello
    else {
      reply = `👋 **Hello! I am Kitch, your GenAI Culinary Companion.** 

Here is how we can collaborate today:
1. **Plan Meals:** Ask me to *"Create a high protein weekly plan"* or *"Substitute Wednesday lunch with chicken salad"*.
2. **Fridge Scan & Pantry Adjustment:** Tell me what you already have (e.g. *"We have 1 cabbage in the fridge"* or scan a picture of your fridge shelves) to subtract it from your grocery shopping list.
3. **Track Personal Macros:** Take a photo of your plate and upload it right here. We track macros individually per household member! (Current user: **${appState.activeUser}**).

How can I help you feed the household today?`;
    }

    setTimeout(() => {
      resolve({ text: reply, action });
    }, 850);
  });
}

export function simulatePhotoScan(fileName, appState) {
  return new Promise((resolve) => {
    const match = IMAGE_CATALOG.find(img => img.name === fileName) || IMAGE_CATALOG[0];

    let scanningSteps = [];
    if (match.isFridgeScan) {
      scanningSteps = [
        "🔍 Loading fridge camera payload...",
        "⚡ Running shelf-level Object Detection...",
        "🍏 Segmenting organic ingredients and counting items...",
        `✅ Success! Identified: ${match.detectedIngredients.length} ingredients in stock.`
      ];
    } else {
      scanningSteps = [
        "🔍 Loading plate image payload...",
        "⚡ Segmenting plate elements using Multimodal ViT...",
        "🥩 Core components isolated: estimating density & volume...",
        `✅ Success! Identified: ${match.label}`
      ];
    }

    setTimeout(() => {
      resolve({
        scanningSteps,
        result: {
          name: match.label,
          calories: match.calories || 0,
          macros: match.macros || { protein: 0, carbs: 0, fat: 0, fiber: 0 },
          detectedIngredients: match.detectedIngredients,
          isFridgeScan: !!match.isFridgeScan,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      });
    }, 1800);
  });
}
