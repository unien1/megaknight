(function protectPanelsByRole() {
    const role = localStorage.getItem("authRole");
    const path = window.location.pathname;


    if (path.includes("admin.html")) {
        if (role !== "admin") {
            window.location.href = "login.html";
        }
    }


    if (path.includes("user.html")) {
        if (role !== "user") {
            window.location.href = "login.html";
        }
    }
})();
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


function autoImageByCategory(cat) {
    if (cat === "fastfood") return "../assets/images/burger.jpeg";
    if (cat === "russian") return "../assets/images/russian.jpeg";
    if (cat === "french") return "../assets/images/french.jpeg";
    return "../assets/images/healthy.jpeg";
}


document.addEventListener("click", (e) => {
    let t = e.target;
    if (!t) return;


    if (t.nodeType === 3) t = t.parentElement;

    if (t.closest && t.closest(".js-del-user-recipe")) return;
    const interactive = t.closest && t.closest("button, input, textarea, select");
    if (interactive && !interactive.hasAttribute("data-nav")) return;
    const el = t && t.closest ? t.closest("[data-nav]") : null;
    if (!el) return;


    if (el.tagName === "A") e.preventDefault();

    const url = el.getAttribute("data-nav");
    if (!url) return;

    if (url.includes("login.html")) {
        const isLogged = localStorage.getItem("isLoggedIn") === "1";
        const role = localStorage.getItem("authRole");

        if (isLogged && role === "admin") {

            const isInPages = window.location.pathname.includes("/pages/");
            window.location.href = isInPages ? "admin.html" : "pages/admin.html";
            return;
        }


        if (isLogged && role === "user") {
            const isInPages = window.location.pathname.includes("/pages/");
            window.location.href = isInPages ? "user.html" : "pages/user.html";
            return;
        }

    }


    if (url.includes("recipe.html") && window.location.pathname.includes("category.html")) {
        const params = new URLSearchParams(window.location.search);
        const type = params.get("type") || "all";


        window.location.href = `${url}&from=${encodeURIComponent(type)}`;
        return;
    }

    window.location.href = url;
});



(function() {
        const listEl = document.querySelector(".category-list");
        if (!listEl) return;

        const params = new URLSearchParams(window.location.search);
        const type = (params.get("type") || "").toLowerCase();

        if (type === "added") {
            const list = loadUserRecipes();
            const role = localStorage.getItem("authRole");
            const canDelete = role === "admin";

            listEl.innerHTML = "";

            if (list.length === 0) {
                listEl.innerHTML = `<div style="opacity:.6;">No added recipes</div>`;
                return;
            }

            list.forEach(r => {
                        const row = document.createElement("div");
                        row.className = "category-card-row";
                        row.setAttribute(
                            "data-nav",
                            `recipe.html?id=${encodeURIComponent(r.id)}&from=category&type=added`
                        );

                        row.innerHTML = `
          <div class="category-card-row__image">
            <img src="${r.image || ""}" alt="${r.title || ""}">
          </div>
          <div class="category-card-row__content">
            <div class="category-card-row__title">${r.title || "Untitled"}</div>

            <div style="margin-top:10px; display:flex; gap:10px;">
              ${canDelete ? `
                <button
                  class="btn btn--ghost js-del-user-recipe"
                  type="button"
                  data-id="${r.id}">
                  Delete
                </button>
              ` : ``}
            </div>
          </div>
        `;

        listEl.appendChild(row);
    });

    return;
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


(function() {
    const titleEl = document.getElementById("recipeTitle");
    if (!titleEl) return;

    const params = new URLSearchParams(window.location.search);
    const id = (params.get("id") || "").toLowerCase();

    const recipes = window.RECIPES || [];
    let recipe = recipes.find((r) => String(r.id || "").toLowerCase() === id);


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


        if (imgEl) imgEl.style.display = "none";
        return;
    }


    titleEl.textContent = recipe.title || "Untitled";
    if (metaEl) metaEl.textContent = `${recipe.time || "—"} • ${recipe.difficulty || "easy"}`;


    if (imgEl) {
        if (recipe.image) {
            imgEl.src = recipe.image;
            imgEl.alt = recipe.title || "";
            imgEl.style.display = "";
        } else {

            imgEl.removeAttribute("src");
            imgEl.alt = "";
            imgEl.style.display = "none";
        }
    }


    if (ingEl) {
        ingEl.innerHTML = "";
        const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
        ingredients.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            ingEl.appendChild(li);
        });
    }


    if (stepsEl) {
        stepsEl.innerHTML = "";
        const steps = Array.isArray(recipe.steps) ? recipe.steps : [];
        steps.forEach((step) => {
            const li = document.createElement("li");
            li.textContent = step;
            stepsEl.appendChild(li);
        });
    }
})();
const AUTH_KEY = "isLoggedIn";
const DEMO_ADMIN_USER = "admin";
const DEMO_ADMIN_PASS = "1234";

const DEMO_NORMAL_USER = "user";
const DEMO_NORMAL_PASS = "1111";

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
    if (!form) return;

    const msg = document.getElementById("loginMsg");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const userEl = document.getElementById("loginUser");
        const passEl = document.getElementById("loginPass");
        const user = (userEl ? userEl.value : "").trim();
        const pass = (passEl ? passEl.value : "").trim();

        
        if (user === DEMO_ADMIN_USER && pass === DEMO_ADMIN_PASS) {
            localStorage.setItem(AUTH_KEY, "1");
            localStorage.setItem("authRole", "admin");
            localStorage.setItem("authUser", "admin");

            if (msg) msg.textContent = "✅ Logged in as admin!";
            window.location.href = "admin.html";
            return;
        }

        
        if (user === DEMO_NORMAL_USER && pass === DEMO_NORMAL_PASS) {
            localStorage.setItem(AUTH_KEY, "1");
            localStorage.setItem("authRole", "user");
            localStorage.setItem("authUser", "user");

            if (msg) msg.textContent = "✅ Logged in as user!";
            window.location.href = "user.html"; // 🔥 ВАЖНО
            return;
        }

        if (msg) msg.textContent = "❌ Wrong username or password.";
    });
})();


requireAuthOnAdmin();


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


document.addEventListener("click", (e) => {
    let t = e.target;
    if (t && t.nodeType === 3) t = t.parentElement;

    const brand = t && t.closest ? t.closest(".brand") : null;
    if (!brand) return;

    const isInPages = window.location.pathname.includes("/pages/");
    window.location.href = isInPages ? "../index.html" : "index.html";
});


(function controlAddRecipeButton() {
    const btn = document.querySelector(".js-add-recipe");
    if (!btn) return;

    const isLogged = localStorage.getItem("isLoggedIn") === "1";
    const role = localStorage.getItem("authRole");

    if (isLogged && (role === "admin" || role === "user")) {
        btn.style.display = "";
    } else {
        btn.style.display = "none";
    }
})();

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


(function setupAdminAddRecipe() {
    const form = document.getElementById("addRecipeForm");
    if (!form) return; 

    const msg = document.getElementById("adminMsg");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("rTitle").value.trim();
        const imageInput = document.getElementById("rImage").value.trim();
        const ingText = document.getElementById("rIngredients").value.trim();
        const stepsText = document.getElementById("rSteps").value.trim();

        
        if (!title || !ingText || !stepsText) {
            if (msg) msg.textContent = "Заполни название, ингредиенты и шаги.";
            return;
        }

        const ingredients = ingText
            .split("\n")
            .map(s => s.trim())
            .filter(Boolean);

        const steps = stepsText
            .split("\n")
            .map(s => s.trim())
            .filter(Boolean);

        const newRecipe = {
            id: `${slugify(title)}-${Date.now()}`,
            title: title,
            image: imageInput || "", 
            time: "—",
            difficulty: "easy",
            categories: ["added"], 
            desc: "User added recipe",
            ingredients: ingredients,
            steps: steps
        };

        const list = loadUserRecipes();
        list.push(newRecipe);
        saveUserRecipes(list);

        if (msg) msg.textContent = "✅ Recipe saved!";
        form.reset();
    });
})();


(function renderUserRecipesInSidebar() {
    const nav = document.getElementById("userRecipesNav");
    if (!nav) return; 

    const params = new URLSearchParams(window.location.search);
    const type = (params.get("type") || "").toLowerCase(); 

    const list = loadUserRecipes();

    
    const filtered = list.filter(r => (r.categories || []).includes(type));

    nav.innerHTML = "";

    if (filtered.length === 0) {
        nav.innerHTML = `<div style="opacity:.6;">No added recipes</div>`;
        return;
    }

    filtered.forEach(r => {
        const a = document.createElement("a");
        a.className = "side-link";
        
        a.setAttribute("data-nav", `recipe.html?id=${encodeURIComponent(r.id)}&from=${encodeURIComponent(type)}`);
        a.textContent = r.title;
        nav.appendChild(a);
    });
})();


(function mergeUserRecipesToWindow() {
    
    const base = Array.isArray(window.RECIPES) ? window.RECIPES : [];
    const user = loadUserRecipes();

    
    const map = new Map();
    [...base, ...user].forEach(r => {
        if (r && r.id) map.set(r.id, r);
    });

    window.RECIPES = Array.from(map.values());
})();

document.addEventListener("click", (e) => {
    let t = e.target;
    if (!t) return;
    if (t.nodeType === 3) t = t.parentElement;

    const btn = t.closest ? t.closest(".js-del-user-recipe") : null;
    if (!btn) return;
    if (localStorage.getItem("authRole") !== "admin") {
        return;
    }
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