(function(){
    'use strict';
    console.log('reading js');

    const fs = document.querySelector('.fa-expand');
    const mySection = document.querySelector('section');
    const line1 = document.querySelector('#line1');
    const line2 = document.querySelector('#line2');
    const myvideo = document.querySelector('#myVideo');

    const intervalID = setInterval(checkTime, 1000);

    fs.addEventListener('click', function() {
        if(!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    function checkTime(){
        if (1< myvideo.currentTime && myvideo.currentTime <12){
            line1.className = 'showing';
        } else {
            line1.className = 'hidden';
        }
        if (12< myvideo.currentTime && myvideo.currentTime <22){
            line2.className = 'showing';
        } else {
            line2.className = 'hidden';
        }
    }

    mySection.addEventListener('mouseenter', function(){
        if (line1.classList.contains('showing')) {
        myvideo.classList.add('yellow');
    }
    });

    mySection.addEventListener('mouseleave', function(){
        myvideo.classList.remove('yellow');
    });



})();