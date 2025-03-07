// timer.js
const timerDisplay = document.getElementById('timerDisplay');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');

const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const millisecondsInput = document.getElementById('milliseconds');

const progressCircle = document.getElementById('progressCircle');

let timerInterval;
let startTime;
let pausedTime = 0;
let isRunning = false;
let targetTimeMilliseconds = 0;

function updateDisplay(time) {
  const minutes = Math.floor(time / (60 * 1000));
  const seconds = Math.floor((time % (60 * 1000)) / 1000);
  const milliseconds = Math.floor((time % 1000) / 10);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  const formattedMilliseconds = String(milliseconds).padStart(2, '0');

  timerDisplay.textContent = `${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    startTime = Date.now() - pausedTime;
    timerInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      updateDisplay(elapsedTime);
      updateProgressBar(elapsedTime);

      if (targetTimeMilliseconds > 0 && elapsedTime >= targetTimeMilliseconds) {
        clearInterval(timerInterval);
        isRunning = false;
      }
    }, 10);
  }
}

function pauseTimer() {
  if (isRunning) {
    isRunning = false;
    clearInterval(timerInterval);
    pausedTime = Date.now() - startTime;
  }
}

function resetTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  pausedTime = 0;
  updateDisplay(0);
  updateProgressBar(0);
}

function setTargetTime() {
  const minutes = parseInt(minutesInput.value, 10) || 0;
  const seconds = parseInt(secondsInput.value, 10) || 0;
  const milliseconds = parseInt(millisecondsInput.value, 10) || 0;

  targetTimeMilliseconds = (minutes * 60 * 1000) + (seconds * 1000) + milliseconds * 10;
}

function updateProgressBar(elapsedTime) {
  if (targetTimeMilliseconds > 0) {
    const percentage = (elapsedTime / targetTimeMilliseconds) * 100;
    const circumference = 2 * Math.PI * 50; // Calculate circumference
    const offset = circumference - (percentage / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
  } else {
    progressCircle.style.strokeDashoffset = 314;
  }
}

minutesInput.addEventListener('change', setTargetTime);
secondsInput.addEventListener('change', setTargetTime);
millisecondsInput.addEventListener('change', setTargetTime);

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

updateDisplay(0);
setTargetTime();
updateProgressBar(0); // Initialize progress bar