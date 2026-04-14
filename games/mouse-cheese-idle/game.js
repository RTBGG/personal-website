const SAVE_KEY = "mouseCheeseIdleSave_v1";
const LOCALE_KEY = "mouseCheeseLocale_v1";
const TICK_MS = 200;
const PURCHASE_EPSILON = 1e-6;
const browserLocale =
  navigator.language && navigator.language.toLowerCase().startsWith("de") ? "de" : "en";
let currentLocale = localStorage.getItem(LOCALE_KEY) || browserLocale;
if (!["de", "en"].includes(currentLocale)) {
  currentLocale = "en";
}

const I18N = {
  de: {
    title: "Mouse Cheese Idle",
    subtitle: "ASCII Idle im Stil von Paperclips",
    clickBtn: "Nagen (+Kaese)",
    saveBtn: "Speichern",
    resetBtn: "Reset",
    prestigeBtn: "Prestige: Instinkt",
    shopTitle: "Shop",
    logTitle: "Ereignisprotokoll",
    initialLog: "Das Rudel erwacht. Eine Maus riecht Kaese.",
    statsLifetime: "Lebenszeit-Kaese: {value}",
    statsIdeasUnlock: "Bis Ideen-Freischaltung: {value}",
    statsEventsUnlock: "Bis Event-Freischaltung: {value}",
    statsPrestigeNeed: "Bis Prestige (Instinkt): {value}",
    noUpgrades: "Noch keine Upgrades freigeschaltet.",
    owned: "Besitz: {value}",
    cost: "Kosten: {value} Kaese",
    costIdeas: "Kosten: {value} Ideen",
    buy: "Kaufen",
    saveLog: "Spielstand gespeichert.",
    buyLog: "{name} ausgebaut ({level}).",
    prestigeNotReady: "Instinkt ist noch nicht bereit. Mehr Kaese ansammeln.",
    prestigeLog: "Prestige! Instinkt +{value}. Neustart mit staerkerem Rudel.",
    resetLog: "Manueller Reset ausgefuehrt.",
    eventGood: "Event: Kaeseregen! Produktion fuer 18s erhoeht.",
    eventBad: "Event: Katze in der Naehe! Produktion fuer 18s reduziert.",
    eventEnd: "Event abgeklungen. Das Rudel sammelt sich neu.",
    asciiProtocol: "MOUSE PROTOCOL",
    asciiCheese: "Kaese",
    asciiIdeas: "Ideen",
    asciiInstinct: "Instinkt",
    asciiClickPower: "Klickkraft",
    asciiAutoNibblers: "Auto-Nager/s",
    asciiIdeasRate: "Ideen/s",
    asciiEvent: "Event",
    moodBoost: "HUNGRIG+",
    moodDebuff: "VORSICHT",
    moodNormal: "NORMAL",
    up_autoNibbler_name: "Auto-Nager",
    up_autoNibbler_desc: "Automatisches Knabbern pro Sekunde.",
    up_betterTeeth_name: "Schaerfere Zaehne",
    up_betterTeeth_desc: "Mehr Kaese pro Klick.",
    up_thinkTank_name: "Kaese-Labor",
    up_thinkTank_desc: "Generiert Ideen aus Ueberschuss.",
    up_caveRoutes_name: "Hoehlenrouten",
    up_caveRoutes_desc: "Auto-Nager arbeiten effizienter.",
    up_hiveMind_name: "Schwarmdenken",
    up_hiveMind_desc: "Erhoeht Ideenproduktion deutlich.",
    up_inspiredChewers_name: "Inspirierte Nager",
    up_inspiredChewers_desc: "Ideen steigern die Kaeseproduktion.",
  },
  en: {
    title: "Mouse Cheese Idle",
    subtitle: "ASCII idle in the style of Paperclips",
    clickBtn: "Nibble (+Cheese)",
    saveBtn: "Save",
    resetBtn: "Reset",
    prestigeBtn: "Prestige: Instinct",
    shopTitle: "Shop",
    logTitle: "Event Log",
    initialLog: "The pack awakens. A mouse smells cheese.",
    statsLifetime: "Lifetime cheese: {value}",
    statsIdeasUnlock: "Until ideas unlock: {value}",
    statsEventsUnlock: "Until events unlock: {value}",
    statsPrestigeNeed: "Until prestige (instinct): {value}",
    noUpgrades: "No upgrades unlocked yet.",
    owned: "Owned: {value}",
    cost: "Cost: {value} cheese",
    costIdeas: "Cost: {value} ideas",
    buy: "Buy",
    saveLog: "Game saved.",
    buyLog: "{name} upgraded ({level}).",
    prestigeNotReady: "Instinct is not ready yet. Collect more cheese.",
    prestigeLog: "Prestige! Instinct +{value}. Restart with a stronger pack.",
    resetLog: "Manual reset completed.",
    eventGood: "Event: Cheese rain! Production increased for 18s.",
    eventBad: "Event: Cat nearby! Production reduced for 18s.",
    eventEnd: "Event ended. The pack regroups.",
    asciiProtocol: "MOUSE PROTOCOL",
    asciiCheese: "Cheese",
    asciiIdeas: "Ideas",
    asciiInstinct: "Instinct",
    asciiClickPower: "Click power",
    asciiAutoNibblers: "Auto nibblers/s",
    asciiIdeasRate: "Ideas/s",
    asciiEvent: "Event",
    moodBoost: "HUNGRY+",
    moodDebuff: "CAUTION",
    moodNormal: "NORMAL",
    up_autoNibbler_name: "Auto Nibbler",
    up_autoNibbler_desc: "Automatic nibbling per second.",
    up_betterTeeth_name: "Sharper Teeth",
    up_betterTeeth_desc: "More cheese per click.",
    up_thinkTank_name: "Cheese Lab",
    up_thinkTank_desc: "Generates ideas from surplus.",
    up_caveRoutes_name: "Cave Routes",
    up_caveRoutes_desc: "Auto nibblers work more efficiently.",
    up_hiveMind_name: "Hive Mind",
    up_hiveMind_desc: "Strongly increases idea generation.",
    up_inspiredChewers_name: "Inspired Chewers",
    up_inspiredChewers_desc: "Ideas improve cheese production.",
  },
};

function t(key, vars = {}) {
  const table = I18N[currentLocale] || I18N.en;
  let text = table[key] || I18N.en[key] || key;
  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}

const defaultState = () => ({
  version: 1,
  resources: { cheese: 0, ideas: 0, instinct: 0 },
  rates: { clickPower: 1, autoNibblers: 0, ideaRate: 0 },
  progression: { unlockIdeasAt: 250, unlockEventsAt: 400, totalCheeseLifetime: 0 },
  boosts: { eventMultiplier: 1, eventEndsAt: 0 },
  lastTick: Date.now(),
  lastSave: Date.now(),
  upgrades: {
    autoNibbler: 0,
    betterTeeth: 0,
    thinkTank: 0,
    caveRoutes: 0,
    hiveMind: 0,
    inspiredChewers: 0,
  },
  log: [t("initialLog")],
});

let gameState = loadGame() || defaultState();
let lastShopRenderAt = 0;
let shopRefreshTimer = null;

const asciiEl = document.getElementById("ascii-art");
const statsEl = document.getElementById("stats-panel");
const shopEl = document.getElementById("shop-list");
const logEl = document.getElementById("log-feed");

const clickBtn = document.getElementById("click-btn");
const saveBtn = document.getElementById("save-btn");
const resetBtn = document.getElementById("reset-btn");
const prestigeBtn = document.getElementById("prestige-btn");
const titleEl = document.getElementById("game-title");
const subtitleEl = document.getElementById("game-subtitle");
const shopTitleEl = document.getElementById("shop-title");
const logTitleEl = document.getElementById("log-title");
const langDeBtn = document.getElementById("lang-de-btn");
const langEnBtn = document.getElementById("lang-en-btn");

function applyStaticTexts() {
  document.documentElement.lang = currentLocale;
  document.title = t("title");
  titleEl.textContent = t("title");
  subtitleEl.textContent = t("subtitle");
  clickBtn.textContent = t("clickBtn");
  saveBtn.textContent = t("saveBtn");
  resetBtn.textContent = t("resetBtn");
  prestigeBtn.textContent = t("prestigeBtn");
  shopTitleEl.textContent = t("shopTitle");
  logTitleEl.textContent = t("logTitle");
  langDeBtn.classList.toggle("active", currentLocale === "de");
  langEnBtn.classList.toggle("active", currentLocale === "en");
}

function setLocale(localeCode) {
  if (!["de", "en"].includes(localeCode)) {
    return;
  }
  currentLocale = localeCode;
  localStorage.setItem(LOCALE_KEY, currentLocale);
  applyStaticTexts();
  render(true);
}

const upgradeDefs = {
  autoNibbler: {
    baseCost: 20,
    scale: 1.35,
    buy: () => {
      gameState.upgrades.autoNibbler += 1;
      recalcRates();
    },
  },
  betterTeeth: {
    baseCost: 45,
    scale: 1.45,
    buy: () => {
      gameState.upgrades.betterTeeth += 1;
      recalcRates();
    },
  },
  thinkTank: {
    baseCost: 175,
    scale: 1.6,
    unlocked: () => gameState.progression.totalCheeseLifetime >= gameState.progression.unlockIdeasAt,
    buy: () => {
      gameState.upgrades.thinkTank += 1;
      recalcRates();
    },
  },
  caveRoutes: {
    baseCost: 300,
    scale: 1.7,
    unlocked: () => gameState.progression.totalCheeseLifetime >= 600,
    buy: () => {
      gameState.upgrades.caveRoutes += 1;
      recalcRates();
    },
  },
  hiveMind: {
    baseCost: 18,
    scale: 1.55,
    currency: "ideas",
    unlocked: () => gameState.progression.totalCheeseLifetime >= gameState.progression.unlockIdeasAt,
    buy: () => {
      gameState.upgrades.hiveMind += 1;
      recalcRates();
    },
  },
  inspiredChewers: {
    baseCost: 40,
    scale: 1.7,
    currency: "ideas",
    unlocked: () => gameState.progression.totalCheeseLifetime >= 700,
    buy: () => {
      gameState.upgrades.inspiredChewers += 1;
      recalcRates();
    },
  },
};

function recalcRates() {
  gameState.rates.clickPower =
    1 + gameState.upgrades.betterTeeth * 1 + gameState.resources.instinct * 0.3;

  const caveBonus = 1 + gameState.upgrades.caveRoutes * 0.12 + gameState.resources.instinct * 0.04;
  gameState.rates.autoNibblers = gameState.upgrades.autoNibbler * caveBonus;

  const hiveMindBonus = 1 + gameState.upgrades.hiveMind * 0.35;
  gameState.rates.ideaRate =
    (gameState.upgrades.thinkTank * 0.22 + Math.max(0, gameState.rates.autoNibblers - 3) * 0.03) *
    hiveMindBonus;

  const inspiredBonus = 1 + gameState.upgrades.inspiredChewers * 0.12;
  gameState.rates.clickPower *= inspiredBonus;
  gameState.rates.autoNibblers *= inspiredBonus;
}

function formatNum(value) {
  if (value < 1000) {
    return value.toFixed(1);
  }
  if (value < 1_000_000) {
    return `${(value / 1000).toFixed(2)}k`;
  }
  return `${(value / 1_000_000).toFixed(2)}m`;
}

function addLog(message) {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  gameState.log.unshift(`[${hh}:${mm}] ${message}`);
  gameState.log = gameState.log.slice(0, 30);
}

function getUpgradeCost(key) {
  const def = upgradeDefs[key];
  const owned = gameState.upgrades[key];
  return def.baseCost * Math.pow(def.scale, owned);
}

function getUpgradeCurrency(key) {
  return upgradeDefs[key].currency || "cheese";
}

function canAfford(key) {
  const currency = getUpgradeCurrency(key);
  return gameState.resources[currency] + PURCHASE_EPSILON >= getUpgradeCost(key);
}

function buyUpgrade(key) {
  const def = upgradeDefs[key];
  if (typeof def.unlocked === "function" && !def.unlocked()) {
    return false;
  }
  const cost = getUpgradeCost(key);
  const currency = getUpgradeCurrency(key);
  if (gameState.resources[currency] + PURCHASE_EPSILON < cost) {
    return false;
  }
  gameState.resources[currency] = Math.max(0, gameState.resources[currency] - cost);
  def.buy();
  addLog(
    t("buyLog", {
      name: getUpgradeName(key),
      level: gameState.upgrades[key],
    })
  );
  render(false);
  return true;
}

function flashSuccessfulPurchase(buttonEl) {
  if (!(buttonEl instanceof HTMLButtonElement)) {
    return;
  }
  const card = buttonEl.closest(".shop-item");
  buttonEl.classList.add("purchase-ok");
  if (card instanceof HTMLElement) {
    card.classList.add("purchase-flash");
  }

  if (shopRefreshTimer) {
    clearTimeout(shopRefreshTimer);
  }
  shopRefreshTimer = setTimeout(() => {
    shopRefreshTimer = null;
    render(true);
  }, 140);

  setTimeout(() => {
    buttonEl.classList.remove("purchase-ok");
    if (card instanceof HTMLElement) {
      card.classList.remove("purchase-flash");
    }
  }, 150);
}

function clickCheese() {
  const gain = gameState.rates.clickPower * gameState.boosts.eventMultiplier;
  gameState.resources.cheese += gain;
  gameState.progression.totalCheeseLifetime += gain;
  render(false);
}

function maybeTriggerEvent(nowTs) {
  if (gameState.progression.totalCheeseLifetime < gameState.progression.unlockEventsAt) {
    return;
  }
  if (gameState.boosts.eventEndsAt > nowTs) {
    return;
  }
  const chance = Math.random();
  if (chance > 0.015) {
    return;
  }

  const durationMs = 18000;
  gameState.boosts.eventEndsAt = nowTs + durationMs;

  if (Math.random() < 0.7) {
    gameState.boosts.eventMultiplier = 1.8;
    addLog(t("eventGood"));
  } else {
    gameState.boosts.eventMultiplier = 0.6;
    addLog(t("eventBad"));
  }
}

function resolveEventExpiry(nowTs) {
  if (gameState.boosts.eventEndsAt && nowTs >= gameState.boosts.eventEndsAt) {
    gameState.boosts.eventEndsAt = 0;
    gameState.boosts.eventMultiplier = 1;
    addLog(t("eventEnd"));
  }
}

function autoSaveIfNeeded(nowTs) {
  if (nowTs - gameState.lastSave > 15000) {
    saveGame(false);
  }
}

function gameTick() {
  const nowTs = Date.now();
  const deltaSec = Math.min(1.2, (nowTs - gameState.lastTick) / 1000);
  gameState.lastTick = nowTs;

  resolveEventExpiry(nowTs);
  maybeTriggerEvent(nowTs);

  const multiplier = gameState.boosts.eventMultiplier;
  const cheeseGain = gameState.rates.autoNibblers * deltaSec * multiplier;
  const ideasGain = gameState.rates.ideaRate * deltaSec;

  gameState.resources.cheese += cheeseGain;
  gameState.resources.ideas += ideasGain;
  gameState.progression.totalCheeseLifetime += Math.max(0, cheeseGain);

  autoSaveIfNeeded(nowTs);
  render(false);
}

function prestigeReady() {
  return gameState.progression.totalCheeseLifetime >= 5000;
}

function doPrestige() {
  if (!prestigeReady()) {
    addLog(t("prestigeNotReady"));
    render(false);
    return;
  }
  const gained = Math.max(1, Math.floor(Math.sqrt(gameState.progression.totalCheeseLifetime / 1400)));
  const permanentInstinct = gameState.resources.instinct + gained;
  gameState = defaultState();
  gameState.resources.instinct = permanentInstinct;
  recalcRates();
  addLog(t("prestigeLog", { value: gained }));
  saveGame(true);
  render(true);
}

function resetGame() {
  const keepInstinct = gameState.resources.instinct;
  gameState = defaultState();
  gameState.resources.instinct = keepInstinct;
  recalcRates();
  addLog(t("resetLog"));
  saveGame(true);
  render(true);
}

function buildAscii() {
  const eventLeft =
    gameState.boosts.eventEndsAt > 0
      ? Math.max(0, Math.ceil((gameState.boosts.eventEndsAt - Date.now()) / 1000))
      : 0;
  const mood =
    gameState.boosts.eventMultiplier > 1
      ? t("moodBoost")
      : gameState.boosts.eventMultiplier < 1
      ? t("moodDebuff")
      : t("moodNormal");

  return String.raw`
       (\__/)
       (o^.^)   ${t("asciiProtocol")}
      z(_(")(")==================
      || ${t("asciiCheese")}: ${formatNum(gameState.resources.cheese).padStart(8, " ")}
      || ${t("asciiIdeas")}: ${formatNum(gameState.resources.ideas).padStart(8, " ")}
      || ${t("asciiInstinct")}: ${formatNum(gameState.resources.instinct).padStart(5, " ")}
      || ${t("asciiClickPower")}: ${formatNum(gameState.rates.clickPower).padStart(6, " ")}
      || ${t("asciiAutoNibblers")}: ${formatNum(gameState.rates.autoNibblers).padStart(6, " ")}
      || ${t("asciiIdeasRate")}: ${formatNum(gameState.rates.ideaRate).padStart(9, " ")}
      || ${t("asciiEvent")}: ${mood}${eventLeft ? ` (${eventLeft}s)` : ""}
      ==========================================`;
}

function renderStats() {
  const progressIdeas = Math.max(
    0,
    gameState.progression.unlockIdeasAt - gameState.progression.totalCheeseLifetime
  );
  const progressEvents = Math.max(
    0,
    gameState.progression.unlockEventsAt - gameState.progression.totalCheeseLifetime
  );
  const prestigeNeed = Math.max(0, 5000 - gameState.progression.totalCheeseLifetime);

  statsEl.textContent = [
    t("statsLifetime", { value: formatNum(gameState.progression.totalCheeseLifetime) }),
    t("statsIdeasUnlock", { value: formatNum(progressIdeas) }),
    t("statsEventsUnlock", { value: formatNum(progressEvents) }),
    t("statsPrestigeNeed", { value: formatNum(prestigeNeed) }),
  ].join("\n");
}

function getUpgradeName(key) {
  return t(`up_${key}_name`);
}

function getUpgradeDesc(key) {
  return t(`up_${key}_desc`);
}

function renderShop() {
  const entries = Object.entries(upgradeDefs)
    .filter(([_, def]) => !def.unlocked || def.unlocked())
    .map(([key, def]) => {
      const cost = getUpgradeCost(key);
      const owned = gameState.upgrades[key];
      const disabled = canAfford(key) ? "" : "disabled";
      const costLabel =
        getUpgradeCurrency(key) === "ideas"
          ? t("costIdeas", { value: formatNum(cost) })
          : t("cost", { value: formatNum(cost) });
      return `
      <article class="shop-item">
        <p><strong>${getUpgradeName(key)}</strong></p>
        <p>${getUpgradeDesc(key)}</p>
        <p>${t("owned", { value: owned })}</p>
        <p>${costLabel}</p>
        <button data-upgrade="${key}" ${disabled}>${t("buy")}</button>
      </article>`;
    })
    .join("");

  shopEl.innerHTML = entries || `<p>${t("noUpgrades")}</p>`;
}

function renderLog() {
  logEl.textContent = gameState.log.join("\n");
}

function render(forceShopRender = false) {
  asciiEl.textContent = buildAscii();
  renderStats();
  const now = Date.now();
  if (forceShopRender || now - lastShopRenderAt > 750) {
    renderShop();
    lastShopRenderAt = now;
  }
  renderLog();

  prestigeBtn.disabled = !prestigeReady();
}

function saveGame(showLog = true) {
  gameState.lastSave = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
  if (showLog) {
    addLog(t("saveLog"));
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1) {
      return null;
    }
    return {
      ...defaultState(),
      ...parsed,
      resources: { ...defaultState().resources, ...parsed.resources },
      rates: { ...defaultState().rates, ...parsed.rates },
      progression: { ...defaultState().progression, ...parsed.progression },
      boosts: { ...defaultState().boosts, ...parsed.boosts },
      upgrades: { ...defaultState().upgrades, ...parsed.upgrades },
      log: Array.isArray(parsed.log) ? parsed.log.slice(0, 30) : defaultState().log,
    };
  } catch (_err) {
    return null;
  }
}

clickBtn.addEventListener("click", clickCheese);
saveBtn.addEventListener("click", () => {
  saveGame(true);
  render(false);
});
resetBtn.addEventListener("click", resetGame);
prestigeBtn.addEventListener("click", doPrestige);

shopEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }
  const button = target.closest("button[data-upgrade]");
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }
  const key = button.getAttribute("data-upgrade");
  if (key && Object.hasOwn(upgradeDefs, key)) {
    const purchased = buyUpgrade(key);
    if (purchased) {
      flashSuccessfulPurchase(button);
    }
  }
});

langDeBtn.addEventListener("click", () => setLocale("de"));
langEnBtn.addEventListener("click", () => setLocale("en"));

recalcRates();
applyStaticTexts();
render(true);
setInterval(gameTick, TICK_MS);
