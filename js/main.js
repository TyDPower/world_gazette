import * as events from "../common/naturalEventsClass.js";
import * as utils from "../common/utilities.js";
import * as country from "../common/countryClass.js";
import * as restaurants from "../common/restaurants.js";
import * as geoData from "../common/geoData.js";
import * as modals from "../common/modals.js";
import { worldTiles } from "../common/mapAndOverlays.js";

$(document).ready(()=> {

    //Initial World map tiles
    var map = L.map('map').fitWorld();

    worldTiles.maps.default.addTo(map);

    //Grab user location with marker and country select
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

    //Initial variable declaration for country change from down down menu
    var selectedCountry;
    //Initial variable declaration for natural events change from down down menu
    var naturalEvents;    

    //Nav country search

    $("#appNavIcon").click(()=> {
        $("#appNav").fadeIn();
        $("#appNavIcon").hide()

        setTimeout(()=> {
            $("#appNav").fadeOut();
            $("#appNavIcon").fadeIn()
        }, 3000)
    })

    $("#countrySearch").click(()=> {
        $(".modal").addClass(" modalOff");

        $("#searchCountriesModal").removeClass(" modalOff");
    })

    $("#searchCountriesBtn").click(()=> {

        const codeA3 = $("#countryList").val();
        const poi = $("input[name='searchCountryOptions']:checked").val();

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
        .then((data)=> data.layerGroups.addLayer(L.marker(data.admin.latlng).on("click", ()=> {modals.countryModal(selectedCountry, userCountry)})).addTo(map))
        .then(()=> {if (poi) {geoData.getGeoData(selectedCountry, map, poi)}})

        geoData.clusters.clearLayers();
        $("#searchCountriesModal").addClass(" modalOff");
        
    })

    $("#countryModalcloseBtn").click(()=> {
        $("#countryModal").addClass(" modalOff");
    })

    $("#geoDataModalcloseBtn").click(()=> {
        $("#geoDataModal").addClass(" modalOff");
    })

    $("#countriesSeachCloseBtn").click(()=> {
        $("#searchCountriesModal").addClass(" modalOff");
    })

    //Nav world search
    $("#worldSearch").click(()=> {
        $(".modal").addClass(" modalOff");

        $("#searchWorldModal").removeClass(" modalOff")
    })

    $("#searchWorldBtn").click(()=> {

        let event = $("input[name='naturalEvents']:checked").val();

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

        naturalEvents.utils.getEvents(event, naturalEvents, map);

        $("#searchWorldModal").addClass(" modalOff")

    })

    $("#seachWorldCloseBtn").click(()=> {
        $("#searchWorldModal").addClass(" modalOff")
    })

    $("#naturalEventsModalcloseBtn").click(()=> {
        $("#naturalEventsModal").addClass(" modalOff");
    })

    //Nav select map
    $("#changeMap").click(()=> {
        $(".modal").addClass(" modalOff");
        $("#selectMapModal").removeClass(" modalOff");
    })

    $("#selectMapBtn").click(()=> {

        if (naturalEvents) {
            naturalEvents.utils.removeLayers(naturalEvents)
        }

        worldTiles.utils.loadOverlays(map);
        $("#selectMapModal").addClass(" modalOff")

    })

    $("#selectMapCloseBtn").click(()=> {
        $("#selectMapModal").addClass(" modalOff")
    })

    //Nav clear markers
    $("#clearMarkers").click(()=> {
        utils.clearAllLayers(selectedCountry, naturalEvents, geoData, worldTiles, map);
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