document.addEventListener("DOMContentLoaded", function () {
    const grindSelector = document.getElementById("grind-selector");
    const grindImage = document.getElementById("grind-image");
    const grindDescription = document.getElementById("grind-description");

    const grindSizes = {
        1: { image: "/images/grind-coarse.png", text: "Coarse grind is best for French press and cold brew." },
        2: { image: "/images/grind-medium-coarse.png", text: "Medium-coarse grind is ideal for Chemex and clever dripper." },
        3: { image: "/images/grind-medium.png", text: "Medium grind is perfect for drip coffee makers and pour-over." },
        4: { image: "/images/grind-medium-fine.png", text: "Medium-fine grind works well for AeroPress and Moka Pot." },
        5: { image: "/images/grind-fine.png", text: "Fine grind is best for espresso and Turkish coffee." }
    };

    function updateGrindInfo(value) {
        grindImage.src = grindSizes[value].image;
        grindDescription.textContent = grindSizes[value].text;
    }

    grindSelector.addEventListener("input", function () {
        updateGrindInfo(this.value);
    });

    // Set default grind info
    updateGrindInfo(grindSelector.value);
});
