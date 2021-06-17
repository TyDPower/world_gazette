import * as location from "../common/country.js";
import * as modal from "../common/modal.js";

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

        var codeA3 = $("#countryList").val().slice(7, 10);
        var codeA2 = $("#countryList").val().slice(19, 21);

        location.updateIsoA3(codeA3);
        location.updateIsoA2(codeA2);

        $.getJSON("./common/countries.geo.json", (data)=> {
            for (let i=0; i<data.features.length; i++) {
                if (data.features[i].properties.ISO_A3 == location.updateIsoA3()) {
                    location.updateCountryBorders(data.features[i]);
                    location.updateCountryName(data.features[i].properties.ADMIN);

                    const removeBorderAndMarker = () => {

                        var border = $(".leaflet-interactive")[1];
                        var marker = $(".leaflet-marker-icon")[1];
                        var shoadow = $(".leaflet-marker-shadow")[1]

                        if (!marker) {
                            border.remove();
                        } else {
                            border.remove();
                            marker.remove();
                            shoadow.remove();
                        }
                    }

                    removeBorderAndMarker();
                    
                    L.geoJSON(location.updateCountryBorders()).addTo(map);

                    $.ajax(
                        {
                            url: "./php/getPlaceInfo.php",
                            type: "post",
                            dataType: "json",
                            data: {
                                isoCode: location.updateIsoA2(),
                                countryName: location.updateCountryName().replace(/\s+/g, "_")
                            },
                
                            success: (res)=> {
                                if (res.status.name == "ok") {
                                    var results = res.data.results[0]

                                    var countryData = {
                                        name: results.components.country,
                                        coords: [results.geometry.lat, results.geometry.lng],
                                        continent: results.components.continent,
                                        flag: results.annotations.flag,
                                        currencyName: results.annotations.currency.name,
                                        currencySubunitName: results.annotations.currency.subunit,
                                        currencySymbol: results.annotations.currency.symbol,
                                        symbolPos: results.annotations.currency.symbol_first,
                                        driveSide: results.annotations.roadinfo.drive_on,
                                        speedUnit: results.annotations.roadinfo.speed_in,
                                        timezoneName: results.annotations.timezone.name,
                                        dst: results.annotations.timezone.now_in_dst
                                    }

                                    location.updateCountryInfo(countryData);

                                    setTimeout(()=> {
                                        map.panTo([location.updateCountryCoords("lat"), location.updateCountryCoords("lng")]).setZoom(5)
                                    }, 100);
                                    
                                    setTimeout(()=> {
                                        $(".modal").show();
                                    }, 1000);
                
                                    $("#closeBtn").click(()=> {
                                        $(".modal").hide();
                                    })

                                    location.updateCountryLoaded(true);
                                    modal.countryInfo(location.updateCountryInfo());
                                    L.marker(location.updateCountryCoords()).addTo(map);

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

    $("#naturalEvents").change(()=> {

        var naturalEvents = {
            period: 365,
            events: {
                wildFiresArr: [],
                earthquakesArr: [],
                volcanosArr: [],
                severeStormsArr: [],
                icebergsArr: []

            }
        }
        

        $.ajax({
            url: "./php/getNaturalEvents.php",
            type: "post",
            dataType: "json",
            data: {
                period: naturalEvents.period
            },

            success: (res)=> {

                if (res.status.name == "ok") {
                    var results = res.data.events

                    for (let i=0; i<results.length; i++) {
                        if (results[i].categories[0].title === "Wildfires") {
                            naturalEvents.events.wildFiresArr.push(results[i]);
                        }

                        if (results[i].categories[0].title === "Severe Storms") {
                            naturalEvents.events.severeStormsArr.push(results[i]);
                        }

                        if (results[i].categories[0].title === "Sea and Lake Ice") {
                            naturalEvents.events.icebergsArr.push(results[i]);
                        }

                        if (results[i].categories[0].title === "Volcanoes") {
                            naturalEvents.events.volcanosArr.push(results[i]);
                        }

                        if (results[i].categories[0].title === "Earthquakes") {
                            naturalEvents.events.earthquakesArr.push(results[i]);
                        }
                    }

                    Object.keys(naturalEvents).forEach(key=> {
                        console.log(key, naturalEvents[key])
                    })

                    $(".leaflet-interactive")[1].remove();
                }

            },

            error: (err)=> {
                console.log(err);
            }

        })

    })

})