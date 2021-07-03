export class Country {
    constructor() {
        this.admin = {
            name: null,
            iso: null,
            capital: null,
            region: null,
            subregion: null,
            latlng: null,
            bounds: {
                max: null,
                min: null
            }
        };
        this.flag = {
            small: null,
            medium: null,
            large: null
        }
        this.social = {
            population: null,
            languages: null,
        };
        this.timezones = null;
        this.currency = {
            name: null,
            code: null,
            symbol: null,
            exchangeRate: null
        };
        this.index = {
            crime: null,
            safety: null,
            healthcare: null,
            qualityOfLife: null,
            costOfLiving: null,
            rent: null,
            groceries: null,
            traffic: null,
            pollution: null,
            restaurant: null,
            purchasingPower: null,
        };
        this.borders = {
            obj: null,
            isLoaded: null,
        };
        this.layerGroups = L.layerGroup();
        this.URLs = {
            restcountries: "./php/getCountryInfo.php",
            numbeoCountryIndex: "./php/getCountryIndices.php",
            openCage: "./php/getUserLocationISO.php"
        };
        this.isLoaded = null;
        this.utils = {
            getInfo(countryObj, phpUrl, isoOrLatLng) {

                let setCountryInfo;

                if (typeof isoOrLatLng === "object") {

                    setCountryInfo = (data) => {
                        {if (!countryObj.admin.iso) {countryObj.admin.iso = [data.results[0].components["ISO_3166-1_alpha-2"], data.results[0].components["ISO_3166-1_alpha-3"]]}};
                    }

                } else {
                    setCountryInfo = (data) => {
                        {if (!countryObj.admin.name) {countryObj.admin.name = data.name}};
                        {if (!countryObj.admin.iso) {countryObj.admin.iso = [data.alpha2Code, data.alpha3Code]}};
                        {if (!countryObj.admin.capital) {countryObj.admin.capital = data.capital}};
                        {if (!countryObj.admin.region) {countryObj.admin.region = data.region}};
                        {if (!countryObj.admin.subregion) {countryObj.admin.subregion = data.subregion}};
                        {if (!countryObj.admin.latlng) {countryObj.admin.latlng = [data.latlng[0], data.latlng[1]]}};

                        {if (!countryObj.admin.flag) {countryObj.flag.small = `https://flagcdn.com/w20/${countryObj.admin.iso[0].toLowerCase()}.png`}};
                        {if (!countryObj.admin.flag) {countryObj.flag.medium = `https://flagcdn.com/w40/${countryObj.admin.iso[0].toLowerCase()}.png`}};
                        {if (!countryObj.admin.flag) {countryObj.flag.large = `https://flagcdn.com/w80/${countryObj.admin.iso[0].toLowerCase()}.png`}};
                
                        {if (!countryObj.social.population) {countryObj.social.population = data.population}};
                        {if (!countryObj.social.languages) {countryObj.social.languages = data.languages}};
                
                        {if (!countryObj.timezones) {countryObj.timezones = [data.timezones]}};
                
                        {if (!countryObj.currency.name) {countryObj.currency.name = data.currencies[0].name}};
                        {if (!countryObj.currency.code) {countryObj.currency.code = data.currencies[0].code}};
                        {if (!countryObj.currency.symbol) {countryObj.currency.symbol = data.currencies[0].symbol}};
                    };
                }
            
                let setIndexes = (data) => {
                    if (!countryObj.index.crime) {countryObj.index.crime = data.crime_index}
                    if (!countryObj.index.safety) {countryObj.index.safety = data.safety_index}
                    if (!countryObj.index.healthcare) {countryObj.index.healthcare = data.health_care_index}
                    if (!countryObj.index.qualityOfLife) {countryObj.index.qualityOfLife = data.quality_of_life_index}
                    if (!countryObj.index.costOfLiving) {countryObj.index.costOfLiving = data.contributors_cost_of_living}
                    if (!countryObj.index.rent) {countryObj.index.rent = data.rent_index}
                    if (!countryObj.index.groceries) {countryObj.index.groceries = data.groceries_index}
                    if (!countryObj.index.traffic) {countryObj.index.traffic = data.traffic_index}
                    if (!countryObj.index.pollution) {countryObj.index.pollution = data.pollution_index}
                    if (!countryObj.index.restaurant) {countryObj.index.restaurant = data.restaurant_price_index}
                    if (!countryObj.index.purchasingPower) {countryObj.index.purchasingPower = data.purchasing_power_incl_rent_index}
                };
            
                let setIsLoaded = (data) => {return countryObj.isLoaded = data};
            
                return new Promise((resolve, reject)=> {
            
                    let code;
                    let latLng;

                    if (typeof isoOrLatLng === "string") {
                        code = isoOrLatLng;
                        latLng = [0, 0]
                    } else if (typeof isoOrLatLng === "object") {
                        latLng = isoOrLatLng;
                    } else {
                        code = countryObj.admin.iso[1]
                        latLng = [0, 0]
                    }
            
                    $.ajax(
                        {
                            url: phpUrl,
                            type: "post",
                            dataType: "json",
                            data: {
                                isoCode: code,
                                lat: latLng.lat,
                                lng: latLng.lng
                            },
            
                            success: (res)=> {
                                if (res.status.name == "ok") {
            
                                    let data = res.data;
                                    setCountryInfo(data);
                                    setIndexes(data);
                                    setIsLoaded(true);
            
            
                                    if (countryObj.isLoaded) {
                                        countryObj.isLoaded = false;
                                        resolve(countryObj);
                                    } else {
                                        reject();
                                    };
                                }
                            },
            
                            error: (err)=> {
                                console.error(err);
                            }
                        }
                    )
                })

            },
            getBorders(countryObj, codeA3) {
                return new Promise((resolve, reject)=> {
                    $.getJSON("./common/countries.geo.json", (data)=> {
                        for (let i=0; i<data.features.length; i++) {
                            if (data.features[i].properties.ISO_A3 === codeA3) {
                                countryObj.borders.obj = data.features[i]
                                countryObj.borders.isLoaded = true
                                if (countryObj.borders.isLoaded) {
                                    resolve(countryObj);
                                } else {
                                    reject();
                                }
                            }
                        }
                    })
                })
            },
            addBorders(countryObj, map) {
                return new Promise((res, rej)=> {
                    countryObj.layerGroups.addLayer(L.geoJSON(countryObj.borders.obj)).addTo(map);
                    res(countryObj);
                    rej();
                })
            },
            removeLayers(countryObj) {
                if (countryObj.layerGroups) {
                    countryObj.layerGroups.clearLayers();
                }
            },
            countryInfoPopup(mapObj, countryObj) {

                let currenciesStr = countryObj.currency.exchangeRate[0].replace(/_/gi, "/");
                let rate = countryObj.currency.exchangeRate[1]

                var data = `<img src="${countryObj.flag.small}"> ${countryObj.admin.name}<br>
                            Quality of Life: ${countryObj.index.qualityOfLife}<br>
                            Cost of Living: ${countryObj.index.costOfLiving}<br>
                            Exchange Rate: ${currenciesStr} ${rate.toFixed(3)}`
                            countryObj.layerGroups.addLayer(
                    L.popup()
                        .setLatLng(countryObj.admin.latlng)
                        .setContent(data)
                        .openOn(mapObj)
                );

                return countryObj;
            
            },
            getCurrencyExchange(countryObj, userCurrency) {

                return new Promise((resolve, reject)=> {
            
                    var currenciesCombined;
            
                    if (!userCurrency) {
                        currenciesCombined = "USD_" + countryObj.currency.code;
                    } else {
                        currenciesCombined = userCurrency + "_" + countryObj.currency.code;
                    }
            
                    $.ajax({
                        url: "./php/getCurrencyExchange.php",
                        type: "post",
                        dataType: "json",
                        data: {
                            currencies: currenciesCombined,
                        },
            
                        success: (res)=> {
            
                            if (res.status.name == "ok") {

                                let exchangeRate = Object.entries(res.data);         
                                countryObj.currency.exchangeRate = exchangeRate[0];
                                
                                if (currenciesCombined) {
                                    resolve(countryObj)
                                } else {
                                    reject()
                                }
            
                            }
            
                        },
            
                        error: (err)=> {
                            console.log(err)
                        }
                    })
                })
            },
            panToCountry(mapObj, countryObj, addPopup = false) {
                mapObj.panTo(countryObj.admin.latlng);
            
                if (addPopup === true) {
                    countryObj.layerGroups.addLayer(
                        L.popup()
                            .setLatLng(countryObj.admin.latlng)
                            .setContent("Loading...")
                            .openOn(mapObj)
                    );
                };
            
                if (mapObj.getZoom() > 5) {
                    mapObj.setZoom(5)
                };

                return countryObj;
            }
        };
    }
};