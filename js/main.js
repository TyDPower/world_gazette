import * as countryUserLocation from "../common/countryUserLocation.js";
import * as modal from "../common/modal.js";
import * as naturalEvents from "../common/naturalEvents.js";
import * as utilities from "../common/utilities.js"
import * as countryInfo from "../common/countryObj.js"

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
                                var countryInfo = res.data.results[0].components
                                countryUserLocation.obj.isoCodeA2 = countryInfo["ISO_3166-1_alpha-2"];
                                countryUserLocation.obj.isoCodeA3 = countryInfo["ISO_3166-1_alpha-3"];
                                countryUserLocation.obj.name = countryInfo.country;

                                for (let i=0; i<data.features.length; i++) {
                                    if (data.features[i].properties.ISO_A3 == countryInfo["ISO_3166-1_alpha-3"]) {
                                        let countryBorder = data.features[i];
                                        countryUserLocation.obj.borders = countryBorder;
                                        L.geoJSON(countryBorder).addTo(map);
                                        countryUserLocation.obj.getInfo(countryUserLocation.obj.isoCodeA2)
                                        .then(()=> countryUserLocation.obj.getCountryIndices(countryUserLocation.obj.isoCodeA2))
                                        .then(()=> countryUserLocation.obj.getCurrencyExchange("USD", countryUserLocation.obj.currencyInfo.code))
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

    //Initial variable declaration for country change from down down menu
    let selectedCountry;

    //Select new country with html drop down menu
    $("#countryList").change(()=> {

        const codeA3 = $("#countryList").val();
        naturalEvents.obj.clearMarkers();

        if (!selectedCountry) {

            selectedCountry = new countryInfo.Country() 

        } else {

            selectedCountry.utils.removeLayers(selectedCountry)
            selectedCountry = new countryInfo.Country()

        }
        
        selectedCountry.utils.getBorders(selectedCountry, codeA3)
        .then((data)=> data.utils.addBorders(data, map))

        selectedCountry.utils.getInfo(selectedCountry, selectedCountry.URLs.restcountriest, codeA3)
        .then((data)=> selectedCountry.utils.getInfo(data, selectedCountry.URLs.numbeoCountryIndex))
        .then(()=> utilities.panToCountry(map, selectedCountry, true))
        .then(()=> utilities.countryInfoPopup(map, selectedCountry))
        .then(()=> console.log(selectedCountry))

    })

    map.on("click", ()=> {
        console.log("You clicked sir!")
    })

    //Select natural event with html drop down menu
    $("#naturalEvents").change(()=> {

        let events = naturalEvents.obj.events;
        let layerGroup = naturalEvents.obj.layerGroups;
        let markers = naturalEvents.obj.markers;
        let period = $("input[name=naturalEvents]:checked").val()

        if (!period) {

            alert("Please select a period")

        } else {

            let periodInDays = parseInt(period)
            const userRequest = naturalEvents.obj.loadNaturalEventsData(periodInDays) 

            const handleSuccess = () => {

                if (selectedCountry) {
                    naturalEvents.obj.clearMarkers();
                    selectedCountry.utils.removeLayers(selectedCountry);
                }

                switch ($("#naturalEvents").val()) {
                    case "wildfires":
                        events.wildfiresArr.forEach(res=> {
                            layerGroup.wildfiresGroup.addLayer(L.marker(res, {icon: markers.wildfires})).addTo(map);
                        })
                        naturalEvents.obj.panToCenter(map);
                        break;
                    
                    case "volcanos":
                        events.volcanosArr.forEach(res=> {
                            layerGroup.volcanosGroup.addLayer(L.marker(res,{icon: markers.volcanos})).addTo(map);
                        })
                        naturalEvents.obj.panToCenter(map);
                        break;
        
                    case "severeStorms":
                        events.severeStormsArr.forEach(res=> {
                            layerGroup.severeStormsGroup.addLayer(L.marker(res, {icon: markers.severeStorms})).addTo(map);
                        })
                        naturalEvents.obj.panToCenter(map);
                        break;
    
                    case "earthquakes":
                        events.earthquakesArr.forEach(res=> {
                            layerGroup.earthquakesGroup.addLayer(L.marker(res, {icon: markers.earthquakes})).addTo(map);
                        })
                        naturalEvents.obj.panToCenter(map);
                        break;
    
                    default:
                        events.icebergsArr.forEach(res=> {
                            layerGroup.icebergsGroup.addLayer(L.marker(res,{icon: markers.icebergs})).addTo(map);
                        })
                        naturalEvents.obj.panToCenter(map);
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