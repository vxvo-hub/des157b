(function () {
    "use strict";
    console.log("reading js");

    const startBtn = document.getElementById("startBtn");
    const startscreen = document.getElementById("startscreen");
    const idealScreeen = document.getElementById("idealScreen");
    const checkScreen = document.getElementById("checkScreen");

    const idealNextBtn = document.getElementById("ideal-next-btn");

    startBtn.addEventListener("click", function() {
        startscreen.classList.add("offscreen");
        idealScreeen.classList.remove("offscreen");
    });

    idealNextBtn.addEventListener("click", function() {
        idealScreeen.classList.add("offscreen");
        checkScreen.classList.remove("offscreen");
    });

    

})();