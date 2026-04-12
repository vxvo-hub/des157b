(function () {
    "use strict";
    console.log("reading js");

    const switchBtn = document.getElementById("switch");

    const body = document.querySelector('body');
    const beach = document.getElementById("beach");
    const garden = document.getElementById("garden");
    const farm = document.getElementById("farm");
    const concert = document.getElementById("concert");
    const top = document.getElementById("top");
    const toph1 = document.querySelector("#top h1");
    const container = document.getElementById("container");
    const photos = document.querySelectorAll("#banner img");
    const main = document.querySelector("main");
    const mainh3 = document.querySelectorAll("main h3");
    const a = document.querySelectorAll("a");
    const sectiona = document.querySelectorAll("section a");
    const btnIcon = document.querySelector("#switch img");
    
    let mode = "retro";
    
    switchBtn.addEventListener("click", function () {
        if(mode === "retro") {
        body.className = "switch";
        beach.src = 'images/beachclear.JPG';
        garden.src = 'images/gardenclear.JPG';
        farm.src = 'images/farmclear.JPG';
        concert.src = 'images/concertclear.JPG';
        top.className = "switch";
        toph1.className = "switch";
        container.className = "switch";
        photos.forEach(photo => photo.classList.add("switch"));
        main.classList.add("switch");
        mainh3.forEach(h3 => h3.classList.add("switch"));
        sectiona.forEach(a => a.classList.add("switch"));
        a.forEach(a => a.classList.add("switch"));
        btnIcon.src = 'icons/switchmodern.svg';
        switchBtn.className = "switch";
        mode = "modern";
    } else {
        body.removeAttribute("class");
        beach.src = 'images/beach.png';
        garden.src = 'images/garden.png';
        farm.src = 'images/farm.png';
        concert.src = 'images/concert.png';
        top.removeAttribute("class");
        toph1.removeAttribute("class");
        container.removeAttribute("class");
        photos.forEach(photo => photo.classList.remove("switch"));
        main.classList.remove("switch");
        mainh3.forEach(h3 => h3.classList.remove("switch"));
        sectiona.forEach(a => a.classList.remove("switch"));
        a.forEach(a => a.classList.remove("switch"));
        btnIcon.src = 'icons/switchretro.svg';
        switchBtn.removeAttribute("class");
        mode = "retro";
    }
    })

})();