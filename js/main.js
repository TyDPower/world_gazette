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
//Garbage code, fix!
$("#countryList").change(()=> {
    var countryCode = $("#countryList").val();
    var countryBorder;
    var countryLoaded = false;
    var countryName;

    $.getJSON("./common/countries.geo.json", (data)=> {
        for (let i=0; i<data.features.length; i++) {
            if (data.features[i].properties.ISO_A3 == countryCode) {
                countryBorder = data.features[i];
                countryName = data.features[i].properties.ADMIN
                $(".leaflet-interactive")[1].remove();
                L.geoJSON(countryBorder).addTo(map);

                let boundsArray = countryBorder.geometry.coordinates
                let boundsShallowArray = [];
                let boundsDeepArray = [];

                boundsArray.forEach(res=> boundsShallowArray.push(res[0]))
                boundsShallowArray.forEach(res=> boundsDeepArray.push(res[0]))

                const ltLngArr = boundsArray.map((latLng)=> {
                    return latLng
                })

                if (Array.isArray(boundsArray[0][0][0])) {
                    var bounds = L.bounds(boundsDeepArray)
                    var center = bounds.getCenter()
                    map.panTo([center.y, center.x]).setZoom(5)
                    countryLoaded = true;

                    
                } else {
                    var bounds = L.bounds(boundsArray[0])
                    var center = bounds.getCenter()
                    map.panTo([center.y, center.x]).setZoom(5)
                    countryLoaded = true;
                }

            }
        }
    })

})