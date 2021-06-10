var map = L.map('map').fitWorld();

const worldMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

worldMap.addTo(map);

map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);

    if (e.latlng) {
        $.getJSON("./common/countries.geo.json", (data)=> {
            $.ajax(
                {
                    url: "./php/getCountryInfo.php",
                    type: "post",
                    dataType: "json",
                    data: {
                        lat: e.latlng.lat,
                        lng: e.latlng.lng
                    },
        
                    success: (res)=> {
                        if (res.status.name == "ok") {
                            country = res.data.results[0].components["ISO_3166-1_alpha-3"]
                            for (let i=0; i<data.features.length; i++) {
                                if (data.features[i].properties.ISO_A3 == country) {
                                    let countryBorder = data.features[i];
                                    L.geoJSON(countryBorder).addTo(map);
                                    break;
                                }
                            }
                        }
                    },
        
                    error: (err)=> {
                        console.log(err);
                    }
                }
            )
        })
    }
    
}

map.on('locationfound', onLocationFound);

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);