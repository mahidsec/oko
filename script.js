const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

// Update current year in footer
const currentYearEl = document.getElementById("current-year");
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
}

setTheme(savedTheme || systemTheme);

themeToggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

// Legal dropdown toggle
const legalToggle = document.getElementById("legalToggle");
const legalMenu = document.getElementById("legalMenu");

if (legalToggle && legalMenu) {
    legalToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = legalMenu.classList.toggle("is-open");
        legalToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close on click outside
    document.addEventListener("click", (e) => {
        if (!legalMenu.contains(e.target) && !legalToggle.contains(e.target)) {
            legalMenu.classList.remove("is-open");
            legalToggle.setAttribute("aria-expanded", "false");
        }
    });

    // Close when a menu link is clicked
    legalMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            legalMenu.classList.remove("is-open");
            legalToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// Static release info — no remote update check.
// ponytail: single hardcoded version; add a versions.json + fetch when >1 release line needs notes.
const heroContent = document.querySelector(".hero-content");
if (heroContent) heroContent.classList.add("hero-content--visible");




