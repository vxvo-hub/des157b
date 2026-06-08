(function () {
    "use strict";
    console.log("reading js");

    // Select buttons and elements with proper CSS syntax (# for IDs)
    const startBtn = document.querySelector("#startBtn");

    // Screens
    const startscreen = document.querySelector("#startscreen");
    const idealScreen = document.querySelector("#idealScreen");
    const checkScreen = document.querySelector("#checkScreen");

    // Buttons
    const idealNextBtn = document.querySelector("#ideal-next-btn");
    const stBtn = document.querySelector("#st-btn");
    const clearBtn = document.querySelector("#ideal-clear-btn");

    // Inputs, Displays, and Stats
    const screenTimeInput = document.querySelector("#screentime-input");
    const screentimeDisplay = document.querySelector("#screentime-display"); // Added '#'
    const screentimeStatCell = document.querySelector("#stat-ideal-screen");  // Added '#'
    
    let userScreenTime = 0;
    
    // Containers for Draggable
    const paletteContainer = document.querySelector('#palette-ideal');
    const timelineContainer = document.querySelector('#timeline-ideal');

    // --- Screen Transitions ---
    startBtn.addEventListener("click", function() {
        if (screentimeStatCell) {
            screentimeStatCell.classList.add("faded");
        }
        startscreen.classList.add("offscreen");
        idealScreen.classList.remove("offscreen");
    });

    idealNextBtn.addEventListener("click", function() {
        idealScreen.classList.add("offscreen");
        checkScreen.classList.remove("offscreen");
    });

    stBtn.addEventListener("click", function() {
        // 1. Grab the fresh value from the input first
        userScreenTime = screenTimeInput.value;

        // 2. Safely apply the properties now that the value is registered
        if (screentimeStatCell) {
            screentimeStatCell.classList.remove("faded");
            screentimeStatCell.textContent = userScreenTime + "h";
        }
        
        checkScreen.classList.add("offscreen");
        idealScreen.classList.remove("offscreen");
        console.log("clicked st-btn");

        if (screentimeDisplay) {
            screentimeDisplay.textContent = "and " + userScreenTime + " hours of screen time";
            screentimeDisplay.classList.remove("offscreen");
        }
    });

 // --- Drag and Drop Initialization with Cloning ---
    if (paletteContainer && timelineContainer) {
        
        // 1. Initialize Sortable on both containers
        const sortable = new Draggable.Sortable([paletteContainer, timelineContainer], {
            draggable: '.block-chip',
            mirror: {
                constrainDimensions: true,
            },
        });

        // 2. Corrected event listener structure using Shopify's native event properties
        sortable.on('sortable:start', (event) => {
            // Fix: Access the source element correctly via event.dragEvent.source
            const source = event.dragEvent.source;
            
            // Check if the item is originating from the palette container menu
            if (source && source.parentNode && source.parentNode.id === 'palette-ideal') {
                const clone = source.cloneNode(true); // Deep clone the block chip
                
                // Immediately put the clone back in the menu before the item moves
                source.parentNode.insertBefore(clone, source.nextSibling);
            }
        });

        // 3. Optional: Prevent duplicate tracking blocks if they drag a card backwards
        sortable.on('sortable:stop', (event) => {
            const currentContainer = event.newContainer || event.dragEvent.overContainer;
            
            if (currentContainer && currentContainer.id === 'palette-ideal') {
                // If they dropped it back into the menu, delete the moving card
                event.dragEvent.source.remove(); 
            } else {
                console.log("Block successfully scheduled into timeline!");
            }
        });
    }

    // --- Clear Button ---
    if (clearBtn) {
        clearBtn.addEventListener("click", function() {
            if (timelineContainer) {
                timelineContainer.innerHTML = '';
            }
            document.querySelector("#ideal-hours-badge").textContent = "0 / 24";
            document.querySelector("#stat-ideal-sleep").textContent = "0h";
            document.querySelector("#stat-ideal-growth").textContent = "0h";
            document.querySelector("#stat-ideal-social").textContent = "0h";
        });
    }

})();