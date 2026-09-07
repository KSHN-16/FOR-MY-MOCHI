const screens = [...document.querySelectorAll(".screen")];
const dots = [...document.querySelectorAll(".progress-dot")];
let currentScreen = 0;

function goToScreen(index) {
  screens[currentScreen].classList.remove("active");
  currentScreen = index;
  screens[currentScreen].classList.add("active");
  dots.forEach((dot, i) => dot.classList.toggle("active-dot", i === currentScreen));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".next-btn").forEach((button) => {
  button.addEventListener("click", () => {
    if (currentScreen < screens.length - 1) goToScreen(currentScreen + 1);
  });
});

/* Cute loading dinosaur */
const loader = document.getElementById("loader");
const loadingFill = document.getElementById("loadingFill");
const loadingPercent = document.getElementById("loadingPercent");

let progress = 0;
const loadingTimer = setInterval(() => {
  progress += Math.floor(Math.random() * 8) + 3;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loadingTimer);
    setTimeout(() => loader.classList.add("hidden"), 450);
  }
  loadingFill.style.width = progress + "%";
  loadingPercent.textContent = progress + "%";
}, 110);

/* Music */
const music = document.getElementById("bgMusic");
const musicButton = document.getElementById("musicButton");
let musicStarted = false;

function startMusic() {
  if (!musicStarted) {
    music.volume = 0.25;
    music.play().then(() => {
      musicStarted = true;
      musicButton.textContent = "♫";
    }).catch(() => {});
  }
}

document.addEventListener("click", startMusic, { once: true });

musicButton.addEventListener("click", (event) => {
  event.stopPropagation();
  if (!music.src || music.currentSrc === "") {
    alert("Add a soft romantic MP3 named music.mp3 into the website folder to enable background music.");
    return;
  }
  if (music.paused) {
    music.play();
    musicStarted = true;
    musicButton.textContent = "♫";
  } else {
    music.pause();
    musicButton.textContent = "♪";
  }
});

/* Envelope — physically flip the flap open */
const envelope = document.getElementById("envelope");
const envelopeFlap = envelope.querySelector(".envelope-flap");
const hiddenMessage = document.getElementById("hiddenMessage");
const chapterTwoNext = document.querySelector('[data-screen="2"] .next-btn');

let dragStartY = null;
let isFlipping = false;
let envelopeOpened = false;

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;
  envelope.classList.remove("flipping");
  envelope.classList.add("open");
  hiddenMessage.classList.add("show");
  chapterTwoNext.classList.remove("locked");
}

function startFlip(clientY) {
  if (envelopeOpened) return;
  dragStartY = clientY;
  isFlipping = true;
  envelope.classList.add("flipping");
}

function moveFlip(clientY) {
  if (!isFlipping || envelopeOpened || dragStartY === null) return;

  const distance = dragStartY - clientY;
  const progress = Math.max(0, Math.min(distance / 90, 1));
  const angle = progress * 180;

  envelopeFlap.style.transform = `rotateX(${angle}deg)`;

  if (progress >= 1) {
    isFlipping = false;
    envelopeFlap.style.transform = "";
    openEnvelope();
  }
}

function endFlip() {
  if (!isFlipping || envelopeOpened) return;
  isFlipping = false;
  envelope.classList.remove("flipping");

  // If the user lets go before opening it fully, the flap gently closes.
  envelopeFlap.style.transform = "";
}

/* Mouse interaction */
envelopeFlap.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  envelopeFlap.setPointerCapture?.(event.pointerId);
  startFlip(event.clientY);
});

envelopeFlap.addEventListener("pointermove", (event) => {
  moveFlip(event.clientY);
});

envelopeFlap.addEventListener("pointerup", () => {
  endFlip();
});

envelopeFlap.addEventListener("pointercancel", () => {
  endFlip();
});

/* Keyboard accessibility */
envelopeFlap.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openEnvelope();
  }
});

/* Comfort messages — only begin after pushing the dinosaur's button */
const comfortMessages = [
  "I'm with you.",
  "Even when I'm not physically there.",
  "Even when you're having a bad day.",
  "You will never have to go through everything alone, My Mochi. ♥"
];

const comfortButton = document.getElementById("comfortButton");
const comfortText = document.getElementById("comfortText");
const comfortMessage = document.getElementById("comfortMessage");
const comfortArea = document.querySelector(".comfort-heart-area");
const chapterThreeNext = document.getElementById("chapterThreeNext");

let comfortIndex = 0;
let comfortStarted = false;

function showNextComfortMessage() {
  if (comfortIndex >= comfortMessages.length) {
    chapterThreeNext.classList.remove("locked");
    return;
  }

  comfortText.style.animation = "none";
  void comfortText.offsetWidth;

  comfortText.textContent = comfortMessages[comfortIndex];
  comfortText.style.animation = "fadeIn .7s ease both";
  comfortIndex++;

  if (comfortIndex >= comfortMessages.length) {
    setTimeout(() => {
      chapterThreeNext.classList.remove("locked");
    }, 700);
  }
}

comfortButton.addEventListener("click", () => {
  if (comfortStarted) return;

  comfortStarted = true;
  comfortArea.classList.add("pushed");
  comfortMessage.classList.remove("hidden-before-push");

  setTimeout(() => {
    showNextComfortMessage();

    const messageTimer = setInterval(() => {
      if (comfortIndex < comfortMessages.length) {
        showNextComfortMessage();
      } else {
        clearInterval(messageTimer);
      }
    }, 4200);
  }, 900);
});

/* Letter */
const openLetter = document.getElementById("openLetter");
const letter = document.getElementById("letter");
const endNote = document.getElementById("endNote");

openLetter.addEventListener("click", () => {
  openLetter.style.display = "none";
  letter.classList.add("show");
  endNote.classList.add("show");
});
