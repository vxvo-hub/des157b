(function () {
    "use strict";

    // DATA

    const BLOCKS = [
        { id: "sleep", label: "Sleep & Rest", color: "#8b82d4", category: "sleep" },
        { id: "school", label: "Classes & School", color: "#5b9bd5", category: "growth" },
        { id: "study", label: "Study & Homework", color: "#dfd69a", category: "growth" },
        { id: "work", label: "Work", color: "#7ab648", category: "growth" },
        { id: "friends", label: "Social & Friends", color: "#f19bdd", category: "social" },
        { id: "gym", label: "Exercise & Health", color: "#4db894", category: "social" },
        { id: "meals", label: "Meals & Cooking", color: "#e8a020", category: "social" },
        { id: "scroll", label: "Social Media", color: "#e63022", category: "screen" }
    ];

    function getBlock(id) {
        return BLOCKS.find(b => b.id === id);
    }

    // STATE

    let idealSlots = new Array(24).fill(null);
    let currentSlots = new Array(24).fill(null);
    let activePhase  = 1;
    let requiredScreenHours = 0;

    const startScreen = document.getElementById("startScreen");
    const idealScreen = document.getElementById("idealScreen");
    const checkScreen = document.getElementById("checkScreen");
    const compareScreen = document.getElementById("compareScreen");


    // SCREEN SWITCHING

    function showScreen(el) {
        [startScreen, idealScreen, checkScreen, compareScreen].forEach(s => {
            s.classList.remove("onscreen");
            s.classList.add("offscreen");
        });
        el.classList.remove("offscreen");
        el.classList.add("onscreen");
        window.scrollTo(0, 0);
    }

    // BUILD PALETTE

    function buildPalette(includeScreen) {
        const $palette = $("#palette-ideal");
        $palette.empty();

        const list = includeScreen ? BLOCKS : BLOCKS.filter(b => b.id !== "scroll");

        list.forEach(b => {
            const $chip = $(`
                <div class="block-chip" data-id="${b.id}">
                    <div class="block-chip-dot" style="background:${b.color}"></div>
                    <span class="block-chip-label">${b.label}</span>
                </div>
            `);

            $palette.append($chip);

            // jQuery UI draggable with cloning & styling for dragging state

            $chip.draggable({
                helper: "clone",
                revert: "invalid",
                appendTo: "body",
                zIndex: 1000,
                cursor: "grabbing",
                opacity: 0.85,
                start: function () {
                    $("#timeline-wrapper-frame").addClass("is-dragging");
                },
                stop: function () {
                    $("#timeline-wrapper-frame").removeClass("is-dragging");
                    $("body > .block-chip").remove();
                }
            });
        });
    }

    // BUILD TIMELINE


    function buildTimeline() {
        const $timeline   = $("#timeline-ideal");
        const $labelRow   = $("#ideal-hour-labels");

        $timeline.empty();
        $labelRow.empty();

        for (let i = 0; i < 24; i++) {
            // Hour slot — the droppable target
            const $slot = $(`<div class="hour-slot" data-hour="${i}"></div>`);
            $timeline.append($slot);

            //  jQuery UI droppable 
            $slot.droppable({
                accept: ".block-chip",
                hoverClass: "drag-over",
                drop: function (event, ui) {
                    const blockId = ui.draggable.data("id");
                    const hour    = parseInt($(this).data("hour"), 10);

                    if (blockId && !isNaN(hour)) {
                        currentSlots[hour] = blockId;
                        renderTimeline();
                        updateStats();
                        checkCompletion();
                    }
                }
            });

            // Hour label beneath the slot
            let labelText = "";
            if (i % 4 === 0) {
                labelText = i === 0  ? "12 AM"
                    : i < 12 ? i + " AM"
                    : i === 12  ? "12 PM"
                    : (i - 12) + " PM";
            }
            $labelRow.append(`<div class="hour-label">${labelText}</div>`);
        }
    }

    // RENDER TIMELINE


    function renderTimeline() {
        const $timeline = $("#timeline-ideal");

        // remove old placed blocks but keep the hour slots
        $timeline.find(".placed-block").remove();

        let i = 0;
        while (i < 24) {
            if (currentSlots[i]) {
                const id  = currentSlots[i];
                let run = 1;
                while (i + run < 24 && currentSlots[i + run] === id) run++;

                const b = getBlock(id);
                // percentage for width
                const pct = 100 / 24;

                const label = run > 1
                    ? `<span class="placed-block-label">${b.label}</span>
                       <span class="placed-block-hrs">${run}h</span>`
                    : `<span class="placed-block-label" style="font-size:8px">
                           ${b.label.charAt(0)}
                       </span>`;

                const $block = $(`
                    <div class="placed-block"
                         title="${b.label} (${run}h) — click to remove"
                         data-start="${i}"
                         data-run="${run}">
                        ${label}
                    </div>
                `).css({
                    background: b.color,
                    left: (i * pct) + "%",
                    width: (run * pct) + "%"
                });

                // clears slots when clicked on
                $block.on("click", function () {
                    const start = parseInt($(this).data("start"), 10);
                    const len   = parseInt($(this).data("run"),   10);
                    for (let x = start; x < start + len; x++) {
                        currentSlots[x] = null;
                    }
                    renderTimeline();
                    updateStats();
                    checkCompletion();
                });

                $timeline.append($block);
                i += run;
            } else {
                i++;
            }
        }

        // Update hours badge
        const used = currentSlots.filter(s => s !== null).length;
        $("#ideal-hours-badge")
            .text(used + " / 24")
            .toggleClass("complete", used === 24);
    }

    // UPDATE STATS


    function updateStats() {
        let sleep = 0, growth = 0, social = 0, screen = 0;

        currentSlots.forEach(id => {
            if (!id) return;
            const b = getBlock(id);
            if (b.category === "sleep")  sleep++;
            if (b.category === "growth") growth++;
            if (b.category === "social") social++;
            if (b.category === "screen") screen++;
        });

        $("#stat-ideal-sleep").text(sleep   + "h");
        $("#stat-ideal-growth").text(growth + "h");
        $("#stat-ideal-social").text(social + "h");
        $("#stat-ideal-screen").text(screen + "h");
    }

    // CHECK COMPLETION + BUTTON LOCK

    function checkCompletion() {
        const used = currentSlots.filter(s => s !== null).length;
        const screen = currentSlots.filter(s => s === "scroll").length;
        const full = used === 24;
        const screenOk = screen >= requiredScreenHours;

        if (activePhase === 1) {
            if (full) {
                enableBtn("#ideal-next-btn");
                setHint("All 24 hours filled. Continue.", "#f5c842");
            } else {
                disableBtn("#ideal-next-btn");
                setHint((24 - used) + " hours remaining.", "#888");
            }
            // screen time required in phase 3
        } else if (activePhase === 3) {
            if (full && screenOk) {
                enableBtn("#ideal-next-btn");
                setHint("Screen time requirement met.", "#f5c842");
            } else if (!full) {
                disableBtn("#ideal-next-btn");
                setHint((24 - used) + " hours remaining.", "#888");
            } else {
                disableBtn("#ideal-next-btn");
                setHint("Add " + (requiredScreenHours - screen) + " more hour(s) of Social Media.", "#e63022");
            }
        }
    }

    function setHint(text, color) {
        $("#ideal-cta-hint").text(text).css("color", color);
    }

    function enableBtn(selector) {
        $(selector).prop("disabled", false);
    }

    function disableBtn(selector) {
        $(selector).prop("disabled", true);
    }

    // COMPARE SCREEN

    function buildCompareScreen() {

        function countCat(slots, cat) {
            return slots.filter(id => id && getBlock(id).category === cat).length;
        }

        // calculate values
        const idealSleep = countCat(idealSlots, "sleep");
        const realSleep = countCat(currentSlots, "sleep");
        const lostSleep = Math.max(0, idealSleep - realSleep);
        const screenHrs = countCat(currentSlots, "screen");
        const daysPerYear = Math.round((screenHrs * 365) / 24);
        const monthsDecade = Math.round((screenHrs * 3650) / 24 / 30);

        // animate stat numbers
        const daysObj = { val: 0 };
        anime({
            targets: daysObj,
            val: daysPerYear,
            duration: 1800,
            easing: "easeOutExpo",
            update: function () {
                $("#report-days-lost").text(Math.round(daysObj.val));
            }
        });

        const sleepObj = { val: 0 };
        anime({
            targets: sleepObj,
            val: lostSleep,
            duration: 1200,
            delay: 300,
            easing: "easeOutExpo",
            update: function () {
                $("#report-sleep-lost").text(Math.round(sleepObj.val));
            }
        });

        const monthsObj = { val: 0 };
        anime({
            targets: monthsObj,
            val: monthsDecade,
            duration: 1400,
            delay: 600,
            easing: "easeOutExpo",
            update: function () {
                $("#report-months-decade").text(Math.round(monthsObj.val));
            }
        });

        // build comparison bars
        buildCompareBars();

        // animate bars and stat cards
        anime({
            targets: ".compare-bar-fill",
            width: function (el) { return el.dataset.width; },
            duration: 900,
            delay: anime.stagger(60),
            easing: "easeOutQuart"
        });

        anime({
            targets: ".compare-stat-cell",
            opacity: [0, 1],
            translateY: [16, 0],
            delay: anime.stagger(120),
            duration: 500,
            easing: "easeOutQuad"
        });
    }

    function buildCompareBars() {
        const $idealBars = $("#compare-ideal-bars").empty();
        const $realityBars = $("#compare-reality-bars").empty();

        BLOCKS.forEach(function (b) {
            const idealH = idealSlots.filter(s => s === b.id).length;
            const realH = currentSlots.filter(s => s === b.id).length;
            if (idealH === 0 && realH === 0) return;

            const diff = realH - idealH;

            $idealBars.append(makeBar(b.label, idealH, b.color));
            $realityBars.append(makeBar(b.label, realH, b.color, diff));
        });
    }

    function makeBar(label, hours, color, diff = 0) {
        const pct = Math.round((hours / 24) * 100);

        const diffLabel = diff < 0
            ? `<span class="compare-bar-diff">${diff}h</span>`
            : ``;

        return $(`
            <div class="compare-bar-item">
                <div class="compare-bar-meta">
                    <span class="compare-bar-name">${label}</span>
                    <div class="compare-bar-right">
                        ${diffLabel}
                        <span class="compare-bar-val">${hours}h</span>
                    </div>
                </div>
                <div class="compare-bar-track">
                    <div class="compare-bar-fill"
                        style="width:0%; background:${color};"
                        data-width="${pct}%">
                    </div>
                </div>
            </div>
        `);
    }

    // BUTTON EVENTS w jQuery .on()

    // start to Ideal builder
    $("#startBtn").on("click", function () {
        showScreen(idealScreen);
        buildPalette(false);
        buildTimeline();
        renderTimeline();
        updateStats();
        checkCompletion();
    });

    // ideal next: phase 1 to checkScreen, phase 3 to compareScreen
    $("#ideal-next-btn").on("click", function () {
        if (activePhase === 1) {
            idealSlots = [...currentSlots];
            showScreen(checkScreen);
        } else if (activePhase === 3) {
            showScreen(compareScreen);
            buildCompareScreen();
        }
    });

    // clear timeline
    $("#ideal-clear-btn").on("click", function () {
        currentSlots.fill(null);
        renderTimeline();
        updateStats();
        checkCompletion();
    });

    // check screen to Reality phase
    $("#st-btn").on("click", function () {
        requiredScreenHours = parseInt($("#screentime-input").val(), 10) || 3;
        requiredScreenHours = Math.max(1, Math.min(16, requiredScreenHours));
        activePhase = 3;

        // start from saved
        currentSlots = [...idealSlots];

        // update UI text and styling for phase 3
        $("#phase-number").text("03");
        $("#phase-title").text("Your Reality");
        $("#builder-headline").text("NOW MAKE ROOM FOR IT").css("color", "#e63022");
        $("#builder-sub").html(
            "Your apps demand <strong>" + requiredScreenHours + " hours</strong> today. " +
            "Drag Social Media onto your timeline."
        );
        $("#timeline-wrapper-frame").css("border-color", "#e63022");
        $("#ideal-next-btn").text("See the difference →");

        // update phase dots
        $("#dot1").removeClass("active").addClass("done");
        $("#dot2").addClass("done");
        $("#dot3").addClass("active");

        // rebuild palette with Social Media chip included
        buildPalette(true);
        showScreen(idealScreen);
        buildTimeline();
        renderTimeline();
        updateStats();
        checkCompletion();
    });

    $("#restart-btn").on("click", function () {
        window.location.reload();
    });


})();