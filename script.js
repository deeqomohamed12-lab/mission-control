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
/* =========================================
   SCRIPT.JS — PART 3
   Timer and Brain Dump
========================================= */

let timerSeconds = 25 * 60;
let timerInterval = null;

function updateTimerDisplay() {
  const display = getElement("timerDisplay");

  if (!display) {
    return;
  }

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  display.textContent =
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;
}

function initializeTimer() {
  const startButton = getElement("startTimerButton");
  const resetButton = getElement("resetTimerButton");

  if (!startButton || !resetButton) {
    return;
  }

  updateTimerDisplay();

  startButton.addEventListener("click", () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      startButton.textContent = "Start";
      return;
    }

    startButton.textContent = "Pause";

    timerInterval = setInterval(() => {
      timerSeconds -= 1;
      updateTimerDisplay();

      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerSeconds = 25 * 60;
        startButton.textContent = "Start";
        updateTimerDisplay();
        showToast("Focus session complete", "⏱️");
      }
    }, 1000);
  });

  resetButton.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timerSeconds = 25 * 60;
    startButton.textContent = "Start";
    updateTimerDisplay();
    showToast("Timer reset", "↺");
  });
}

function initializeBrainDump() {
  const brainDumpInput = getElement("brainDumpInput");
  const saveButton = getElement("saveBrainDumpButton");
  const clearButton = getElement("clearBrainDumpButton");

  if (!brainDumpInput) {
    return;
  }

  brainDumpInput.value = loadData("brainDump", "");

  brainDumpInput.addEventListener("input", () => {
    saveData("brainDump", brainDumpInput.value);
    updateBrainSummary();
  });

  if (saveButton) {
    saveButton.addEventListener("click", () => {
      saveData("brainDump", brainDumpInput.value);
      updateBrainSummary();
      showToast("Brain Dump saved", "🧠");
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      const confirmed = window.confirm(
        "Clear your entire Brain Dump?"
      );

      if (!confirmed) {
        return;
      }

      brainDumpInput.value = "";
      saveData("brainDump", "");
      updateBrainSummary();
      showToast("Brain Dump cleared", "🗑️");
    });
  }

  updateBrainSummary();
}

function updateBrainSummary() {
  const brainDumpInput = getElement("brainDumpInput");
  const summary = getElement("brainDumpSummary");
  const actionList = getElement("brainActionList");

  if (!brainDumpInput || !summary || !actionList) {
    return;
  }

  const text = brainDumpInput.value.trim();

  if (!text) {
    summary.textContent =
      "Your Brain Dump summary will appear here.";

    actionList.innerHTML =
      "<li>No action items yet.</li>";

    return;
  }

  const words = text
    .split(/\s+/)
    .filter(Boolean);

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  summary.textContent =
    `You captured ${words.length} words across ` +
    `${lines.length} thought${lines.length === 1 ? "" : "s"}.`;

  const possibleTasks = lines.filter((line) => {
    const lower = line.toLowerCase();

    return (
      lower.startsWith("call ") ||
      lower.startsWith("email ") ||
      lower.startsWith("send ") ||
      lower.startsWith("finish ") ||
      lower.startsWith("create ") ||
      lower.startsWith("do ") ||
      lower.startsWith("buy ") ||
      lower.startsWith("contact ")
    );
  });

  if (possibleTasks.length === 0) {
    actionList.innerHTML =
      "<li>No obvious action items found yet.</li>";
    return;
  }

  actionList.innerHTML = possibleTasks
    .slice(0, 8)
    .map((task) => `<li>${escapeHtml(task)}</li>`)
    .join("");
}

function initializeQuickBrainSave() {
  const saveButton = getElement("saveQuickBrainButton");
  const quickInput = getElement("quickBrainInput");

  if (!saveButton || !quickInput) {
    return;
  }

  saveButton.addEventListener("click", () => {
    const thought = quickInput.value.trim();

    if (!thought) {
      showToast("Write a thought first", "✍️");
      return;
    }

    const existing = loadData("brainDump", "");
    const divider = existing.trim() ? "\n\n" : "";

    const updated =
      `${existing}${divider}${thought}`;

    saveData("brainDump", updated);

    const fullBrainDump = getElement("brainDumpInput");

    if (fullBrainDump) {
      fullBrainDump.value = updated;
    }

    quickInput.value = "";
    saveData("quickBrainText", "");
    updateBrainSummary();

    showToast("Thought added to Brain Dump", "🧠");
  });
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initializeTimer();
    initializeBrainDump();
    initializeQuickBrainSave();
  }
);
/* =========================================
   SCRIPT.JS — PART 4
   Shadow Operator Creator CRM
========================================= */

function initializeCreatorCRM() {
  const saveButton = getElement("saveCreatorButton");
  const addButton = getElement("addCreatorButton");

  if (saveButton) {
    saveButton.addEventListener("click", saveCreatorFromForm);
  }

  if (addButton) {
    addButton.addEventListener("click", () => {
      openSection("shadow");

      const creatorName = getElement("creatorName");

      if (creatorName) {
        creatorName.focus();
      }
    });
  }

  renderCreators();
}

function saveCreatorFromForm() {
  const nameInput = getElement("creatorName");
  const platformInput = getElement("creatorPlatform");
  const followersInput = getElement("creatorFollowers");

  if (!nameInput || !platformInput || !followersInput) {
    return;
  }

  const name = nameInput.value.trim();
  const platform = platformInput.value.trim();
  const followers = Number(followersInput.value) || 0;

  if (!name) {
    showToast("Add a creator name first", "✍️");
    nameInput.focus();
    return;
  }

  const creators = loadData("creators", []);

  creators.unshift({
    id: Date.now(),
    name,
    platform: platform || "Not added",
    followers,
    status: "researching",
    createdAt: new Date().toISOString()
  });

  saveData("creators", creators);

  nameInput.value = "";
  platformInput.value = "";
  followersInput.value = "";

  renderCreators();
  showToast("Creator saved", "🎯");
}

function renderCreators() {
  const creatorList = getElement("creatorList");
  const creators = loadData("creators", []);

  updateCreatorStats(creators);

  if (!creatorList) {
    return;
  }

  if (creators.length === 0) {
    creatorList.innerHTML = `
      <div class="empty-state compact-empty">
        <span>👥</span>
        <p>No creators added yet.</p>
      </div>
    `;
    return;
  }

  creatorList.innerHTML = creators
    .map((creator) => {
      const followerText = Number(
        creator.followers || 0
      ).toLocaleString("en-US");

      return `
        <div class="opportunity-item">
          <div>
            <h4>${escapeHtml(creator.name)}</h4>
            <p>
              ${escapeHtml(creator.platform)}
              · ${followerText} followers
            </p>
          </div>

          <select
            class="main-select creator-status-select"
            data-creator-status="${creator.id}"
          >
            <option value="researching">
              Researching
            </option>

            <option value="contacted">
              Contacted
            </option>

            <option value="replied">
              Replied
            </option>

            <option value="client">
              Client
            </option>
          </select>

          <button
            class="small-button"
            type="button"
            data-delete-creator="${creator.id}"
          >
            Delete
          </button>
        </div>
      `;
    })
    .join("");

  getAll("[data-creator-status]").forEach(
    (select) => {
      const creatorId = Number(
        select.dataset.creatorStatus
      );

      const creator = creators.find(
        (item) => item.id === creatorId
      );

      if (creator) {
        select.value = creator.status;
      }

      select.addEventListener("change", () => {
        updateCreatorStatus(
          creatorId,
          select.value
        );
      });
    }
  );

  getAll("[data-delete-creator]").forEach(
    (button) => {
      button.addEventListener("click", () => {
        deleteCreator(
          Number(button.dataset.deleteCreator)
        );
      });
    }
  );
}

function updateCreatorStatus(creatorId, status) {
  const creators = loadData("creators", []);

  const creator = creators.find(
    (item) => item.id === creatorId
  );

  if (!creator) {
    return;
  }

  creator.status = status;
  saveData("creators", creators);

  renderCreators();
  showToast("Creator status updated", "✓");
}

function deleteCreator(creatorId) {
  const confirmed = window.confirm(
    "Delete this creator?"
  );

  if (!confirmed) {
    return;
  }

  const creators = loadData("creators", [])
    .filter((creator) => creator.id !== creatorId);

  saveData("creators", creators);

  renderCreators();
  showToast("Creator deleted", "🗑️");
}

function updateCreatorStats(creators) {
  const stats = {
    total: creators.length,
    contacted: creators.filter(
      (creator) => creator.status === "contacted"
    ).length,
    replies: creators.filter(
      (creator) => creator.status === "replied"
    ).length,
    clients: creators.filter(
      (creator) => creator.status === "client"
    ).length
  };

  const bindings = {
    creatorTotal: stats.total,
    creatorContacted: stats.contacted,
    creatorReplies: stats.replies,
    creatorClients: stats.clients,
    homeTotalLeads: stats.total,
    homeContactedLeads: stats.contacted,
    homeReplies: stats.replies,
    homeClients: stats.clients
  };

  Object.entries(bindings).forEach(
    ([elementId, value]) => {
      const element = getElement(elementId);

      if (element) {
        element.textContent = value;
      }
    }
  );
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initializeCreatorCRM();
  }
);
/* =========================================
   CREATOR DISPLAY REPAIR
========================================= */

function renderCreators() {
  const creatorList = getElement("creatorList");
  const creators = loadData("creators", []);

  updateCreatorStats(creators);

  if (!creatorList) {
    return;
  }

  if (!Array.isArray(creators) || creators.length === 0) {
    creatorList.innerHTML = `
      <div class="empty-state compact-empty">
        <span>👥</span>
        <p>No creators added yet.</p>
      </div>
    `;
    return;
  }

  creatorList.innerHTML = "";

  creators.forEach((creator) => {
    const card = document.createElement("div");
    card.className = "opportunity-item";

    const information = document.createElement("div");

    const name = document.createElement("h4");
    name.textContent = creator.name || "Unnamed Creator";

    const details = document.createElement("p");
    const followers = Number(
      creator.followers || 0
    ).toLocaleString("en-US");

    details.textContent =
      `${creator.platform || "Platform not added"} · ` +
      `${followers} followers`;

    information.appendChild(name);
    information.appendChild(details);

    const status = document.createElement("select");
    status.className = "main-select creator-status-select";

    const statuses = [
      ["researching", "Researching"],
      ["contacted", "Contacted"],
      ["replied", "Replied"],
      ["client", "Client"]
    ];

    statuses.forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      status.appendChild(option);
    });

    status.value = creator.status || "researching";

    status.addEventListener("change", () => {
      updateCreatorStatus(
        Number(creator.id),
        status.value
      );
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "small-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      deleteCreator(Number(creator.id));
    });

    card.appendChild(information);
    card.appendChild(status);
    card.appendChild(deleteButton);

    creatorList.appendChild(card);
  });
}
/* =========================================
   SCRIPT.JS — PART 5
   Live CRM Stats and Opportunity Score
========================================= */

function calculateOpportunityScore(creator) {
  const followers = Number(creator.followers || 0);

  let score = 10;

  if (followers >= 10000) {
    score += 20;
  }

  if (followers >= 100000) {
    score += 20;
  }

  if (followers >= 1000000) {
    score += 25;
  }

  if (creator.status === "contacted") {
    score += 5;
  }

  if (creator.status === "replied") {
    score += 15;
  }

  if (creator.status === "client") {
    score = 100;
  }

  return Math.min(score, 100);
}

function updateOpportunityScore() {
  const creators = loadData("creators", []);
  const scoreBox = document.querySelector(
    "#shadow .insight-box"
  );

  if (!scoreBox) {
    return;
  }

  if (!Array.isArray(creators) || creators.length === 0) {
    scoreBox.textContent =
      "Once creator data is added, Mission Control will calculate a score to help prioritize outreach.";
    return;
  }

  const scoredCreators = creators
    .map((creator) => ({
      ...creator,
      score: calculateOpportunityScore(creator)
    }))
    .sort((a, b) => b.score - a.score);

  const bestCreator = scoredCreators[0];

  scoreBox.innerHTML = `
    <strong>${escapeHtml(bestCreator.name)}</strong>
    has the highest opportunity score:
    <strong>${bestCreator.score}/100</strong>.
    <br><br>
    Status: ${escapeHtml(bestCreator.status)}
    <br>
    Followers:
    ${Number(bestCreator.followers || 0).toLocaleString("en-US")}
  `;
}

function renderBestOpportunities() {
  const list = getElement("bestOpportunityList");
  const creators = loadData("creators", []);

  if (!list) {
    return;
  }

  if (!Array.isArray(creators) || creators.length === 0) {
    list.innerHTML = `
      <div class="empty-state compact-empty">
        <span>👥</span>
        <p>Your highest-scoring creator leads will appear here.</p>
      </div>
    `;
    return;
  }

  const bestCreators = creators
    .map((creator) => ({
      ...creator,
      score: calculateOpportunityScore(creator)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  list.innerHTML = "";

  bestCreators.forEach((creator) => {
    const item = document.createElement("div");
    item.className = "opportunity-item";

    const info = document.createElement("div");

    const name = document.createElement("h4");
    name.textContent = creator.name;

    const details = document.createElement("p");
    details.textContent =
      `${creator.platform} · ` +
      `${Number(creator.followers || 0).toLocaleString("en-US")} followers`;

    info.appendChild(name);
    info.appendChild(details);

    const score = document.createElement("span");
    score.className = "number-badge";
    score.textContent = `${creator.score}/100`;

    item.appendChild(info);
    item.appendChild(score);
    list.appendChild(item);
  });
}

function refreshCRMDisplay() {
  const creators = loadData("creators", []);

  updateCreatorStats(creators);
  updateOpportunityScore();
  renderBestOpportunities();
}

const originalUpdateCreatorStatus =
  updateCreatorStatus;

updateCreatorStatus = function (creatorId, status) {
  originalUpdateCreatorStatus(creatorId, status);

  refreshCRMDisplay();
};

const originalSaveCreatorFromForm =
  saveCreatorFromForm;

saveCreatorFromForm = function () {
  originalSaveCreatorFromForm();

  refreshCRMDisplay();
};

const originalDeleteCreator =
  deleteCreator;

deleteCreator = function (creatorId) {
  originalDeleteCreator(creatorId);

  refreshCRMDisplay();
};

document.addEventListener(
  "DOMContentLoaded",
  () => {
    refreshCRMDisplay();
  }
);
/* =========================================
   SCRIPT.JS — PART 6A
   Lead Library
========================================= */

function initializeLeadLibrary() {
  const saveButton = getElement("saveLeadButton");
  const addButton = getElement("addLeadButton");
  const searchInput = getElement("leadSearchInput");
  const statusFilter = getElement("leadStatusFilter");

  if (saveButton) {
    saveButton.addEventListener(
      "click",
      saveLeadFromForm
    );
  }

  if (addButton) {
    addButton.addEventListener("click", () => {
      const nameInput = getElement("leadName");

      if (nameInput) {
        nameInput.focus();
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      renderLeadLibrary
    );
  }

  if (statusFilter) {
    statusFilter.addEventListener(
      "change",
      renderLeadLibrary
    );
  }

  renderLeadLibrary();
}

function saveLeadFromForm() {
  const nameInput = getElement("leadName");
  const handleInput = getElement("leadHandle");
  const nicheInput = getElement("leadNiche");
  const followersInput = getElement("leadFollowers");
  const platformInput = getElement("leadPlatform");

  if (
    !nameInput ||
    !handleInput ||
    !nicheInput ||
    !followersInput ||
    !platformInput
  ) {
    return;
  }

  const name = nameInput.value.trim();
  const handle = handleInput.value.trim();
  const niche = nicheInput.value.trim();
  const followers =
    Number(followersInput.value) || 0;
  const platform = platformInput.value;

  if (!name) {
    showToast("Add the creator name first", "✍️");
    nameInput.focus();
    return;
  }

  const leads = loadData("leads", []);

  leads.unshift({
    id: Date.now(),
    name,
    handle,
    niche,
    followers,
    platform: platform || "Other",
    status: "researching",
    createdAt: new Date().toISOString()
  });

  saveData("leads", leads);

  nameInput.value = "";
  handleInput.value = "";
  nicheInput.value = "";
  followersInput.value = "";
  platformInput.value = "";

  renderLeadLibrary();
  showToast("Lead saved", "📚");
}

function renderLeadLibrary() {
  const wrapper = getElement("leadTableWrapper");
  const searchInput = getElement("leadSearchInput");
  const statusFilter = getElement("leadStatusFilter");

  if (!wrapper) {
    return;
  }

  const leads = loadData("leads", []);

  const searchText = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  const selectedStatus = statusFilter
    ? statusFilter.value
    : "all";

  const visibleLeads = leads.filter((lead) => {
    const searchableText = [
      lead.name,
      lead.handle,
      lead.niche,
      lead.platform
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !searchText ||
      searchableText.includes(searchText);

    const matchesStatus =
      selectedStatus === "all" ||
      lead.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  updateLeadStats(leads, visibleLeads.length);

  if (visibleLeads.length === 0) {
    wrapper.innerHTML = `
      <div class="empty-state">
        <span>📚</span>
        <h4>No matching leads</h4>
        <p>
          Add a new creator lead or change your
          search and filter.
        </p>
      </div>
    `;

    return;
  }

  wrapper.innerHTML = `
    <table class="lead-table">
      <thead>
        <tr>
          <th>Creator</th>
          <th>Platform</th>
          <th>Niche</th>
          <th>Followers</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        ${visibleLeads
          .map((lead) => {
            const followers = Number(
              lead.followers || 0
            ).toLocaleString("en-US");

            return `
              <tr>
                <td>
                  <strong>
                    ${escapeHtml(lead.name)}
                  </strong>

                  <br>

                  <span>
                    ${escapeHtml(
                      lead.handle || "No username"
                    )}
                  </span>
                </td>

                <td>
                  ${escapeHtml(lead.platform)}
                </td>

                <td>
                  ${escapeHtml(
                    lead.niche || "Not added"
                  )}
                </td>

                <td>
                  ${followers}
                </td>

                <td>
                  <select
                    class="main-select"
                    data-lead-status="${lead.id}"
                  >
                    <option value="researching">
                      Researching
                    </option>

                    <option value="ready">
                      Ready to Contact
                    </option>

                    <option value="contacted">
                      Contacted
                    </option>

                    <option value="replied">
                      Replied
                    </option>

                    <option value="client">
                      Client
                    </option>
                  </select>
                </td>

                <td>
                  <button
                    class="small-button"
                    type="button"
                    data-delete-lead="${lead.id}"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;

  connectLeadLibraryButtons(leads);
}

function connectLeadLibraryButtons(leads) {
  getAll("[data-lead-status]").forEach(
    (select) => {
      const leadId = Number(
        select.dataset.leadStatus
      );

      const lead = leads.find(
        (item) => item.id === leadId
      );

      if (lead) {
        select.value = lead.status;
      }

      select.addEventListener("change", () => {
        updateLeadStatus(
          leadId,
          select.value
        );
      });
    }
  );

  getAll("[data-delete-lead]").forEach(
    (button) => {
      button.addEventListener("click", () => {
        deleteLead(
          Number(button.dataset.deleteLead)
        );
      });
    }
  );
}

function updateLeadStatus(leadId, status) {
  const leads = loadData("leads", []);

  const lead = leads.find(
    (item) => item.id === leadId
  );

  if (!lead) {
    return;
  }
lead.status = status;

if (
  status === "contacted" &&
  !lead.firstOutreachAt
) {
  lead.firstOutreachAt =
    new Date().toISOString();

  lead.followUpAt =
    addDaysToDate(
      lead.firstOutreachAt,
      4
    );
}

if (
  status === "replied" ||
  status === "client"
) {
  lead.followUpAt = null;
}

saveData("leads", leads);

renderLeadLibrary();
renderOutreachHub();
updateFollowUpCounter();

showToast("Lead status updated", "✓");
  }

function deleteLead(leadId) {
  const confirmed = window.confirm(
    "Delete this lead?"
  );

  if (!confirmed) {
    return;
  }

  const leads = loadData("leads", [])
    .filter((lead) => lead.id !== leadId);

  saveData("leads", leads);

  renderLeadLibrary();
  renderOutreachHub();
  showToast("Lead deleted", "🗑️");
}

function updateLeadStats(leads, visibleCount) {
  const values = {
    libraryTotalLeads: leads.length,

    libraryReadyLeads: leads.filter(
      (lead) => lead.status === "ready"
    ).length,

    libraryContactedLeads: leads.filter(
      (lead) => lead.status === "contacted"
    ).length,

    libraryClientLeads: leads.filter(
      (lead) => lead.status === "client"
    ).length
  };

  Object.entries(values).forEach(
    ([elementId, value]) => {
      const element = getElement(elementId);

      if (element) {
        element.textContent = value;
      }
    }
  );

  const visibleCounter =
    getElement("visibleLeadCount");

  if (visibleCounter) {
    visibleCounter.textContent =
      `${visibleCount} ` +
      `${visibleCount === 1 ? "lead" : "leads"}`;
  }
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initializeLeadLibrary();
  }
);
/* =========================================
   SCRIPT.JS — PART 6B
   Bulk Creator Import
========================================= */

function cleanCreatorUsername(value) {
  return String(value)
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/[/?#].*$/, "")
    .replace(/^@/, "")
    .trim();
}

function getBulkUsernames() {
  const bulkInput = getElement("bulkLeadInput");

  if (!bulkInput) {
    return [];
  }

  const rawLines = bulkInput.value
    .split(/\n|,/)
    .map(cleanCreatorUsername)
    .filter(Boolean);

  return [...new Set(rawLines)];
}

function updateBulkLeadCount() {
  const counter = getElement("bulkLeadCount");
  const usernames = getBulkUsernames();

  if (!counter) {
    return;
  }

  counter.textContent =
    `${usernames.length} ` +
    `${usernames.length === 1 ? "username" : "usernames"}`;
}

function importBulkLeads() {
  const bulkInput = getElement("bulkLeadInput");

  if (!bulkInput) {
    return;
  }

  const usernames = getBulkUsernames();

  if (usernames.length === 0) {
    showToast("Paste creator usernames first", "✍️");
    return;
  }

  const leads = loadData("leads", []);

  const existingUsernames = new Set(
    leads
      .map((lead) =>
        cleanCreatorUsername(lead.handle || "")
          .toLowerCase()
      )
      .filter(Boolean)
  );

  let importedCount = 0;
  let skippedCount = 0;

  usernames.forEach((username, index) => {
    const normalizedUsername =
      username.toLowerCase();

    if (existingUsernames.has(normalizedUsername)) {
      skippedCount += 1;
      return;
    }

    leads.unshift({
      id: Date.now() + index,
      name: username,
      handle: `@${username}`,
      niche: "",
      followers: 0,
      platform: "Instagram",
      status: "researching",
      createdAt: new Date().toISOString()
    });

    existingUsernames.add(normalizedUsername);
    importedCount += 1;
  });

  saveData("leads", leads);

  bulkInput.value = "";
  updateBulkLeadCount();
  renderLeadLibrary();

  if (importedCount === 0) {
    showToast(
      "All usernames were already imported",
      "✓"
    );
    return;
  }

  const skippedMessage = skippedCount
    ? ` · ${skippedCount} duplicates skipped`
    : "";

  showToast(
    `${importedCount} creators imported${skippedMessage}`,
    "📥"
  );
}

function initializeBulkLeadImport() {
  const bulkInput = getElement("bulkLeadInput");
  const importButton =
    getElement("importBulkLeadButton");
  const clearButton =
    getElement("clearBulkLeadButton");

  if (bulkInput) {
    bulkInput.addEventListener(
      "input",
      updateBulkLeadCount
    );
  }

  if (importButton) {
    importButton.addEventListener(
      "click",
      importBulkLeads
    );
  }

  if (clearButton && bulkInput) {
    clearButton.addEventListener("click", () => {
      bulkInput.value = "";
      updateBulkLeadCount();
      showToast("Import box cleared", "🗑️");
    });
  }

  updateBulkLeadCount();
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initializeBulkLeadImport();
  }
);
/* =========================================
   SCRIPT.JS — PART 7
   Instagram Profile Research
========================================= */

function getInstagramUsername(value) {
  return String(value || "")
    .trim()
    .replace(
      /^https?:\/\/(www\.)?instagram\.com\//i,
      ""
    )
    .replace(/[/?#].*$/, "")
    .replace(/^@/, "")
    .trim();
}

function getInstagramProfileUrl(lead) {
  const username = getInstagramUsername(
    lead.handle || lead.name
  );

  if (!username) {
    return "";
  }

  return `https://www.instagram.com/${encodeURIComponent(
    username
  )}/`;
}

function openInstagramProfile(leadId) {
  const leads = loadData("leads", []);

  const lead = leads.find(
    (item) => Number(item.id) === Number(leadId)
  );

  if (!lead) {
    showToast("Creator could not be found", "⚠️");
    return;
  }

  const profileUrl = getInstagramProfileUrl(lead);

  if (!profileUrl) {
    showToast(
      "Add an Instagram username first",
      "✍️"
    );
    return;
  }

  window.open(
    profileUrl,
    "_blank",
    "noopener,noreferrer"
  );
}

function researchInstagramLead(leadId) {
  const leads = loadData("leads", []);

  const lead = leads.find(
    (item) => Number(item.id) === Number(leadId)
  );

  if (!lead) {
    return;
  }

  const updatedName = window.prompt(
    "Creator’s display name:",
    lead.name || ""
  );

  if (updatedName === null) {
    return;
  }

  const updatedNiche = window.prompt(
    "What is this creator’s niche?",
    lead.niche || ""
  );

  if (updatedNiche === null) {
    return;
  }

  const updatedFollowers = window.prompt(
    "How many followers do they have? Use the full number, such as 4700000.",
    lead.followers || ""
  );

  if (updatedFollowers === null) {
    return;
  }

  const updatedNotes = window.prompt(
    "Add your research notes, product ideas, or audience observations:",
    lead.researchNotes || ""
  );

  if (updatedNotes === null) {
    return;
  }

  lead.name =
    updatedName.trim() ||
    lead.name ||
    getInstagramUsername(lead.handle);

  lead.niche = updatedNiche.trim();

  lead.followers =
    Number(
      String(updatedFollowers).replaceAll(",", "")
    ) || 0;

  lead.researchNotes = updatedNotes.trim();
  lead.lastResearchedAt = new Date().toISOString();

  saveData("leads", leads);
  renderLeadLibrary();

  showToast("Research saved", "🔎");
}

function addInstagramResearchButtons() {
  const leads = loadData("leads", []);

  getAll("[data-delete-lead]").forEach(
    (deleteButton) => {
      const leadId = Number(
        deleteButton.dataset.deleteLead
      );

      const lead = leads.find(
        (item) => Number(item.id) === leadId
      );

      if (!lead) {
        return;
      }

      const actionCell =
        deleteButton.closest("td");

      if (
        !actionCell ||
        actionCell.querySelector(
          `[data-open-instagram="${leadId}"]`
        )
      ) {
        return;
      }

      const openButton =
        document.createElement("button");

      openButton.type = "button";
      openButton.className = "small-button";
      openButton.textContent = "Instagram";
      openButton.dataset.openInstagram = leadId;

      openButton.addEventListener("click", () => {
        openInstagramProfile(leadId);
      });

      const researchButton =
        document.createElement("button");

      researchButton.type = "button";
      researchButton.className = "small-button";
      researchButton.textContent = "Research";
      researchButton.dataset.researchLead = leadId;

      researchButton.addEventListener(
        "click",
        () => {
          researchInstagramLead(leadId);
        }
      );

      actionCell.insertBefore(
        openButton,
        deleteButton
      );

      actionCell.insertBefore(
        researchButton,
        deleteButton
      );

      if (lead.researchNotes) {
        const creatorCell =
          actionCell.parentElement?.querySelector(
            "td:first-child"
          );

        if (creatorCell) {
          const note = document.createElement("small");

          note.style.display = "block";
          note.style.marginTop = "6px";
          note.style.color = "var(--text-muted)";
          note.textContent =
            `Notes: ${lead.researchNotes}`;

          creatorCell.appendChild(note);
        }
      }
    }
  );
}

/* Accept links in the single-lead form too. */

const originalSaveLeadWithInstagram =
  saveLeadFromForm;

saveLeadFromForm = function () {
  const handleInput = getElement("leadHandle");

  if (handleInput && handleInput.value.trim()) {
    const username = getInstagramUsername(
      handleInput.value
    );

    handleInput.value = username
      ? `@${username}`
      : handleInput.value;
  }

  originalSaveLeadWithInstagram();
};

/* Add the new buttons whenever the table renders. */

const originalInstagramLeadRender =
  renderLeadLibrary;

renderLeadLibrary = function () {
  originalInstagramLeadRender();
  addInstagramResearchButtons();
};

document.addEventListener(
  "DOMContentLoaded",
  () => {
    renderLeadLibrary();
  }
);
/* =========================================
   SCRIPT.JS — FINAL PART 8
   Founder Journal and Faith
========================================= */

function initializeFounderJournal() {
  const fields = [
    ["journalWin", "journalWinDraft"],
    ["journalLesson", "journalLessonDraft"],
    ["journalChallenge", "journalChallengeDraft"],
    ["journalTomorrow", "journalTomorrowDraft"],
    ["journalMood", "journalMoodDraft"]
  ];

  fields.forEach(([elementId, storageKey]) => {
    const element = getElement(elementId);

    if (!element) {
      return;
    }

    element.value = loadData(storageKey, "");

    element.addEventListener("input", () => {
      saveData(storageKey, element.value);
    });

    element.addEventListener("change", () => {
      saveData(storageKey, element.value);
    });
  });

  const energy = getElement("journalEnergy");
  const energyValue = getElement("journalEnergyValue");

  if (energy && energyValue) {
    energy.value = loadData("journalEnergyDraft", 50);

    const updateJournalEnergy = () => {
      energyValue.textContent = `${energy.value}%`;
      saveData(
        "journalEnergyDraft",
        Number(energy.value)
      );
    };

    energy.addEventListener(
      "input",
      updateJournalEnergy
    );

    updateJournalEnergy();
  }

  const saveButton = getElement("saveJournalButton");

  if (saveButton) {
    saveButton.addEventListener(
      "click",
      saveJournalEntry
    );
  }

  renderJournalHistory();
}

function saveJournalEntry() {
  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    win: getElement("journalWin")?.value.trim() || "",
    lesson:
      getElement("journalLesson")?.value.trim() || "",
    challenge:
      getElement("journalChallenge")?.value.trim() || "",
    tomorrow:
      getElement("journalTomorrow")?.value.trim() || "",
    mood:
      getElement("journalMood")?.value || "",
    energy:
      Number(getElement("journalEnergy")?.value) || 50
  };

  const hasContent =
    entry.win ||
    entry.lesson ||
    entry.challenge ||
    entry.tomorrow;

  if (!hasContent) {
    showToast("Write something before saving", "✍️");
    return;
  }

  const entries = loadData("journalEntries", []);
  entries.unshift(entry);

  saveData("journalEntries", entries);

  [
    "journalWin",
    "journalLesson",
    "journalChallenge",
    "journalTomorrow"
  ].forEach((elementId) => {
    const element = getElement(elementId);

    if (element) {
      element.value = "";
    }
  });

  saveData("journalWinDraft", "");
  saveData("journalLessonDraft", "");
  saveData("journalChallengeDraft", "");
  saveData("journalTomorrowDraft", "");

  renderJournalHistory();
  showToast("Journal entry saved", "📖");
}

function renderJournalHistory() {
  const history = getElement("journalHistory");
  const counter = getElement("journalEntryCount");

  if (!history) {
    return;
  }

  const entries = loadData("journalEntries", []);

  if (counter) {
    counter.textContent =
      `${entries.length} ` +
      `${entries.length === 1 ? "entry" : "entries"}`;
  }

  if (entries.length === 0) {
    history.innerHTML = `
      <div class="empty-state compact-empty">
        <span>📖</span>
        <p>Your saved journal entries will appear here.</p>
      </div>
    `;
    return;
  }

  history.innerHTML = entries
    .slice(0, 20)
    .map((entry) => {
      const date = new Date(
        entry.date
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });

      return `
        <div class="opportunity-item">
          <div>
            <h4>${escapeHtml(date)}</h4>
            <p>
              ${escapeHtml(
                entry.win ||
                entry.lesson ||
                entry.tomorrow ||
                "Journal entry"
              )}
            </p>
            <p>
              Mood: ${escapeHtml(entry.mood || "Not added")}
              · Energy: ${entry.energy}%
            </p>
          </div>

          <button
            class="small-button"
            type="button"
            data-delete-journal="${entry.id}"
          >
            Delete
          </button>
        </div>
      `;
    })
    .join("");

  getAll("[data-delete-journal]").forEach(
    (button) => {
      button.addEventListener("click", () => {
        const entryId = Number(
          button.dataset.deleteJournal
        );

        const updatedEntries = loadData(
          "journalEntries",
          []
        ).filter(
          (entry) => Number(entry.id) !== entryId
        );

        saveData("journalEntries", updatedEntries);
        renderJournalHistory();
        showToast("Journal entry deleted", "🗑️");
      });
    }
  );
}

function initializeFaithTracker() {
  const savedPrayers = loadData(
    "faithPrayers",
    {}
  );

  getAll("[data-faith-check]").forEach(
    (checkbox) => {
      const prayerName =
        checkbox.dataset.faithCheck;

      checkbox.checked =
        Boolean(savedPrayers[prayerName]);

      checkbox.addEventListener(
        "change",
        () => {
          savedPrayers[prayerName] =
            checkbox.checked;

          saveData(
            "faithPrayers",
            savedPrayers
          );

          updateFaithPrayerCount();
        }
      );
    }
  );

  [
    ["quranReadingInput", "quranReading"],
    ["quranReflectionInput", "quranReflection"],
    ["duaInput", "dua"],
    ["faithGratitudeInput", "faithGratitude"]
  ].forEach(([elementId, storageKey]) => {
    bindSavedInput(elementId, storageKey);
  });

  const increaseButton =
    getElement("increaseDhikrButton");
  const resetButton =
    getElement("resetDhikrButton");

  if (increaseButton) {
    increaseButton.addEventListener(
      "click",
      () => {
        const nextCount =
          loadData("dhikrCount", 0) + 1;

        saveData("dhikrCount", nextCount);
        updateDhikrDisplay();
      }
    );
  }

  if (resetButton) {
    resetButton.addEventListener(
      "click",
      () => {
        saveData("dhikrCount", 0);
        updateDhikrDisplay();
        showToast("Dhikr counter reset", "↺");
      }
    );
  }

  updateFaithPrayerCount();
  updateDhikrDisplay();
}

function updateFaithPrayerCount() {
  const counter = getElement("faithPrayerCount");

  if (!counter) {
    return;
  }

  const completed = Array.from(
    getAll("[data-faith-check]")
  ).filter(
    (checkbox) => checkbox.checked
  ).length;

  counter.textContent = `${completed} / 5`;
}

function updateDhikrDisplay() {
  const display = getElement("dhikrCount");

  if (display) {
    display.textContent =
      loadData("dhikrCount", 0);
  }
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initializeFounderJournal();
    initializeFaithTracker();
  }
);
/* =========================================
   MISSION CONTROL V1.0
   FINAL CLEANUP
========================================= */

function finalizeMissionControlV1() {
  const unfinishedSections = [
    "voice-command",
    "deenas",
    "idea-vote",
    "gym",
    "drama-center",
    "connected-brain",
    "mission-replay",
    "settings"
  ];

  unfinishedSections.forEach((sectionId) => {
    const navButton = document.querySelector(
      `.nav-item[data-section="${sectionId}"]`
    );

    if (navButton) {
      navButton.style.display = "none";
    }
  });

  const connectedBrainButtons = getAll(
    '[data-jump="connected-brain"]'
  );

  connectedBrainButtons.forEach((button) => {
    button.style.display = "none";
  });

  const voiceButton = getElement("voiceQuickButton");

  if (voiceButton) {
    voiceButton.style.display = "none";
  }

  const savedSection = loadData(
    "activeSection",
    "home"
  );

  if (unfinishedSections.includes(savedSection)) {
    openSection("home");
  }
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    finalizeMissionControlV1();
  }
);

/* =========================================
   MISSION CONTROL V1.0
   FINAL PART 9
   Connected Brain and Winning List
========================================= */

function updateConnectedBrainInsight() {
  const homeInsight = getElement(
    "homeConnectedInsight"
  );

  if (!homeInsight) {
    return;
  }

  const mission = loadData(
    "missionText",
    ""
  ).trim();

  const missionComplete = loadData(
    "missionComplete",
    false
  );

  const creators = loadData(
    "creators",
    []
  );

  const leads = loadData(
    "leads",
    []
  );

  const journalEntries = loadData(
    "journalEntries",
    []
  );

  const energy = Number(
    loadData("homeEnergy", 50)
  );

  const readyLeads = leads.filter(
    (lead) => lead.status === "ready"
  ).length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "contacted"
  ).length;

  const repliedLeads = leads.filter(
    (lead) => lead.status === "replied"
  ).length;

  let insight = "";

  if (!mission) {
    insight =
      "Start by writing today’s mission. Mission Control will use it to guide your next action.";
  } else if (!missionComplete) {
    insight =
      `Your main focus is: “${mission}” ` +
      `You currently have ${leads.length} leads, ` +
      `${readyLeads} ready to contact, and ` +
      `${contactedLeads} contacted.`;
  } else {
    insight =
      "Your main mission is complete. Record the win and choose the next most important move.";
  }

  if (energy <= 30) {
    insight +=
      " Your energy is low, so choose one small task and avoid starting several things.";
  } else if (energy >= 75) {
    insight +=
      " Your energy is high, making this a good time for outreach or focused research.";
  }

  if (repliedLeads > 0) {
    insight +=
      ` You have ${repliedLeads} creator ` +
      `${repliedLeads === 1 ? "reply" : "replies"} waiting for attention.`;
  }

  if (journalEntries.length > 0) {
    insight +=
      " Your Founder Journal is active, so remember to review today’s lesson before ending the day.";
  }

  if (creators.length > 0) {
    const highestCreator = creators
      .map((creator) => ({
        ...creator,
        score: typeof calculateOpportunityScore ===
          "function"
          ? calculateOpportunityScore(creator)
          : 0
      }))
      .sort((a, b) => b.score - a.score)[0];

    if (highestCreator) {
      insight +=
        ` Your strongest current opportunity is ${highestCreator.name}.`;
    }
  }

  homeInsight.textContent = insight;
}

function automaticallyRecordMissionWin() {
  const missionComplete = loadData(
    "missionComplete",
    false
  );

  const mission = loadData(
    "missionText",
    ""
  ).trim();

  if (!missionComplete || !mission) {
    return;
  }

  const wins = loadData("wins", []);

  const alreadySaved = wins.some(
    (win) =>
      typeof win === "string" &&
      win.toLowerCase() ===
        mission.toLowerCase()
  );

  if (!alreadySaved) {
    wins.unshift(mission);
    saveData("wins", wins);
    renderWinningList();
  }
}

function enhanceWinningList() {
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

  list.innerHTML = "";

  wins.slice(0, 10).forEach((win, index) => {
    const item = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = win;

    const removeButton =
      document.createElement("button");

    removeButton.type = "button";
    removeButton.className = "small-button";
    removeButton.textContent = "Remove";
    removeButton.style.marginLeft = "12px";

    removeButton.addEventListener(
      "click",
      () => {
        const updatedWins = loadData(
          "wins",
          []
        );

        updatedWins.splice(index, 1);

        saveData("wins", updatedWins);
        enhanceWinningList();

        showToast("Win removed", "🗑️");
      }
    );

    item.appendChild(text);
    item.appendChild(removeButton);
    list.appendChild(item);
  });
}

function finalizeConnectedBrainAndWins() {
  automaticallyRecordMissionWin();
  enhanceWinningList();
  updateConnectedBrainInsight();
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    finalizeConnectedBrainAndWins();
  }
);

document.addEventListener(
  "input",
  () => {
    updateConnectedBrainInsight();
  }
);

document.addEventListener(
  "change",
  () => {
    updateConnectedBrainInsight();
  }
);
/* =========================================
   OUTREACH HUB — PART 2
   Connect Lead Library to Outreach Hub
========================================= */

function renderOutreachHub() {
  const leads = loadData("leads", []);

  const sentStatuses = [
    "contacted",
    "replied",
    "follow-up",
    "call-scheduled",
    "client"
  ];

  const outreachSent = leads.filter((lead) =>
    sentStatuses.includes(
      String(lead.status || "").toLowerCase()
    )
  );

  const waitingForReply = leads.filter(
    (lead) =>
      String(lead.status || "").toLowerCase() ===
      "contacted"
  );

  const replies = leads.filter(
    (lead) =>
      String(lead.status || "").toLowerCase() ===
      "replied"
  );

  const calls = leads.filter(
    (lead) =>
      String(lead.status || "").toLowerCase() ===
      "call-scheduled"
  );

  const clients = leads.filter(
    (lead) =>
      String(lead.status || "").toLowerCase() ===
      "client"
  );

  const setCount = (id, value) => {
    const element = getElement(id);

    if (element) {
      element.textContent = value;
    }
  };

  setCount(
    "outreachSentCount",
    outreachSent.length
  );

  setCount(
    "waitingReplyCount",
    waitingForReply.length
  );

  setCount(
    "newReplyCount",
    replies.length
  );

  setCount(
    "callScheduledCount",
    calls.length
  );

  setCount(
    "outreachClientCount",
    clients.length
  );

  renderReplyInbox(replies);
  renderOutreachQueue(getFollowUpLeads());
}

function renderReplyInbox(replies) {
  const inbox = getElement("replyInbox");

  if (!inbox) {
    return;
  }

  if (replies.length === 0) {
    inbox.innerHTML = `
      <div class="empty-state compact-empty">
        <span>💬</span>
        <p>New replies will appear here.</p>
      </div>
    `;

    return;
  }

  inbox.innerHTML = replies
    .map((lead) => {
      return `
        <div class="opportunity-item">
          <div>
            <strong>
              ${escapeHtml(
                lead.name ||
                lead.handle ||
                "Creator"
              )}
            </strong>

            <p>
              ${escapeHtml(
                lead.handle || ""
              )}
            </p>
          </div>

          <span class="number-badge">
            Replied
          </span>
        </div>
      `;
    })
    .join("");
}

function renderOutreachQueue(waitingLeads) {
  const queue = getElement("outreachQueue");
  const counter = getElement(
    "outreachQueueCount"
  );

  if (counter) {
    counter.textContent =
      `${waitingLeads.length} ` +
      `${waitingLeads.length === 1
        ? "person"
        : "people"}`;
  }

  if (!queue) {
    return;
  }

  if (waitingLeads.length === 0) {
    queue.innerHTML = `
      <div class="empty-state compact-empty">
        <span>📭</span>
        <p>No outreach actions are due yet.</p>
      </div>
    `;

    return;
  }

  queue.innerHTML = waitingLeads
    .map((lead) => {
      return `
        <div class="opportunity-item">
          <div>
            <strong>
              ${escapeHtml(
                lead.name ||
                lead.handle ||
                "Creator"
              )}
            </strong>

            <p>
              Waiting for reply
            </p>
          </div>

          <button
  class="small-button"
  type="button"
  data-follow-up-complete="${lead.id}"
>
  ✓ Followed Up
</button>
            
          
        </div>
      `;
    })
    .join("");

getAll("[data-follow-up-complete]").forEach(
  (button) => {
    button.addEventListener("click", () => {
      markFollowUpComplete(
        Number(button.dataset.followUpComplete)
      );
    });
  }
);
}
document.addEventListener(
  "DOMContentLoaded",
  () => {
    renderOutreachHub();
  }
);
/* =========================================
   OUTREACH HUB — PART 3
   Outreach Dates and Follow-Ups
========================================= */

function addDaysToDate(dateValue, numberOfDays) {
  const date = new Date(dateValue);

  date.setDate(date.getDate() + numberOfDays);

  return date.toISOString();
}

function getTodayDateOnly() {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
}

function getFollowUpLeads() {
  const leads = loadData("leads", []);
  const today = getTodayDateOnly();

  return leads.filter((lead) => {
    if (!lead.followUpAt) {
      return false;
    }

    if (
      lead.status === "replied" ||
      lead.status === "client"
    ) {
      return false;
    }

    const followUpDate = new Date(
      lead.followUpAt
    );

    const followUpDay = new Date(
      followUpDate.getFullYear(),
      followUpDate.getMonth(),
      followUpDate.getDate()
    );

    return followUpDay <= today;
  });
}

function updateFollowUpCounter() {
  const followUpLeads = getFollowUpLeads();

  const counter = getElement(
    "followUpTodayCount"
  );

  if (counter) {
    counter.textContent =
      followUpLeads.length;
  }
}

/* =========================================
   OUTREACH HUB — PART 3B
   Fix Existing Contacted Leads
========================================= */

function migrateExistingContactedLeads() {
  const leads = loadData("leads", []);
  let changed = false;

  leads.forEach((lead) => {
    if (lead.status === "contacted" && !lead.followUpAt) {
      const outreachDate =
        lead.firstOutreachAt ||
        lead.contactedAt ||
        lead.createdAt ||
        new Date().toISOString();

      lead.firstOutreachAt = outreachDate;
      lead.followUpAt = addDaysToDate(outreachDate, 4);

      changed = true;
    }
  });

  if (changed) {
    saveData("leads", leads);
  }

  updateFollowUpCounter();
}

document.addEventListener("DOMContentLoaded", () => {
  migrateExistingContactedLeads();
});

/* ==========================================
   OUTREACH HUB — PART 4
   Mark Follow-Up Complete
========================================== */

function markFollowUpComplete(leadId) {
  const leads = loadData("leads", []);

  const lead = leads.find(
    (item) => item.id === leadId
  );

  if (!lead) {
    return;
  }

  lead.lastFollowUpAt = new Date().toISOString();

  lead.followUpAt = addDaysToDate(
    lead.lastFollowUpAt,
    4
  );

  saveData("leads", leads);

  renderLeadLibrary();
  renderOutreachHub();
  updateFollowUpCounter();

  showToast("Follow-up completed", "✓");
}
/* =========================================
   OUTREACH HUB — PART 5
   Mark Creator As Replied
========================================= */

function markLeadReplied(leadId) {
  const leads = loadData("leads", []);

  const lead = leads.find(
    (item) => item.id === leadId
  );

  if (!lead) {
    return;
  }

  lead.status = "replied";
  lead.repliedAt = new Date().toISOString();

  saveData("leads", leads);

  renderLeadLibrary();
  renderOutreachHub();
  updateFollowUpCounter();

  showToast("Reply recorded! 🎉");
}
