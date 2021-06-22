export var obj = {
    isoCodeA3: null,
    isoCodeA2: null,
    countryBorders: null,
    countryLoaded: false,
    countryName: null,
    countryCoords: [],
    continent: null,
    flag: null,
    currencyInfo: {
        unitName: null,
        subunitName: null,
        symbol: null,
        symbolPosition: null,
    },
    roadInfo: {
        driveSide: null,
        speedUnit: null,
    },
    timezoneInfo: {
        name: null,
        nowInDst: null,
    },
    layerGroups: L.layerGroup(),
    updateCountryInfo(dataObj) {
        if (dataObj) {
    
            obj.countryName = dataObj.name;
            obj.countryCoords = dataObj.coords;
            obj.continent = dataObj.continent;
            obj.flag = dataObj.flag;
            obj.marker = dataObj.flag;
            obj.currencyInfo.unitName = dataObj.currencyName;
            obj.currencyInfo.subunitName = dataObj.currencySubunitName;
            obj.currencyInfo.symbol = dataObj.currencySymbol;
            obj.currencyInfo.symbolPosition = dataObj.symbolPos;
            obj.roadInfo.driveSide = dataObj.driveSide;
            obj.roadInfo.speedUnit = dataObj.speedUnit;
            obj.timezoneInfo.name = dataObj.timezoneName;
            obj.timezoneInfo.nowInDst = dataObj.dst;
    
        } else {
            
            var modalPlaceObj = {
                name: obj.countryName,
                coordsoords: obj.countryCoords,
                continent: obj.continent,
                flag: obj.flag,
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
                        obj.countryBorders = data.features[i]
                        obj.countryName = data.features[i].properties.ADMIN

                        if (this.countryBorders) {
                            resolve(this.countryBorders)
                        } else {
                            reject("error");
                        }
                    }
                }
            })
        })
    },
    getCountryInfo(code) {
        return new Promise((resolve, reject)=> {
            $.ajax(
                {
                    url: "./php/getPlaceInfo.php",
                    type: "post",
                    dataType: "json",
                    data: {
                        isoCode: code,
                        countryName: this.countryName.replace(/\s+/g, "_")
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
                                driveSide: results.annotations.roadinfo.drive_on,
                                speedUnit: results.annotations.roadinfo.speed_in,
                                timezoneName: results.annotations.timezone.name,
                                dst: results.annotations.timezone.now_in_dst
                            };

                            updateCountryInfo(countryData);

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

    }
}

