(function () {
    "use strict";
    console.log("reading js");


    const startBtn = document.getElementById("startBtn");

    // screens
    const startscreen = document.getElementById("startscreen");
    const idealScreen = document.getElementById("idealScreen");
    const checkScreen = document.getElementById("checkScreen");

    // buttons
    const idealNextBtn = document.getElementById("ideal-next-btn");
    const stBtn = document.getElementById("st-btn");

    // input
    const screenTimeInput = document.getElementById("screentime-input");

    const screentimeDisplay = document.getElementById("screentime-display");
    let userScreenTime = 0;
    
    // draggable
    const containers = document.querySelectorAll('.palette-grid, .timeline');

    const screentimeStatCell = document.getElementById("stat-ideal-screen");

    startBtn.addEventListener("click", function() {
        screentimeStatCell.classList.add("faded");
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

    if (containers.length > 0) {
        const sortable = new Draggable.Sortable(containers, {
            draggable: '.block-chip', 
            mirror: {
                constrainDimensions: true, 
            },
    });

    // Optional: Log actions to see if it works!
    sortable.on('sortable:start', () => console.log('Started dragging!'));
    sortable.on('sortable:stop', () => console.log('Dropped the item!'));
}
    
    

})();