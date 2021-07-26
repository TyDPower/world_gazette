/*--------------- CONTENT ---------------*/
/*
    1. IMPORTS
    2. HTTP TO HTTPS REDIRECT
*/

/*--------------- 1. IMPORTS ---------------*/
import * as mapUtils from "../common/mapsAndOverlays.js";
import * as modals from "../common/modals.js";
import * as ajax from "../common/ajax.js"
import * as user from "../common/userCountry.js"
import * as utils from "../common/utilities.js"

/*--------------- 2. HTTP TO HTTPS REDIRECT ---------------*/
if (window.location.protocol == 'http:') {
    window.location.href = window.location.href.replace('http:', 'https:');
}

var myCarousel = document.querySelector('#myCarousel')
var carousel = new bootstrap.Carousel(myCarousel)

var map = L.map('map', {
    center: [0, 0],
    zoom: 2,
    layers: [mapUtils.tiles.thunderForest,  mapUtils.tiles.openStreetmap]
})

const clearLayers = () => {
    mapUtils.layerGroups.cityGroup.clearLayers(),
    mapUtils.layerGroups.beachCamsGroup.clearLayers(),
    mapUtils.layerGroups.trafficCamsGroup.clearLayers(),
    mapUtils.layerGroups.squareCamsGroup.clearLayers(),
    mapUtils.layerGroups.cityGroup.clearLayers(),
    mapUtils.layerGroups.mountainPOIGroup.clearLayers(),
    mapUtils.layerGroups.airportPOIGroup.clearLayers(),
    mapUtils.layerGroups.beachPOIGroup.clearLayers(),
    mapUtils.layerGroups.castlePOIGroup.clearLayers(),
    mapUtils.layerGroups.beachPOIGroup.clearLayers(),
    mapUtils.layerGroups.lakePOIGroup.clearLayers()
}

L.control.layers(mapUtils.baseMaps, mapUtils.markerOverlays).addTo(map);
const ctryLayerGroup = L.layerGroup();
var popupLayer;
let countryData;

$("#preloader").fadeIn("fast")

const addCtryLayer = (data) => {

    ctryLayerGroup.addLayer(L.geoJSON(data.borders)).addTo(map);

    let crds = data.ctryInfo.openCage.bounds
    let bounds = [
            [crds.northeast.lat, crds.northeast.lng], [crds.southwest.lat, crds.southwest.lng]
    ]
    map.fitBounds(bounds)

    return data;
}

const displayMarkers = (data, clusterGroup, marker) => {
    $.each(data, (i,o)=> {

        if (o.latitude && o.longitude) {
                clusterGroup.addLayer(L.marker([o.latitude, o.longitude], {icon: marker}).on(
                    "click", ()=> {
                        $("#preloader").fadeIn("fast")
                        ajax.getPopupInfo([o.latitude, o.longitude])
                        .then((data)=> {
                            L.popup().setLatLng([o.latitude, o.longitude]).setContent(`
                            <div id="popup">
                            <h1><span style="font-size: 30px; color: black;"><i class="fas fa-info-circle"></i></span>&nbsp${utils.getName(data)}</h1>
                            <table class="table">
                                <tr>
                                    <td>Road</td>
                                    <td class="right-col">${data.location.road}</td>
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
                                    <td>Average ${data.weather.daily[0].temp.day}<sup>o</sup>C<br>
                                    Minimum ${data.weather.daily[0].temp.min}<sup>o</sup>C<br>
                                    Maximum ${data.weather.daily[0].temp.max}<sup>o</sup>C</td>
                                </tr>
                                <tr>
                                    <td>Current</td>
                                    <td>Temperture ${data.weather.current.temp}<sup>o</sup>C<br>
                                    ${data.weather.current.weather[0].description}</td>
                                </tr>
                                <tr>
                                    <td>Tomorrow</td>
                                    <td>Average ${data.weather.daily[1].temp.day}<sup>o</sup>C<br>
                                    ${data.weather.daily[1].weather[0].description}</td>             
                                </tr>
                            </table>
                        </div>
                            `).openOn(map);
                        })
                        .then(()=> $("#preloader").fadeOut("fast"))
                        .then(()=> popupLayer = $(".leaflet-popup"))
                        .catch((err)=> console.error(err));
                    })
                );
        }

        if (o.lat && o.lng) {
                clusterGroup.addLayer(L.marker([o.lat, o.lng], {icon: marker}).on(
                    "click", ()=> {
                        $("#preloader").fadeIn("fast")
                        ajax.getPopupInfo([o.lat, o.lng])
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
                                    <td>Postal Code</td>
                                    <td class="right-col">${data.location.postcode}</td>
                                </tr>
                            </table>
            
                            <h2><span style="font-size: 20px; color: black;"><i class="fas fa-temperature-high"></i></span>&nbspWeather</h2>
                            <table class="table">
                                <tr>
                                    <td>Today</td>
                                    <td>Average ${data.weather.daily[0].temp.day}<sup>o</sup>C<br>
                                    Minimum ${data.weather.daily[0].temp.min}<sup>o</sup>C<br>
                                    Maximum ${data.weather.daily[0].temp.max}<sup>o</sup>C</td>
                                </tr>
                                <tr>
                                    <td>Current</td>
                                    <td>Temperture ${data.weather.current.temp}<sup>o</sup>C<br>
                                    ${data.weather.current.weather[0].description}</td>
                                </tr>
                                <tr>
                                    <td>Tomorrow</td>
                                    <td>Average ${data.weather.daily[1].temp.day}<sup>o</sup>C<br>
                                    ${data.weather.daily[1].weather[0].description}</td>             
                                </tr>
                            </table>
                        </div>
                            `).openOn(map).bringToFront();
                        })
                        .then(()=> $("#preloader").fadeOut("fast"))
                        .then(()=> popupLayer = $(".leaflet-popup"))
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
                    ajax.getPopupInfo([o.location.latitude, o.location.longitude])
                        .then((data)=> {
                            L.popup().setLatLng([o.location.latitude, o.location.longitude]).setContent(`
                                <div id="popup">
                                    <h1><span style="font-size: 30px; color: black;"><i class="fas fa-info-circle"></i></span>&nbsp${utils.getName(data)}</h1>
                                    <table class="table">
                                        <tr>
                                            <td>Road</td>
                                            <td class="right-col">${data.location.road}</td>
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
                                            <td>Minimum ${data.weather.daily[0].temp.min}<sup>o</sup>C<br>
                                            Maximum ${data.weather.daily[0].temp.max}<sup>o</sup>C<br>
                                            Average ${data.weather.daily[0].temp.day}<sup>o</sup>C</td>
                                        </tr>
                                        <tr>
                                            <td>Current</td>
                                            <td>Temperture ${data.weather.current.temp}<sup>o</sup>C<br>
                                            ${data.weather.current.weather[0].description}</td>
                                        </tr>
                                        <tr>
                                            <td>Tomorrow</td>
                                            <td>Average ${data.weather.daily[1].temp.day}<sup>o</sup>C<br>
                                            ${data.weather.daily[1].weather[0].description}</td>                     
                                        </tr>
                                    </table>
                                    <h2><span style="font-size: 20px; color: black;"><i class="fas fa-video"></i></span>&nbspWebcam</h2>
                                    <div id="videoPlayer">
                                        <iframe class="holds-the-iframe" src="${o.player.month.embed}style="width:100%"></iframe> 
                                    </div>
                                </div>
                            `).openOn(map); 
                        })
                        .then(()=> $("#preloader").fadeOut("fast"))
                        .then(()=> popupLayer = $(".leaflet-popup"))
                        .catch((err)=> console.error(err));                  
                }))
        }
    })
        
}

const loadOverlays = (data) => {

    let something = true;

    return new Promise((resolve, reject)=> {

        displayWebCamMarkers(data.overlays.beachCams, mapUtils.layerGroups.beachCamsGroup, mapUtils.markers.beachCam);
        displayWebCamMarkers(data.overlays.trafficCams, mapUtils.layerGroups.trafficCamsGroup, mapUtils.markers.trafficCam);
        displayWebCamMarkers(data.overlays.squareCams, mapUtils.layerGroups.squareCamsGroup, mapUtils.markers.squareCam);
        displayMarkers(data.overlays.cities, mapUtils.layerGroups.cityGroup, mapUtils.markers.city);
        displayMarkers(data.overlays.mountainPOI, mapUtils.layerGroups.mountainPOIGroup, mapUtils.markers.mountainPOI);
        displayMarkers(data.overlays.airportPOI, mapUtils.layerGroups.airportPOIGroup, mapUtils.markers.airportPOI);
        displayMarkers(data.overlays.beachPOI, mapUtils.layerGroups.beachPOIGroup, mapUtils.markers.beachPOI);
        displayMarkers(data.overlays.castlePOI, mapUtils.layerGroups.castlePOIGroup, mapUtils.markers.castlePOI);
        displayMarkers(data.overlays.lakePOI, mapUtils.layerGroups.lakePOIGroup, mapUtils.markers.lakePOI);

        if (something) {
            resolve(data.code)
        } else {
            reject("Overlays did not load!")
        }
    })
}
    
user.getUserLatLng()
.then((data)=> user.getUserCtry(data))
.then((data)=> utils.getCountryList(data))
.then((data)=> ajax.getOverlayInfo(data))
.then((data)=> loadOverlays(data))
.then((data)=> ajax.getCountryInfo(data))
.then((data)=> modals.ctryInfo(data))
.then((data)=> ajax.getCtryBorders(data))
.then((data)=> addCtryLayer(data))
.then((data)=> countryData = data.ctryInfo)
.then(()=> $("#preloader").fadeOut("fast"))
.catch((err)=> console.error(err));

$("#countrySelector").on("change", ()=> {

    $(popupLayer).remove()
    $("#preloader").fadeIn("fast")
        
    let code = $("#countrySelector").val()

    ctryLayerGroup.clearLayers();
    clearLayers();

    ajax.getOverlayInfo(code)
    .then((data)=> loadOverlays(data))
    .then((data)=> ajax.getCountryInfo(data))
    .then((data)=> modals.ctryInfo(data))
    .then((data)=> ajax.getCtryBorders(data))
    .then((data)=> addCtryLayer(data))
    .then((data)=> countryData = data.ctryInfo)
    .then(()=> $("#preloader").fadeOut("fast"))
    .catch((err)=> console.error(err));
        
})

$("#ctryModalcloseBtn").on("click", ()=> {
    $("#countryModal").hide();
})

$("#modalClsBtn").on("click", ()=> {
    $("#infoModal").hide()
})

$("#ctryBtn").on("click", ()=> {
    modals.ctryInfo(countryData);     
})

$("#exRatesBtn").on("click", ()=> {
    modals.exRates(countryData);        
})

$("#statsBtn").on("click", ()=> {
    modals.stats(countryData);        
})

$("#newsBtn").on("click", ()=> {
    modals.news(countryData);        
})

$("#galleryBtn").on("click", ()=> {
    modals.gallery(countryData);        
})

$("#wikiBtn").on("click", ()=> {
    modals.wiki(countryData);        
})

$("#modNavInfo").on("click", ()=> {
    modals.ctryInfo(countryData);    
})

$("#modNavRate").on("click", ()=> {
    modals.exRates(countryData);        
})

$("#modNavStats").on("click", ()=> {
    modals.stats(countryData);        
})

$("#modNavNews").on("click", ()=> {
    modals.news(countryData);        
})

$("#modNavGallery").on("click", ()=> {
    modals.gallery(countryData);        
})

$("#modNavWiki").on("click", ()=> {
    modals.wiki(countryData);        
})

$(".leaflet-control-layers-overlays").on("click", ()=> {
    $(popupLayer).remove();
})