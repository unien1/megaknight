// js/data/app.js

// =========================
// 1) Навигация по data-nav
// =========================
document.addEventListener("click", (e) => {
    let t = e.target;
    if (!t) return;

    // иногда target — текст, у него нет closest()
    if (t.nodeType === 3) t = t.parentElement;

    const el = t && t.closest ? t.closest("[data-nav]") : null;
    if (!el) return;

    // чтобы <a href="#"> не прыгал
    if (el.tagName === "A") e.preventDefault();

    const url = el.getAttribute("data-nav");
    if (!url) return;

    // Если идём в рецепт со страницы category.html — добавляем from=тип категории
    if (url.includes("recipe.html") && window.location.pathname.includes("category.html")) {
        const params = new URLSearchParams(window.location.search);
        const type = params.get("type") || "all";

        // url обычно типа "recipe.html?id=nachos"
        window.location.href = `${url}&from=${encodeURIComponent(type)}`;
        return;
    }

    window.location.href = url;
});

// ====================================
// 2) Фильтрация категорий на category.html
// ====================================
(function() {
    const listEl = document.querySelector(".category-list");
    if (!listEl) return; // не category.html

    const params = new URLSearchParams(window.location.search);
    const type = (params.get("type") || "").toLowerCase();

    const titleEl = document.getElementById("categoryTitle");
    if (titleEl) {
        titleEl.textContent = type ? `Category: ${type}` : "Category";
    }

    const cards = Array.from(listEl.querySelectorAll(".category-card-row"));

    // если нет type или type=all — показываем всё
    if (!type || type === "all") {
        cards.forEach((c) => (c.style.display = ""));
        return;
    }

    // показываем только те, где data-types содержит type
    cards.forEach((card) => {
        const types = (card.getAttribute("data-types") || "")
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);

        card.style.display = types.includes(type) ? "" : "none";
    });
})();

// ====================================
// 3) Рендер рецепта на recipe.html?id=...
// ====================================
(function() {
    const titleEl = document.getElementById("recipeTitle");
    if (!titleEl) return; // не recipe.html

    const params = new URLSearchParams(window.location.search);
    const id = (params.get("id") || "").toLowerCase();

    const recipes = window.RECIPES || [];
    const recipe = recipes.find((r) => (r.id || "").toLowerCase() === id);

    const errorEl = document.getElementById("recipeError");
    const imgEl = document.getElementById("recipeImage");
    const metaEl = document.getElementById("recipeMeta");
    const ingEl = document.getElementById("ingredientsList");
    const stepsEl = document.getElementById("stepsList");

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
        recipe.ingredients.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            ingEl.appendChild(li);
        });
    }

    if (stepsEl) {
        stepsEl.innerHTML = "";
        recipe.steps.forEach((step) => {
            const li = document.createElement("li");
            li.textContent = step;
            stepsEl.appendChild(li);
        });
    }
})();
// ====================================
// AUTH (простая авторизация для статического проекта)
// ====================================
const AUTH_KEY = "isLoggedIn";
const DEMO_USER = "admin";
const DEMO_PASS = "1234";

function isLoggedIn() {
    return localStorage.getItem(AUTH_KEY) === "1";
}

function requireAuthOnAdmin() {
    const page = window.location.pathname.split("/").pop();
    if (page === "admin.html" && !isLoggedIn()) {
        window.location.href = "login.html";
    }
}

(function setupLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return; // не login.html

    const msg = document.getElementById("loginMsg");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const userEl = document.getElementById("loginUser");
        const passEl = document.getElementById("loginPass");
        const user = (userEl ? userEl.value : "").trim();
        const pass = (passEl ? passEl.value : "").trim();

        if (user === DEMO_USER && pass === DEMO_PASS) {
            localStorage.setItem(AUTH_KEY, "1");
            if (msg) msg.textContent = "✅ Logged in!";
            window.location.href = "admin.html";
        } else {
            if (msg) msg.textContent = "❌ Wrong username or password.";
        }
    });
})();

// запускаем проверку доступа
requireAuthOnAdmin();

// ====================================
// 4) Кнопка Back (кроме recipe.html)
// ЛЕСТНИЦА: category -> home, иначе обычный back
// ====================================
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-back");
    if (!btn) return;

    e.preventDefault();

    const page = window.location.pathname.split("/").pop(); // category.html / login.html / admin.html

    // если это category.html -> на главную
    if (page === "category.html") {
        window.location.href = "../index.html";
        return;
    }

    // иначе (login/admin) — назад, а если некуда, то на главную
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "../index.html";
    }
});

// ====================================
// Back на recipe.html -> в категорию (по from=...)
// ====================================
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-recipe-back");
    if (!btn) return;

    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const from = params.get("from") || "all";

    window.location.href = `category.html?type=${encodeURIComponent(from)}`;
});

// ====================================
// Клик по MEGAKNIGHT -> на главную
// ====================================
document.addEventListener("click", (e) => {
    const brand = e.target.closest(".brand");
    if (!brand) return;

    // если мы внутри /pages -> главная на уровень выше
    const isInPages = window.location.pathname.includes("/pages/");
    window.location.href = isInPages ? "../index.html" : "index.html";
});