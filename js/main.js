/*--------------- CONTENT ---------------*/
/*
    1. IMPORTS
    2. HTTP TO HTTPS REDIRECT
    3. WINDOW PRELOADER
    4. JQUERY DOCUMENT
        4.1 LOAD WORLD MAP TILES
        4.2 LOAD USER LOCATION
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
$(window).on("load", ()=> {
    $("#preloader").fadeOut("slow")
});

/*--------------- 4. JQUERY DOCUMENT ---------------*/
$(document).ready(()=> {

    /*--------------- 4.1 LOAD WORLD MAP TILES ---------------*/
    var map = L.map('map').fitWorld();
    worldTiles.maps.default.addTo(map);

    /*--------------- 4.2 LOAD USER LOCATION ---------------*/
    var userCountry;
    map.locate({setView: true, maxZoom: 16});
    const onLocationFound = (e) => {
        var radius = e.accuracy;

        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius.toFixed(0) + " meters from this point").openPopup();

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

    /*--------------- 4.3 GLOBAL VARIABLE DELARATIONS ---------------*/
    //INITIAL VAR DECLARATIONS FOR COUNTRY AND NATURAL EVENTS OBJECTS
    var selectedCountry;
    var naturalEvents;  
    
    /*--------------- 4.4 NAV ICONS ---------------*/
    /*--------------- 4.4.1 MOBILE MENU ICON ---------------*/
    $("#appNavIcon").click(()=> {
        $("#appNav").fadeIn();
        $("#appNavIcon").hide()

        setTimeout(()=> {
            $("#appNav").fadeOut();
            $("#appNavIcon").fadeIn()
        }, 3000)
    })

    /*--------------- 4.4.2 NAV COUNTRY SEARCH ---------------*/
    /*--------------- 4.4.2.1 NAV COUNTRY SEARCH MODAL ---------------*/
    $("#countrySearch").click(()=> {
        $(".modal").addClass(" modalOff");

        $("#searchCountriesModal").removeClass(" modalOff");
    })

    /*--------------- 4.4.2.2 COUNTRY SEARCH FUNCTIONS ---------------*/
    $("#searchCountriesBtn").click(()=> {

        const codeA3 = $("#countryList").val();
        const poi = $("input[name='searchCountryOptions']:checked").val();
        let loaded = false;

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
        

        utils.preloader(loaded)
        
        selectedCountry.utils.getBorders(selectedCountry, codeA3)
        .then((data)=> data.utils.addBorders(data, map))

        selectedCountry.utils.getInfo(selectedCountry, selectedCountry.URLs.restcountries, codeA3)
        .then((data)=> data.utils.getInfo(data, data.URLs.numbeoCountryIndex))
        .then((data)=> data.utils.getCurrencyExchange(data, userCountry.currency.code))
        .then((data)=> data.utils.panToCountry(map, data, true))
        .then((data)=> data.utils.countryInfoPopup(map, data))
        .then((data)=> data.layerGroups.addLayer(L.marker(data.admin.latlng).on("click", ()=> {modals.countryModal(selectedCountry, userCountry)})).addTo(map))
        .then(()=> {if (poi) {geoData.getGeoData(selectedCountry, map, poi)}})
        .then(()=> loaded = true)
        .then(()=> utils.preloader(loaded))

        geoData.clusters.clearLayers();
        $("#searchCountriesModal").addClass(" modalOff");
        
    })

    /*--------------- 4.4.2.3 COUNTRY SEARCH CLOSE FUNCTIONS ---------------*/
    $("#countryModalcloseBtn").click(()=> {
        $("#countryModal").addClass(" modalOff");
    })
    $("#geoDataModalcloseBtn").click(()=> {
        $("#geoDataModal").addClass(" modalOff");
    })
    $("#countriesSeachCloseBtn").click(()=> {
        $("#searchCountriesModal").addClass(" modalOff");
    })

    /*--------------- 4.4.3 NAV WORLD SEARCH ---------------*/
    /*--------------- 4.4.3.1 NAV WORLD SEARCH MODAL ---------------*/
    $("#worldSearch").click(()=> {
        $(".modal").addClass(" modalOff");
        $("#searchWorldModal").removeClass(" modalOff")
    })

    /*--------------- 4.4.3.2 WORLD SEARCH FUNCTIONS ---------------*/
    $("#searchWorldBtn").click(()=> {

        let event = $("input[name='naturalEvents']:checked").val();
        let loaded = false;

        if (!selectedCountry && !naturalEvents) {

            naturalEvents = new events.NaturalEvents();

        } else if (!selectedCountry && naturalEvents) {

            naturalEvents.utils.removeLayers(naturalEvents);
            naturalEvents = new events.NaturalEvents();

        } else if (selectedCountry && !naturalEvents) {

            selectedCountry.utils.removeLayers(selectedCountry);
            geoData.removeLayers();
            naturalEvents = new events.NaturalEvents();

        } else {

            naturalEvents.utils.removeLayers(naturalEvents);
            selectedCountry.utils.removeLayers(selectedCountry);
            geoData.removeLayers();
            naturalEvents = new events.NaturalEvents();
        }

        utils.preloader(loaded);

        naturalEvents.utils.getEvents(event, naturalEvents, map)
        .then(()=> loaded = true)
        .then(()=> utils.preloader(loaded));

        $("#searchWorldModal").addClass(" modalOff")

    })

    /*--------------- 4.4.3.3 WORLD SEARCH CLOSE FUNCTIONS ---------------*/
    $("#seachWorldCloseBtn").click(()=> {
        $("#searchWorldModal").addClass(" modalOff")
    })
    $("#naturalEventsModalcloseBtn").click(()=> {
        $("#naturalEventsModal").addClass(" modalOff");
    })

    /*--------------- 4.4.4 NAV SELECT MAP ---------------*/
    /*--------------- 4.4.4.1 NAV SELECT MAP MODAL ---------------*/
    $("#changeMap").click(()=> {
        $(".modal").addClass(" modalOff");
        $("#selectMapModal").removeClass(" modalOff");
    })

    /*--------------- 4.4.4.2 NAV SELECT MAP FUNCTIONS ---------------*/
    $("#selectMapBtn").click(()=> {

        if (naturalEvents) {
            naturalEvents.utils.removeLayers(naturalEvents)
        }

        worldTiles.utils.loadOverlays(map)

        $("#selectMapModal").addClass(" modalOff")

    })

    /*--------------- 4.4.4.3 NAV SELECT MAP CLOSE FUNCTIONS ---------------*/
    $("#selectMapCloseBtn").click(()=> {
        $("#selectMapModal").addClass(" modalOff")
    })

    /*--------------- 4.4.5 NAV CLEAR MARKERS ---------------*/
    /*--------------- 4.4.5.1 NAV CLEAR MARKERS FUNCTION ---------------*/
    $("#clearMarkers").click(()=> {
        utils.clearAllLayers(selectedCountry, naturalEvents, geoData, worldTiles, map);
    })

    /*--------------- 4.4.6 NAV INFO ---------------*/
    /*--------------- 4.4.6.1 NAV INFO MODAL ---------------*/
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

    /*--------------- 4.4.6.2 NAV INFO TABS ---------------*/
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

    /*--------------- 4.4.6.3 NAV INFO CLOSE FUNCTIONS ---------------*/
    $("#appInfoCloseBtn").click(()=> {
        $("#appInfoModal").addClass(" modalOff");
        $(".modalTabLinks").removeClass(" activeTab");
    })

    /*--------------- 4.4.7 NAV CONTACT ---------------*/
    /*--------------- 4.4.7.1 NAV CONTACT MODAL ---------------*/
    $("#contactInfo").click(()=> {
        $(".modal").addClass(" modalOff");

        $("#contactModal").removeClass(" modalOff");
    })

    /*--------------- 4.4.7.2 NAV CONTACT CLOSE FUNCTIONS ---------------*/
    $("#contactCloseBtn").click(()=> {
        $("#contactModal").addClass(" modalOff");
    })

})