document.addEventListener("DOMContentLoaded", function () {
    const brewMethods = document.querySelectorAll(".brew-method");

    brewMethods.forEach((method) => {
        method.addEventListener("mouseenter", function () {
            const textElement = method.querySelector("text");
            if (textElement) {
                const methodName = textElement.textContent.trim();
                displayGrindInfo(methodName);
            }
        });

        method.addEventListener("mouseleave", function () {
            hideGrindInfo();
        });
    });

    function displayGrindInfo(method) {
        const descriptionBox = document.getElementById("grind-description");

        const descriptions = {
            "French Press": "Coarse grind (1000µ) for full-bodied flavor.",
            "Cold Brew": "Extra-coarse grind (1000µ+) for slow extraction.",
            "Chemex": "Medium-coarse grind (800µ) for a clean cup.",
            "Pour-Over": "Medium grind (600µ) for balanced extraction.",
            "AeroPress": "Medium to medium-fine grind (600-400µ) for versatility.",
            "Moka Pot": "Medium-fine grind (400µ) for strong espresso-like coffee.",
            "Espresso": "Fine grind (200µ) for high-pressure extraction.",
        };

        if (descriptions[method]) {
            descriptionBox.textContent = descriptions[method];
        } else {
            descriptionBox.textContent = "Hover over a brew method to see details.";
        }
    }

    function hideGrindInfo() {
        document.getElementById("grind-description").textContent = "Hover over a brew method to see details.";
    }
});
