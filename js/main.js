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

    /*--------------- 4.1 LOAD WORLD MAP TILES ---------------*/
    var map = L.map('map').fitWorld();
    worldTiles.maps.default.addTo(map);

    /*--------------- 4.2 LOAD USER COUNTRY ---------------*/

    const ctryLayerGroup = L.layerGroup();

    const getUserLatLng = () => {

        var options = {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0
        };

        return new Promise((resolve, reject)=> {

            navigator.geolocation.getCurrentPosition((pos)=> {
                var crd = [pos.coords.latitude, pos.coords.longitude];
                resolve(crd);
            }, (err)=> {
                reject(err);
            }, options)
        })

    }

    const getUserCtry = (latLng) => {

        let ctryInfo;

        return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getUserCtry.php",
                type: "post",
                dataType: "json",
                data: {
                    lat: latLng[0],
                    lng: latLng[1]
                },

                success: (res)=> {
                    resolve(ctryInfo = {
                        code: res.data
                    })
                },

                error: (err)=> {
                    console.error(err);
                }
            })
        })
    }

    const getCtryBorders = (obj) => {

        let ctryInfo;

        return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getCtryBorders.php",
                type: "post",
                dataType: "json",
                data: {
                    code: obj.code
                },

                success: (res)=> {
                    resolve(ctryInfo = {
                        borders: res.data[0].geometry,
                        code: obj.code
                    })
                },

                error: (err)=> {
                    reject(err);
                }
            })
        })

    }

    const addBorderLayer = (ctryInfo) => {

        ctryLayerGroup.addLayer(L.geoJSON(ctryInfo.borders)).addTo(map);

        let bounds = [
            [61.061, 2.0919117], [49.674, -14.015517]
        ] // bounds found in openCage[0]
        map.fitBounds(bounds)

        return ctryInfo;
    }


    $("#preloader").fadeIn("fast")

    getUserLatLng()
    .then((data)=> getUserCtry(data))
    .then((data)=> getCtryBorders(data))
    .then((data)=> addBorderLayer(data))
    .then((data)=> getCountryInfo(data))
    .then((data)=> getAddCtryInfo(data))
    .then((data)=> ctryInfoModal(data))
    .then(()=> $("#preloader").fadeOut("fast"))
    .catch((err)=> console.error(err));
    
    //$("#preloader").fadeOut("fast")


    //Zoom to and highlight user country
    

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



    //------------------NEW CODE

    const getCountryList = () => {
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
                } else {
                    console.error(`Error code: ${res.status.code}`)
                }
            },
            error: (err)=> {
                console.error(err);
            }
        })
    };

    getCountryList();

    const getCountryBorders = (isoCodeA2) => {

        return new Promise((resolve, reject)=> {

            $.getJSON("./common/countryBorders.geo.json", (data) => {
                for (let i=0; i<data.features.length; i++) {
                    if (data.features[i].properties.iso_a2 === isoCodeA2) {
                        let obj = data.features[i].geometry;
                        if (obj) {
                            resolve(obj);
                        } else {
                            reject("No ISO Match!")
                        }
                    }
                }
            
            })

        })

    }

    const getCountryInfo = (ctryInfo) => {

        const date = new Date();

        return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getCountryInfo.php",
                type: "post",
                dataType: "json",
                data: {
                    code: ctryInfo.code,
                    year: date.getFullYear()
                },

                success: (res)=> {
                    resolve(res.data)
                },

                error: (err)=> {
                    reject(err);
                }
            })
        })
    }

    const getAddCtryInfo = (data) => {

        let ctryData;

        return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getAddCtryInfo.php",
                type: "post",
                dataType: "json",
                data: {
                    currCode: data.restCtry.currencies[0].code,
                    name: data.restCtry.nativeName.replace(/\s+/g, "%20")
                },

                success: (res)=> {
                    resolve(ctryData = {
                        exRates: res.data.exRates,
                        news: res.data.news,
                        wiki: res.data.wiki,
                        images: res.data.images,
                        openCage: res.data.openCage,
                        holidays: data.holidays,
                        restCtry: data.restCtry,
                        })
                },

                error: (err)=> {
                    reject(err);
                }
            })
        })
    }

    const getWebCams = (isoCodeA2, category) => {

        return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getWebCams.php",
                type: "post",
                dataType: "json",
                data: {
                    code: isoCodeA2,
                    category: category
                },

                success: (res)=> {
                    resolve(res)
                },

                error: (err)=> {
                    reject(err);
                }
            })

        })
    }

    const getCities = (isoCodeA2) => {

        return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getCities.php",
                type: "post",
                dataType: "json",
                data: {
                    code: isoCodeA2
                },

                success: (res)=> {
                    resolve(res.data)
                },

                error: (err)=> {
                    reject(err);
                }
            })
        })
    }

    const getWeather = (latLng) => {

        return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getWeather.php",
                type: "post",
                dataType: "json",
                data: {
                    lat: latLng[0],
                    lng: latLng[1]
                },

                success: (res)=> {
                    resolve(res)
                },

                error: (err)=> {
                    reject(err)
                }
            })
        })
    }


    const ctryInfoModal = (data) => {

        const imgCheck = (img) => {
            if (img) {
                return img;
            } else {
                return "./images/wildfireMarker.svg";
            }
        }

        $("#ctryFlag").attr("src", data.restCtry.flag);
        $("#ctryName").html(data.restCtry.name);

        let areaSize = data.restCtry.area.toLocaleString();
        let population = data.restCtry.population.toLocaleString();
        $("#adminInfo").html("");
        $("#adminInfo").append(`
            <p><span>Region: </span><span>${data.restCtry.region}</span></p>
            <p><span>Subregion: </span><span>${data.restCtry.subregion}</span></p>
            <p><span>Area: </span><span>${areaSize}km<sup>2</sup></p>
            <p><span>Population: </span><span>${population}</span></p>
            <p><span>ISO Alpha 2 Ccode: </span><span>${data.restCtry.alpha2Code}</span></p>
            <p><span>ISO Alpha 3 Ccode: </span><span>${data.restCtry.alpha3Code}</span></p>
            <p><span>Capital City: </span><span>${data.restCtry.capital}</span></p>
            <p><span>Dailing Code: </span><span>+${data.restCtry.callingCodes[0]}</span></p>
        `);

        $("#ctryLang").html("");
        $.each(data.restCtry.languages, (index, obj)=> {
            $("#ctryLang").append(`
                <p>${obj.name}</p>
            `)
        })

        $("#ctryTZ").html("");
        $.each(data.restCtry.timezones, (index, tz)=> {
            $("#ctryTZ").append(`
                <p>${tz}</p>
            `)
        })

        $("#wikiInfo").html("");
        $.each(data.wiki.geonames, (index, obj)=> {
            $("#wikiInfo").append(`
                <br><img src="${imgCheck(obj.thumbnailImg)}">
                <h3>${obj.title}</h3>
                <p>${obj.summary} <a href="https://${obj.wikipediaUrl}" target="_blank">read more</a></p>
                <br><hr>
            `);
        });

        $("#curInfo").html("");
        $("#curInfo").append(`
            <p><span>Name: </span><span>${data.restCtry.currencies[0].name}</span></p>
            <p><span>Code: </span><span>${data.restCtry.currencies[0].code}</span></p>
            <p><span>Symbol: </span><span>${data.restCtry.currencies[0].symbol}</span></p>
        `);

        $("#exRateKeyVal").html("");
        $.each(data.exRates, (index, obj)=> {
            for (const [key, value] of Object.entries(obj)) {
                $("#exRateKeyVal").append(`${key}: ${value}<br>`);
            };
        });

        $("#borderingCtry").html("");
        if (data.restCtry.borders.length > 0) {
            $.each(data.restCtry.borders, (index, ctry)=> {
                $("#borderingCtry").append(`
                <p>${ctry}</p>
                `);
            });
        } else {
            $("#borderingCtry").html("No bordering countries.");
        };

        $("#ctryNews").html("");
        $.each(data.news, (index, news)=> {
        
            $("#ctryNews").append(`
                <br>
                <img src=${imgCheck(news.image.url)} alt="No Image!" onerror=this.src="./images/train.svg">
                <p>${news.title}</p>
                <p>${news.snippet}</p>
                <a href="${news.url}" target="_blank">Read More</a>
                <p>${news.datePublished.replace("T", " ")}</p>
                <br>
                <hr>
            `)
        });

        $("#holidays").html("");
        $.each(data.holidays, (index, obj)=> {
            $("#holidays").append(`
                <p><span>${obj.name}</span><span>${obj.date}</span></p>
            `)
        })

        $("#imgGallery").html("");
        $.each(data.images, (index, img)=> {
            $("#imgGallery").append(`
                <img id="img${index}" src=${img.thumb}>
            `)
        })

        console.log(data);
        $("#countryModal").removeClass("modalOff");

    }

    $("#countrySelector").change(()=> {
        
        const info = {
            code: $("#countrySelector").val(),
            name: $("#countrySelector").find(":selected").text(),
        }

        ctryLayerGroup.clearLayers();

        $("#preloader").fadeIn("fast")

        getCtryBorders(info)
        .then((data)=> addBorderLayer(data))
        .then((data)=> getCountryInfo(data))
        .then((data)=> getAddCtryInfo(data))
        .then((data)=> ctryInfoModal(data))
        .then(()=> $("#preloader").fadeOut("fast"))
        .catch((err)=> console.error(err));


        //getCountryBorders(info.code)
        //.then((data)=> console.log(data))
        //.catch((err)=> console.error(err));

        //let category = "beach";
        //getWebCams(info.code, category)
        //.then((data)=> console.log(data)) 

        //getCities(info.code)
        //.then((data)=> console.log(data))
        //.catch((err)=> console.error(err));

        //let latlng = [51.2283, -2.3221];
        //getWeather(latlng)
        //.then((data)=> console.log(data))
        //.catch((err)=> console.error(err));

        
    })

    $("#ctryModalcloseBtn").click(()=> {
        $("#countryModal").addClass(" modalOff");
    })

})