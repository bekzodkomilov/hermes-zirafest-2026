const EVENT_DATE =
  new Date(
    "2026-09-29T10:00:00+05:00"
  ).getTime();


const body =
  document.body;

const cover =
  document.getElementById("cover");

const openBtn =
  document.getElementById("openBtn");

const musicBtn =
  document.getElementById("musicBtn");

const bottomNav =
  document.getElementById("bottomNav");

const reveals =
  document.querySelectorAll(".reveal");


let opened = false;


/* =========================
   COUNTDOWN
========================= */

function pad(value) {
  return String(value).padStart(2, "0");
}


function updateCountdown() {

  let distance =
    EVENT_DATE - Date.now();


  if (distance < 0) {
    distance = 0;
  }


  const days =
    Math.floor(
      distance / 86400000
    );


  const hours =
    Math.floor(
      (distance % 86400000)
      / 3600000
    );


  const minutes =
    Math.floor(
      (distance % 3600000)
      / 60000
    );


  const seconds =
    Math.floor(
      (distance % 60000)
      / 1000
    );


  document.getElementById(
    "days"
  ).textContent = pad(days);


  document.getElementById(
    "hours"
  ).textContent = pad(hours);


  document.getElementById(
    "minutes"
  ).textContent = pad(minutes);


  document.getElementById(
    "seconds"
  ).textContent = pad(seconds);

}


updateCountdown();

setInterval(
  updateCountdown,
  1000
);


/* =========================
   OPEN SOUND
========================= */

function playOpenSound() {

  try {

    const AC =
      window.AudioContext ||
      window.webkitAudioContext;


    const ctx =
      new AC();


    const master =
      ctx.createGain();


    master.gain.setValueAtTime(
      0.0001,
      ctx.currentTime
    );


    master.gain.exponentialRampToValueAtTime(
      0.06,
      ctx.currentTime + 0.06
    );


    master.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + 1.6
    );


    master.connect(
      ctx.destination
    );


    const notes = [
      392.0,
      523.25,
      659.25,
      783.99
    ];


    notes.forEach(
      (frequency, index) => {

        const osc =
          ctx.createOscillator();

        const gain =
          ctx.createGain();


        osc.type = "sine";

        osc.frequency.value =
          frequency;


        const start =
          ctx.currentTime +
          index * 0.09;


        gain.gain.setValueAtTime(
          0.0001,
          start
        );


        gain.gain.exponentialRampToValueAtTime(
          0.13,
          start + 0.05
        );


        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          start + 1
        );


        osc.connect(gain);

        gain.connect(master);


        osc.start(start);

        osc.stop(
          start + 1.1
        );

      }
    );

  }

  catch (error) {
    console.log(error);
  }

}


/* =========================
   ENVELOPE OPENING
========================= */

openBtn.addEventListener(
  "click",
  () => {

    if (opened) return;

    opened = true;


    playOpenSound();


    /*
      0.0s
      seal pulse
    */
    cover.classList.add(
      "seal-active"
    );


    /*
      0.18s
      flowers start glowing
    */
    setTimeout(
      () => {

        cover.classList.add(
          "glow-flower"
        );

      },
      180
    );


    /*
      0.65s
      warm light from inside
    */
    setTimeout(
      () => {

        cover.classList.add(
          "light-on"
        );

      },
      650
    );


    /*
      1.20s
      flap opens
    */
    setTimeout(
      () => {

        cover.classList.add(
          "open-envelope"
        );

      },
      1200
    );


    /*
      1.85s
      invitation card rises
    */
    setTimeout(
      () => {

        cover.classList.add(
          "letter-up"
        );

      },
      1850
    );


    /*
      3.25s
      main page starts
    */
    setTimeout(
      () => {

        body.classList.add(
          "opened"
        );


        window.scrollTo(
          0,
          0
        );


        revealElements();

      },
      3250
    );


    /*
      3.55s
      cover disappears
    */
    setTimeout(
      () => {

        cover.classList.add(
          "hide"
        );

      },
      3550
    );

  },
  { once: true }
);


/* =========================
   SCROLL REVEAL
========================= */

function revealElements() {

  reveals.forEach(
    element => {

      const rect =
        element.getBoundingClientRect();


      if (
        rect.top <
        window.innerHeight - 50
      ) {

        element.classList.add(
          "visible"
        );

      }

    }
  );

}


/* =========================
   SCROLL
========================= */

window.addEventListener(
  "scroll",
  () => {

    revealElements();


    if (
      body.classList.contains(
        "opened"
      )
      &&
      window.scrollY > 120
    ) {

      bottomNav.classList.add(
        "show"
      );

    }

    else {

      bottomNav.classList.remove(
        "show"
      );

    }

  },
  {
    passive: true
  }
);


/* =========================
   MUSIC BUTTON
========================= */

musicBtn.addEventListener(
  "click",
  () => {

    playOpenSound();

  }
);