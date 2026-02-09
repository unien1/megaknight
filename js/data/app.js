// js/data/app.js
// =========================
// USER RECIPES (localStorage)
// =========================
const USER_RECIPES_KEY = "USER_RECIPES";

function loadUserRecipes() {
  try {
    const raw = localStorage.getItem(USER_RECIPES_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function saveUserRecipes(arr) {
  localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(arr));
}

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// если фото не ввели — подбираем простое по категории
function autoImageByCategory(cat) {
  if (cat === "fastfood") return "../assets/images/burger.jpeg";
  if (cat === "russian") return "../assets/images/russian.jpeg";
  if (cat === "french") return "../assets/images/french.jpeg";
  return "../assets/images/healthy.jpeg";
}

// =========================
// 1) Навигация по data-nav
// =========================
document.addEventListener("click", (e) => {
    let t = e.target;
    if (!t) return;

    // иногда target — текст, у него нет closest()
    if (t.nodeType === 3) t = t.parentElement;
    // НЕ навигируем, если нажали на кнопку Delete (или вообще на любую кнопку/инпут внутри карточки)
if (t.closest && t.closest(".js-del-user-recipe")) return;
const interactive = t.closest && t.closest("button, input, textarea, select");
if (interactive && !interactive.hasAttribute("data-nav")) return;
    const el = t && t.closest ? t.closest("[data-nav]") : null;
    if (!el) return;

    // чтобы <a href="#"> не прыгал
    if (el.tagName === "A") e.preventDefault();

    const url = el.getAttribute("data-nav");
    if (!url) return;
    // ====== если нажали на иконку профиля -> открываем не login, а панель ======
if (url.includes("login.html")) {
    const isLogged = localStorage.getItem("isLoggedIn") === "1";
    const role = localStorage.getItem("authRole"); // "admin" или null

    if (isLogged && role === "admin") {
        // если мы в /pages -> admin.html рядом, если на главной -> pages/admin.html
        const isInPages = window.location.pathname.includes("/pages/");
        window.location.href = isInPages ? "admin.html" : "pages/admin.html";
        return;
    }

    // (опционально) если у тебя есть user-панель
    if (isLogged && role === "user") {
        const isInPages = window.location.pathname.includes("/pages/");
        window.location.href = isInPages ? "user.html" : "pages/user.html";
        return;
    }

    // если не залогинен — идём на login как обычно
}

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
// 2) Категории на category.html + "Added recipe" из localStorage
// ====================================
(function () {
  const listEl = document.querySelector(".category-list");
  if (!listEl) return; // не category.html

  const params = new URLSearchParams(window.location.search);
  const type = (params.get("type") || "").toLowerCase();
  // если открыли Added recipe — показываем рецепты из localStorage
if (type === "added") {
  const list = loadUserRecipes();

  // прячем встроенные карточки и очищаем список
  listEl.innerHTML = "";

  if (list.length === 0) {
    listEl.innerHTML = `<div style="opacity:.6;">No added recipes</div>`;
    return;
  }

  list.forEach(r => {
    const row = document.createElement("div");
    row.className = "category-card-row";
    row.setAttribute("data-nav", `recipe.html?id=${encodeURIComponent(r.id)}&from=category&type=added`);

    row.innerHTML = `
      <div class="category-card-row__image">
        <img src="${r.image || ""}" alt="${r.title || ""}">
      </div>
      <div class="category-card-row__content">
        <div class="category-card-row__title">${r.title || "Untitled"}</div>

        <div style="margin-top:10px; display:flex; gap:10px;">
          <button class="btn btn--ghost js-del-user-recipe" type="button" data-id="${r.id}">
            Delete
          </button>
        </div>
      </div>
    `;

    listEl.appendChild(row);
  });

  return; // важно: дальше обычная фильтрация не нужна
}

  const titleEl = document.getElementById("categoryTitle");
  if (titleEl) titleEl.textContent = type ? `Category: ${type}` : "Category";

  const cards = Array.from(listEl.querySelectorAll(".category-card-row"));

  function createUserCard(recipe) {
    const wrap = document.createElement("div");
    wrap.className = "category-card-row";
    wrap.setAttribute("data-nav", `recipe.html?id=${encodeURIComponent(recipe.id)}&from=category&type=${encodeURIComponent(type || "")}`);

    wrap.innerHTML = `
      <div class="category-card-row__image">
        <img src="${recipe.image || ""}" alt="${recipe.title || ""}">
      </div>
      <div class="category-card-row__content">
        <div class="category-card-row__title">${recipe.title || "Untitled"}</div>
        <div class="category-card-row__meta" style="opacity:.75; margin-top:6px;">
          <span>${recipe.time || "—"}</span>
          <span style="margin-left:10px;">${recipe.difficulty || ""}</span>
        </div>

        <div style="margin-top:10px;">
          <button class="btn btn--ghost js-del-user-recipe" type="button" data-id="${recipe.id}">Delete</button>
        </div>
      </div>
    `;
    return wrap;
  }

  // стандартная фильтрация встроенных карточек
  if (!type || type === "all") {
    cards.forEach((c) => (c.style.display = ""));
  } else {
    cards.forEach((card) => {
      const types = (card.getAttribute("data-types") || "")
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

      card.style.display = types.includes(type) ? "" : "none";
    });
  }

  const userList = loadUserRecipes();

  // если открыли "Added recipe" — показываем только добавленные
  if (type === "added") {
    cards.forEach((c) => (c.style.display = "none"));
    listEl.innerHTML = "";

    if (userList.length === 0) {
      listEl.innerHTML = `<div style="opacity:.6;">No added recipes</div>`;
      return;
    }

    userList.forEach((r) => listEl.appendChild(createUserCard(r)));
    return;
  }

  // если открыли обычную категорию — добавляем туда пользовательские рецепты этой категории
  if (type) {
    const filteredUser = userList.filter((r) =>
      (r.categories || []).map(x => String(x).toLowerCase()).includes(type)
    );

    if (filteredUser.length) {
      const sep = document.createElement("div");
      sep.style.margin = "18px 0 8px";
      sep.style.opacity = ".7";
      sep.textContent = "Your added recipes:";
      listEl.appendChild(sep);

      filteredUser.forEach((r) => listEl.appendChild(createUserCard(r)));
    }
  }
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
let recipe = recipes.find((r) => String(r.id || "").toLowerCase() === id);

// если не нашли среди встроенных — ищем среди добавленных (localStorage)
if (!recipe) {
  const user = loadUserRecipes();
  recipe = user.find((r) => String(r.id || "").toLowerCase() === id);
}

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
    localStorage.setItem("authRole", "admin");   // ← ВАЖНО
    localStorage.setItem("authUser", "admin");   // ← можно, но не обязательно

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
  let t = e.target;
  if (t && t.nodeType === 3) t = t.parentElement;

  const btn = t && t.closest ? t.closest(".js-back") : null;
  if (!btn) return;

  e.preventDefault();

  const page = window.location.pathname.split("/").pop();

  if (page === "category.html") {
    window.location.href = "../index.html";
    return;
  }

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
  let t = e.target;
  if (t && t.nodeType === 3) t = t.parentElement;

  const btn = t && t.closest ? t.closest(".js-recipe-back") : null;
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
  let t = e.target;
  if (t && t.nodeType === 3) t = t.parentElement;

  const brand = t && t.closest ? t.closest(".brand") : null;
  if (!brand) return;

  const isInPages = window.location.pathname.includes("/pages/");
  window.location.href = isInPages ? "../index.html" : "index.html";
});

// ====================================
// Показываем ADD RECIPE только для admin
// ====================================
(function controlAddRecipeButton() {
    const btn = document.querySelector(".js-add-recipe");
    if (!btn) return;

    const isLogged = localStorage.getItem("isLoggedIn") === "1";
    const role = localStorage.getItem("authRole");

    // показываем ТОЛЬКО если admin
    if (isLogged && role === "admin") {
        btn.style.display = "";
    } else {
        btn.style.display = "none";
    }
})();
// ====================================
// LOGOUT
// ====================================
document.addEventListener("click", (e) => {
  let t = e.target;
  if (t && t.nodeType === 3) t = t.parentElement;

  const btn = t && t.closest ? t.closest(".js-logout") : null;
  if (!btn) return;

  e.preventDefault();

  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("authRole");
  localStorage.removeItem("authUser");

  window.location.href = "../index.html";
});

// =========================
// Admin: save recipe
// =========================
(function setupAdminAddRecipe() {
  const form = document.getElementById("addRecipeForm");
  if (!form) return; // не admin.html

  const msg = document.getElementById("adminMsg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("rTitle").value.trim();
    const category = "added"; 
    const imageInput = document.getElementById("rImage").value.trim();
    const ingText = document.getElementById("rIngredients").value.trim();
    const stepsText = document.getElementById("rSteps").value.trim();

    if (!title || !ingText || !stepsText) {
      if (msg) msg.textContent = "Заполни все поля.";
      return;
    }

    const ingredients = ingText.split("\n").map(s => s.trim()).filter(Boolean);
    const steps = stepsText.split("\n").map(s => s.trim()).filter(Boolean);

    const newRecipe = {
      id: `${slugify(title)}-${Date.now()}`,
      title,
      image: imageInput || autoImageByCategory(category),
      time: "—",
      difficulty: "easy",
      categories: ["added"],
      desc: "User added recipe",
      ingredients,
      steps
    };

    const list = loadUserRecipes();
    list.push(newRecipe);
    saveUserRecipes(list);

    if (msg) msg.textContent = "✅ Saved!";
    form.reset();
  });
})();

// =========================
// Category sidebar: show added recipes in current category
// =========================
(function renderUserRecipesInSidebar() {
  const nav = document.getElementById("userRecipesNav");
  if (!nav) return; // не category.html

  const params = new URLSearchParams(window.location.search);
  const type = (params.get("type") || "").toLowerCase(); // fastfood/russian/french/...

  const list = loadUserRecipes();

  // показываем только те, что относятся к текущей категории
  const filtered = list.filter(r => (r.categories || []).includes(type));

  nav.innerHTML = "";

  if (filtered.length === 0) {
    nav.innerHTML = `<div style="opacity:.6;">No added recipes</div>`;
    return;
  }

  filtered.forEach(r => {
    const a = document.createElement("a");
    a.className = "side-link";
    // переходим в recipe.html и говорим откуда пришли (чтобы back работал)
    a.setAttribute("data-nav", `recipe.html?id=${encodeURIComponent(r.id)}&from=${encodeURIComponent(type)}`);
    a.textContent = r.title;
    nav.appendChild(a);
  });
})();

// =========================
// Recipe page: дать доступ к user recipes
// =========================
(function mergeUserRecipesToWindow() {
  // если recipes.js не подключен на странице, window.RECIPES может быть undefined
  const base = Array.isArray(window.RECIPES) ? window.RECIPES : [];
  const user = loadUserRecipes();

  // склеиваем без дублей
  const map = new Map();
  [...base, ...user].forEach(r => {
    if (r && r.id) map.set(r.id, r);
  });

  window.RECIPES = Array.from(map.values());
})();
// =========================
// Delete user-added recipe (from localStorage)
// =========================
document.addEventListener("click", (e) => {
  let t = e.target;
  if (!t) return;
  if (t.nodeType === 3) t = t.parentElement;

  const btn = t.closest ? t.closest(".js-del-user-recipe") : null;
  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();

  const id = btn.getAttribute("data-id");
  if (!id) return;

  const list = loadUserRecipes();
  const next = list.filter(r => String(r.id) !== String(id));
  saveUserRecipes(next);

  const card = btn.closest(".category-card-row");
  if (card) card.remove();

  const listEl = document.querySelector(".category-list");
  if (listEl && listEl.querySelectorAll(".category-card-row").length === 0) {
    listEl.innerHTML = `<div style="opacity:.6;">No added recipes</div>`;
  }
});