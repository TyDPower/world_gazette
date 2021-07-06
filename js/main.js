import * as userLocation from "../common/userLocation.js";
import * as modal from "../common/modal.js";
import * as events from "../common/naturalEventsClass.js";
import * as utilities from "../common/utilities.js";
import * as country from "../common/countryClass.js";
import * as restaurants from "../common/restaurants.js";
import * as geoData from "../common/geoData.js";

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
                .then((data)=> data.utils.getInfo(data, data.URLs.restcountries, data.admin.iso[1]))
                .then((data)=> data.utils.getInfo(data, data.URLs.numbeoCountryIndex, data.admin.iso[1]))
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

    //Select natural event with html drop down menu
    

    //Nav country search
    $("#countrySearch").click(()=> {
        $(".modal").addClass(" modalOff");

        $("#searchCountriesModal").removeClass(" modalOff");
    })

    $("#searchCountriesBtn").click(()=> {

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
        //--------------------------------------------
        
        selectedCountry.utils.getBorders(selectedCountry, codeA3)
        .then((data)=> data.utils.addBorders(data, map))

        selectedCountry.utils.getInfo(selectedCountry, selectedCountry.URLs.restcountries, codeA3)
        .then((data)=> data.utils.getInfo(data, data.URLs.numbeoCountryIndex))
        .then((data)=> data.utils.getCurrencyExchange(data, userCountry.currency.code))
        .then((data)=> data.utils.panToCountry(map, data, true))
        .then((data)=> data.utils.countryInfoPopup(map, data))
        .then(()=> modal.countryInfo(selectedCountry, userCountry))
        .then(()=> selectedCountry.languages)
        .then(()=> geoData.getGeoData(selectedCountry, map, "AIRP"))

        geoData.clusters.clearLayers();

        $("#searchCountriesModal").hide();

        $("#countryModalClseBtn").click(()=>$("#countryModal").hide())

    })

    $("#countriesSeachCloseBtn").click(()=> {
        $("#searchCountriesModal").addClass(" modalOff");
    })

    //Nav world search
    $("#worldSearch").click(()=> {
        $(".modal").addClass(" modalOff");

        $("#searchWorldModal").removeClass(" modalOff")
    })

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

    $("#seachWorldCloseBtn").click(()=> {
        $("#searchWorldModal").addClass(" modalOff")
    })

    //Nav clear markers
    $("#clearMarkers").click(()=> {
        $(".modal").removeClass(" modalOn");
        $(".modal").addClass(" modalOff");
        if (!naturalEvents && !selectedCountry) {
            geoData.clusters.clearLayers();
        } else if (!naturalEvents) {
            selectedCountry.utils.removeLayers(selectedCountry);
            geoData.clusters.clearLayers();
        } else if (!selectedCountry) {
            naturalEvents.utils.removeLayers(naturalEvents);
            geoData.clusters.clearLayers();
        } else {
            selectedCountry.utils.removeLayers(selectedCountry);
            naturalEvents.utils.removeLayers(naturalEvents);
            geoData.clusters.clearLayers();
        }        
    })

    //Nav app info with tabs
    $("#appInfo").click(()=> {
        $(".modal").addClass(" modalOff");
        $(".modalTabLinks").removeClass(" activeTab");
        $("#infoDisplay").addClass(" modalOff");
        $("#howItWorksDisplay").addClass(" modalOff");
        $("#creditsDisplay").addClass(" modalOff");

        $("#appInfoModal").removeClass(" modalOff");
        $("#infoDisplay").removeClass(" modalOff");
        $("#appInfoTab").addClass(" activeTab");
    })

    $("#appInfoTab").click(()=> {
        $(".modalTabContent").addClass(" modalOff");
        $(".modalTabLinks").removeClass(" activeTab");

        $("#infoDisplay").removeClass(" modalOff");
        $("#appInfoTab").addClass(" activeTab");

    })

    $("#howItWorksTab").click(()=> {
        $(".modalTabContent").addClass(" modalOff");
        $(".modalTabLinks").removeClass(" activeTab");

        $("#howItWorksDisplay").removeClass(" modalOff");
        $("#howItWorksTab").addClass(" activeTab");
    })

    $("#creditsTab").click(()=> {
        $(".modalTabContent").addClass(" modalOff");
        $(".modalTabLinks").removeClass(" activeTab");

        $("#creditsDisplay").removeClass(" modalOff");
        $("#creditsTab").addClass(" activeTab");
    })

    $("#appInfoCloseBtn").click(()=> {
        $("#appInfoModal").addClass(" modalOff");
        $(".modalTabLinks").removeClass(" activeTab");
    })

    //Nav contact
    $("#contactInfo").click(()=> {
        $(".modal").addClass(" modalOff");

        $("#contactModal").removeClass(" modalOff");
    })

    $("#contactCloseBtn").click(()=> {
        $("#contactModal").addClass(" modalOff");
    })

})