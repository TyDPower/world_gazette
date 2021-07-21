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

    var cityMarker = L.ExtraMarkers.icon({
        icon: 'fa-city',
        markerColor: 'pink',
        shape: 'round',
        prefix: 'fas',
    });

    var beachMarker = L.ExtraMarkers.icon({
        icon: 'fa-umbrella-beach',
        markerColor: 'blue',
        shape: 'square',
        prefix: 'fas',
    });

    var trafficMarker = L.ExtraMarkers.icon({
        icon: 'fa-traffic-light',
        markerColor: 'red',
        shape: 'square',
        prefix: 'fas',
    });

    var squareMarker = L.ExtraMarkers.icon({
        icon: 'fa-store',
        markerColor: 'green',
        shape: 'square',
        prefix: 'fas',
    });

    var cityGroup = L.markerClusterGroup();
    var beachCamsGroup = L.markerClusterGroup();
    var trafficCamsGroup = L.markerClusterGroup();
    var squareCamsGroup = L.markerClusterGroup();    
    
    var overlayMaps = {
        "Cities": cityGroup,
        "Webcams Beaches": beachCamsGroup,
        "Webcams Traffic": trafficCamsGroup,
        "Webcams City Center": squareCamsGroup
    };

    const displayCityMarkers = (data, clusterGroup, marker) => {
        $.each(data, (i,o)=> {
            clusterGroup.addLayer(L.marker([o.latitude, o.longitude], {icon: marker}).bindPopup(`${o.city}`));
        })   
    }

    const displayWebCamMarkers = (data, clusterGroup, marker) => {
        $.each(data, (i,o)=> {
            clusterGroup.addLayer(L.marker([o.location.latitude, o.location.longitude], {icon: marker}).on("click", ()=> {
                $("#webCamContainer").removeClass("modalOff");
                $("#webCamPlayer").append(`
                    <div id="videoPlayer">
                        <iframe src="${o.player.month.embed}style="width:100%"></iframe> 
                    </div>
                `);
            }))
        })
        
    }

    const clearLayers = () => {
        cityGroup.clearLayers();
        beachCamsGroup.clearLayers();
        trafficCamsGroup.clearLayers();
        squareCamsGroup.clearLayers();
    }

    L.control.layers(baseMaps, overlayMaps).addTo(map);

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
    }

    $("#preloader").fadeIn("fast")
    
    getUserLatLng()
    .then((data)=> getUserCtry(data))
    .then((data)=> getAllInfo(data))
    
    //$("#preloader").fadeOut("fast")
    

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

    const getOverlayInfo = (isoCodeA2) => {

        return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getOverlayInfo.php",
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

        console.log(data)


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
        $.each(data.restCtry.languages, (i, obj)=> {
            $("#ctryLang").append(`
                <p>${obj.name}</p>
            `)
        })

        $("#ctryTZ").html("");
        $.each(data.restCtry.timezones, (i, tz)=> {
            $("#ctryTZ").append(`
                <p>${tz}</p>
            `)
        })

        $("#wikiInfo").html("");
        $.each(data.wiki.geonames, (i, obj)=> {
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
        $.each(data.exRates, (i, obj)=> {
            for (const [key, value] of Object.entries(obj)) {
                $("#exRateKeyVal").append(`${key}: ${value}<br>`);
            };
        });

        $("#borderingCtry").html("");
        if (data.restCtry.borders.length > 0) {
            $.each(data.restCtry.borders, (i, ctry)=> {
                $("#borderingCtry").append(`
                <p>${ctry}</p>
                `);
            });
        } else {
            $("#borderingCtry").html("No bordering countries.");
        };

        $("#ctryNews").html("");
        $.each(data.news, (i, news)=> {
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
        $.each(data.holidays, (i, obj)=> {
            $("#holidays").append(`
                <p><span>${obj.name}</span><span>${obj.date}</span></p>
            `)
        })

        $("#imgGallery").html("");
        $.each(data.images, (i, img)=> {
            $("#imgGallery").append(`
                <img id="img${i}" src=${img.thumb}>
            `)
        })

        $("#driveInfo").html("");
        $("#driveInfo").append(`
            <p><span>Drive on: </span><span>${data.openCage.annotations.roadinfo.drive_on}</span></p>
            <p><span>Speed in: </span><span>${data.openCage.annotations.roadinfo.speed_in}</span></p>
        `)

        //----------NUMBEO INDEX CHART

        let idx = data.numbeoIndexs 
        var charData = {
            labels: ['Quality of Life', 'Crime', 'Safety', 'Cliamte', 'Rent', 'Health Care', 'Food(cost)', 'Pollution', 'Buying Power'],
            series: [
              [idx.quality_of_life_index, idx.crime_index, idx.safety_index, idx.climate_index, idx.rent_index, idx.health_care_index, idx.groceries_index, idx.pollution_index, idx.purchasing_power_incl_rent_index]
            ]
          };
    
        var charOptions = {
            width: 500,
            height: 400,
            horizontalBars: true,
            axisY: {
                offset: 70
              }
        }
          
          new Chartist.Bar('.ct-chart', charData, charOptions);

        //-----------------------

        $("#curDisplay").html("");
        $("#curDisplay").html(`<p><span>Prices displayed is: </span><span>${data.numbeoPrices.currency}</span></p>`)

        let cur = data.restCtry.currencies[0].symbol;
        const priceCheck = (price, obj) => {
            if (price in obj) {
                switch(price) {
                    case "average_price":
                        return cur + obj.average_price.toFixed(2);

                    case "highest_price":
                        return cur + obj.highest_price.toFixed(2);

                    case "lowest_price":
                        return cur + obj.lowest_price.toFixed(2);
                }
            }

            return "Price not available."
        };
        $("#itemPrices").html("");
        $.each(data.numbeoPrices.prices, (i, obj)=> {          

            $("#itemPrices").append(`
                <p><span>Item: </span><span>${obj.item_name}</span></p>
                <p><span>Average Price: </span><span>${priceCheck("average_price", obj)}</span></p>
                <p><span>Highest Price: </span><span>${priceCheck("highest_price", obj)}</span></p>
                <p><span>Lowest Price: </span><span>${priceCheck("lowest_price", obj)}</span></p>
                <hr>
                
            `)

        })
        


        $("#countryModal").removeClass("modalOff");
        return data;

    }

    const getAllInfo = (data) => {
        getCountryInfo(data)
        .then((data)=> ctryInfoModal(data))
        .then((data)=> getCtryBorders(data))
        .then((data)=> addCtryLayer(data))
        .then(()=> $("#preloader").fadeOut("fast"))
        .catch((err)=> console.error(err));
    }

    $("#countrySelector").change(()=> {
        
        const info = {
            code: $("#countrySelector").val(),
            name: $("#countrySelector").find(":selected").text(),
        }

        ctryLayerGroup.clearLayers();
        clearLayers();

        $("#preloader").fadeIn("fast")
        getCountryInfo(info)
        .then((data)=> getAllInfo(data))
        //.then((data)=> ctryInfoModal(data))
        //.then((data)=> getCtryBorders(data))
        //.then((data)=> addCtryLayer(data))
        //.then(()=> $("#preloader").fadeOut("fast"))
        //.catch((err)=> console.error(err));

        getOverlayInfo(info.code)
        .then((data)=> {
            console.log(data)
            displayWebCamMarkers(data.beaches, beachCamsGroup, beachMarker)
            displayWebCamMarkers(data.traffic, trafficCamsGroup, trafficMarker)
            displayWebCamMarkers(data.squares, squareCamsGroup, squareMarker)
            displayCityMarkers(data.cities, cityGroup, cityMarker)
        })
        .catch((err)=> console.error(err));
        
    })

    $("#ctryModalcloseBtn").click(()=> {
        $("#countryModal").addClass(" modalOff");
    })

    $("#webCamCloseBtn").click(()=> {
        $("#webCamContainer").addClass(" modalOff");
        $("#webCamPlayer").html("");
    })

    //let latlng = [51.2283, -2.3221];
        //getWeather(latlng)
        //.then((data)=> console.log(data))
        //.catch((err)=> console.error(err));

})