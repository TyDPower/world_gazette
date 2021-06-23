export var obj = {
    isoCodeA3: null,
    isoCodeA2: null,
    borders: null,
    name: null,
    coords: [],
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
    indexes: {
        crime: null,
        saftey: null,
        health: null
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
                    url: "./php/getPlaceInfo.php",
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
                                driveSide: results.annotations.roadinfo.drive_on,
                                speedUnit: results.annotations.roadinfo.speed_in,
                                timezoneName: results.annotations.timezone.name,
                                dst: results.annotations.timezone.now_in_dst
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
    getCrimeIndex(isoCodeA2) {

        return new Promise((resolve, reject)=> {
            $.ajax({
                url: "./php/getCrimeIndex.php",
                type: "post",
                dataType: "json",
                data: {
                    isoCodeA2: isoCodeA2,
                },
    
                success: (res)=> {

                    if (res.status.name == "ok") {

                        this.indexes.crime = res.data.index_crime
                        this.indexes.saftey = res.data.index_safety
                        
                        if (this.indexes.crime && this.indexes.saftey) {
                            resolve()
                        } else {
                            reject("Indexes are null!")
                        }

                    }
    
                },
    
                error: (err)=> {
                    console.log(err)
                }
            })
        })
    },
    getHealthIndex(isoCodeA2) {

        return new Promise((resolve, reject)=> {
            $.ajax({
                url: "./php/getHealthIndex.php",
                type: "post",
                dataType: "json",
                data: {
                    isoCodeA2: isoCodeA2,
                },
    
                success: (res)=> {

                    if (res.status.name == "ok") {

                        this.indexes.health = res.data.index_healthcare;
                        
                        if (this.indexes.health) {
                            resolve()
                        } else {
                            reject("Indexes are null!")
                        }

                    }
    
                },
    
                error: (err)=> {
                    console.log(err)
                }
            })
        })
    },
    getPollutionIndex(isoCodeA2) {

        return new Promise((resolve, reject)=> {
            $.ajax({
                url: "./php/getPollutionIndex.php",
                type: "post",
                dataType: "json",
                data: {
                    isoCodeA2: isoCodeA2,
                },
    
                success: (res)=> {

                    if (res.status.name == "ok") {

                        this.indexes.pollution = res.data.index_pollution;
                        
                        if (this.indexes.pollution) {
                            resolve()
                        } else {
                            reject("Indexes are null!")
                        }

                    }
    
                },
    
                error: (err)=> {
                    console.log(err)
                }
            })
        })
    },
    getTrafficIndex(isoCodeA2) {

        return new Promise((resolve, reject)=> {
            $.ajax({
                url: "./php/getTrafficIndex.php",
                type: "post",
                dataType: "json",
                data: {
                    isoCodeA2: isoCodeA2,
                },
    
                success: (res)=> {

                    if (res.status.name == "ok") {

                        this.indexes.traffic = res.data.index_traffic;
                        
                        if (this.indexes.traffic) {
                            resolve()
                        } else {
                            reject(console.log(this.indexes))
                        }

                    }
    
                },
    
                error: (err)=> {
                    console.log(err)
                }
            })
        })
    },
    getAllIndexes(isoCodeA2) {
        const crime = this.indexes.crime;
        const health = this.indexes.health;
        const pollution = this.indexes.pollution;
        const traffic = this.indexes.traffic;

        return new Promise((resolve, reject)=> {

            this.getCrimeIndex(isoCodeA2);
            this.getHealthIndex(isoCodeA2);
            this.getTrafficIndex(isoCodeA2);
            this.getPollutionIndex(isoCodeA2);

            if (crime && health && pollution && traffic) {
                resolve()
            } else {
                reject("Null values")
            }
        })
    }
}

