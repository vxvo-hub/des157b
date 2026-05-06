(function(){
    'use strict';

    // add your script here
    var map = L.map('map').setView([38.554053, -121.756374], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    var circle = L.circle([38.554053, -121.756374], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map);

    var polygon = L.polygon([
        [38.554053, -121.756374],
        [38.542978, -121.762339],
        [38.53, -121.75]
    ]).addTo(map);

    var marker = L.marker([38.542978, -121.762339]).addTo(map);
    marker.bindPopup("<b>Hello world!</b><br>I am Vic's home.").openPopup();
    circle.bindPopup("I am a circle.");
    polygon.bindPopup("I am a polygon.");


}());