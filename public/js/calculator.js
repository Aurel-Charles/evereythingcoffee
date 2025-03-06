document.addEventListener("DOMContentLoaded", function () {
    let coffeeInput = document.getElementById("coffee");
    let waterInput = document.getElementById("water");
    let ratioInput = document.getElementById("ratio");
    let lockRatio = document.getElementById("lock-ratio");

    function updateValues(source) {
        let coffee = parseFloat(coffeeInput.value);
        let water = parseFloat(waterInput.value);
        let ratio = parseFloat(ratioInput.value);

        // Ensure valid numbers
        if (isNaN(coffee) || coffee <= 0) coffee = 0;
        if (isNaN(water) || water <= 0) water = 0;
        if (isNaN(ratio) || ratio <= 0) ratio = 15; // Default ratio

        if (lockRatio.checked) {
            // Disable ratio input when locked
            ratioInput.disabled = true;

            // Coffee updates Water
            if (source === coffeeInput && coffee > 0) {
                water = coffee * ratio;
                waterInput.value = water.toFixed(1); // 1 decimal place
            }
            // Water updates Coffee
            else if (source === waterInput && water > 0) {
                coffee = water / ratio;
                coffeeInput.value = coffee.toFixed(1); // 1 decimal place
            }
        } else {
            // Enable ratio input when unlocked
            ratioInput.disabled = false;

            // Coffee updates Water using ratio
            if (source === coffeeInput && coffee > 0) {
                water = coffee * ratio;
                waterInput.value = water.toFixed(1);
            }
            // Ratio changes, update Water
            else if (source === ratioInput && coffee > 0) {
                water = coffee * ratio;
                waterInput.value = water.toFixed(1);
            }
            // Changing Coffee & Water updates Ratio dynamically
            else if (coffee > 0 && water > 0) {
                ratio = water / coffee;
                ratioInput.value = ratio.toFixed(1); // 1 decimal place
            }
        }
    }

    function handleInput(event) {
        updateValues(event.target);
    }

    // Event Listeners
    coffeeInput.addEventListener("input", handleInput);
    waterInput.addEventListener("input", handleInput);
    ratioInput.addEventListener("input", handleInput);
    lockRatio.addEventListener("change", function () {
        updateValues(null);
    });
});
