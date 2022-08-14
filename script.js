// DOM Element 

const time = document.querySelectorAll(".time");
const overlay = document.querySelector(".timer_wrapper");
const custom = document.querySelector("#custom");
const start = document.querySelector(".submit");
const white = document.querySelector(".white");
const black = document.querySelector(".black");
const options = document.querySelector(".options_wrapper");

// Script Variables

let matchTime = 0;
let incre = 0;
let chance = true;
let first = true;
let details = [];
let paused = false;
let timerInterval = undefined;

// Functions

const setTime = e => {
  time.forEach(timeItem => {
    timeItem.classList.remove("active");
  });
  e.target.classList.add("active");
  details = e.target.textContent.split("+");
};
const setCustomTime = () => {
  setTimeout(() => {
    time.forEach(timeItem => {
      timeItem.classList.remove("active");
    });
    details = custom.value.split("+");
  }, 100);
};
const startTime = () => {
  if (typeof details[0] === "undefined" || typeof details[1] === "undefined") {
    alert("Please select a time");
  } else {
    overlay.classList.add("none");
    matchTime = +details[0];
    incre = +details[1];
    populateUI();
  }
};
const populateUI = () => {
  let timer = document.querySelectorAll(".timer");
  options.classList.remove("none");
  timer.forEach(time => {
    time.querySelector(".min").textContent = String(matchTime).padStart(2, "0");
    time.querySelector(".sec").textContent = String(incre).padStart(2, "0");
    time.querySelector(".incr").textContent = "+" + incre;
  });
  listenEvents();
};
const decreaseTime = e => {
  e.classList.add("chance");
  checkSec(e);
  timerInterval = setInterval(() => {
    checkSec(e);
    e.querySelector(".sec").textContent = String(
      +e.querySelector(".sec").textContent - 1
    ).padStart(2, "0");
    checkTimeEnd(e);
  }, 1000);
};
const checkTimeEnd = e => {
  if (
    e.querySelector(".min").textContent == 0 &&
    e.querySelector(".sec").textContent == 0
  ) {
    e.classList.add("end");
    clearInterval(timerInterval);
    document.removeEventListener("keypress", fireSpaceTime);
    document.removeEventListener("click", fireMouseTime);
    setTimeout(() => {
      overlay.classList.remove("none");
      e.classList.remove("end");
      e.classList.remove("chance");
      options.classList.add("none")
    }, 5000);
  }
};
const increaseTime = e => {
  e.classList.remove("chance");
  e.querySelector(".sec").textContent = String(
    +e.querySelector(".sec").textContent + +incre
  ).padStart(2, "0");
  checkSec(e);
};
const listenEvents = () => {
  document.addEventListener("keypress", fireSpaceTime);
  setTimeout(() => {
    document.addEventListener("click", fireMouseTime, true);
  }, 100);
};
const fireSpaceTime = e => {
  setTimeout(() => {
    if (e.key === " ") {
      fireTime();
    } else if(e.key == "p"){
      pauseTime()
    }
  }, 100);
};
const fireMouseTime = e => {
  e.preventDefault();
  fireTime();
};
const fireTime = () => {
  white.classList.add("chance");
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  if (chance) {
    if (!first) {
      increaseTime(black);
    }
    first = false;
    decreaseTime(white);
  } else {
    decreaseTime(black);
    increaseTime(white);
  }
  chance = !chance;
};
const pauseTime = () => {
  if (paused) {
    options.children[0].innerHTML = "II"
    white.classList.add("chance")
    black.classList.add("chance")
    chance = !chance
    fireTime()
  } else{
    options.children[0].innerHTML = "&triangleright;"
    white.classList.remove("chance")
    black.classList.remove("chance")
    clearInterval(timerInterval);
  }
  paused = !paused
};
const checkSec = e => {
  if (+e.querySelector(".sec").textContent == 0) {
    e.querySelector(".min").textContent = String(
      +e.querySelector(".min").textContent - 1
    ).padStart(2, "0");
    e.querySelector(".sec").textContent = 59;
  }
  if (+e.querySelector(".sec").textContent >= 60) {
    e.querySelector(".min").textContent = String(
      +e.querySelector(".min").textContent + 1
    ).padStart(2, "0");
    e.querySelector(".sec").textContent = String(
      +e.querySelector(".sec").textContent - 60
    ).padStart(2, "0");
  }
};
const resetTime = () => {
  pauseTime()
  let timer = document.querySelectorAll(".timer");
  timer.forEach(time => {
    time.querySelector(".min").textContent = String(matchTime).padStart(2, "0");
    time.querySelector(".sec").textContent = String(incre).padStart(2, "0");
    time.querySelector(".incr").textContent = "+" + incre;
  });
};

// Event Listeners

time.forEach(timeItem => {
  timeItem.addEventListener("click", setTime);
});
custom.addEventListener("keypress", setCustomTime);
start.addEventListener("click", startTime);
document.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    startTime();
  }
});
options.children[0].addEventListener("click", pauseTime);
options.children[1].addEventListener("click", resetTime);