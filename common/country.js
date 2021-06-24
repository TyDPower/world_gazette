export var obj = {
    isoCodeA3: null,
    isoCodeA2: null,
    borders: null,
    name: null,
    coords: [],
    continent: null,
    flag: null,
    societyInfo: {
        languagePrimary: null,
        languagesOther: [],
        population: null,
    },
    currencyInfo: {
        unitName: null,
        subunitName: null,
        symbol: null,
        symbolPosition: null,
        code: null,
        foreignExchange: [null, null],
    },
    roadInfo: {
        driveSide: null,
        speedUnit: null,
    },
    timezoneInfo: {
        name: null,
        nowInDst: null,
    },
    indexes: {
        crime: null,
        saftey: null,
        healthcare: null,
        qualityOfLife: null,
        costOfLiving: null,
        rentIndex: null,
        groceriesIndex: null,
        traffic: null,
        pollution: null,
        resturant: null,
        purchasingPower: null,
        isLoaded: false,
    },
    layerGroups: L.layerGroup(),
    updateInfo(dataObj) {
        if (dataObj) {
    
            obj.name = dataObj.name;
            obj.coords = dataObj.coords;
            obj.continent = dataObj.continent;
            obj.flag = dataObj.flag;
            obj.marker = dataObj.flag;
            obj.currencyInfo.unitName = dataObj.currencyName;
            obj.currencyInfo.subunitName = dataObj.currencySubunitName;
            obj.currencyInfo.symbol = dataObj.currencySymbol;
            obj.currencyInfo.symbolPosition = dataObj.symbolPos;
            obj.currencyInfo.code = dataObj.currencyCode;
            obj.roadInfo.driveSide = dataObj.driveSide;
            obj.roadInfo.speedUnit = dataObj.speedUnit;
            obj.timezoneInfo.name = dataObj.timezoneName;
            obj.timezoneInfo.nowInDst = dataObj.dst;
    
        } else {
            
            var modalPlaceObj = {
                name: obj.name,
                coordsoords: obj.coords,
                continent: obj.continent,
                flag: obj.flag,
                societyInfo: {
                    population: obj.societyInfo.pollution,
                    languagePrimary: this.languagePrimary,
                    languagesOther: this.languagesOther,
                },
                currencyInfo: {
                    name: obj.currencyInfo.unitName,
                    subunit: obj.currencyInfo.subunitName,
                    symbol: obj.currencyInfo.symbol,
                    symbolPos:obj.currencyInfo.symbolPosition,
                },
                roadInfo: {
                    driveSide: obj.roadInfo.driveSide,
                    speedUnit: obj.roadInfo.speedUnit,
                },
                timezoneInfo: {
                    name: obj.timezoneInfo.name,
                    dst: obj.timezoneInfo.nowInDst,
                }
            }
    
            return modalPlaceObj
    
        }
    
    },
    getBorders(code) {
        return new Promise((resolve, reject)=> {
            $.getJSON("./common/countries.geo.json", (data)=> {
                for (let i=0; i<data.features.length; i++) {
                    if (data.features[i].properties.ISO_A3 === code) {
                        obj.borders = data.features[i]
                        obj.name = data.features[i].properties.ADMIN

                        if (this.borders) {
                            resolve(this.borders)
                        } else {
                            reject("error");
                        }
                    }
                }
            })
        })
    },
    getInfo(code) {
        return new Promise((resolve, reject)=> {
            $.ajax(
                {
                    url: "./php/getCountryInfo.php",
                    type: "post",
                    dataType: "json",
                    data: {
                        isoCode: code,
                        countryName: this.name.replace(/\s+/g, "_")
                    },

                    success: (response)=> {
                        if (response.status.name == "ok") {
                            const results = response.data.results[0]

                            var countryData = {
                                name: results.components.country,
                                coords: [results.geometry.lat, results.geometry.lng],
                                continent: results.components.continent,
                                flag: results.annotations.flag,
                                currencyName: results.annotations.currency.name,
                                currencySubunitName: results.annotations.currency.subunit,
                                currencySymbol: results.annotations.currency.symbol,
                                symbolPos: results.annotations.currency.symbol_first,
                                currencyCode: results.annotations.currency.iso_code,
                                driveSide: results.annotations.roadinfo.drive_on,
                                speedUnit: results.annotations.roadinfo.speed_in,
                                timezoneName: results.annotations.timezone.name,
                                dst: results.annotations.timezone.now_in_dst,
                            };

                            this.updateInfo(countryData);

                            if (this.flag) {
                                resolve()
                            } else {
                                reject(err)
                            }
                        }
                    },

                    error: (err)=> {
                        console.log(err)
                    }
                }
            )
        })

    },
    getCountryIndices(isoCodeA2) {

        return new Promise((resolve, reject)=> {
            $.ajax({
                url: "./php/getCountryIndices.php",
                type: "post",
                dataType: "json",
                data: {
                    isoCodeA2: isoCodeA2,
                },
    
                success: (res)=> {

                    if (res.status.name == "ok") {

                        let i = this.indexes;
                        let d = res.data

                        i.crime = d.crime_index;
                        i.saftey = d.safety_index;
                        i.healthcare = d.health_care_index;
                        i.qualityOfLife = d.quality_of_life_index;
                        i.costOfLiving = d.contributors_cost_of_living;
                        i.rentIndex = d.rent_index;
                        i.groceriesIndex = d.groceries_index;
                        i.traffic = d.traffic_index;
                        i.pollution = d.pollution_index;
                        i.resturant = d.restaurant_price_index;
                        i.purchasingPower= d.purchasing_power_incl_rent_index;
                        i.isLoaded = true
                        
                        if (i.isLoaded) {
                            resolve()
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
    getCurrencyExchange(selectedCurrency, myCurrency) {

        return new Promise((resolve, reject)=> {

            var currenciesCombined;

            if (myCurrency) {
                currenciesCombined =  myCurrency + "_" + selectedCurrency;
            } else {
                currenciesCombined = selectedCurrency + "_USD";
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

                        this.currencyInfo.foreignExchange[0] = currenciesCombined
                        this.currencyInfo.foreignExchange[1] = res.data[currenciesCombined].toFixed(4);
                        
                        if (currenciesCombined) {
                            resolve()
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
    }
}

