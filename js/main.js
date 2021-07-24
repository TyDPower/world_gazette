/*--------------- CONTENT ---------------*/
/*
    1. IMPORTS
    2. HTTP TO HTTPS REDIRECT
    3. WINDOW PRELOADER
    4. JQUERY DOCUMENT
        4.1 LOAD WORLD MAP TILES
        4.2 LOAD USER COUNTRY
        4.3 GLOBAL VARIABLE DELARATIONS
        4.4 NAV ICONS
            4.4.1 MOBILE MENU ICON
            4.4.2 NAV COUNTRY SEARCH
                4.4.2.1 NAV COUNTRY SEARCH MODAL
                4.4.2.2 COUNTRY SEARCH FUNCTIONS
                4.4.2.3 COUNTRY SEARCH CLOSE FUNCTIONS
            4.4.3 NAV WORLD SEARCH
                4.4.3.1 NAV WORLD SEARCH MODAL
                4.4.3.2 WORLD SEARCH FUNCTIONS
                4.4.3.3 WORLD SEARCH CLOSE FUNCTIONS
            4.4.4 NAV SELECT MAP
                4.4.4.1 NAV SELECT MAP MODAL
                4.4.4.2 NAV SELECT MAP FUNCTIONS
                4.4.4.3 NAV SELECT MAP CLOSE FUNCTIONS
            4.4.5 NAV CLEAR MARKERS
                4.4.5.1 NAV CLEAR MARKERS FUNCTION
            4.4.6 NAV INFO
                4.4.6.1 NAV INFO MODAL
                4.4.6.2 NAV INFO TABS
                4.4.6.3 NAV INFO CLOSE FUNCTIONS
            4.4.7 NAV CONTACT
                4.4.7.1 NAV CONTACT MODAL
                4.4.7.2 NAV CONTACT CLOSE FUNCTIONS
*/

/*--------------- 1. IMPORTS ---------------*/
import * as events from "../common/naturalEventsClass.js";
import * as utils from "../common/utilities.js";
import * as country from "../common/countryClass.js";
import * as geoData from "../common/geoData.js";
import * as modals from "../common/modals.js";
import { worldTiles } from "../common/mapAndOverlays.js";

/*--------------- 2. HTTP TO HTTPS REDIRECT ---------------*/
/*if (window.location.protocol == 'http:') {
    window.location.href = window.location.href.replace('http:', 'https:');
}*/

/*--------------- 3. WINDOW PRELOADER ---------------*/

/*--------------- 4. JQUERY DOCUMENT ---------------*/
$(document).ready(()=> {

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    var myCarousel = document.querySelector('#myCarousel')
    var carousel = new bootstrap.Carousel(myCarousel)



    let defaultMap = L.tileLayer('https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=3bd3719a93e0430094d656e7d697f55e', {
        maxZoom: 22,
        attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    let outdoorMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var map = L.map('map', {
        center: [0, 0],
        zoom: 2,
        layers: [defaultMap, outdoorMap]
    });

    var baseMaps = {
        "<span style='color: gray'>Grayscale</span>": defaultMap,
        "Streets": outdoorMap
    };

    const markers = {
        city: L.ExtraMarkers.icon({
            icon: 'fa-home',
            markerColor: 'pink',
            shape: 'round',
            prefix: 'fas',
        }),
        beachCam: L.ExtraMarkers.icon({
            icon: 'fa-umbrella-beach',
            markerColor: 'blue',
            shape: 'square',
            prefix: 'fas',
        }),
        trafficCam: L.ExtraMarkers.icon({
            icon: 'fa-traffic-light',
            markerColor: 'red',
            shape: 'square',
            prefix: 'fas',
        }),
        squareCam: L.ExtraMarkers.icon({
            icon: 'fa-store',
            markerColor: 'light blue',
            shape: 'square',
            prefix: 'fas',
        }),
        city: L.ExtraMarkers.icon({
            icon: 'fa-city',
            markerColor: 'pink',
            shape: 'circle',
            prefix: 'fas',
        }),

        mountainPOI: L.ExtraMarkers.icon({
            icon: 'fa-mountain',
            markerColor: 'green',
            shape: 'star',
            prefix: 'fas',
        }),
        airportPOI: L.ExtraMarkers.icon({
            icon: 'fa-plane-departure',
            markerColor: 'purple',
            shape: 'star',
            prefix: 'fas',
        }),
        beachPOI: L.ExtraMarkers.icon({
            icon: 'fa-umbrella-beach',
            markerColor: 'yellow',
            shape: 'star',
            prefix: 'fas',
        }),
        castlePOI: L.ExtraMarkers.icon({
            icon: 'fa-fort-awesome',
            markerColor: 'black',
            shape: 'star',
            prefix: 'fab',
        }),
        lakePOI: L.ExtraMarkers.icon({
            icon: 'fa-water',
            markerColor: 'blue',
            shape: 'star',
            prefix: 'fas',
        }),
    }

    const overlayGroups = {
        cityGroup: L.markerClusterGroup(),
        beachCamsGroup: L.markerClusterGroup(),
        trafficCamsGroup: L.markerClusterGroup(),
        squareCamsGroup: L.markerClusterGroup(),
        cityGroup: L.markerClusterGroup(),
        mountainPOIGroup: L.markerClusterGroup(),
        airportPOIGroup: L.markerClusterGroup(),
        beachPOIGroup: L.markerClusterGroup(),
        castlePOIGroup: L.markerClusterGroup(),
        beachPOIGroup: L.markerClusterGroup(),
        lakePOIGroup: L.markerClusterGroup(),
    }

    const overlayMaps = {
        "Cities": overlayGroups.cityGroup,
        "Webcams Beaches": overlayGroups.beachCamsGroup,
        "Webcams Traffic": overlayGroups.trafficCamsGroup,
        "Webcams City Center": overlayGroups.squareCamsGroup,
        "POI Mountains": overlayGroups.mountainPOIGroup,
        "POI Airports": overlayGroups.airportPOIGroup,
        "POI Beaches": overlayGroups.beachPOIGroup,
        "POI Castles": overlayGroups.castlePOIGroup,
        "POI Lakes": overlayGroups.lakePOIGroup
    };

    const getName = (data) => {
        if (data.location.city) {
            return data.location.city
        } else if (data.location.town) {
            return data.location.town
        } else {
            return "Name not avalible"
        }
    }

    const displayMarkers = (data, clusterGroup, marker) => {
        $.each(data, (i,o)=> {

            if (o.latitude && o.longitude) {
                clusterGroup.addLayer(L.marker([o.latitude, o.longitude], {icon: marker}).on(
                    "click", ()=> {
                        $("#preloader").fadeIn("fast")
                        getPopupInfo([o.latitude, o.longitude])
                        .then((data)=> {
                            L.popup().setLatLng([o.latitude, o.longitude]).setContent(`
                            <div id="popup">
                            <h1><span style="font-size: 30px; color: black;"><i class="fas fa-info-circle"></i></span>&nbsp${getName(data)}</h1>
                            <table class="table">
                                <tr>
                                    <td>Road</td>
                                    <td class="right-col">${data.location.road}</td>
                                </tr>
                                <tr>
                                    <td>Suburb</td>
                                    <td class="right-col">${data.location.suburb}</td>
                                </tr>
                                <tr>
                                    <td>Postal Code</td>
                                    <td class="right-col">${data.location.postcode}</td>
                                </tr>
                            </table>
            
                            <h2><span style="font-size: 20px; color: black;"><i class="fas fa-temperature-high"></i></span>&nbspWeather</h2>
                            <table class="table">
                                <tr>
                                    <td>Today</td>
                                    <td>Minimum ${data.weather.daily[0].temp.min}<sup>o</sup>C</td>
                                    <td>Maximum ${data.weather.daily[0].temp.max}<sup>o</sup>C</td>
                                    <td>Average ${data.weather.daily[0].temp.day}<sup>o</sup>C</td>
                                </tr>
                                <tr>
                                    <td>Current</td>
                                    <td>Temperture ${data.weather.current.temp}<sup>o</sup>C</td>
                                    <td>${data.weather.current.weather[0].description}</td>
                                    <td>${getImg(data.weather.current.weather[0].icon)}</td>
                                </tr>
                                <tr>
                                    <td>Tomorrow</td>
                                    <td>Average ${data.weather.daily[1].temp.day}<sup>o</sup>C</td>
                                    <td>${data.weather.daily[1].weather[0].description}</td>
                                    <td>${getImg(data.weather.daily[1].weather[0].icon)}</td>                     
                                </tr>
                            </table>
                        </div>
                            `).openOn(map);
                        })
                        .then(()=> $("#preloader").fadeOut("fast"))
                        .catch((err)=> console.error(err));
                    })
                );
            }

            if (o.lat && o.lng) {
                clusterGroup.addLayer(L.marker([o.lat, o.lng], {icon: marker}).on(
                    "click", ()=> {
                        $("#preloader").fadeIn("fast")
                        getPopupInfo([o.lat, o.lng])
                        .then((data)=> {
                            L.popup().setLatLng([o.lat, o.lng]).setContent(`
                            <div id="popup">
                            <h1><span style="font-size: 30px; color: black;"><i class="fas fa-info-circle"></i></span>&nbsp${o.name}</h1>
                            <table class="table">
                                <tr>
                                    <td>Road</td>
                                    <td class="right-col">${data.location.road}</td>
                                </tr>
                                <tr>
                                    <td>Suburb</td>
                                    <td class="right-col">${data.location.suburb}</td>
                                </tr>
                                <tr>
                                    <td>Postal Code</td>
                                    <td class="right-col">${data.location.postcode}</td>
                                </tr>
                            </table>
            
                            <h2><span style="font-size: 20px; color: black;"><i class="fas fa-temperature-high"></i></span>&nbspWeather</h2>
                            <table class="table">
                                <tr>
                                    <td>Today</td>
                                    <td>Minimum ${data.weather.daily[0].temp.min}<sup>o</sup>C</td>
                                    <td>Maximum ${data.weather.daily[0].temp.max}<sup>o</sup>C</td>
                                    <td>Average ${data.weather.daily[0].temp.day}<sup>o</sup>C</td>
                                </tr>
                                <tr>
                                    <td>Current</td>
                                    <td>Temperture ${data.weather.current.temp}<sup>o</sup>C</td>
                                    <td>${data.weather.current.weather[0].description}</td>
                                    <td>${getImg(data.weather.current.weather[0].icon)}</td>
                                </tr>
                                <tr>
                                    <td>Tomorrow</td>
                                    <td>Average ${data.weather.daily[1].temp.day}<sup>o</sup>C</td>
                                    <td>${data.weather.daily[1].weather[0].description}</td>
                                    <td>${getImg(data.weather.daily[1].weather[0].icon)}</td>                     
                                </tr>
                            </table>
                        </div>
                            `).openOn(map);
                        })
                        .then(()=> $("#preloader").fadeOut("fast"))
                        .catch((err)=> console.error(err));
                    })
                );
            }
        })   
    }

    const displayWebCamMarkers = (data, clusterGroup, marker) => {
        $.each(data, (i,o)=> {

            if (o.location.latitude && o.location.longitude) {
                clusterGroup.addLayer(L.marker([o.location.latitude, o.location.longitude], {icon: marker}).on("click", ()=> {
                    $("#preloader").fadeIn("fast")
                    getPopupInfo([o.location.latitude, o.location.longitude])
                        .then((data)=> {
                            L.popup().setLatLng([o.location.latitude, o.location.longitude]).setContent(`
                                <div id="popup">
                                    <h1><span style="font-size: 30px; color: black;"><i class="fas fa-info-circle"></i></span>&nbsp${getName(data)}</h1>
                                    <table class="table">
                                        <tr>
                                            <td>Road</td>
                                            <td class="right-col">${data.location.road}</td>
                                        </tr>
                                        <tr>
                                            <td>Suburb</td>
                                            <td class="right-col">${data.location.suburb}</td>
                                        </tr>
                                        <tr>
                                            <td>Postal Code</td>
                                            <td class="right-col">${data.location.postcode}</td>
                                        </tr>
                                    </table>
                                    <h2><span style="font-size: 20px; color: black;"><i class="fas fa-temperature-high"></i></span>&nbspWeather</h2>
                                    <table class="table">
                                        <tr>
                                            <td>Today</td>
                                            <td>Minimum ${data.weather.daily[0].temp.min}<sup>o</sup>C</td>
                                            <td>Maximum ${data.weather.daily[0].temp.max}<sup>o</sup>C</td>
                                            <td>Average ${data.weather.daily[0].temp.day}<sup>o</sup>C</td>
                                        </tr>
                                        <tr>
                                            <td>Current</td>
                                            <td>Temperture ${data.weather.current.temp}<sup>o</sup>C</td>
                                            <td>${data.weather.current.weather[0].description}</td>
                                            <td>${getImg(data.weather.current.weather[0].icon)}</td>
                                        </tr>
                                        <tr>
                                            <td>Tomorrow</td>
                                            <td>Average ${data.weather.daily[1].temp.day}<sup>o</sup>C</td>
                                            <td>${data.weather.daily[1].weather[0].description}</td>
                                            <td>${getImg(data.weather.daily[1].weather[0].icon)}</td>                     
                                        </tr>
                                    </table>
                                    <h2><span style="font-size: 20px; color: black;"><i class="fas fa-video"></i></span>&nbspWebcam</h2>
                                    <div id="videoPlayer">
                                        <iframe class="holds-the-iframe" src="${o.player.month.embed}style="width:100%"></iframe> 
                                    </div>
                                </div>
                            `).openOn(map) 
                        })
                        .then(()=> $("#preloader").fadeOut("fast"))
                        .catch((err)=> console.error(err));                  
                }))
            }
        })
        
    }

    const clearLayers = () => {
        overlayGroups.cityGroup.clearLayers(),
        overlayGroups.beachCamsGroup.clearLayers(),
        overlayGroups.trafficCamsGroup.clearLayers(),
        overlayGroups.squareCamsGroup.clearLayers(),
        overlayGroups.cityGroup.clearLayers(),
        overlayGroups.mountainPOIGroup.clearLayers(),
        overlayGroups.airportPOIGroup.clearLayers(),
        overlayGroups.beachPOIGroup.clearLayers(),
        overlayGroups.castlePOIGroup.clearLayers(),
        overlayGroups.beachPOIGroup.clearLayers(),
        overlayGroups.lakePOIGroup.clearLayers()
    }

    L.control.layers(baseMaps, overlayMaps).addTo(map);


    const ctryLayerGroup = L.layerGroup();

    const getUserLatLng = () => {

        var options = {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0
        };

        return new Promise((resolve, reject)=> {

            navigator.geolocation.getCurrentPosition((pos)=> {
                var latLng = [pos.coords.latitude, pos.coords.longitude];
                resolve(latLng);
            }, (err)=> {
                reject(err);
            }, options)
        })

    }

    const getUserCtry = (latLngArr) => {

        return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getUserCtry.php",
                type: "post",
                dataType: "json",
                data: {
                    lat: latLngArr[0],
                    lng: latLngArr[1]
                },

                success: (res)=> {
                    resolve(res.data)
                },

                error: (err)=> {
                    console.error(err);
                }
            })
        })
    }

    const getOverlayInfo = (isoCodeA2) => {

        let data;

        return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getOverlayInfo.php",
                type: "post",
                dataType: "json",
                data: {
                    code: isoCodeA2
                },

                success: (res)=> {
                    console.log(res.data)
                    resolve(
                        data = {
                            overlays: res.data,
                            code: isoCodeA2
                        })
                },

                error: (err)=> {
                    reject(err);
                }
            })
        })
    }

    const loadOverlays = (data) => {

       let something = true;

        return new Promise((resolve, reject)=> {

            displayWebCamMarkers(data.overlays.beachCams, overlayGroups.beachCamsGroup, markers.beachCam);
            displayWebCamMarkers(data.overlays.trafficCams, overlayGroups.trafficCamsGroup, markers.trafficCam);
            displayWebCamMarkers(data.overlays.squareCams, overlayGroups.squareCamsGroup, markers.squareCam);
            displayMarkers(data.overlays.cities, overlayGroups.cityGroup, markers.city);
            displayMarkers(data.overlays.mountainPOI, overlayGroups.mountainPOIGroup, markers.mountainPOI);
            displayMarkers(data.overlays.airportPOI, overlayGroups.airportPOIGroup, markers.airportPOI);
            displayMarkers(data.overlays.beachPOI, overlayGroups.beachPOIGroup, markers.beachPOI);
            displayMarkers(data.overlays.castlePOI, overlayGroups.castlePOIGroup, markers.castlePOI);
            displayMarkers(data.overlays.lakePOI, overlayGroups.lakePOIGroup, markers.lakePOI);

            if (something) {
                resolve(data.code)
            } else {
                reject("Overlays did not load!")
            }
        })
    }

    const getCountryInfo = (data) => {

        const date = new Date();

        return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getCountryInfo.php",
                type: "post",
                dataType: "json",
                data: {
                    code: data,
                    year: date.getFullYear()
                },

                success: (res)=> {
                    console.log(res.data)
                    countryData = res.data;
                    resolve(res.data)
                },

                error: (err)=> {
                    reject(err);
                }
            })
        })
    }

    const getCtryBorders = (data) => {

        let ctryInfo;

        return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getCtryBorders.php",
                type: "post",
                dataType: "json",
                data: {
                    code: data.restCtry.alpha2Code
                },

                success: (res)=> {
                    resolve(ctryInfo = {
                        borders: res.data[0].geometry,
                        ctryInfo: data
                    })
                },

                error: (err)=> {
                    reject(err);
                }
            })
        })

    }

    const addCtryLayer = (data) => {

        ctryLayerGroup.addLayer(L.geoJSON(data.borders)).addTo(map);

        let crds = data.ctryInfo.openCage.bounds
        let bounds = [
            [crds.northeast.lat, crds.northeast.lng], [crds.southwest.lat, crds.southwest.lng]
        ]
        map.fitBounds(bounds)

        return data;
    }

    const getCountryList = (iso) => {

        let country = $("#countrySelector");

        return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getCountryList.php",
                type: "post",
                dataType: "json",
                success: (res)=> {
                    if (res.status.name == "ok") {
                        res.data.forEach((res) => {
                            $("#countrySelector").append(
                                $("<option>", {
                                    value: res.code,
                                    text: res.name,
                                })
                            );
                        })

                        for (let i=0; i<country[0].length; i++) {
                            if (country[0][i].value === iso.toUpperCase()) {
                                country[0][i].defaultSelected = true;
                                resolve(iso)
                            }
                        }
                    }
                },
                error: (err)=> {
                    reject(err)
                }
            })
        })
        
    };

    const getPopupInfo = (latLng) => {

        return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getPopupInfo.php",
                type: "post",
                dataType: "json",
                data: {
                    lat: latLng[0],
                    lng: latLng[1]
                },

                success: (res)=> {
                    console.log(res.data)
                    resolve(res.data)
                },

                error: (err)=> {
                    reject(err)
                }
            })
        })
    }

    const getImg = (code) => {

        switch (code) {
            case "01d":
            case "01n":
                return`<span style="font-size: 25px; color: black;"><i class="fas fa-sun"></i></span>`;
            case "02d":
            case "02n":
                return`<span style="font-size: 25px; color: black;"><i class="fas fa-cloud-sun"></i></span>`;
            case "03d":
            case "03n":
            case "04d":
            case "04n":
                return`<span style="font-size: 25px; color: black;"><i class="fas fa-cloud"></i></span>`;
            case "09d":
            case "09n":
            case "10d":
            case "10n":
                return`<span style="font-size: 25px; color: black;"><i class="fas fa-cloud-rain"></i></span>`;
            case "11d":
            case "11n":
                return`<span style="font-size: 25px; color: black;"><i class="fas fa-cloud-showers-heavy"></i></span>`;
            case "13d":
            case "13n":
                return`<span style="font-size: 25px; color: black;"><i class="far fa-snowflake"></i></span>`;
            case "50d":
            case "50n":
                return`<span style="font-size: 25px; color: black;"><i class="fas fa-smog"></i></span>`;
        }
    }

    const reverseStr = (str) => {
        let splitStr = str.split("-");
        let revArr = splitStr.reverse();
        let revStr = revArr.join("-");
        return revStr;
    }

    const indexRating = (key, val) => {

        if (key === "crime_index" || key === "pollution_index" || key === "rent_index") {
            
            //Low is good
            if (val <= 19.9) {
                return "Very Low"
            } else if (val <= 39.9) {
                return "Low"
            } else if (val <= 59.9) {
                return "Medium"
            } else if (val <= 79.9) {
                return "High"
            } else {
                return "Very High"
            }

        }

        if (key === "safety_index" || key === "health_care_index" || key === "purchasing_power_incl_rent_index") {

            //High is good
            if (val <= 19.9) {
                return "Very Low"
            } else if (val <= 39.9) {
                return "Low"
            } else if (val <= 59.9) {
                return "Medium"
            } else if (val <= 79.9) {
                return "High"
            } else {
                return "Very High"
            }

        }
        
        if (key === "groceries_index") {

            //Low is good
            if (val <= 24.9) {
                return "Very Low"
            } else if (val <= 49.9) {
                return "Low"
            } else if (val <= 99.9) {
                return "Moderate"
            } else if (val <= 124.9) {
                return "High"
            } else {
                return "Very High"
            }

        }

        if (key === "quality_of_life_index") {

            //High is good
            if (val <= 39.9) {
                return "Very Low"
            } else if (val <= 79.9) {
                return "Low"
            } else if (val <= 119.9) {
                return "Moderate"
            } else if (val <= 159.9) {
                return "High"
            } else {
                return "Very High"
            }

        }


    }

    const checkValue = (symbol, val) => {
        if (val) {
            return symbol + val.toFixed(2);
        }

        return "No data"
    }

    let countryData;

    //$("#preloader").fadeIn("fast")
    //
    //getUserLatLng()
    //.then((data)=> getUserCtry(data))
    //.then((data)=> getCountryList(data))
    //.then((data)=> getOverlayInfo(data))
    //.then((data)=> loadOverlays(data))
    //.then((data)=> getCountryInfo(data))
    //.then((data)=> ctryModal(data))
    //.then((data)=> getCtryBorders(data))
    //.then((data)=> addCtryLayer(data))
    //.then(()=> $("#preloader").fadeOut("fast"))
    //.catch((err)=> console.error(err));
    
    $("#preloader").fadeOut("fast")

    $("#infoModal").show()//=================>REMOVE THIS

    $("#countrySelector").change(()=> {

        $("#preloader").fadeIn("fast")
        
        let code = $("#countrySelector").val()

        ctryLayerGroup.clearLayers();
        clearLayers();

        getOverlayInfo(code)
        .then((data)=> loadOverlays(data))
        .then((data)=> getCountryInfo(data))
        .then((data)=> ctryModal(data))
        .then((data)=> getCtryBorders(data))
        .then((data)=> addCtryLayer(data))
        .then(()=> $("#preloader").fadeOut("fast"))
        .catch((err)=> console.error(err));

        //$("#preloader").fadeOut("fast")
        
    })

    $("#ctryModalcloseBtn").click(()=> {
        $("#countryModal").addClass(" modalOff");
    })

    $("#webCamCloseBtn").click(()=> {
        $("#webCamContainer").addClass(" modalOff");
        $("#webCamPlayer").html("");
    })

    $("#modalClsBtn").click(()=> {
        $("#infoModal").hide()
    })

    $("#ctryBtn").click(()=> {
        ctryModal(countryData);
        
    })

    $("#exRatesBtn").click(()=> {
        exRatesModal(countryData);        
    })

    $("#statsBtn").click(()=> {
        statsModal(countryData);        
    })

    $("#newsBtn").click(()=> {
        newsModal(countryData);        
    })

    $("#galleryBtn").click(()=> {
        galleryModal(countryData);        
    })

    $("#wikiBtn").click(()=> {
        wikiModal(countryData);        
    })

    const ctryModal = (data) => {

        console.log(data)

        $("#modalContent").html("")
        $("#modalTitle").html(data.restCtry.name)

        $("#infoModal").show()

        let areaSize = data.restCtry.area.toLocaleString();
        let population = data.restCtry.population.toLocaleString();

        $("#modalContent").append(`
            <div>
                <img src="${data.restCtry.flag}" alt="${data.restCtry.name} Flag" style="width: 100%;">
            </div>
            <br>
            <table id="ctryTable" class="table">
                <tr>
                    <th class="table-headings"><span style="font-size: 30px; color: black;"><i class="fas fa-info-circle"></i></span>  Official</th>
                    <th></th>
                </tr>
                <tr>
                    <td>Native Name</td>
                    <td class="right-col">${data.restCtry.nativeName}</td>
                </tr>
                <tr>
                    <td>Region</td>
                    <td class="right-col">${data.restCtry.region}</td>
                </tr>
                <tr>
                    <td>Subregion</td>
                    <td class="right-col">${data.restCtry.subregion}</td>
                </tr>
                <tr>
                    <td>ISO Alpha-2</td>
                    <td class="right-col">${data.restCtry.alpha2Code}</td>
                </tr>
                <tr>
                    <td>ISO Alpha-3</td>
                    <td class="right-col">${data.restCtry.alpha3Code}</td>
                </tr>
                <tr>
                    <td>Area Size</td>
                    <td class="right-col">${areaSize}km<sup>2</sup></td>
                </tr>
                <tr>
                    <td>Population</td>
                    <td class="right-col">${population}</td>
                </tr>
                <tr>
                    <td>Capital City</td>
                    <td class="right-col">${data.restCtry.capital}</td>
                </tr>
                <tr>
                    <td>Dailing Code</td>
                    <td class="right-col">+${data.restCtry.callingCodes[0]}</td>
                </tr>
                <tr>
                    <th class="table-headings"><span style="font-size: 30px; color: black;"><i class="far fa-money-bill-alt"></i></span> Currency</th>
                    <th></th>
                </tr>
                <tr>
                    <td>Name</td>
                    <td class="right-col">${data.restCtry.currencies[0].name}</td>
                </tr>
                <tr>
                    <td>Code</td>
                    <td class="right-col">${data.restCtry.currencies[0].code}</td>
                </tr>
                <tr>
                    <td>Symbol</td>
                    <td class="right-col">${data.restCtry.currencies[0].symbol}</td>
                </tr>
                <tr>
                    <th class="table-headings"><span style="font-size: 30px; color: black;"><i class="fas fa-road"></i></span> Driving</th>
                    <th></th>
                </tr>
                <tr>
                    <td>Speed in</td>
                    <td class="right-col">${data.openCage.annotations.roadinfo.speed_in}</td>
                </tr>
                <tr>
                    <td>Drive on</td>
                    <td class="right-col">${data.openCage.annotations.roadinfo.drive_on}</td>
                </tr>
                <tr>
                <tr>
                    <th class="table-headings"><span style="font-size: 30px; color: black;"><i class="fas fa-language"></i></span> Language</th>
                    <th></th>
                </tr>
                <tr>
                    <td>Languages</td>
                    <td id="langCon" class="right-col"></td>
                </tr>
                <tr>
                    <th class="table-headings"><span style="font-size: 30px; color: black;"><i class="far fa-clock"></i></span> Timezone</th>
                    <th></th>
                </tr>
                <tr>
                    <td>Timezones</td>
                    <td id="tzCon" class="right-col"></td>
                </tr>
                <tr>
                    <th class="table-headings"><span style="font-size: 30px; color: black;"><i class="fas fa-glass-cheers"></i></span> Holidays</th>
                    <th></th>
                </tr>
            </table>
        `)

        $.each(data.restCtry.languages, (i, obj)=> {
            $("#langCon").append(`${obj.name}<br>`)
        })

        $.each(data.restCtry.timezones, (i, tz)=> {
            $("#tzCon").append(`${tz}<br>`)
        })

        $.each(data.holidays, (i, holiday)=> {
            $("#ctryTable").append(`
                <tr>
                    <td>${holiday.name}</td>
                    <td>${reverseStr(holiday.date)}</span></td>
                </tr>
            `)
        })

        return data;
        
    }

    const exRatesModal = (data) => {

        $("#modalContent").html("")
        $("#modalTitle").html(data.restCtry.name)

        $("#infoModal").show()
        $("#modalContent").append(`
            <table id="exRatesTable" class="table">
                <tr>
                    <th class="table-headings"><span style="font-size: 30px; color: black;"><i class="fas fa-coins"></i></span> Exchange</th>
                    <th></th>
                </tr>
            </table>
        `)

        $.each(data.exRates, (i, rate)=> {
            for (const [key, value] of Object.entries(rate)) {
                $("#exRatesTable").append(`
                    <tr>
                        <td><img src="./img/currencyFlags/${key}.png" onerror=this.src="./img/currencyFlags/flagPlaceHolder.png" alt="${key} Flag"></td>
                        <td>${key} ${value}</td>
                    </tr>
                `);
            };
        });
    }

    const newsModal = (data) => {

        $("#modalContent").html("")
        $("#modalTitle").html(data.restCtry.name)

        $("#infoModal").show()

        $("#modalContent").append(`

            <h4 class="table-headings"><span style="font-size: 30px; color: black;"><i class="far fa-newspaper"></i></span> News Headlines</h4>
            <hr>
        `)

        $.each(data.news, (i, news)=> {
            $("#modalContent").append(`
                <div class="card w-100 p-3" style="width: 18rem;">
                    <img src="${news.image.url}" class="card-img-top" alt="${news.title} picture" onerror=this.src="./img/newsPlaceholder.svg">
                    <div class="card-body">
                        <h5 class="card-title">${news.title}</h5>
                        <p class="card-text">${news.description}</p>
                        <a href="${news.url}" target="_blank" class="btn btn-dark">Read More</a>
                    </div>
                </div><br>
            `)
        })
        
    }

    const statsModal = (data) => {

        let symbol = data.restCtry.currencies[0].symbol;

        $("#modalContent").html("")
        $("#modalTitle").html(data.restCtry.name)

        $("#infoModal").show()

        $("#modalContent").append(`

            <h4><span style="font-size: 30px; color: black;"><i class="fas fa-shopping-cart"></i> Item Prices</h4>

            <table id="pricesTable" class="table">
                <tr>
                    <td colspan="4">Currency in ${data.prices.currency}</td>
                </tr>
                <tr>
                    <th>Item</th>
                    <th class="right-col">Low</th>
                    <th class="right-col">High</th>
                    <th class="right-col">Avg</th>
                </tr>
            </table>
        `)

        $.each(data.prices.prices, (i, obj)=> {

            console.log(obj.lowest_price)
            $("#pricesTable").append(`
                <tr>
                    <td>${obj.item_name}</td>
                    <td class=" right-col">${checkValue(symbol, obj.lowest_price)}</td>
                    <td class=" right-col">${checkValue(symbol, obj.highest_price)}</td>
                    <td class=" right-col">${checkValue(symbol, obj.average_price)}</td>
                </tr>
                
            `)
        })

    }

    const galleryModal = (data) => {
        
        $("#modalContent").html("")
        $("#modalTitle").html(data.restCtry.name)

        $("#infoModal").show()

        $("#modalContent").append(`

            <h4><span style="font-size: 30px; color: black;"><i class="far fa-images"></i></span> Gallery</h4>
            <hr>

            <div id="imgGallery" class="carousel slide" data-bs-ride="carousel">
                <div id="imgCarousel" class="carousel-inner" role="listbox">
                    <div class="carousel-item active">
                    <img src="${data.restCtry.flag}" class="d-block w-100" alt="${data.restCtry.name} Flag">
                    </div>
                </div>
            </div>
            

        `)

        $.each(data.images, (i, img)=> {
            $("#imgCarousel").append(`
                <div id="img${i}" class="carousel-item">
                    <img src="${img.large}" class="d-block w-100" alt="Gallery Image">
                </div>
            `)
        })

        $("#imgCarousel").append(`
            <a class="carousel-control-prev" href="#imgGallery" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon"></span>
            </a>
            <a class="carousel-control-next" href="#imgGallery" role="button" data-slide="next">
                <span class="carousel-control-next-icon"></span>
            </a>
        `)


    }

    const wikiModal = (data) => {

        $("#modalContent").html("")
        $("#modalTitle").html(data.restCtry.name)

        $("#infoModal").show()

        $("#modalContent").append(`

            <h4 class="table-headings"><span style="font-size: 30px; color: black;"><i class="fab fa-wikipedia-w"></i></span> Wiki Articles</h4>
            <hr>
        `)

        $.each(data.wiki, (i, wiki)=> {
            $("#modalContent").append(`
                <div class="card w-100 p-3" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${wiki.title}</h5>
                        <p class="card-text">${wiki.summary}</p>
                        <a href="https://${wiki.wikipediaUrl}" target="_blank" class="btn btn-dark">Read More</a>
                    </div>
                </div><br>
            `)
        })
        
    }
})