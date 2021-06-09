var map = L.map('map').fitWorld();

const worldMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
    tileSize: 512,
    zoomOffset: -1,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

worldMap.addTo(map);

map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);

    console.log(e.latlng)

    if (e.latlng) {
        $.getJSON("./common/countryBorders.geo.json", (obj)=> {
            console.log(obj)
            L.geoJSON(obj).addTo(map);
        })
    }
    
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);