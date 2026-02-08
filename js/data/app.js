// js/data/app.js

// 1) Навигация по data-nav
document.addEventListener("click", (e) => {
    let t = e.target;
    if (!t) return;
    if (t.nodeType === 3) t = t.parentElement;

    const el = t && t.closest ? t.closest("[data-nav]") : null;
    if (!el) return;

    if (el.tagName === "A") e.preventDefault();

    const url = el.getAttribute("data-nav");
    if (!url) return;

    window.location.href = url;
});


// --- Recipe page render: pages/recipe.html?id=... ---
(function() {
    const titleEl = document.getElementById("recipeTitle");
    if (!titleEl) return; // не recipe.html

    const params = new URLSearchParams(window.location.search);
    const id = (params.get("id") || "").toLowerCase();

    const errorEl = document.getElementById("recipeError");
    const imgEl = document.getElementById("recipeImage");
    const metaEl = document.getElementById("recipeMeta");
    const ingEl = document.getElementById("ingredientsList");
    const stepsEl = document.getElementById("stepsList");

    const recipes = window.RECIPES || [];
    const recipe = recipes.find(r => (r.id || "").toLowerCase() === id);

    if (!recipe) {
        titleEl.textContent = "Recipe not found";
        if (errorEl) errorEl.textContent = `No recipe for id: ${id}`;
        return;
    }

    titleEl.textContent = recipe.title;
    if (metaEl) metaEl.textContent = `${recipe.time} • ${recipe.difficulty}`;

    if (imgEl) {
        imgEl.src = recipe.image;
        imgEl.alt = recipe.title;
    }

    if (ingEl) {
        ingEl.innerHTML = "";
        recipe.ingredients.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            ingEl.appendChild(li);
        });
    }

    if (stepsEl) {
        stepsEl.innerHTML = "";
        recipe.steps.forEach(step => {
            const li = document.createElement("li");
            li.textContent = step;
            stepsEl.appendChild(li);
        });
    }
})();