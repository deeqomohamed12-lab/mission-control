/* =========================================
   MISSION CONTROL
   SCRIPT.JS — PART 1
   Foundation, Navigation, Date and Theme
========================================= */

"use strict";

/* ---------- Storage Helpers ---------- */

const STORAGE_PREFIX = "missionControl_";

function saveData(key, value) {
  try {
    localStorage.setItem(
      STORAGE_PREFIX + key,
      JSON.stringify(value)
    );
  } catch (error) {
    console.error("Could not save data:", error);
  }
}

function loadData(key, fallbackValue = null) {
  try {
    const savedValue = localStorage.getItem(
      STORAGE_PREFIX + key
    );

    return savedValue !== null
      ? JSON.parse(savedValue)
      : fallbackValue;
  } catch (error) {
    console.error("Could not load data:", error);
    return fallbackValue;
  }
}

/* ---------- Element Helpers ---------- */

function getElement(id) {
  return document.getElementById(id);
}

function getAll(selector) {
  return document.querySelectorAll(selector);
}

/* ---------- Toast Notification ---------- */

let toastTimer;

function showToast(message, icon = "✓") {
  const toast = getElement("toast");
  const toastMessage = getElement("toastMessage");
  const toastIcon = getElement("toastIcon");

  if (!toast || !toastMessage || !toastIcon) {
    return;
  }

  toastMessage.textContent = message;
  toastIcon.textContent = icon;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

/* ---------- Current Date ---------- */

function updateCurrentDate() {
  const currentDay = getElement("currentDay");
  const currentDate = getElement("currentDate");

  if (!currentDay || !currentDate) {
    return;
  }

  const now = new Date();

  currentDay.textContent = now.toLocaleDateString(
    "en-US",
    {
      weekday: "long"
    }
  );

  currentDate.textContent = now.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  );
}

/* ---------- Greeting ---------- */

function updateGreeting() {
  const pageTitle = getElement("pageTitle");

  if (!pageTitle) {
    return;
  }

  const hour = new Date().getHours();
  let greeting = "Good evening";

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  }

  pageTitle.textContent = `${greeting}, Deeqo`;
}

/* ---------- Sidebar Navigation ---------- */

function openSection(sectionId) {
  const targetSection = getElement(sectionId);

  if (!targetSection) {
    return;
  }

  getAll(".app-section").forEach((section) => {
    section.classList.remove("active");
  });

  getAll(".nav-item").forEach((button) => {
    button.classList.remove("active");
  });

  targetSection.classList.add("active");

  const matchingButton = document.querySelector(
    `.nav-item[data-section="${sectionId}"]`
  );

  if (matchingButton) {
    matchingButton.classList.add("active");
  }

  const pageTitle = getElement("pageTitle");
  const pageEyebrow = getElement("pageEyebrow");

  if (pageTitle) {
    pageTitle.textContent =
      targetSection.dataset.title || "Mission Control";
  }

  if (pageEyebrow) {
    pageEyebrow.textContent =
      targetSection.dataset.eyebrow || "Mission Control";
  }

  saveData("activeSection", sectionId);
  closeMobileSidebar();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function initializeNavigation() {
  getAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      openSection(button.dataset.section);
    });
  });

  getAll(".section-jump").forEach((button) => {
    button.addEventListener("click", () => {
      openSection(button.dataset.jump);
    });
  });

  const savedSection = loadData(
    "activeSection",
    "home"
  );

  openSection(savedSection);
}

/* ---------- Mobile Sidebar ---------- */

function openMobileSidebar() {
  const sidebar = getElement("sidebar");
  const overlay = getElement("sidebarOverlay");

  if (sidebar) {
    sidebar.classList.add("open");
  }

  if (overlay) {
    overlay.classList.add("show");
  }
}

function closeMobileSidebar() {
  const sidebar = getElement("sidebar");
  const overlay = getElement("sidebarOverlay");

  if (sidebar) {
    sidebar.classList.remove("open");
  }

  if (overlay) {
    overlay.classList.remove("show");
  }
}

function initializeMobileSidebar() {
  const menuButton = getElement("menuButton");
  const closeButton = getElement("closeSidebar");
  const overlay = getElement("sidebarOverlay");

  if (menuButton) {
    menuButton.addEventListener(
      "click",
      openMobileSidebar
    );
  }

  if (closeButton) {
    closeButton.addEventListener(
      "click",
      closeMobileSidebar
    );
  }

  if (overlay) {
    overlay.addEventListener(
      "click",
      closeMobileSidebar
    );
  }
}

/* ---------- Theme ---------- */

function applyTheme(theme) {
  const themeToggle = getElement("themeToggle");

  document.body.classList.toggle(
    "light-theme",
    theme === "light"
  );

  if (themeToggle) {
    themeToggle.textContent =
      theme === "light" ? "☀️" : "🌙";
  }
}

function initializeTheme() {
  const savedTheme = loadData("theme", "dark");
  const themeToggle = getElement("themeToggle");

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight =
        document.body.classList.contains(
          "light-theme"
        );

      const nextTheme = isLight
        ? "dark"
        : "light";

      saveData("theme", nextTheme);
      applyTheme(nextTheme);
      showToast(`${nextTheme} theme activated`, "🎨");
    });
  }
}

/* ---------- Keyboard Search Shortcut ---------- */

function initializeKeyboardShortcuts() {
  document.addEventListener("keydown", (event) => {
    const isSearchShortcut =
      (event.metaKey || event.ctrlKey) &&
      event.key.toLowerCase() === "k";

    if (isSearchShortcut) {
      event.preventDefault();

      const globalSearch =
        getElement("globalSearch");

      if (globalSearch) {
        globalSearch.focus();
      }
    }

    if (event.key === "Escape") {
      closeMobileSidebar();
    }
  });
}

/* ---------- Start Mission Control ---------- */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    updateCurrentDate();
    updateGreeting();
    initializeNavigation();
    initializeMobileSidebar();
    initializeTheme();
    initializeKeyboardShortcuts();

    console.log("Mission Control is online.");
  }
);
