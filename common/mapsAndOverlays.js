import { getPopupInfo } from "./ajax.js"
import { getName } from "./utilities.js"

export const tiles = {
    thunderForest: L.tileLayer('https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=3bd3719a93e0430094d656e7d697f55e', {
        maxZoom: 22,
        attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    openStreetmap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
}

export const baseMaps = {
    "World Map": tiles.thunderForest,
    "Streets": tiles.openStreetmap
}

export const layerGroups = {
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
    lakePOIGroup: L.markerClusterGroup()
}

export const markers = {
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

export const markerOverlays = {
    "Cities": layerGroups.cityGroup,
    "Webcams Beaches": layerGroups.beachCamsGroup,
    "Webcams Traffic": layerGroups.trafficCamsGroup,
    "Webcams City Center": layerGroups.squareCamsGroup,
    "POI Mountains": layerGroups.mountainPOIGroup,
    "POI Airports": layerGroups.airportPOIGroup,
    "POI Beaches": layerGroups.beachPOIGroup,
    "POI Castles": layerGroups.castlePOIGroup,
    "POI Lakes": layerGroups.lakePOIGroup
}