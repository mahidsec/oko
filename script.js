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

function detectPlatform() {
    const ua = navigator.userAgent || "";
    if (/android/i.test(ua) && !/tv|smarttv|android\s*tv/i.test(ua)) return "android-mobile";
    if (/android\s*tv|smarttv/i.test(ua)) return "android-tv";
    if (/iphone|ipad|ipod/i.test(ua)) return "ios";
    return "desktop";
}

const platform = detectPlatform();

function configureHero(plat, data) {
    const heroIcon = document.querySelector(".hero-content .icon");
    const downloadBtn = document.getElementById("downloadBtn");
    const heroAltLink = document.querySelector(".hero-alt-link");

    if (heroIcon) {
        heroIcon.src = "assets/icon.png";
    }

    // Show correct version based on platform
    const versionEl = document.getElementById("version");
    if (versionEl && data) {
        const ver = (plat === "android-tv" || plat === "desktop") ? data.tv?.latest_version : data.mobile?.latest_version;
        versionEl.textContent = ver ? `v${ver}` : "Latest";
    }

    if (!downloadBtn) return;

    // Configure button per platform
    if (plat === "desktop") {
        downloadBtn.href = "#";
        downloadBtn.classList.add("download-btn--disabled");
        downloadBtn.querySelector("span").textContent = "Coming to desktop soon";
        downloadBtn.addEventListener("click", e => e.preventDefault());
    } else if (plat === "ios") {
        downloadBtn.href = "#";
        downloadBtn.classList.add("download-btn--disabled");
        downloadBtn.querySelector("span").textContent = "Coming Soon";
        downloadBtn.addEventListener("click", e => e.preventDefault());
    } else if (plat === "android-tv") {
        downloadBtn.href = "https://play.google.com/store/apps/details?id=com.oko.tv";
        downloadBtn.classList.remove("download-btn--disabled");
        downloadBtn.querySelector("span").textContent = "Download APK";
    } else {
        // android-mobile
        downloadBtn.href = "https://play.google.com/store/apps/details?id=com.oko";
        downloadBtn.classList.remove("download-btn--disabled");
        downloadBtn.querySelector("span").textContent = "Download APK";
    }

    // "Other platform?" link always shown
    if (heroAltLink) {
        heroAltLink.querySelector("a").textContent = "other platform?";
    }

    // Reveal hero content after configuration
    document.querySelector(".hero-content").style.opacity = "1";
}



// Fetch changelogs from local JSON
fetch("app-update/app-update.json")
.then(r => r.json())
.then(data => {

    if (document.getElementById("notes-mobile")) {
        const changelog = data.mobile?.changelog || ["No release notes available."];
        document.getElementById("notes-mobile").innerHTML = changelog
            .map(item => `<li>${item}</li>`)
            .join("");
    }

    if (document.getElementById("notes-tv")) {
        const changelog = data.tv?.changelog || ["No release notes available."];
        document.getElementById("notes-tv").innerHTML = changelog
            .map(item => `<li>${item}</li>`)
            .join("");
    }

    configureHero(platform, data);

    // Set version badges and download links with dummy Play Store URLs
    ["mobile", "tv"].forEach(p => {
        const info = data[p];
        const versionEl = document.getElementById(`${p}-version`);
        const downloadEl = document.getElementById(`${p}-download`);

        if (versionEl && info) {
            versionEl.textContent = `v${info.latest_version}`;
        }

        if (downloadEl) {
            downloadEl.href = p === "tv"
                ? "https://play.google.com/store/apps/details?id=com.oko.tv"
                : "https://play.google.com/store/apps/details?id=com.oko";
            downloadEl.classList.remove("version-card__download--disabled");
            downloadEl.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span>Download APK</span>`;
        }
    });
})
.catch(() => {
    if (document.getElementById("notes-mobile")) {
        document.getElementById("notes-mobile").innerHTML = "<li>Unable to fetch release notes.</li>";
    }
    if (document.getElementById("notes-tv")) {
        document.getElementById("notes-tv").innerHTML = "<li>Unable to fetch release notes.</li>";
    }

    configureHero(platform, null);
});
