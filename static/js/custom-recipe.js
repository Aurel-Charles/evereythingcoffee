document.addEventListener("DOMContentLoaded", () => {
    const brewMethodSelect = document.getElementById("brew-method");
    const ratioInput = document.getElementById("ratio");
    const coffeeAmountInput = document.getElementById("coffee-amount");
    const waterAmountInput = document.getElementById("water-amount");
    const brewTimeMinutesInput = document.getElementById("brew-time-minutes");
    const brewTimeSecondsInput = document.getElementById("brew-time-seconds");
    const grindSizeInput = document.getElementById("grind-size");
    const saveButton = document.getElementById("save-recipe");
    const recipeNameInput = document.getElementById("recipe-name");
    const savedRecipesList = document.getElementById("saved-recipes");

    // Default recipes for each brew method
    const defaultRecipes = {
        "french-press": { ratio: "1:15", brewTime: [4, 0], grindSize: "Coarse" },
        "pour-over": { ratio: "1:16", brewTime: [3, 0], grindSize: "Medium" },
        "espresso": { ratio: "1:2", brewTime: [0, 25], grindSize: "Fine" },
        "moka-pot": { ratio: "1:10", brewTime: [5, 0], grindSize: "Medium-Fine" },
        "aeropress": { ratio: "1:15", brewTime: [2, 0], grindSize: "Medium" },
    };

    // Load saved recipes from localStorage
    function loadSavedRecipes() {
        const savedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
        savedRecipesList.innerHTML = "";
        savedRecipes.forEach((recipe) => {
            const li = document.createElement("li");
            li.textContent = `${recipe.name} - ${recipe.method} | Ratio: ${recipe.ratio}, Time: ${recipe.brewTime[0]} min ${recipe.brewTime[1]} sec, Grind: ${recipe.grindSize}, Coffee: ${recipe.coffeeAmount}g, Water: ${recipe.waterAmount}ml`;
            savedRecipesList.appendChild(li);
        });
    }

    // Function to update coffee and water amounts dynamically
    function updateAmounts(changedInput) {
        const ratio = ratioInput.value;
        const [coffeeRatio, waterRatio] = ratio.split(":").map(Number);
        let coffeeAmount = parseFloat(coffeeAmountInput.value);
        let waterAmount = parseFloat(waterAmountInput.value);

        if (changedInput === "coffee" && !isNaN(coffeeAmount)) {
            waterAmountInput.value = ((coffeeAmount * waterRatio) / coffeeRatio).toFixed(1);
        } else if (changedInput === "water" && !isNaN(waterAmount)) {
            coffeeAmountInput.value = ((waterAmount * coffeeRatio) / waterRatio).toFixed(1);
        }
    }

    // When a brew method is selected, fill in suggested values
    brewMethodSelect.addEventListener("change", () => {
        const method = brewMethodSelect.value;
        if (method) {
            const { ratio, brewTime, grindSize } = defaultRecipes[method];
            ratioInput.value = ratio;
            brewTimeMinutesInput.value = brewTime[0]; // Set minutes
            brewTimeSecondsInput.value = brewTime[1]; // Set seconds
            grindSizeInput.value = grindSize;
            coffeeAmountInput.value = "";
            waterAmountInput.value = "";
        }
    });

    // Handle input changes dynamically
    coffeeAmountInput.addEventListener("input", () => updateAmounts("coffee"));
    waterAmountInput.addEventListener("input", () => updateAmounts("water"));
    ratioInput.addEventListener("input", () => updateAmounts());

    // Save the recipe to localStorage
    saveButton.addEventListener("click", () => {
        const name = recipeNameInput.value.trim();
        const method = brewMethodSelect.value;
        const ratio = ratioInput.value;
        const brewTime = [brewTimeMinutesInput.value, brewTimeSecondsInput.value]; // Store as [min, sec]
        const grindSize = grindSizeInput.value;
        const coffeeAmount = coffeeAmountInput.value;
        const waterAmount = waterAmountInput.value;

        if (name && method && coffeeAmount && waterAmount) {
            const savedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
            savedRecipes.push({ name, method, ratio, brewTime, grindSize, coffeeAmount, waterAmount });
            localStorage.setItem("recipes", JSON.stringify(savedRecipes));
            loadSavedRecipes(); // Reload the saved recipes list
            alert("Recipe saved successfully!");
        } else {
            alert("Please fill out all fields to save the recipe.");
        }
    });

    // Load the saved recipes on page load
    loadSavedRecipes();
});
