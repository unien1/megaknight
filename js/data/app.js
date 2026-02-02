// js/app.js
// Делает кликабельным любой элемент с атрибутом data-nav.
// Название сайта кликабельным НЕ делаем — просто не ставим data-nav на .brand.

document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-nav]");
    if (!el) return;

    const url = el.dataset.nav;
    if (!url) return;

    window.location.href = url;
});