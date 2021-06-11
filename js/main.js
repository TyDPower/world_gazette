//Initial World map tiles
var map = L.map('map').fitWorld();
const worldMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});
worldMap.addTo(map);

//Grab user location with marker and country select
map.locate({setView: true, maxZoom: 16});
const onLocationFound = (e) => {
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
const onLocationError = (e) => {
    alert(e.message);
}
map.on('locationerror', onLocationError);

//Select new country with html drop bow menu
$("#countryList").change(()=> {
    let countryCode = $("#countryList").val();
    let countryBorder;

    $.getJSON("./common/countries.geo.json", (data)=> {
        for (let i=0; i<data.features.length; i++) {
            if (data.features[i].properties.ISO_A3 == countryCode) {
                countryBorder = data.features[i];
                $(".leaflet-interactive")[1].remove();
                L.geoJSON(countryBorder).addTo(map);
                console.log(countryBorder.geometry.coordinates.length)

                for (let i=0; i<countryBorder.geometry.coordinates.length; i++) {
                    let coords = [countryBorder.geometry.coordinates[i]]
                    //console.log(coords)
                    let bounds = L.bounds(coords);
                    console.log(bounds.max.x + " " + bounds.max.y)
                }
                //map.panTo([-28.265682390146466, 23.9501953125]);
                //let bounds = L.bounds([1, 3], [4, 5], [9, 3], [1, 3], [1, 3]);
                //console.log(bounds);
                break;
            }
        }

        /*for (let i=0; i<data.features.length; i++) {
            for (let f=0; f<data.features[i].geometry.coordinates.length; f++) {
                console.log(i + " " + data.features[i].geometry.coordinates[f]);
            }
        }*/

    })

})