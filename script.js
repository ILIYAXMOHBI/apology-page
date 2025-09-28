// Elements
const forgiveBtn = document.getElementById("forgiveBtn");
const noBtn = document.getElementById("noBtn");
const memoryBtn = document.getElementById("memoryBtn");
const noteBtn = document.getElementById("noteBtn");

const message = document.getElementById("message");
const hiddenNote = document.getElementById("hiddenNote");
const memoryVideo = document.getElementById("memoryVideo");

const heartsLayer = document.querySelector(".hearts");
const fxLayer = document.getElementById("fx-layer");

// small helper
function randomPick(arr) {
  return arr[(Math.random() * arr.length) | 0];
}

/* -------------------------------------------------------
   1) Gentle floating hearts background (always visible)
   - uses .float-heart elements
   - they start at bottom (top:100%) and float up (CSS handles animation)
------------------------------------------------------- */
createFloatingHearts(24);
function createFloatingHearts(count = 20) {
  const vw = window.innerWidth;
  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.className = "float-heart";
    span.textContent = randomPick(["💗", "💖", "💞", "💕", "💘", "💝"]);

    const size = 14 + Math.random() * 16; // 14–30px
    const left = Math.random() * vw; // start X position
    const duration = 12 + Math.random() * 16; // 12–28s
    const delay = Math.random() * 8; // 0–8s
    const drift = (Math.random() * 2 - 1) * 60; // -60..+60px

    span.style.left = `${left}px`;
    span.style.fontSize = `${size}px`;
    span.style.animationDuration = `${duration}s`;
    span.style.animationDelay = `${delay}s`;
    span.style.setProperty("--drift", `${drift}px`);

    // when the animation finishes we slightly reseed to keep a loop-like behavior
    span.addEventListener("animationend", () => {
      // reposition at bottom to re-float
      span.style.left = `${Math.random() * vw}px`;
      span.style.animationDuration = `${12 + Math.random() * 16}s`;
      span.style.animationDelay = `${Math.random() * 8}s`;
      // push it back to bottom
      span.style.top = "100%";
      // re-trigger animation (force reflow then leave to CSS)
      void span.offsetWidth;
      span.style.animationName = "floatUpFloat";
    });

    heartsLayer.appendChild(span);
  }
}

/* -------------------------------------------------------
   2) Action particles: hearts rain when buttons clicked
   - spawn from near top of viewport so they are visible immediately
------------------------------------------------------- */
function spawnHearts({
  count = 30,
  emojiList = ["💖", "💗", "💞"],
  minSize = 16,
  maxSize = 34,
  minFall = 2.2,
  maxFall = 4.8,
} = {}) {
  const vw = window.innerWidth;
  for (let i = 0; i < count; i++) {
    const h = document.createElement("span");
    h.className = "fx-item";
    h.textContent = randomPick(emojiList);

    const x = Math.random() * vw;
    const size = minSize + Math.random() * (maxSize - minSize);
    const fall = minFall + Math.random() * (maxFall - minFall);
    const delay = Math.random() * 0.6;

    // start slightly inside viewport (random small offset)
    const startTop = -10 + Math.random() * 30; // range -10..20 px
    h.style.left = `${x}px`;
    h.style.top = `${startTop}px`;
    h.style.fontSize = `${size}px`;
    h.style.animationDuration = `${fall}s`;
    h.style.animationDelay = `${delay}s`;

    fxLayer.appendChild(h);
    h.addEventListener("animationend", () => h.remove());
  }
}

/* -------------------------------------------------------
   3) Button behaviors
------------------------------------------------------- */

// YES -> sweet message + soft heart rain
forgiveBtn?.addEventListener("click", () => {
  message.textContent =
    "Thank you for forgiving me! 💖 I’ll do better—let’s write our happiest chapter together.";
  document.body.classList.remove("heartbreak");
  spawnHearts({
    count: 18,
    emojiList: ["💖", "💗", "💞", "💘"],
    minSize: 18,
    maxSize: 40,
    minFall: 2.6,
    maxFall: 5.2,
  });
});

// NO -> broken hearts rain + subtle vignette + goodbye text
noBtn?.addEventListener("click", () => {
  const goodbye =
    noBtn.dataset.noMessage ||
    "I understand… 💔 Wishing you peace and happiness.";
  message.textContent = goodbye;
  document.body.classList.add("heartbreak");
  spawnHearts({
    count: 42,
    emojiList: ["💔", "🖤"],
    minSize: 18,
    maxSize: 42,
    minFall: 2.0,
    maxFall: 4.0,
  });
});

// Play / pause memory video
memoryBtn?.addEventListener("click", () => {
  if (!memoryVideo) return;
  const isHidden = memoryVideo.hasAttribute("hidden");
  if (isHidden) {
    memoryVideo.removeAttribute("hidden");
    memoryVideo.play().catch(() => {
      /* autoplay might be blocked by browser */
    });
  } else {
    memoryVideo.pause();
    memoryVideo.setAttribute("hidden", "");
  }
});

// Toggle hidden Persian note
noteBtn?.addEventListener("click", () => {
  if (!hiddenNote) return;
  if (hiddenNote.hasAttribute("hidden")) {
    hiddenNote.removeAttribute("hidden");
    message.textContent = "Shhh… a note from my heart 💌";
    spawnHearts({
      count: 12,
      emojiList: ["💌", "💖", "💕"],
      minSize: 16,
      maxSize: 34,
    });
  } else {
    hiddenNote.setAttribute("hidden", "");
    message.textContent = "";
  }
});
