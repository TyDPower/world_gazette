$(document).ready(()=> {
    //Selected Country/City Parameters
var placeParams = {
    isoCodeA3: $("#countryList").val().slice(7, 10),
    isoCodeA2: $("#countryList").val().slice(19, 21),
    borders: null,
    loaded: false,
    name: null,
    latLng: []
}

//Selected Country/City Parameters change values function



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
                    url: "./php/getUserCountryInfo.php",
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

//Select new country with html drop down menu
$("#countryList").change(()=> {

    console.log("change is happening")

    $.getJSON("./common/countries.geo.json", (data)=> {
        for (let i=0; i<data.features.length; i++) {
            if (data.features[i].properties.ISO_A3 == placeParams.isoCodeA3) {
                placeParams.borders = data.features[i];
                placeParams.name = data.features[i].properties.ADMIN
                $(".leaflet-interactive")[1].remove();
                L.geoJSON(placeParams.borders).addTo(map);

                console.log(placeParams.name)
                console.log(placeParams.isoCodeA3)
                console.log(placeParams.isoCodeA2)

                $.ajax(
                    {
                        url: "./php/getPlaceInfo.php",
                        type: "post",
                        dataType: "json",
                        data: {
                            isoCode: placeParams.isoCodeA2,
                            countryName: placeParams.name.replace(/\s+/g, "_")
                        },
            
                        success: (res)=> {
                            if (res.status.name == "ok") {
                                var results = res.data.results[0].geometry
                                placeParams.latLng = [results.lat, results.lng];
                                console.log(placeParams.latLng)
                                map.panTo([placeParams.latLng[0], placeParams.latLng[1]]).setZoom(5)
                                setTimeout(()=> {
                                    $(".modal").show();
                                }, 1000)
            
                                $("#closeBtn").click(()=> {
                                    $(".modal").hide();
                                })
                                countryLoaded = true;
                            }
                        },
            
                        error: (err)=> {
                            console.log(err);
                        }
                    }
                )

            }
        }
    })

})

})