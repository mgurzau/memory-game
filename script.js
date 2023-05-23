"use strict";

//Initial conditions
let gamePlaying = 0; //the game can only run after "new game" button is clicked
let click = 0;
let sequence = [];

//////////////////////////////////////////
//Sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//////////////////////////////////////////
// Start new game:

//1. Generating random sequence
function newGame() {
  gamePlaying = 1;
  click = 0;
  sequence.length = 0;

  for (let i = 0; i < levelValue; i++) {
    sequence[i] = Math.trunc(Math.random() * 16) + 1;
  }
  //console.log(sequence);
}

//2. Displaying generated sequence
async function displaySequence() {
  //2.1. Make square magenta
  for (let i = 0; i < levelValue; i++) {
    //Make square magenta
    document.getElementById(`sq${sequence[i]}`).style.backgroundColor =
      "magenta";
    document.getElementById(`sq${sequence[i]}`).style.scale = 1.1;

    await sleep(250);

    //2.2. Make square back to blue
    document.getElementById(`sq${sequence[i]}`).style.backgroundColor =
      "#1862b8";
    document.getElementById(`sq${sequence[i]}`).style.scale = 1;

    await sleep(250);
  }
}

//1+2. NEW GAME button:
document.querySelector(".start").addEventListener("click", function () {
  gamePlaying = true;
  newGame();
  displaySequence();
  console.log(gamePlaying);
});

//////////////////////////////////////////
//3. Recreating sequence by user
//3.1 Display correct squares
async function correct(id) {
  //3.1.1. Make correct square green
  document.getElementById(id).style.backgroundColor = "green";
  document.getElementById(id).style.scale = 1.1;

  await sleep(250);

  //3.1.2. Make correct square back to blue
  document.getElementById(id).style.backgroundColor = "#1862b8";
  document.getElementById(id).style.scale = 1;

  await sleep(250);
}

//3.2. Display wrong square
async function wrong(id) {
  //3.2.1. Make wrong square red
  document.getElementById(id).style.backgroundColor = "red";
  document.getElementById(id).style.scale = 1.1;

  await sleep(250);

  document.getElementById(id).style.scale = 1;
}

//3.3. Game Lost-> Make correct square green (x5)
async function gameLost(id) {
  await sleep(250);

  for (let i = 0; i < 5; i++) {
    document.getElementById(`sq${id}`).style.backgroundColor = "green";
    document.getElementById(`sq${id}`).style.scale = 1.1;

    await sleep(100);

    //3.3.1. Make correct square back to blue
    document.getElementById(`sq${id}`).style.backgroundColor = "#1862b8";
    document.getElementById(`sq${id}`).style.scale = 1;

    await sleep(100);
  }
  await 2000;
}

//3.4. Make all squares back to blue
async function stop() {
  await sleep(1500);
  const allSquares = document.querySelectorAll(".sq");
  for (let square of allSquares) {
    square.style.backgroundColor = "#1862b8";
  }
}

//////////////////////////////////////////
//Level slider
const slider = document.getElementById("level-select");
const output = document.getElementById("level-diplay");
let levelValue = 5; //default value
document.getElementById("level-display").textContent = `Level: ${levelValue}`;

slider.oninput = function () {
  levelValue = this.value;
  document.getElementById("level-display").textContent = `Level: ${levelValue}`;
};

//////////////////////////////////////////
// Win and Lose windows
const win = document.querySelector(".win");
const lose = document.querySelector(".lose");

const btnCloseWin = document.querySelector(".close-win");
const btnCloseLose = document.querySelector(".close-lose");

const openWin = async function () {
  await sleep(250);
  win.classList.remove("hidden");
};

const openLose = async function () {
  await sleep(1500);
  lose.classList.remove("hidden");
};

const closeWin = function () {
  win.classList.add("hidden");
};
const closeLose = function () {
  lose.classList.add("hidden");
};

btnCloseWin.addEventListener("click", closeWin);
btnCloseLose.addEventListener("click", closeLose);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !win.classList.contains("hidden")) {
    closeWin();
  }
  if (e.key === "Escape" && !lose.classList.contains("hidden")) {
    closeLose();
  }
});

//////////////////////////////////////////
//Game logic
const allSquares = document.querySelectorAll(".sq");

for (let square of allSquares) {
  square.addEventListener("click", function () {
    let idNumber = (this.id + "").slice(2); //converting id to string and getting the number at the end

    if (idNumber == sequence[click]) {
      click++;
      correct(this.id);
      if (click === sequence.length) {
        openWin();
        gamePlaying = 0;
      }
    } else if (gamePlaying === 1 && idNumber != sequence[click]) {
      wrong(this.id);
      gameLost(sequence[click]);
      stop();
      openLose();
      gamePlaying = 0;
    }
  });
}
