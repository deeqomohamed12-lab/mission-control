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
/* =========================================
   SCRIPT.JS — PART 2
   Home Dashboard and Progress
========================================= */

function bindSavedInput(elementId, storageKey) {
  const element = getElement(elementId);

  if (!element) {
    return;
  }

  element.value = loadData(storageKey, "");

  element.addEventListener("input", () => {
    saveData(storageKey, element.value);
  });
}

function initializeMission() {
  const missionInput = getElement("missionInput");
  const completeButton =
    getElement("completeMissionButton");

  if (!missionInput || !completeButton) {
    return;
  }

  missionInput.value = loadData("missionText", "");

  const isComplete = loadData(
    "missionComplete",
    false
  );

  completeButton.textContent = isComplete
    ? "Completed ✓"
    : "Mark Complete";

  missionInput.addEventListener("input", () => {
    saveData("missionText", missionInput.value);
  });

  completeButton.addEventListener("click", () => {
    const nextState = !loadData(
      "missionComplete",
      false
    );

    saveData("missionComplete", nextState);

    completeButton.textContent = nextState
      ? "Completed ✓"
      : "Mark Complete";

    showToast(
      nextState
        ? "Mission completed"
        : "Mission reopened",
      nextState ? "🏆" : "↩"
    );

    updateHomeProgress();
  });
}

function initializeTopThree() {
  const savedTasks = loadData("topThreeTasks", [
    "",
    "",
    ""
  ]);

  const savedChecks = loadData(
    "topThreeChecks",
    [false, false, false]
  );

  getAll("[data-priority-input]").forEach(
    (input) => {
      const index = Number(
        input.dataset.priorityInput
      );

      input.value = savedTasks[index] || "";

      input.addEventListener("input", () => {
        savedTasks[index] = input.value;
        saveData("topThreeTasks", savedTasks);
      });
    }
  );

  getAll("[data-priority-check]").forEach(
    (checkbox) => {
      const index = Number(
        checkbox.dataset.priorityCheck
      );

      checkbox.checked =
        Boolean(savedChecks[index]);

      checkbox.addEventListener("change", () => {
        savedChecks[index] = checkbox.checked;
        saveData("topThreeChecks", savedChecks);

        updateTopThreeCounter();
        updateHomeProgress();
      });
    }
  );

  updateTopThreeCounter();
}

function updateTopThreeCounter() {
  const counter = getElement("topThreeCounter");

  if (!counter) {
    return;
  }

  const completed = Array.from(
    getAll("[data-priority-check]")
  ).filter((checkbox) => checkbox.checked).length;

  counter.textContent = `${completed} / 3`;
}

function initializeEnergy() {
  const slider = getElement("homeEnergySlider");
  const value = getElement("homeEnergyValue");
  const message = getElement("homeEnergyMessage");

  if (!slider || !value || !message) {
    return;
  }

  slider.value = loadData("homeEnergy", 50);

  function updateEnergyDisplay() {
    const energy = Number(slider.value);

    value.textContent = `${energy}%`;

    if (energy <= 20) {
      message.textContent = "Very low energy";
    } else if (energy <= 40) {
      message.textContent = "Take it gently";
    } else if (energy <= 70) {
      message.textContent = "Steady energy";
    } else {
      message.textContent = "High energy";
    }

    saveData("homeEnergy", energy);
  }

  slider.addEventListener(
    "input",
    updateEnergyDisplay
  );

  updateEnergyDisplay();
}

function initializeWinningList() {
  const addButton = getElement("addWinButton");

  if (!addButton) {
    return;
  }

  addButton.addEventListener("click", () => {
    const win = window.prompt(
      "What win do you want to record?"
    );

    if (!win || !win.trim()) {
      return;
    }

    const wins = loadData("wins", []);
    wins.unshift(win.trim());
    saveData("wins", wins);

    renderWinningList();
    showToast("Win added", "🏆");
  });

  renderWinningList();
}

function renderWinningList() {
  const list = getElement("winningList");

  if (!list) {
    return;
  }

  const wins = loadData("wins", []);

  if (wins.length === 0) {
    list.innerHTML =
      "<li>Your completed wins will appear here.</li>";
    return;
  }

  list.innerHTML = wins
    .slice(0, 8)
    .map((win) => `<li>${escapeHtml(win)}</li>`)
    .join("");
}

function initializeSchedule() {
  const schedule = loadData("schedule", [
    { time: "", task: "" },
    { time: "", task: "" },
    { time: "", task: "" }
  ]);

  getAll("[data-schedule-time]").forEach(
    (input) => {
      const index = Number(
        input.dataset.scheduleTime
      );

      input.value = schedule[index]?.time || "";

      input.addEventListener("input", () => {
        schedule[index].time = input.value;
        saveData("schedule", schedule);
      });
    }
  );

  getAll("[data-schedule-task]").forEach(
    (input) => {
      const index = Number(
        input.dataset.scheduleTask
      );

      input.value = schedule[index]?.task || "";

      input.addEventListener("input", () => {
        schedule[index].task = input.value;
        saveData("schedule", schedule);
      });
    }
  );
}

function updateHomeProgress() {
  const missionComplete = loadData(
    "missionComplete",
    false
  );

  const completedPriorities = Array.from(
    getAll("[data-priority-check]")
  ).filter((checkbox) => checkbox.checked).length;

  const completedItems =
    (missionComplete ? 1 : 0) +
    completedPriorities;

  const totalItems = 4;

  const percentage = Math.round(
    (completedItems / totalItems) * 100
  );

  const sidebarText =
    getElement("sidebarProgressText");
  const sidebarFill =
    getElement("sidebarProgressFill");
  const homeText =
    getElement("homeProgressText");
  const ring = getElement("progressRing");

  if (sidebarText) {
    sidebarText.textContent = `${percentage}%`;
  }

  if (sidebarFill) {
    sidebarFill.style.width = `${percentage}%`;
  }

  if (homeText) {
    homeText.textContent = `${percentage}%`;
  }

  if (ring) {
    ring.style.background =
      `conic-gradient(
        var(--primary) ${percentage * 3.6}deg,
        var(--card-soft) 0deg
      )`;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initializeMission();
    initializeTopThree();
    initializeEnergy();
    initializeWinningList();
    initializeSchedule();

    bindSavedInput(
      "rightNowInput",
      "rightNowText"
    );

    bindSavedInput(
      "quickBrainInput",
      "quickBrainText"
    );

    updateHomeProgress();
  }
);
