const answers = ["f", "j"];
let currentFlash = null;
let flashCount = 0;
const totalFlashes = 10;
var flashes = [];

const feedback = document.getElementsByTagName("p")[0];

function waitForKeyPress() {
  return new Promise((resolve) => {
    const handler = (e) => {
      if (e.key === "f" || e.key === "j") {
        window.removeEventListener("keydown", handler);
        resolve(e.key);
      }
    };
    window.addEventListener("keydown", handler);
  });
}

function flashAndWait() {
  // All flashes are done, store info
  if (flashCount >= totalFlashes) {
    let time_after_flashes = new Date().getTime();
    window.__TAURI__.invoke("store", {
      code: null,
      timeAfterVideos: null,
      flashes: flashes,
      timeAfterFlashes: time_after_flashes
    });
    return;
  }

  // Wait for a random time between 1 and 3 seconds before flashing
  setTimeout(async () => {
    // clear feedback text
    feedback.innerText = "";

    // Pick a random side [0-1]
    let sideID = Math.floor(Math.random() * 2);
    let side = document.getElementById(sideID);

    // Flash the side
    side.style.visibility = "visible";
    setTimeout(() => {
      side.style.visibility = "hidden";
    }, 300);

    // Store the correct answer for this flash
    currentFlash = answers[sideID];

    // Store the time, and wait for user input
    let time_before_press = new Date().getTime();
    const userKey = await waitForKeyPress();
    let time_after_press = new Date().getTime();
    let right = userKey == currentFlash;

    flashes.push({
      "time": time_after_press - time_before_press,
      "right": right
    });

    // Display feedback
    if (right) {
      feedback.innerText = "Correct";
    }
    else {
      feedback.innerText = "Wrong";
    }

    flashCount++;
    flashAndWait(); // Repeat the process
  }, Math.random() * 2000 + 1000);
}

// Start the flash sequence
flashAndWait();
