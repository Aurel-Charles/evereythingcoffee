document.addEventListener("DOMContentLoaded", function () {
    let startButton = document.getElementById("start-timer");
    let stopButton = document.getElementById("stop-timer");
    let resetButton = document.getElementById("reset-timer");
    let minutesInput = document.getElementById("minutes");
    let secondsInput = document.getElementById("seconds");
    let timeLeftDisplay = document.getElementById("time-left");
    let countdown;
    let timeRemaining = 0;  // Time in seconds
    let isTimerRunning = false;

    function startTimer() {
        if (isTimerRunning) return;

        let minutes = parseInt(minutesInput.value);
        let seconds = parseInt(secondsInput.value);
        
        // Convert minutes and seconds to total time in seconds
        timeRemaining = (minutes * 60) + seconds;
        isTimerRunning = true;

        countdown = setInterval(function () {
            if (timeRemaining <= 0) {
                clearInterval(countdown);
                isTimerRunning = false;
                alert("Time's up!");
                resetTimer();
            } else {
                let minutesLeft = Math.floor(timeRemaining / 60);
                let secondsLeft = timeRemaining % 60;
                timeLeftDisplay.textContent = `${minutesLeft.toString().padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`;
                timeRemaining--;
            }
        }, 1000);

        stopButton.disabled = false;
        startButton.disabled = true;
    }

    function stopTimer() {
        clearInterval(countdown);
        isTimerRunning = false;
        startButton.disabled = false;
        stopButton.disabled = true;
    }

    function resetTimer() {
        clearInterval(countdown);
        isTimerRunning = false;
        timeRemaining = 0;
        minutesInput.value = "4";  // Reset to default minutes
        secondsInput.value = "0";  // Reset to default seconds
        timeLeftDisplay.textContent = "00:00";
        startButton.disabled = false;
        stopButton.disabled = true;
    }

    // Event Listeners
    startButton.addEventListener("click", startTimer);
    stopButton.addEventListener("click", stopTimer);
    resetButton.addEventListener("click", resetTimer);
});
