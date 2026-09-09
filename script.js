const EVENT_DATE = new Date("2026-09-29T10:00:00+05:00").getTime();

const hero = document.getElementById("heroSection");
const sealBtn = document.getElementById("sealBtn");
const innerCard = document.getElementById("innerCard");

let isOpening = false;

/* =========================
   COUNTDOWN
========================= */

function pad(value) {
  return String(value).padStart(2, "0");
}

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


/* =========================
   OPEN SOUND
========================= */

function playOpenChime() {
  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    const ctx = new AudioContextClass();

    const master = ctx.createGain();

    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(
      0.055,
      ctx.currentTime + 0.05
    );
    master.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + 1.5
    );

    master.connect(ctx.destination);

    const notes = [392, 523.25, 659.25, 783.99];

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const start = ctx.currentTime + index * 0.08;

      osc.type = "sine";
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(
        0.14,
        start + 0.05
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        start + 0.95
      );

      osc.connect(gain);
      gain.connect(master);

      osc.start(start);
      osc.stop(start + 1);
    });
  } catch (error) {
    console.log("Audio unavailable");
  }
}


/* =========================
   ENVELOPE OPEN SEQUENCE
========================= */

sealBtn.addEventListener(
  "click",
  () => {
    if (isOpening) return;

    isOpening = true;

    playOpenChime();

    // 0.0s — seal glow
    hero.classList.add("seal-on");

    // 0.18s — side ornaments light up
    setTimeout(() => {
      hero.classList.add("ornaments-on");
    }, 180);

    // 0.62s — strong warm light from inside
    setTimeout(() => {
      hero.classList.add("light-on");
    }, 620);

    // 1.15s — flap opens
    setTimeout(() => {
      hero.classList.add("open-envelope");
    }, 1150);

    // 1.75s — inner card rises
    setTimeout(() => {
      hero.classList.add("card-up");
    }, 1750);

    // 3.0s — fade hero slightly
    setTimeout(() => {
      hero.classList.add("hero-finish");
    }, 3000);

    // 3.55s — scroll to main content
    setTimeout(() => {
      const content = document.getElementById("contentSection");

      content.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 3550);
  },
  { once: true }
);


/* =========================
   MUSIC BUTTON
========================= */

const musicBtn = document.querySelector(".icon-btn");

musicBtn.addEventListener("click", () => {
  playOpenChime();
});


/* =========================
   MOBILE SAFETY
========================= */

window.addEventListener("orientationchange", () => {
  window.scrollTo(0, window.scrollY);
});