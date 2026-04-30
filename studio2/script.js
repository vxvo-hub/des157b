(function () {
    "use strict";
    console.log("reading js");

    const numberOfReels = document.getElementById("reels");
    const dateRange = document.getElementById("date");
    const nextBtn = document.getElementById("next");
    const prevBtn = document.getElementById("prev");
    const prescription = document.getElementById("prescription");

    let data = []
    let currentIndex = 0;

    function updateDisplay() {
        const entry = data[currentIndex];
        numberOfReels.innerHTML = entry.reels_watched;
        dateRange.innerHTML = entry.period;
        prescription.innerHTML = getPrescription(entry.reels_watched);
        updateButtons();
    }

    function updateButtons() {
        if (currentIndex >= data.length - 1) {
            nextBtn.classList.add("disabled");
        } else {
            nextBtn.classList.remove("disabled");
        }

        if (currentIndex <= 0) {
            prevBtn.classList.add("disabled");
        } else {
            prevBtn.classList.remove("disabled");
        }
    }

    function getPrescription(reelsWatched) {
        if (reelsWatched < 50) {
            return "Healthy screen time. Keep it up!";
        } else if (reelsWatched < 100) {
            return "Consider a walk outside.";
        } else if (reelsWatched < 200) {
            return "Needs to touch grass and see friends";
        } else {
            return "Immediate grass touching required. Phone confiscated.";
        }
    }


    async function getData(){
        const myReels = await fetch('data/reels.json');
        const json = await myReels.json();
        data = json.data;
        console.log(data);
        updateDisplay();
    }

    nextBtn.addEventListener("click", function () {
        if (currentIndex < data.length - 1) {
            currentIndex++;
            updateDisplay();
        }
    });

    prevBtn.addEventListener("click", function () {
        if (currentIndex > 0) {
            currentIndex--;
            updateDisplay();
        }
    });

    getData();


})();