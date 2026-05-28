// PlateWise AI - Recipe & Plan Database

export const DIET_TYPES = {
  balanced: {
    name: "Balanced Diet",
    description: "Even distribution of proteins, complex carbs, and healthy fats.",
    targetMacros: { protein: 30, carbs: 40, fat: 30 },
    dailyCalorieTargetPerPerson: 2000
  },
  keto: {
    name: "Keto / Low-Carb",
    description: "High healthy fats, moderate protein, and very low carbohydrates.",
    targetMacros: { protein: 25, carbs: 5, fat: 70 },
    dailyCalorieTargetPerPerson: 1800
  },
  vegan: {
    name: "Vegan / Plant-Based",
    description: "100% plant-based recipes rich in clean fibers and plant proteins.",
    targetMacros: { protein: 20, carbs: 55, fat: 25 },
    dailyCalorieTargetPerPerson: 1900
  },
  "high-protein": {
    name: "High-Protein Active",
    description: "Designed for muscle retention, high satiety, and active lifestyles.",
    targetMacros: { protein: 40, carbs: 35, fat: 25 },
    dailyCalorieTargetPerPerson: 2300
  }
};

export const RECIPES = [
  // BREAKFASTS
  {
    id: "b1",
    name: "Avocado & Poached Egg Toast",
    type: "breakfast",
    diets: ["balanced", "high-protein"],
    prepTime: "10 mins",
    calories: 380,
    macros: { protein: 16, carbs: 28, fat: 22, fiber: 7 },
    ingredients: [
      { name: "Whole wheat bread slices", amount: 1, unit: "slice" },
      { name: "Medium ripe avocado", amount: 0.5, unit: "whole" },
      { name: "Fresh organic eggs", amount: 2, unit: "large" },
      { name: "Cherry tomatoes", amount: 4, unit: "pieces" }
    ],
    instructions: "Toast bread. Mash avocado with salt, pepper, and lemon juice. Poach eggs for 3 minutes. Spread avocado on toast, top with poached eggs, halved cherry tomatoes, and microgreens."
  },
  {
    id: "b2",
    name: "Keto Vanilla Chia Pudding",
    type: "breakfast",
    diets: ["keto", "vegan"],
    prepTime: "5 mins + chilling",
    calories: 320,
    macros: { protein: 8, carbs: 6, fat: 28, fiber: 11 },
    ingredients: [
      { name: "Organic black chia seeds", amount: 3, unit: "tbsp" },
      { name: "Unsweetened almond milk", amount: 0.75, unit: "cup" },
      { name: "Full fat coconut milk", amount: 0.25, unit: "cup" },
      { name: "Liquid stevia / monkfruit", amount: 4, unit: "drops" },
      { name: "Fresh raspberries", amount: 8, unit: "pieces" }
    ],
    instructions: "Mix chia seeds, almond milk, coconut milk, and stevia in a jar. Stir well. Let sit for 10 minutes, stir again, then refrigerate overnight. Garnish with fresh raspberries before serving."
  },
  {
    id: "b3",
    name: "Double Berry Protein Smoothie",
    type: "breakfast",
    diets: ["balanced", "high-protein", "vegan"],
    prepTime: "5 mins",
    calories: 350,
    macros: { protein: 28, carbs: 32, fat: 8, fiber: 9 },
    ingredients: [
      { name: "Plant-based protein powder", amount: 1, unit: "scoop" },
      { name: "Frozen mixed berries", amount: 1, unit: "cup" },
      { name: "Spinach leaves", amount: 1, unit: "cup" },
      { name: "Flaxseeds", amount: 1, unit: "tbsp" },
      { name: "Unsweetened almond milk", amount: 1.5, unit: "cups" }
    ],
    instructions: "Combine all ingredients in a high-speed blender. Blend until completely smooth. Add ice if a thicker texture is desired."
  },
  {
    id: "b4",
    name: "Cinnamon Almond Oatmeal",
    type: "breakfast",
    diets: ["balanced", "vegan"],
    prepTime: "8 mins",
    calories: 410,
    macros: { protein: 12, carbs: 54, fat: 14, fiber: 10 },
    ingredients: [
      { name: "Rolled oats", amount: 0.5, unit: "cup" },
      { name: "Almond milk", amount: 1, unit: "cup" },
      { name: "Slivered almonds", amount: 2, unit: "tbsp" },
      { name: "Ground cinnamon", amount: 0.5, unit: "tsp" },
      { name: "Maple syrup", amount: 1, unit: "tbsp" }
    ],
    instructions: "Cook oats in almond milk over medium heat until thickened. Stir in cinnamon and maple syrup. Pour into a bowl and top with slivered almonds."
  },

  // LUNCHES
  {
    id: "l1",
    name: "Grilled Chicken Quinoa Bowl",
    type: "lunch",
    diets: ["balanced", "high-protein"],
    prepTime: "15 mins",
    calories: 520,
    macros: { protein: 42, carbs: 48, fat: 16, fiber: 8 },
    ingredients: [
      { name: "Free-range chicken breast", amount: 150, unit: "g" },
      { name: "Cooked organic quinoa", amount: 1, unit: "cup" },
      { name: "Cucumber slices", amount: 0.5, unit: "cup" },
      { name: "Crumbled feta cheese", amount: 30, unit: "g" }
    ],
    instructions: "Season and grill chicken breast until internal temperature hits 165°F. Dice the chicken. Assemble the bowl starting with quinoa, then top with chicken, cucumbers, and feta. Drizzle olive oil and squeeze fresh lemon."
  },
  {
    id: "l2",
    name: "Mediterranean Chickpea Salad",
    type: "lunch",
    diets: ["vegan", "balanced"],
    prepTime: "10 mins",
    calories: 460,
    macros: { protein: 15, carbs: 52, fat: 18, fiber: 12 },
    ingredients: [
      { name: "Canned organic chickpeas", amount: 1, unit: "can" },
      { name: "Red bell pepper", amount: 0.5, unit: "whole" },
      { name: "Kalamata olives", amount: 6, unit: "pieces" },
      { name: "Red onion", amount: 0.25, unit: "whole" }
    ],
    instructions: "Rinse and drain chickpeas. Finely chop bell pepper, olives, and red onion. Mix all ingredients in a bowl and toss with creamy tahini dressing."
  },
  {
    id: "l3",
    name: "Keto Salmon Lettuce Wraps",
    type: "lunch",
    diets: ["keto", "high-protein"],
    prepTime: "12 mins",
    calories: 490,
    macros: { protein: 36, carbs: 4, fat: 34, fiber: 2 },
    ingredients: [
      { name: "Canned wild-caught salmon", amount: 150, unit: "g" },
      { name: "Avocado oil mayonnaise", amount: 2, unit: "tbsp" },
      { name: "Butter lettuce heads", amount: 3, unit: "leaves" },
      { name: "Diced celery", amount: 2, unit: "tbsp" }
    ],
    instructions: "Flake salmon in a bowl and mix with mayonnaise, celery, dill, and chives. Scoop the mixture evenly into butter lettuce leaves."
  },

  // DINNERS
  {
    id: "d1",
    name: "Garlic Butter Salmon & Asparagus",
    type: "dinner",
    diets: ["balanced", "keto", "high-protein"],
    prepTime: "20 mins",
    calories: 580,
    macros: { protein: 44, carbs: 8, fat: 38, fiber: 4 },
    ingredients: [
      { name: "Wild-caught salmon fillet", amount: 180, unit: "g" },
      { name: "Fresh asparagus stalks", amount: 8, unit: "stalks" },
      { name: "Grass-fed butter", amount: 1.5, unit: "tbsp"},
      { name: "Minced garlic", amount: 2, unit: "cloves"}
    ],
    instructions: "Place salmon and trimmed asparagus on a baking sheet. Melt butter with minced garlic and drizzle over salmon and asparagus. Bake at 400°F for 12-15 minutes until salmon flakes easily."
  },
  {
    id: "d2",
    name: "Sesame Ginger Tofu Stir-Fry",
    type: "dinner",
    diets: ["vegan", "balanced"],
    prepTime: "20 mins",
    calories: 480,
    macros: { protein: 22, carbs: 42, fat: 20, fiber: 7 },
    ingredients: [
      { name: "Extra-firm organic tofu", amount: 150, unit: "g" },
      { name: "Broccoli florets", amount: 1.5, unit: "cups" },
      { name: "Sliced shiitake mushrooms", amount: 0.5, unit: "cup" },
      { name: "Brown rice", amount: 0.75, unit: "cup" }
    ],
    instructions: "Press tofu to drain water, cut into cubes, and pan-fry in sesame oil until golden. Add broccoli and mushrooms, cooking for 5 minutes. Stir in ginger, garlic, and tamari. Serve hot over brown rice."
  },
  {
    id: "d3",
    name: "Herbed Ribeye & Garlic Spinach",
    type: "dinner",
    diets: ["keto"],
    prepTime: "18 mins",
    calories: 690,
    macros: { protein: 48, carbs: 3, fat: 54, fiber: 2 },
    ingredients: [
      { name: "Ribeye steak", amount: 200, unit: "g" },
      { name: "Baby spinach leaves", amount: 2, unit: "cups" },
      { name: "Extra virgin olive oil", amount: 1, unit: "tbsp" },
      { name: "Garlic cloves", amount: 2, unit: "pieces" }
    ],
    instructions: "Sear ribeye steak in a hot cast-iron skillet for 3-4 minutes per side. Let rest, then top with herb butter. In another pan, sauté baby spinach with olive oil and garlic until wilted."
  },
  {
    id: "d4",
    name: "Lemon Herb Grilled Chicken",
    type: "dinner",
    diets: ["balanced", "high-protein"],
    prepTime: "25 mins",
    calories: 510,
    macros: { protein: 46, carbs: 12, fat: 14, fiber: 5 },
    ingredients: [
      { name: "Organic chicken breast", amount: 180, unit: "g" },
      { name: "Sweet potato wedges", amount: 150, unit: "g" },
      { name: "Broccoli florets", amount: 1, unit: "cup" },
      { name: "Olive oil", amount: 1, unit: "tbsp" }
    ],
    instructions: "Marinate chicken in lemon juice, herbs, and olive oil. Roast sweet potato wedges with sea salt at 420°F. Grill chicken breast for 6 mins per side. Steam broccoli. Plate together."
  },

  // SNACKS
  {
    id: "s1",
    name: "Raw Almonds & Dark Chocolate",
    type: "snack",
    diets: ["balanced", "keto", "vegan"],
    prepTime: "2 mins",
    calories: 220,
    macros: { protein: 6, carbs: 12, fat: 18, fiber: 4 },
    ingredients: [
      { name: "Raw organic almonds", amount: 1, unit: "oz" },
      { name: "85% dark chocolate square", amount: 1, unit: "square" }
    ]
  },
  {
    id: "s2",
    name: "Hummus & Cucumber Platter",
    type: "snack",
    diets: ["balanced", "vegan"],
    prepTime: "5 mins",
    calories: 180,
    macros: { protein: 5, carbs: 16, fat: 10, fiber: 5 },
    ingredients: [
      { name: "Organic classic hummus", amount: 3, unit: "tbsp" },
      { name: "English cucumber", amount: 1, unit: "whole" },
      { name: "Kalamata olives", amount: 3, unit: "pieces" }
    ]
  },
  {
    id: "s3",
    name: "Greek Yogurt & Honey Parfait",
    type: "snack",
    diets: ["balanced", "high-protein"],
    prepTime: "3 mins",
    calories: 200,
    macros: { protein: 17, carbs: 18, fat: 4, fiber: 2 },
    ingredients: [
      { name: "Non-fat plain Greek yogurt", amount: 150, unit: "g" },
      { name: "Organic honey", amount: 1, unit: "tsp" },
      { name: "Chia seeds", amount: 0.5, unit: "tsp" },
      { name: "Fresh blueberries", amount: 15, unit: "pieces" }
    ]
  }
];

export const DEFAULT_WEEKLY_PLAN = {
  balanced: {
    Monday: { breakfast: "b1", lunch: "l1", dinner: "d1", snack: "s3" },
    Tuesday: { breakfast: "b3", lunch: "l2", dinner: "d4", snack: "s1" },
    Wednesday: { breakfast: "b1", lunch: "l1", dinner: "d1", snack: "s2" },
    Thursday: { breakfast: "b4", lunch: "l2", dinner: "d2", snack: "s3" },
    Friday: { breakfast: "b3", lunch: "l1", dinner: "d4", snack: "s1" },
    Saturday: { breakfast: "b1", lunch: "l2", dinner: "d2", snack: "s2" },
    Sunday: { breakfast: "b4", lunch: "l1", dinner: "d1", snack: "s3" }
  },
  keto: {
    Monday: { breakfast: "b2", lunch: "l3", dinner: "d3", snack: "s1" },
    Tuesday: { breakfast: "b2", lunch: "l3", dinner: "d1", snack: "s1" },
    Wednesday: { breakfast: "b2", lunch: "l3", dinner: "d3", snack: "s1" },
    Thursday: { breakfast: "b2", lunch: "l3", dinner: "d1", snack: "s1" },
    Friday: { breakfast: "b2", lunch: "l3", dinner: "d3", snack: "s1" },
    Saturday: { breakfast: "b2", lunch: "l3", dinner: "d1", snack: "s1" },
    Sunday: { breakfast: "b2", lunch: "l3", dinner: "d3", snack: "s1" }
  },
  vegan: {
    Monday: { breakfast: "b2", lunch: "l2", dinner: "d2", snack: "s2" },
    Tuesday: { breakfast: "b3", lunch: "l2", dinner: "d2", snack: "s1" },
    Wednesday: { breakfast: "b2", lunch: "l2", dinner: "d2", snack: "s2" },
    Thursday: { breakfast: "b4", lunch: "l2", dinner: "d2", snack: "s1" },
    Friday: { breakfast: "b3", lunch: "l2", dinner: "d2", snack: "s2" },
    Saturday: { breakfast: "b4", lunch: "l2", dinner: "d2", snack: "s1" },
    Sunday: { breakfast: "b2", lunch: "l2", dinner: "d2", snack: "s2" }
  },
  "high-protein": {
    Monday: { breakfast: "b1", lunch: "l1", dinner: "d1", snack: "s3" },
    Tuesday: { breakfast: "b3", lunch: "l3", dinner: "d4", snack: "s3" },
    Wednesday: { breakfast: "b1", lunch: "l1", dinner: "d1", snack: "s3" },
    Thursday: { breakfast: "b3", lunch: "l3", dinner: "d4", snack: "s3" },
    Friday: { breakfast: "b1", lunch: "l1", dinner: "d1", snack: "s3" },
    Saturday: { breakfast: "b3", lunch: "l3", dinner: "d4", snack: "s3" },
    Sunday: { breakfast: "b1", lunch: "l1", dinner: "d1", snack: "s3" }
  }
};

export const IMAGE_CATALOG = [
  {
    name: "salmon_plate.jpg",
    label: "Garlic Butter Salmon with Asparagus",
    calories: 580,
    macros: { protein: 44, carbs: 8, fat: 38, fiber: 4 },
    detectedIngredients: ["Salmon fillet 180g", "Asparagus 8 stalks", "Butter 1.5 tbsp", "Garlic 2 cloves"]
  },
  {
    name: "chicken_quinoa.jpg",
    label: "Grilled Chicken Quinoa Bowl",
    calories: 520,
    macros: { protein: 42, carbs: 48, fat: 16, fiber: 8 },
    detectedIngredients: ["Chicken breast 150g", "Quinoa 1 cup", "Cucumber 0.5 cup", "Feta cheese 30g"]
  },
  {
    name: "chickpea_salad.jpg",
    label: "Mediterranean Chickpea Salad",
    calories: 460,
    macros: { protein: 15, carbs: 52, fat: 18, fiber: 12 },
    detectedIngredients: ["Chickpeas 1 can", "Red bell pepper 0.5", "Kalamata olives 6", "Tahini dressing 2 tbsp"]
  },
  {
    name: "berry_smoothie.jpg",
    label: "Double Berry Protein Smoothie",
    calories: 350,
    macros: { protein: 28, carbs: 32, fat: 8, fiber: 9 },
    detectedIngredients: ["Protein powder 1 scoop", "Mixed berries 1 cup", "Spinach 1 cup", "Almond milk 1.5 cups"]
  },
  {
    name: "fridge_interior.jpg",
    label: "Fridge Stock (Fresh Scan)",
    isFridgeScan: true,
    detectedIngredients: [
      { name: "Fresh asparagus stalks", amount: 8, unit: "stalks" },
      { name: "Whole wheat bread slices", amount: 6, unit: "slice" },
      { name: "Cabbage head", amount: 1, unit: "whole" },
      { name: "Fresh organic eggs", amount: 6, unit: "large" },
      { name: "Organic classic hummus", amount: 2, unit: "tbsp" }
    ]
  }
];
