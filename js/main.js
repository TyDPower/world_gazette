import * as userLocation from "../common/userLocation.js";
import * as modal from "../common/modal.js";
import * as events from "../common/naturalEventsClass.js";
import * as utilities from "../common/utilities.js"
import * as country from "../common/countryClass.js"

$(document).ready(()=> {

    //Initial World map tiles
    var map = L.map('map').fitWorld();
    const worldMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });
    worldMap.addTo(map);

    //Grab user location with marker and country select
    var userCountry;
    map.locate({setView: true, maxZoom: 16});
    const onLocationFound = (e) => {
        var radius = e.accuracy;

        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();

        L.circle(e.latlng, radius).addTo(map);

        if (e.latlng) {

            userCountry = new country.Country();
            
            if (userCountry) {

                userCountry.utils.getInfo(userCountry, userCountry.URLs.openCage, e.latlng)
                .then((data)=> userCountry.utils.getInfo(data, data.URLs.restcountries, data.admin.iso[1]))
                .then((data)=> userCountry.utils.getInfo(data, data.URLs.numbeoCountryIndex, data.admin.iso[1]))
                .then((data)=> data.utils.getBorders(data, data.admin.iso[1]))
                .then((data)=> data.utils.addBorders(data, map))
            }
           
        }
        
    }
    map.on('locationfound', onLocationFound);
    const onLocationError = (e) => {
        alert(e.message);
    }
    map.on('locationerror', onLocationError);

    //Initial variable declaration for country change from down down menu
    var selectedCountry;
    //Initial variable declaration for natural events change from down down menu
    var naturalEvents;

    //Select new country with html drop down menu
    $("#countryList").change(()=> {

        const codeA3 = $("#countryList").val();

        if (!selectedCountry && !naturalEvents) {

            selectedCountry = new country.Country() 

        } else if (!selectedCountry && naturalEvents) {

            naturalEvents.utils.removeLayers(naturalEvents);
            selectedCountry = new country.Country()

        } else if (selectedCountry && !naturalEvents) {

            selectedCountry.utils.removeLayers(selectedCountry)
            selectedCountry = new country.Country()

        } else {

            naturalEvents.utils.removeLayers(naturalEvents);
            selectedCountry.utils.removeLayers(selectedCountry)
            selectedCountry = new country.Country()

        }
        
        selectedCountry.utils.getBorders(selectedCountry, codeA3)
        .then((data)=> data.utils.addBorders(data, map))

        selectedCountry.utils.getInfo(selectedCountry, selectedCountry.URLs.restcountries, codeA3)
        .then((data)=> selectedCountry.utils.getInfo(data, selectedCountry.URLs.numbeoCountryIndex))
        .then((data)=> selectedCountry.utils.getCurrencyExchange(data, userCountry.currency.code))
        .then((data)=> data.utils.panToCountry(map, data, true))
        .then((data)=> data.utils.countryInfoPopup(map, data))

    })

    map.on("click", ()=> {
        console.log("You clicked sir!")
    })

    //Select natural event with html drop down menu
    $("#naturalEvents").change(()=> {

        let period = $("input[name=naturalEvents]:checked").val();
        let event = $("#naturalEvents").val();

        if (!period) {
            alert("Please select either 'Today', 'Week', 'Month' or 'Year' to display natural events.")
        }

        if (!selectedCountry && !naturalEvents) {

            naturalEvents = new events.NaturalEvents();

        } else if (!selectedCountry && naturalEvents) {

            naturalEvents.utils.removeLayers(naturalEvents);
            naturalEvents = new events.NaturalEvents();

        } else if (selectedCountry && !naturalEvents) {

            selectedCountry.utils.removeLayers(selectedCountry);
            naturalEvents = new events.NaturalEvents();

        } else {

            naturalEvents.utils.removeLayers(naturalEvents);
            selectedCountry.utils.removeLayers(selectedCountry);
            naturalEvents = new events.NaturalEvents();

        }

        naturalEvents.utils.getEvents(period, event, naturalEvents)
        .then((data)=> naturalEvents.utils.addEvents(map, data));

    })

})