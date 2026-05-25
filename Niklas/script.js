const charmSets = {
  home: ["♡", "✦", "✿", "☁"],
  explainer: ["♡", "✦", "✿", "☼"],
  game: ["✦", "✧", "♡", "✿"],
};

const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");

const parseLooseNumber = (value) => {
  const normalized = String(value ?? "").trim().replace(/\s+/g, "").replace(",", ".");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const shiftUpperLetter = (letter, amount) => {
  const normalized = String(letter ?? "").trim().toUpperCase();
  const index = alphabet.indexOf(normalized);

  if (index === -1) {
    return normalized;
  }

  return alphabet[(index + amount + alphabet.length) % alphabet.length];
};

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const normalizeLooseDate = (value) => {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return "";
  }

  const parts = raw.split(/\D+/).filter(Boolean);

  if (parts.length !== 3) {
    return "";
  }

  let year = "";
  let month = "";
  let day = "";

  if (parts[0].length === 4) {
    [year, month, day] = parts;
  } else {
    [day, month, year] = parts;
  }

  if (year.length === 2) {
    year = `20${year}`;
  }

  return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const createSparkles = (selector, symbols) => {
  const container = document.querySelector(selector);

  if (!container) {
    return;
  }

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const amount = window.innerWidth < 540 ? 8 : window.innerWidth < 720 ? 12 : 20;

  for (let index = 0; index < amount; index += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.textContent = symbols[index % symbols.length];
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.animationDelay = `${Math.random() * -12}s`;
    sparkle.style.setProperty("--drift", `${Math.random() * 60 - 30}px`);
    sparkle.style.setProperty("--duration", `${10 + Math.random() * 8}s`);
    sparkle.style.opacity = `${0.35 + Math.random() * 0.45}`;
    container.appendChild(sparkle);
  }
};

const setupPageTransitions = () => {
  const links = document.querySelectorAll("[data-nav]");

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href.startsWith("#")) {
        return;
      }

      event.preventDefault();
      document.body.classList.add("is-leaving");

      window.setTimeout(() => {
        window.location.href = href;
      }, 380);
    });
  });
};

const setupReveal = () => {
  const reveals = document.querySelectorAll(".reveal");

  if (!reveals.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    },
  );

  reveals.forEach((element) => observer.observe(element));
};

const setupHomeIntro = () => {
  const video = document.querySelector("[data-intro-video]");
  const poster = document.querySelector("[data-intro-poster]");
  const startButton = document.querySelector("[data-start-intro]");
  const finalePanel = document.querySelector("[data-intro-finale]");
  const enterButton = document.querySelector("[data-enter-game]");

  if (!video || !startButton || !finalePanel || !enterButton) {
    return;
  }

  let hasStarted = false;
  let framePrimed = false;
  let playbackStarted = false;
  const setStartButtonLabel = (label) => {
    startButton.innerHTML = `<span>${label}</span>`;
  };

  const markPrimed = () => {
    document.body.classList.add("is-intro-primed");
  };

  const waitForVideoReady = () =>
    new Promise((resolve, reject) => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        resolve();
        return;
      }

      let settled = false;

      const cleanup = () => {
        video.removeEventListener("loadeddata", handleReady);
        video.removeEventListener("canplay", handleReady);
        video.removeEventListener("error", handleError);
      };

      const settle = (handler) => {
        if (settled) {
          return;
        }

        settled = true;
        cleanup();
        handler();
      };

      const handleReady = () => settle(resolve);
      const handleError = () => settle(() => reject(new Error("video-not-ready")));

      video.addEventListener("loadeddata", handleReady);
      video.addEventListener("canplay", handleReady);
      video.addEventListener("error", handleError);

      window.setTimeout(() => {
        settle(resolve);
      }, 4000);
    });

  const resetIntroState = () => {
    hasStarted = false;
    playbackStarted = false;
    startButton.disabled = false;
    setStartButtonLabel("Ready");
    finalePanel.setAttribute("aria-hidden", "true");
    enterButton.tabIndex = -1;
    document.body.classList.remove(
      "is-intro-loading",
      "is-intro-playing",
      "is-intro-complete",
      "is-intro-primed",
    );
    video.pause();
    if (poster?.src) {
      poster.hidden = false;
    }

    try {
      video.currentTime = 0;
    } catch (error) {
      return;
    }
  };

  const primeVideoFrame = () => {
    if (framePrimed || hasStarted) {
      return;
    }

    try {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.videoWidth && video.videoHeight) {
        const canvas = document.createElement("canvas");
        const maxWidth = 1600;
        const scale = Math.min(1, maxWidth / video.videoWidth);
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));

        const context = canvas.getContext("2d", { alpha: false });

        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          if (poster) {
            poster.src = canvas.toDataURL("image/jpeg", 0.86);
            poster.hidden = false;
          }
        }
      }
    } catch (error) {
      return;
    } finally {
      framePrimed = true;
      markPrimed();
    }
  };

  video.pause();
  video.preload = "auto";
  video.playsInline = true;
  video.defaultMuted = true;
  video.muted = true;
  enterButton.tabIndex = -1;
  setStartButtonLabel("Let´s go");
  video.load();

  video.addEventListener("loadeddata", () => {
    primeVideoFrame();
  });

  video.addEventListener("canplay", () => {
    if (!framePrimed) {
      primeVideoFrame();
    } else {
      markPrimed();
    }
  });

  video.addEventListener("playing", () => {
    document.body.classList.remove("is-intro-loading");
    document.body.classList.add("is-intro-playing");
    playbackStarted = true;
  });

  video.addEventListener("timeupdate", () => {
    if (hasStarted && !playbackStarted && video.currentTime > 0) {
      document.body.classList.remove("is-intro-loading");
      document.body.classList.add("is-intro-playing");
      playbackStarted = true;
    }
  });

  video.addEventListener("ended", () => {
    document.body.classList.remove("is-intro-loading", "is-intro-playing");
    finalePanel.setAttribute("aria-hidden", "false");
    enterButton.tabIndex = 0;

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.body.classList.add("is-intro-complete");
        enterButton.focus({ preventScroll: true });
      });
    });
  });

  video.addEventListener("error", () => {
    framePrimed = false;
    playbackStarted = false;
    resetIntroState();
  });

  startButton.addEventListener("click", async () => {
    if (hasStarted) {
      return;
    }

    hasStarted = true;
    playbackStarted = false;
    startButton.disabled = true;
    setStartButtonLabel("...");
    document.body.classList.add("is-intro-loading");

    try {
      await waitForVideoReady();
      video.currentTime = 0;
      await video.play();
    } catch (error) {
      framePrimed = false;
      resetIntroState();
    }
  });
};

const validateAnswer = (rawValue, validation) => {
  const value = String(rawValue ?? "");

  switch (validation?.mode) {
    case "exactText":
      return normalizeText(value) === normalizeText(validation.value);
    case "oneOfText":
      return (validation.accepted ?? []).some(
        (candidate) => normalizeText(value) === normalizeText(candidate),
      );
    case "includesText":
      return (validation.accepted ?? []).some((candidate) =>
        normalizeText(value).includes(normalizeText(candidate)),
      );
    case "numberExact": {
      const parsed = parseLooseNumber(value);
      return !Number.isNaN(parsed) && parsed === Number(validation.value);
    }
    case "oneOfNumber": {
      const parsed = parseLooseNumber(value);
      return !Number.isNaN(parsed) && (validation.accepted ?? []).includes(parsed);
    }
    case "dateExact":
      return normalizeLooseDate(value) === normalizeLooseDate(validation.value);
    default:
      return false;
  }
};

const setupGamePage = () => {
  const root = document.querySelector("[data-game-root]");
  const data = window.ANNIVERSARY_GAME;

  if (!root || !data?.levels?.length) {
    return;
  }

  const ui = {
    body: document.body,
    stageCard: document.querySelector("[data-stage-card]"),
    questCard: document.querySelector("[data-quest-card]"),
    inventoryPanel: document.querySelector(".inventory-panel"),
    levelsPanel: document.querySelector(".levels-panel"),
    levelImage: document.querySelector("[data-level-image]"),
    levelChapter: document.querySelector("[data-level-chapter]"),
    levelKicker: document.querySelector("[data-level-kicker]"),
    levelTitle: document.querySelector("[data-level-title]"),
    questTitle: document.querySelector("[data-quest-title]"),
    progressCount: document.querySelector("[data-progress-count]"),
    progressFill: document.querySelector("[data-progress-fill]"),
    levelPrompt: document.querySelector("[data-level-prompt]"),
    levelHelper: document.querySelector("[data-level-helper]"),
    statePanel: document.querySelector("[data-state-panel]"),
    artifactGrid: document.querySelector("[data-artifact-grid]"),
    levelList: document.querySelector("[data-level-list]"),
    resetButton: document.querySelector("[data-reset-progress]"),
    modal: document.querySelector("[data-artifact-modal]"),
    modalPanel: document.querySelector("[data-artifact-modal-panel]"),
    modalTitle: document.querySelector("[data-modal-title]"),
    modalCopy: document.querySelector("[data-modal-copy]"),
    modalImage: document.querySelector("[data-modal-image]"),
    modalChapter: document.querySelector("[data-modal-chapter]"),
    modalLetter: document.querySelector("[data-modal-letter]"),
    modalArtifactNote: document.querySelector("[data-modal-artifact-note]"),
    advanceButton: document.querySelector("[data-advance-level]"),
    finaleShell: document.querySelector("[data-finale-shell]"),
    finaleHeading: document.querySelector("[data-finale-heading]"),
    finaleCopy: document.querySelector("[data-finale-copy]"),
    finalePrize: document.querySelector("[data-finale-prize]"),
    finaleDestination: document.querySelector("[data-finale-destination]"),
    cipherKey: document.querySelector("[data-cipher-key]"),
    cipherGrid: document.querySelector("[data-cipher-grid]"),
    cipherStatus: document.querySelector("[data-cipher-status]"),
    keyForm: document.querySelector("[data-key-form]"),
    keyShell: document.querySelector("[data-key-shell]"),
    keyInput: document.querySelector("[data-key-input]"),
    submitKeyButton: document.querySelector("[data-submit-key]"),
    decryptButton: document.querySelector("[data-run-decrypt]"),
    openGiftButton: document.querySelector("[data-open-gift]"),
    giftModal: document.querySelector("[data-gift-modal]"),
    giftHeading: document.querySelector("[data-gift-heading]"),
    giftSubheading: document.querySelector("[data-gift-subheading]"),
    giftCopy: document.querySelector("[data-gift-copy]"),
  };

  const createDefaultState = () => ({
    completedLevelIds: [],
    stepProgressByLevel: {},
    finaleKeyValidated: false,
    finaleDecrypted: false,
    giftOpened: false,
  });

  const loadState = () => {
    try {
      const raw = window.localStorage.getItem(data.storageKey);

      if (!raw) {
        return createDefaultState();
      }

      const parsed = JSON.parse(raw);
      const completed = Array.isArray(parsed.completedLevelIds)
        ? [...new Set(parsed.completedLevelIds.map((value) => Number(value)).filter(Boolean))]
        : [];
      const stepProgressByLevel =
        parsed.stepProgressByLevel && typeof parsed.stepProgressByLevel === "object"
          ? Object.fromEntries(
              Object.entries(parsed.stepProgressByLevel)
                .map(([key, value]) => [Number(key), Number(value)])
                .filter(([key, value]) => Number.isFinite(key) && Number.isFinite(value)),
            )
          : {};

      return {
        completedLevelIds: completed,
        stepProgressByLevel,
        finaleKeyValidated: Boolean(parsed.finaleKeyValidated),
        finaleDecrypted: Boolean(parsed.finaleDecrypted),
        giftOpened: Boolean(parsed.giftOpened),
      };
    } catch (error) {
      return createDefaultState();
    }
  };

  const saveState = () => {
    try {
      window.localStorage.setItem(data.storageKey, JSON.stringify(state));
    } catch (error) {
      return;
    }
  };

  const getLevelById = (id) => data.levels.find((level) => level.id === id) ?? data.levels[0];

  const getUnlockedLevelIds = () => {
    const unlocked = [];

    for (const level of data.levels) {
      unlocked.push(level.id);

      if (!isCompleted(level.id)) {
        break;
      }
    }

    return unlocked;
  };

  const isUnlocked = (levelId) => getUnlockedLevelIds().includes(levelId);

  const getFirstOpenLevelId = () => {
    return getUnlockedLevelIds().find((levelId) => !isCompleted(levelId)) ?? data.levels[0].id;
  };

  const getNextLevelId = (currentId) => {
    const currentIndex = data.levels.findIndex((level) => level.id === currentId);

    if (currentIndex === -1) {
      return currentId;
    }

    return data.levels[currentIndex + 1]?.id ?? currentId;
  };

  const getCompletionCount = () => state.completedLevelIds.length;
  const isCompleted = (levelId) => state.completedLevelIds.includes(levelId);
  const isGameComplete = () => getCompletionCount() >= data.totalArtifacts;

  const getStepList = (level) => level.steps ?? [];

  const getCurrentStepIndex = (level) => {
    const maxIndex = Math.max(getStepList(level).length - 1, 0);
    const rawIndex = Number(state.stepProgressByLevel[level.id] ?? 0);
    return Math.min(Math.max(rawIndex, 0), maxIndex);
  };

  const getCurrentChallenge = (level) => getStepList(level)[getCurrentStepIndex(level)] ?? null;

  const getLevelStateLabel = (level) => {
    if (isCompleted(level.id)) {
      return "gesichert";
    }

    if (isUnlocked(level.id)) {
      return "offen";
    }

    return "versiegelt";
  };

  const createInputField = (inputConfig) => {
    if (inputConfig.type === "textarea") {
      const textarea = document.createElement("textarea");
      textarea.id = "dynamic-answer";
      textarea.className = "answer-input answer-input--textarea";
      textarea.placeholder = inputConfig.placeholder ?? "";
      textarea.rows = inputConfig.rows ?? 4;
      return textarea;
    }

    const input = document.createElement("input");
    input.id = "dynamic-answer";
    input.className = "answer-input";
    input.placeholder = inputConfig.placeholder ?? "";
    input.type = inputConfig.type === "number" ? "number" : "text";
    input.inputMode = inputConfig.type === "number" ? "decimal" : "text";
    input.autocomplete = "off";

    if (inputConfig.step) {
      input.step = inputConfig.step;
    }

    if (inputConfig.min !== undefined) {
      input.min = inputConfig.min;
    }

    if (inputConfig.max !== undefined) {
      input.max = inputConfig.max;
    }

    return input;
  };

  const setFeedback = (message, tone = "info") => {
    const bubble = root.querySelector("[data-feedback]");

    if (!bubble) {
      return;
    }

    bubble.textContent = message;
    bubble.dataset.tone = tone;
    bubble.hidden = false;
    window.requestAnimationFrame(() => {
      bubble.classList.add("is-visible");
    });
  };

  const clearFeedback = () => {
    const bubble = root.querySelector("[data-feedback]");

    if (!bubble) {
      return;
    }

    bubble.classList.remove("is-visible");
    bubble.hidden = true;
    bubble.textContent = "";
    bubble.removeAttribute("data-tone");
  };

  const setKeyShellTone = (tone = "") => {
    if (!ui.keyShell) {
      return;
    }

    if (!tone) {
      ui.keyShell.removeAttribute("data-tone");
      ui.keyShell.classList.remove("is-shaking");
      return;
    }

    ui.keyShell.dataset.tone = tone;

    if (tone === "error") {
      ui.keyShell.classList.remove("is-shaking");
      void ui.keyShell.offsetWidth;
      ui.keyShell.classList.add("is-shaking");
    }
  };

  const getEncryptedLetters = () => data.levels.map((level) => level.artifact.encryptedLetter);

  const buildCipherLetters = (decrypted = false) => {
    const sourceLetters = decrypted
      ? getEncryptedLetters().map((letter) => shiftUpperLetter(letter, data.finale.cipherKey))
      : getEncryptedLetters();

    ui.cipherGrid.innerHTML = "";

    sourceLetters.forEach((letter, index) => {
      const cell = document.createElement("div");
      cell.className = `cipher-cell${decrypted ? " is-solved" : ""}`;
      cell.dataset.cipherIndex = String(index);
      cell.innerHTML = `<span class="cipher-letter">${letter}</span>`;
      ui.cipherGrid.appendChild(cell);
    });
  };

  const renderFinale = () => {
    if (!ui.finaleShell) {
      return;
    }

    if (!isGameComplete()) {
      ui.finaleShell.hidden = true;
      return;
    }

    ui.finaleShell.hidden = false;
    ui.finaleShell.classList.add("is-visible");
    ui.finaleHeading.textContent = data.finale.chamberHeading;
    ui.finaleCopy.textContent = data.finale.decryptInstruction;
    ui.finalePrize.textContent = data.finale.chamberPrize;
    ui.finaleDestination.textContent = state.finaleDecrypted
      ? data.finale.chamberDestinationUnlocked
      : data.finale.chamberDestinationLocked;
    ui.cipherKey.textContent = state.finaleKeyValidated ? String(data.finale.cipherKey) : "?";
    ui.cipherKey.classList.toggle("finale-key-value--empty", !state.finaleKeyValidated);
    ui.giftHeading.textContent = data.finale.revealHeading;
    ui.giftSubheading.textContent = data.finale.revealSubheading;
    ui.giftCopy.textContent = data.finale.revealCopy;

    buildCipherLetters(state.finaleDecrypted);

    if (state.finaleDecrypted) {
      ui.cipherStatus.textContent =
        "Das Reiseziel ist entschlüsselt: Barcelona. Jetzt kannst du dir dein Geschenk abholen.";
      ui.keyForm.hidden = true;
      ui.decryptButton.hidden = true;
      ui.openGiftButton.hidden = false;
      setKeyShellTone("");
    } else {
      ui.keyForm.hidden = false;
      ui.cipherStatus.textContent = state.finaleKeyValidated
        ? "schlüssel erkannt. Du hast eine Reise gewonnen, und jetzt kannst du den verschlüsselten Reiseort sichtbar machen."
        : "Du hast eine Reise gewonnen, aber das Reiseziel ist noch verschlüsselt. Finde die richtige schlüsselzahl.";
      ui.decryptButton.hidden = !state.finaleKeyValidated;
      ui.decryptButton.disabled = false;
      if (ui.keyInput) {
        ui.keyInput.disabled = state.finaleKeyValidated;
      }
      if (ui.submitKeyButton) {
        ui.submitKeyButton.disabled = state.finaleKeyValidated;
        ui.submitKeyButton.textContent = state.finaleKeyValidated
          ? "schlüssel erkannt"
          : "schlüssel pruefen";
      }
      ui.openGiftButton.hidden = true;
    }
  };

  const scrollToFinale = () => {
    if (!ui.finaleShell || ui.finaleShell.hidden) {
      return;
    }

    (ui.finaleHeading ?? ui.finaleShell).scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const openGiftModal = () => {
    if (!ui.giftModal) {
      return;
    }

    state.giftOpened = true;
    saveState();
    ui.giftModal.hidden = false;
    ui.body.classList.add("is-gift-open");
    window.requestAnimationFrame(() => {
      ui.giftModal.classList.add("is-open");
    });
  };

  const closeGiftModal = () => {
    if (!ui.giftModal) {
      return;
    }

    ui.giftModal.classList.remove("is-open");
    ui.body.classList.remove("is-gift-open");

    window.setTimeout(() => {
      ui.giftModal.hidden = true;
    }, 260);
  };

  let decryptionRunning = false;

  const runDecryptionSequence = async () => {
    if (
      decryptionRunning ||
      state.finaleDecrypted ||
      !state.finaleKeyValidated ||
      !isGameComplete()
    ) {
      return;
    }

    decryptionRunning = true;
    ui.decryptButton.disabled = true;
    ui.cipherStatus.textContent = "schlüssel eingesetzt. Die Buchstaben verschieben sich ...";

    const cells = [...ui.cipherGrid.querySelectorAll(".cipher-cell")];
    const encryptedLetters = getEncryptedLetters();

    for (const [index, cell] of cells.entries()) {
      const letterNode = cell.querySelector(".cipher-letter");
      const baseLetter = encryptedLetters[index];

      cell.classList.add("is-decoding");

      for (let step = 1; step <= data.finale.cipherKey; step += 1) {
        await wait(90);
        letterNode.textContent = shiftUpperLetter(baseLetter, step);
      }

      cell.classList.remove("is-decoding");
      cell.classList.add("is-solved");
      cell.style.animation = "jackpot-pop 420ms cubic-bezier(0.22, 1, 0.36, 1)";
      window.setTimeout(() => {
        cell.style.animation = "";
      }, 440);

      await wait(85);
    }

    state.finaleDecrypted = true;
    saveState();
    ui.cipherStatus.textContent =
      "BARCELONA wurde entschlüsselt. Das Geschenk wartet darauf, abgeholt zu werden.";
    ui.keyForm.hidden = true;
    ui.decryptButton.hidden = true;
    ui.openGiftButton.hidden = false;
    decryptionRunning = false;
  };

  const validateFinaleKey = () => {
    if (!ui.keyInput || !isGameComplete() || state.finaleKeyValidated) {
      return;
    }

    const enteredKey = parseLooseNumber(ui.keyInput.value);

    if (Number.isNaN(enteredKey)) {
      setKeyShellTone("error");
      ui.cipherStatus.textContent = "Bitte gib zuerst die versteckte schlüsselzahl ein.";
      return;
    }

    if (enteredKey !== data.finale.cipherKey) {
      setKeyShellTone("error");
      ui.cipherStatus.textContent =
        "Diese Zahl passt noch nicht. Die Reise ist gewonnen, aber das Ziel bleibt noch verschlüsselt.";
      return;
    }

    state.finaleKeyValidated = true;
    saveState();
    setKeyShellTone("success");
    renderFinale();
    ui.cipherStatus.textContent =
      "Perfekt. Das ist der richtige schlüssel. Jetzt kannst du den verschlüsselten Reiseort entschlüsseln.";
  };

  const animatePanels = () => {
    [ui.stageCard, ui.questCard, ui.inventoryPanel, ui.levelsPanel].forEach((panel) => {
      panel?.classList.add("is-switching");
    });

    window.setTimeout(() => {
      [ui.stageCard, ui.questCard, ui.inventoryPanel, ui.levelsPanel].forEach((panel) => {
        panel?.classList.remove("is-switching");
      });
    }, 320);
  };

  const renderArtifactGrid = () => {
    ui.artifactGrid.innerHTML = "";

    data.levels.forEach((level) => {
      const slot = document.createElement("article");
      slot.className = "artifact-slot";
      slot.style.setProperty(
        "--artifact-image",
        `url("${(level.gallery?.[0]?.src ?? level.image.src).replace(/"/g, '\\"')}")`,
      );
      slot.setAttribute(
        "aria-label",
        isCompleted(level.id)
          ? `Buchstabe ${level.artifact.encryptedLetter} in Slot ${level.id}`
          : `Verschlossener Slot ${level.id}`,
      );

      if (isCompleted(level.id)) {
        slot.classList.add("is-unlocked");
      }

      if (activeLevelId === level.id) {
        slot.classList.add("is-active-level");
      }

      slot.innerHTML = `
        <div class="artifact-slot-stage">
          <span class="artifact-slot-index">${String(level.id).padStart(2, "0")}</span>
          <div class="artifact-slot-core">
            ${
              isCompleted(level.id)
                ? `<span class="artifact-slot-letter">${level.artifact.encryptedLetter}</span>`
                : '<span class="artifact-slot-locked">?</span>'
            }
          </div>
        </div>
      `;

      ui.artifactGrid.appendChild(slot);
    });
  };

  const renderLevelList = () => {
    ui.levelList.innerHTML = "";

    data.levels.forEach((level) => {
      const button = document.createElement("button");
      const unlocked = isUnlocked(level.id);
      button.type = "button";
      button.className = "level-tile";
      button.dataset.levelId = String(level.id);
      button.disabled = !unlocked;

      if (activeLevelId === level.id) {
        button.classList.add("is-active");
      }

      if (isCompleted(level.id)) {
        button.classList.add("is-complete");
      }

      if (!unlocked) {
        button.classList.add("is-sealed");
      }

      button.innerHTML = `
        <div class="level-thumb">
          ${
            unlocked
              ? `<img src="${level.image.src}" alt="${level.image.alt}" loading="lazy" />`
              : `
                <div class="level-thumb-placeholder" aria-hidden="true">
                  <span class="level-thumb-lock"></span>
                  <span class="level-thumb-label">Gesperrt</span>
                </div>
              `
          }
        </div>
        <div class="level-copy">
          <p class="level-kicker">${level.chapter}</p>
          <p class="level-name">${unlocked ? level.title : "Noch gesperrt"}</p>
          <p class="level-desc">${
            unlocked
              ? level.kicker
              : "Wird erst nach dem vorherigen Kapitel freigeschaltet."
          }</p>
        </div>
        <span class="level-state-pill">${getLevelStateLabel(level)}</span>
      `;

      ui.levelList.appendChild(button);
    });
  };

  const buildPlayableState = (level, challenge, completed) => {
    if (completed) {
      return `
        <div class="quest-empty-state">
          <h3>Artefakt gesichert</h3>
          <p>
            Dieses Kapitel ist geschafft. Der Buchstabe liegt jetzt
            sicher in deinem Inventar und kann jederzeit erneut angesehen werden.
          </p>
        </div>
        <div class="quest-actions">
          <button class="ghost-button" type="button" data-view-artifact>Artefakt ansehen</button>
          <button class="ghost-button" type="button" data-go-next-level>Nächstes Level ansehen</button>
        </div>
      `;
    }

    return `
      <form class="answer-form" data-answer-form novalidate>
        <label class="field-label" data-answer-label for="dynamic-answer">${challenge.answerInput.label}</label>
        <div class="answer-shell">
          <div class="answer-input-region" data-answer-input-region></div>
          <button
            class="primary-button primary-button--compact"
            type="submit"
            data-submit-answer
          >
            ${challenge.answerInput.buttonLabel}
          </button>
        </div>
      </form>

      <div class="quest-actions">
        ${
          challenge.hint
            ? '<button class="ghost-button" type="button" data-show-hint>Hinweis zeigen</button>'
            : ""
        }
        <button class="ghost-button" type="button" data-view-artifact>Artefakt ansehen</button>
      </div>

      ${
        challenge.hint
          ? `<div class="hint-card" data-hint-card hidden>
        <p class="hint-card-label">Hinweis</p>
        <p class="hint-card-copy" data-hint-copy>${challenge.hint}</p>
      </div>`
          : ""
      }

      <div class="feedback-bubble" data-feedback hidden></div>
    `;
  };

  const buildSealedState = () => `
    <div class="quest-empty-state">
      <h3>Noch versiegelt</h3>
      <p>
        Dieses Kapitel bleibt verborgen, bis du das vorherige Kapitel abgeschlossen
        hast.
      </p>
    </div>
  `;

  const renderStatePanel = (level) => {
    const completed = isCompleted(level.id);
    const challenge = getCurrentChallenge(level);

    if (isUnlocked(level.id) && challenge) {
      ui.statePanel.innerHTML = buildPlayableState(level, challenge, completed);

      if (!completed) {
        const region = root.querySelector("[data-answer-input-region]");
        const field = createInputField(challenge.answerInput);
        region?.appendChild(field);
      }
    } else {
      ui.statePanel.innerHTML = buildSealedState();
    }
  };

  const renderLevel = (animate = false) => {
    if (!isUnlocked(activeLevelId)) {
      activeLevelId = getFirstOpenLevelId();
    }

    const level = getLevelById(activeLevelId);
    const challenge = getCurrentChallenge(level);
    const stepCount = getStepList(level).length;
    const stepIndex = getCurrentStepIndex(level);

    if (animate) {
      animatePanels();
    }

    ui.levelImage.src = level.image.src;
    ui.levelImage.alt = level.image.alt;
    ui.levelChapter.textContent = level.chapter;
    ui.levelKicker.textContent = level.kicker;
    ui.levelTitle.textContent = level.title;
    ui.questTitle.textContent = level.title;
    ui.progressCount.textContent = `${getCompletionCount()}/${data.totalArtifacts}`;
    ui.progressFill.style.width = `${(getCompletionCount() / data.totalArtifacts) * 100}%`;
    ui.levelPrompt.textContent =
      isUnlocked(level.id) && challenge
        ? challenge.prompt
        : "Dieses Kapitel ist noch nicht geoeffnet, aber seine Stimmung ist schon da.";
    ui.levelHelper.textContent =
      isUnlocked(level.id) && challenge
        ? challenge.helper
        : "Sobald das Kapitel freigeschaltet ist, erscheint hier die richtige Aufgabe samt passendem Antwortmodus.";

    ui.questCard.classList.toggle("is-level-complete", isCompleted(level.id));

    renderStatePanel(level);
    renderArtifactGrid();
    renderLevelList();
    renderFinale();
  };

  const openArtifactModal = (level) => {
    ui.modalTitle.textContent = level.reward.title;
    ui.modalCopy.textContent = level.reward.copy;
    ui.modalImage.src = level.image.src;
    ui.modalImage.alt = `${level.title} Reward Bild`;
    ui.modalChapter.textContent = level.chapter;
    ui.modalLetter.textContent = level.artifact.encryptedLetter;
    ui.modalArtifactNote.textContent =
      `Der Buchstabe ${level.artifact.encryptedLetter} wurde gerade freigeschaltet und liegt jetzt sicher in deinem Inventar.`;

    const nextLevelId = getNextLevelId(level.id);
    ui.advanceButton.textContent = isGameComplete()
      ? "Zur schlüsselkammer"
      : nextLevelId === level.id
        ? "Bei den Artefakten bleiben"
        : "Nächstes Kapitel";

    ui.modal.removeAttribute("hidden");
    ui.modal.hidden = false;
    ui.modal.style.display = "grid";
    ui.modal.style.opacity = "1";
    ui.modal.style.visibility = "visible";
    ui.modal.style.pointerEvents = "auto";
    ui.modal.scrollTop = 0;
    if (ui.modalPanel) {
      ui.modalPanel.scrollTop = 0;
    }
    ui.body.classList.add("is-modal-open");
    ui.modal.classList.add("is-open");
  };

  const closeArtifactModal = (advance = false) => {
    ui.modal.classList.remove("is-open");
    ui.body.classList.remove("is-modal-open");

    window.setTimeout(() => {
      ui.modal.setAttribute("hidden", "");
      ui.modal.hidden = true;
      ui.modal.style.display = "";
      ui.modal.style.opacity = "";
      ui.modal.style.visibility = "";
      ui.modal.style.pointerEvents = "";
    }, 480);

    if (advance) {
      window.setTimeout(() => {
        if (isGameComplete()) {
          scrollToFinale();
          return;
        }

        const nextLevelId = getNextLevelId(activeLevelId);

        if (nextLevelId !== activeLevelId) {
          activeLevelId = nextLevelId;
          renderLevel(true);
        }
      }, 180);
    } else {
      renderLevel();
    }
  };

  const completeLevel = (level) => {
    if (!isCompleted(level.id)) {
      state.completedLevelIds = [...state.completedLevelIds, level.id];
      delete state.stepProgressByLevel[level.id];
      saveState();
    }

    renderLevel();
    window.requestAnimationFrame(() => {
      openArtifactModal(level);
    });
  };

  let state = loadState();
  let activeLevelId = getFirstOpenLevelId();

  root.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-answer-form]");

    if (!form) {
      return;
    }

    event.preventDefault();

    const level = getLevelById(activeLevelId);
    const challenge = getCurrentChallenge(level);
    const field = root.querySelector("#dynamic-answer");
    const rawValue = field?.value ?? "";

    if (!challenge) {
      return;
    }

    if (validateAnswer(rawValue, challenge.validation)) {
      const currentStepIndex = getCurrentStepIndex(level);
      const stepList = getStepList(level);

      if (currentStepIndex < stepList.length - 1) {
        state.stepProgressByLevel[level.id] = currentStepIndex + 1;
        saveState();
        renderLevel();
        setFeedback(challenge.successMessage || "Richtig. Weiter geht's.", "success");
        root.querySelector("#dynamic-answer")?.focus();
        return;
      }

      completeLevel(level);
      return;
    }

    setFeedback(
      challenge.failureMessage || "Noch nicht ganz. Versuch es noch einmal.",
      "error",
    );
  });

  root.addEventListener("click", (event) => {
    const levelButton = event.target.closest("[data-level-id]");

    if (levelButton) {
      const targetLevelId = Number(levelButton.dataset.levelId);

      if (!isUnlocked(targetLevelId)) {
        setFeedback(
          "Dieses Level ist noch gesperrt. Schaffe zuerst das vorherige Level.",
          "info",
        );
        return;
      }

      activeLevelId = targetLevelId;
      renderLevel(true);
      return;
    }

    if (event.target.closest("[data-show-hint]")) {
      const hintCard = root.querySelector("[data-hint-card]");
      const hintButton = event.target.closest("[data-show-hint]");

      if (!hintCard) {
        return;
      }

      hintCard.hidden = !hintCard.hidden;
      hintButton.textContent = hintCard.hidden ? "Hinweis zeigen" : "Hinweis ausblenden";
      clearFeedback();
      return;
    }

    if (event.target.closest("[data-view-artifact]")) {
      const level = getLevelById(activeLevelId);

      if (isCompleted(level.id)) {
        openArtifactModal(level);
      } else {
        setFeedback("Das Artefakt erscheint erst, wenn du das Kapitel schaffst.", "info");
      }

      return;
    }

    if (event.target.closest("[data-go-next-level]")) {
      const nextLevelId = getNextLevelId(activeLevelId);

      if (nextLevelId !== activeLevelId) {
        activeLevelId = nextLevelId;
        renderLevel(true);
      }
    }
  });

  ui.keyForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    validateFinaleKey();
  });

  ui.decryptButton?.addEventListener("click", () => {
    runDecryptionSequence();
  });

  ui.openGiftButton?.addEventListener("click", () => {
    openGiftModal();
  });

  ui.modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-modal]")) {
      closeArtifactModal(false);
      return;
    }

    if (event.target.closest("[data-advance-level]")) {
      closeArtifactModal(true);
    }
  });

  ui.giftModal?.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-gift]")) {
      closeGiftModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !ui.modal.hidden) {
      closeArtifactModal(false);
    }

    if (event.key === "Escape" && ui.giftModal && !ui.giftModal.hidden) {
      closeGiftModal();
    }
  });

  ui.resetButton?.addEventListener("click", () => {
    const shouldReset = window.confirm(
      "Willst du den gesamten Fortschritt wirklich zuruecksetzen?",
    );

    if (!shouldReset) {
      return;
    }

    state = createDefaultState();
    saveState();
    activeLevelId = getFirstOpenLevelId();
    closeArtifactModal(false);
    closeGiftModal();
    renderLevel(true);
  });

  renderLevel();
};

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-ready");
  setupPageTransitions();
  setupReveal();

  if (document.body.classList.contains("page-home")) {
    setupHomeIntro();
  }

  if (document.body.classList.contains("page-explainer")) {
    createSparkles(".page-sparkles", charmSets.explainer);
  }

  if (document.body.classList.contains("page-game")) {
    createSparkles(".page-sparkles-game", charmSets.game);
  }

  setupGamePage();
});
