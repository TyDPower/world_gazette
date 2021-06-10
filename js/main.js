var map = L.map('map').fitWorld();

const worldMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
    tileSize: 512,
    zoomOffset: -1,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

worldMap.addTo(map);

var getCountryInfo = (lat, lang) => {

    $.ajax(

        {
            url: "../php/getCountryInfo.php",
            type: "post",
            dataType: "json",
            data: {
                lat: lat,
                lang: lang
            },

            success: (res)=> {

                let data = JSON.stringify(res);

                if (res.status.code == "ok") {
                    console.log("Success");
                    console.log(data)
                }
            },

            error: (err)=> {
                console.log(err);
            }
        }
    )
}

map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);

    if (e.latlng) {
        $.getJSON("./common/countryBorders.geo.json", (data)=> {




            for (let i=0; i<data.features.length; i++) {
                if (data.features[i].properties.iso_a2 == code) {
                    let countryBorder = data.features[i];
                    L.geoJSON(countryBorder).addTo(map)
                    break;
                }
            }

        })
    }
    
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);