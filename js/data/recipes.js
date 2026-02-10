// js/data/recipes.js
// Храним рецепты в одном месте. id должен совпадать с ?id=... в data-nav

window.RECIPES = [{
        id: "oatmeal",
        title: "Oatmeal with berries",
        image: "../assets/images/breakfast.jpeg",
        time: "10 min",
        difficulty: "easy",
        categories: ["breakfast", "healthy"],
        ingredients: [
            "60 g oats",
            "250 ml milk or water",
            "1 tsp honey",
            "Handful of berries",
            "Pinch of salt"
        ],
        steps: [
            "Pour milk/water into a pot and bring to a light boil.",
            "Add oats and a pinch of salt. Cook 5–7 minutes, stirring.",
            "Turn off heat, add honey.",
            "Top with berries and serve."
        ]
    },
    {
        id: "burger",
        title: "Burger",
        image: "../assets/images/burger.jpeg",
        time: "30 min",
        difficulty: "easy",
        categories: ["fastfood", "dinner"],
        ingredients: [
            "1 bun",
            "150 g beef patty",
            "1 slice cheese",
            "Lettuce, tomato, onion",
            "Salt, pepper",
            "Sauce (ketchup/mayo)"
        ],
        steps: [
            "Season the patty with salt and pepper.",
            "Fry the patty 3–4 min per side.",
            "Add cheese on top for last minute to melt.",
            "Toast bun, add sauce, veggies, patty, close burger."
        ]
    },
    {
        id: "pizza",
        title: "Pizza",
        image: "../assets/images/pizza.jpeg",
        time: "45 min",
        difficulty: "medium",
        categories: ["fastfood", "lunch"],
        ingredients: [
            "Pizza base (dough)",
            "Tomato sauce",
            "Mozzarella",
            "Toppings (ham/mushrooms/olives)",
            "Oregano"
        ],
        steps: [
            "Preheat oven to 220°C.",
            "Spread sauce on the base.",
            "Add cheese and toppings.",
            "Bake 10–15 minutes until golden."
        ]
    },
    {
        id: "nachos",
        title: "Nachos",
        image: "../assets/images/snacks.jpeg",
        time: "10 min",
        difficulty: "easy",
        categories: ["snacks", "fastfood"],
        ingredients: [
            "Nachos chips",
            "Cheese sauce",
            "Salsa",
            "Jalapeños (optional)"
        ],
        steps: [
            "Put chips on a plate.",
            "Warm cheese sauce (optional).",
            "Pour cheese sauce and add salsa/jalapeños."
        ]
    },
    {
        id: "crepes",
        title: "Crêpes",
        image: "../assets/images/desserts.jpeg",
        time: "20 min",
        difficulty: "easy",
        categories: ["french", "breakfast", "desserts"],
        ingredients: [
            "2 eggs",
            "250 ml milk",
            "120 g flour",
            "1 tbsp sugar",
            "Pinch of salt",
            "Butter for frying"
        ],
        steps: [
            "Mix eggs + milk, then add flour, sugar, salt. Whisk smooth.",
            "Heat pan, lightly butter it.",
            "Pour thin layer, fry 30–60 sec each side.",
            "Serve with jam/chocolate/banana."
        ]
    },
    {
        id: "syrniki",
        title: "Syrniki",
        image: "../assets/images/syrniki1.jpg",
        time: "20 min",
        difficulty: "easy",
        categories: ["russian", "breakfast", "desserts"],
        ingredients: [
            "300 g cottage cheese",
            "1 egg",
            "2–3 tbsp flour",
            "1–2 tbsp sugar",
            "Pinch of salt",
            "Oil for frying"
        ],
        steps: [
            "Mix cottage cheese, egg, sugar, salt.",
            "Add flour, form small patties.",
            "Fry 2–3 min per side until golden.",
            "Serve with sour cream or jam."
        ]
    },
    {
        id: "carbonara",
        title: "Pasta Carbonara",
        image: "../assets/images/dinner.jpeg",
        time: "25 min",
        difficulty: "medium",
        categories: ["dinner"],
        ingredients: [
            "200 g pasta",
            "2 eggs",
            "50 g cheese",
            "80 g bacon",
            "Black pepper",
            "Salt"
        ],
        steps: [
            "Cook pasta in salted water.",
            "Fry bacon until crispy.",
            "Mix eggs + grated cheese + pepper in a bowl.",
            "Drain pasta, mix with bacon, remove from heat.",
            "Add egg-cheese mix быстро, перемешай (чтобы не омлет!)."
        ]
    },
    {
        id: "chicken-salad",
        title: "Chicken salad",
        image: "../assets/images/healthy.jpeg",
        time: "15 min",
        difficulty: "easy",
        categories: ["lunch", "healthy"],
        ingredients: [
            "Cooked chicken",
            "Lettuce/greens",
            "Cucumber",
            "Tomato",
            "Olive oil + lemon",
            "Salt, pepper"
        ],
        steps: [
            "Cut chicken and vegetables.",
            "Mix in a bowl.",
            "Season with oil/lemon, salt and pepper."
        ]
    }
];