document.addEventListener("DOMContentLoaded", () => {
    const ratioInput = document.getElementById("ratio");
    const coffeeInput = document.getElementById("coffee-amount");
    const waterInput = document.getElementById("water-amount");
    const brewTimeMinutes = document.getElementById("brew-time-minutes");
    const brewTimeSeconds = document.getElementById("brew-time-seconds");
    const bloomTimeInput = document.getElementById("bloom-time");
    const pourStepsInput = document.getElementById("pour-steps");
    const startButton = document.getElementById("start-timer");
    const resetButton = document.getElementById("reset-timer");
    const savedRecipeSelect = document.getElementById("saved-recipe-timer");
    const deleteRecipeButton = document.getElementById("delete-timer-recipe");
    const timerText = document.getElementById("timer-text");
    const brewStepText = document.getElementById("brew-step");
    const progressCircle = document.getElementById("progress-circle");
    const pourStepsContainer = document.getElementById("pour-steps-container");

    let totalTime = 0;
    let elapsedTime = 0;
    let pourSteps = [];
    let timerInterval;
    let pourTimerInterval;
    let currentPourStepIndex = 0;
    let currentPourTime = 0;

    // Function to update coffee & water amounts dynamically
    function updateAmounts() {
        const ratio = ratioInput.value.split(":").map(Number);
        if (coffeeInput.value) {
            waterInput.value = (coffeeInput.value * ratio[1] / ratio[0]).toFixed(1);
        } else if (waterInput.value) {
            coffeeInput.value = (waterInput.value * ratio[0] / ratio[1]).toFixed(1);
        }
    }

    // Event listeners for updating amounts when inputs change
    coffeeInput.addEventListener("input", updateAmounts);
    waterInput.addEventListener("input", updateAmounts);
    ratioInput.addEventListener("input", updateAmounts);

    // Function to load saved recipes
    function loadSavedRecipes() {
        savedRecipeSelect.innerHTML = '<option value="">-- Select a Recipe --</option>';
        const savedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];

        savedRecipes.forEach((recipe, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = recipe.name;
            savedRecipeSelect.appendChild(option);
        });
    }

    // Fill the timer form when a recipe is selected
    savedRecipeSelect.addEventListener("change", () => {
        const savedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
        const selectedRecipe = savedRecipes[savedRecipeSelect.value];

        if (selectedRecipe) {
            ratioInput.value = selectedRecipe.ratio;
            coffeeInput.value = selectedRecipe.coffeeAmount;
            waterInput.value = selectedRecipe.waterAmount;
            bloomTimeInput.value = selectedRecipe.bloomTime || 0;
            pourStepsInput.value = selectedRecipe.pourSteps || 1;

            // Split brew time into minutes and seconds
            const brewTime = selectedRecipe.brewTime || [0, 0];
            const minutes = brewTime[0]; // Brew time minutes
            const seconds = brewTime[1]; // Brew time seconds

            brewTimeMinutes.value = minutes;
            brewTimeSeconds.value = seconds;

            updateAmounts(); // Recalculate water when the recipe is loaded
            generatePourStepInputs(); // Regenerate the pour steps input fields
        }
    });

    // Delete a saved recipe
    deleteRecipeButton.addEventListener("click", () => {
        const savedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
        const selectedIndex = savedRecipeSelect.value;

        if (selectedIndex !== "") {
            savedRecipes.splice(selectedIndex, 1);
            localStorage.setItem("recipes", JSON.stringify(savedRecipes));
            loadSavedRecipes();
            alert("Recipe deleted!");
        } else {
            alert("Select a recipe to delete.");
        }
    });

    // Generate pour step input fields dynamically based on the number of steps
    function generatePourStepInputs() {
        const numSteps = parseInt(pourStepsInput.value) || 1;
        pourStepsContainer.innerHTML = ''; // Clear previous inputs

        for (let i = 0; i < numSteps; i++) {
            const stepDiv = document.createElement('div');
            stepDiv.innerHTML = `
                <label for="pour-time-${i + 1}">Pour Time for Step ${i + 1} (seconds):</label>
                <input type="number" id="pour-time-${i + 1}" min="1" value="45">
            `;
            pourStepsContainer.appendChild(stepDiv);
        }
    }

    // Update pour steps container when the number of pour steps changes
    pourStepsInput.addEventListener("input", generatePourStepInputs);

    // Function to start the Smart Brew Timer
    function startTimer() {
        clearInterval(timerInterval);
        elapsedTime = 0;
    
        const min = parseInt(brewTimeMinutes.value) || 0;
        const sec = parseInt(brewTimeSeconds.value) || 0;
        totalTime = min * 60 + sec;
    
        const bloomTime = parseInt(bloomTimeInput.value) || 0;
        const numSteps = parseInt(pourStepsInput.value) || 1;
        const totalWater = parseFloat(waterInput.value) || 0;
        const coffeeAmount = parseFloat(coffeeInput.value) || 0;
    
        if (totalTime <= 0 || totalWater <= 0 || coffeeAmount <= 0) {
            alert("Please set valid values for brew time, coffee, and water.");
            return;
        }
    
        // Reset water tracking
        let waterPoured = 0;
        document.getElementById("water-poured").textContent = "0";
        document.getElementById("water-target").textContent = totalWater;
    
        // Calculate bloom pour amount (2x coffee amount)
        const bloomWater = coffeeAmount * 2;
        const remainingWater = totalWater - bloomWater;
    
        if (remainingWater < 0) {
            alert("Error: Bloom water exceeds total water amount!");
            return;
        }
    
        let remainingTime = totalTime - bloomTime;
        pourSteps = [];
    
        // Bloom step
        pourSteps.push({ time: bloomTime, waterAmount: bloomWater, action: "Bloom Phase" });
    
        // Pouring steps
        for (let i = 0; i < numSteps; i++) {
            pourSteps.push({
                time: bloomTime + Math.round((remainingTime / numSteps) * (i + 1)),
                waterAmount: (remainingWater / numSteps).toFixed(1),
                action: `Pour Step ${i + 1}`,
            });
        }
    
        brewStepText.textContent = "Bloom Phase...";
        updateTimerDisplay();
    
        // Start countdown
        timerInterval = setInterval(() => {
            elapsedTime++;
            updateTimerDisplay();
    
            // Check if it's time for the next step
            const currentStep = pourSteps.find((step) => step.time === elapsedTime);
            if (currentStep) {
                brewStepText.textContent = `${currentStep.action}: Pour ${currentStep.waterAmount} ml`;
    
                // Update water tracking
                waterPoured += parseFloat(currentStep.waterAmount);
                document.getElementById("water-poured").textContent = waterPoured;
            }
    
            if (elapsedTime >= totalTime) {
                clearInterval(timerInterval);
                brewStepText.textContent = "Brew Complete!";
            }
        }, 1000);
    }
    

    // Update the timer display and progress circle
    function updateTimerDisplay() {
        const remainingTime = totalTime - elapsedTime;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerText.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        // Update progress circle
        const progress = (remainingTime / totalTime) * 565.48;
        progressCircle.style.strokeDashoffset = progress;
    }

    // Reset the timer
    function resetTimer() {
        clearInterval(timerInterval);
        clearInterval(pourTimerInterval);
        elapsedTime = 0;
        currentPourStepIndex = 0;
        brewStepText.textContent = "Waiting...";
        timerText.textContent = "00:00";
        progressCircle.style.strokeDashoffset = "565.48";
    }

    startButton.addEventListener("click", startTimer);
    resetButton.addEventListener("click", resetTimer);

    // Load saved recipes on page load
    loadSavedRecipes();
});
