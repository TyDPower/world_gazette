import * as country from "../common/country.js";
import * as modal from "../common/modal.js";
import * as naturalEvents from "../common/naturalEvents.js"



$(document).ready(()=> {

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
                                var country = res.data.results[0].components["ISO_3166-1_alpha-3"]
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

        const codeA3 = $("#countryList").val().slice(7, 10);
        const codeA2 = $("#countryList").val().slice(19, 21);
        

        const goToCountry = () => {
            var data = `${country.obj.name}<br>
                        ${country.obj.continent}<br>
                        ${country.obj.flag}`;
            L.popup()
                    .setLatLng(country.obj.coords)
                    .setContent(data)
                    .openOn(map);
            map.panTo(country.obj.coords);
            //country.obj.layerGroups.addLayer(L.marker(country.obj.coords)).addTo(map);
            if (map.getZoom() > 5) {
                map.setZoom(5)
            }
        }

        country.obj.layerGroups.clearLayers();
        naturalEvents.obj.clearMarkers();

        country.obj.getBorders(codeA3)
        .then((borders)=>country.obj.layerGroups.addLayer(L.geoJSON(borders))
        .addTo(map))
        .then(()=>country.obj.getCountryInfo(codeA2))
        .then(()=>goToCountry())
        .then(()=>modal.countryInfo(country.updateCountryInfo()))
        .catch((val)=>console.log(val))

        $("#closeBtn").click(()=> {
            $(".modal").hide();
        })

    })

    //Select natural event with html drop down menu
    $("#naturalEvents").change(()=> {

        naturalEvents.obj.clearMarkers(); 

        let panToCenter = () => {
            map.panTo([0, 0])
            if (map.getZoom() > 2) {
                map.setZoom(2);
            }
        }

        let events = naturalEvents.obj.events;
        let layerGroup = naturalEvents.obj.layerGroups;
        let markers = naturalEvents.obj.markers;
        let period = $("input[name=naturalEvents]:checked").val()

        if (!period) {

            alert("Please select a period")

        } else {

            let periodInDays = parseInt(period)
            const userRequest = naturalEvents.loadNaturalEventsData(periodInDays) 

            const handleSuccess = () => {

                country.obj.layerGroups.clearLayers();

                switch ($("#naturalEvents").val()) {
                    case "wildfires":
                        events.wildfiresArr.forEach(res=> {
                            layerGroup.wildfiresGroup.addLayer(L.marker(res, {icon: markers.wildfires})).addTo(map);
                        })
                        panToCenter();
                        break;
                    
                    case "volcanos":
                        events.volcanosArr.forEach(res=> {
                            layerGroup.volcanosGroup.addLayer(L.marker(res,{icon: markers.volcanos})).addTo(map);
                        })
                        panToCenter();
                        break;
        
                    case "severeStorms":
                        events.severeStormsArr.forEach(res=> {
                            layerGroup.severeStormsGroup.addLayer(L.marke(res, {icon: markers.severeStorms})).addTo(map);
                        })
                        panToCenter();
                        break;
    
                    case "earthquakes":
                        events.earthquakesArr.forEach(res=> {
                            layerGroup.earthquakesGroup.addLayer(L.marke(res, {icon: markers.earthquakes})).addTo(map);
                        })
                        panToCenter();
                        break;
    
                    default:
                        events.icebergsArr.forEach(res=> {
                            layerGroup.icebergsGroup.addLayer(L.marker(res,{icon: markers.icebergs})).addTo(map);
                        })
                        panToCenter();
                }
                
            }

            const handleErr = (err) => {
                console.log(err)
            }

            userRequest
            .then(handleSuccess)
            .catch(handleErr)
        }

    })

})