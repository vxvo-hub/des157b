(function () {
    "use strict";
    console.log("reading js");

    const startBtn = document.getElementById("startBtn");
    const startscreen = document.getElementById("startscreen");
    const idealScreen = document.getElementById("idealScreen");
    const checkScreen = document.getElementById("checkScreen");

    const idealNextBtn = document.getElementById("ideal-next-btn");
    const stBtn = document.getElementById("st-btn");

    const screenTimeInput = document.getElementById("screentime-input");

    const screentimeDisplay = document.getElementById("screentime-display");
    let userScreenTime = 0;

    const testOverlay = document.getElementById("test-overlay");
    const closeOverlayBtn = document.getElementById("close-overlay-btn");

    closeOverlayBtn.addEventListener("click", function() {
        testOverlay.classList.add("hidden"); 
        console.log("Usability test started by user.");
    });

    // Your existing code below...
    startBtn.addEventListener("click", function() {
        startscreen.classList.add("offscreen");
        idealScreen.classList.remove("offscreen");
    });

    startBtn.addEventListener("click", function() {
        startscreen.classList.add("offscreen");
        idealScreen.classList.remove("offscreen");
    });

    idealNextBtn.addEventListener("click", function() {
        idealScreen.classList.add("offscreen");
        checkScreen.classList.remove("offscreen");
    });

    stBtn.addEventListener("click", function() {
        userScreenTime = screenTimeInput.value;
        checkScreen.classList.add("offscreen");
        idealScreen.classList.remove("offscreen");
        console.log("clicked st-btn");

        screentimeDisplay.textContent = "and " + userScreenTime + " hours of screen time";
        screentimeDisplay.classList.remove("offscreen");
    });
    

    

})();