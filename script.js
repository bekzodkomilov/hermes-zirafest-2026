const EVENT_DATE = new Date("2026-09-29T10:00:00+05:00").getTime();

const body = document.body;
const cover = document.getElementById("cover");
const openBtn = document.getElementById("openBtn");
const musicBtn = document.getElementById("musicBtn");
const bottomNav = document.getElementById("bottomNav");
const whiteTransition = document.getElementById("whiteTransition");
const revealEls = document.querySelectorAll(".reveal");

let opening = false;

function pad(n) { return String(n).padStart(2, "0"); }

function updateCountdown() {
  let diff = EVENT_DATE - Date.now();
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById("days").textContent = pad(days);
  document.getElementById("hours").textContent = pad(hours);
  document.getElementById("minutes").textContent = pad(minutes);
  document.getElementById("seconds").textContent = pad(seconds);
}
updateCountdown();
setInterval(updateCountdown, 1000);

function playOpenChime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 0.04);
    master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.15);
    master.connect(ctx.destination);

    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + i * 0.06;
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.11, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.75);
      osc.connect(gain);
      gain.connect(master);
      osc.start(start);
      osc.stop(start + 0.85);
    });
  } catch (_) {}
}

function revealOnScroll() {
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 40) el.classList.add("visible");
  });
}

openBtn.addEventListener("click", () => {
  if (opening) return;
  opening = true;

  playOpenChime();

  // 1) ONLY the side flowers wake up / glow.
  cover.classList.add("glow-flower");

  // 2) Then the envelope flap opens. No center light effect.
  setTimeout(() => {
    cover.classList.add("open-envelope");
  }, 620);

  // 3) After the flap movement, show a completely clean white screen.
  setTimeout(() => {
    whiteTransition.classList.add("show");
  }, 1480);

  // Hide the envelope behind the white screen and prepare the page.
  setTimeout(() => {
    cover.classList.add("hide");
    body.classList.add("opened");
    window.scrollTo(0, 0);
    revealOnScroll();
  }, 1580);

  // 4) Keep the white screen for ~1 second, then reveal the invitation.
  setTimeout(() => {
    whiteTransition.classList.remove("show");
  }, 2480);
}, { once: true });

musicBtn.addEventListener("click", playOpenChime);

window.addEventListener("scroll", () => {
  revealOnScroll();
  if (body.classList.contains("opened") && window.scrollY > 90) {
    bottomNav.classList.add("show");
  } else {
    bottomNav.classList.remove("show");
  }
}, { passive: true });
