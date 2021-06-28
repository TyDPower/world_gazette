export class NaturalEvents {
    constructor() {
        this.events = {
            wildfiresArr: [],
            earthquakesArr: [],
            volcanosArr: [],
            severeStormsArr: [],
            icebergsArr: []
        },
        this.markers = {
            wildfires: L.icon({
                iconUrl: "./images/wildfireMarker.svg",
                iconSize: [38, 95]
            }),
            severeStorms: L.icon({
                iconUrl: "./images/severeStormMarker.svg",
                iconSize: [38, 95]
            }),
            earthquakes: L.icon({
                iconUrl: "./images/earthquakeMarker.svg",
                iconSize: [38, 95]
            }),
            icebergs: L.icon({
                iconUrl: "./images/icebergMarker.svg",
                iconSize: [38, 95]
            }),
            volcanos: L.icon({
                iconUrl: "./images/volcanoMarker.svg",
                iconSize: [38, 95]
            }),
        },
        this.layerGroups = {
            wildfiresGroup: L.layerGroup(),
            earthquakesGroup: L.layerGroup(),
            volcanosGroup: L.layerGroup(),
            severeStormsGroup: L.layerGroup(),
            icebergsGroup: L.layerGroup()
        },
        this.utils = {
            clearMarkers() {
                Object.values(obj.layerGroups).forEach(val => val.clearLayers());
            },
            panToCenter(map) {
                map.panTo([0, 0])
                    if (map.getZoom() > 2) {
                        map.setZoom(2);
                    }
            },
            loadNaturalEventsData(period) {
        
                return new Promise((resolve, rej)=> {
                    $.ajax({
                        url: "./php/getNaturalEvents.php",
                        type: "post",
                        dataType: "json",
                        data: {
                            period: period
                        },
                
                        success: (res)=> {
                
                            if (res.status.name == "ok") {
                                var results = res.data.events
                
                                for (let i=0; i<results.length; i++) {
                
                                    var lat = results[i].geometries[0].coordinates[1]
                                    var lng = results[i].geometries[0].coordinates[0]
                
                                    if (results[i].categories[0].title === "Wildfires") {
                                        obj.events.wildfiresArr.push([lat, lng]);
                                    } else if (results[i].categories[0].title === "Severe Storms") {
                                        obj.events.severeStormsArr.push([lat, lng]);
                                    } else if (results[i].categories[0].title === "Sea and Lake Ice") {
                                        obj.events.icebergsArr.push([lat, lng]);
                                    } else if (results[i].categories[0].title === "Volcanoes") {
                                        obj.events.volcanosArr.push([lat, lng]);
                                    } else {
                                        obj.events.earthquakesArr.push([lat, lng]);
                                    }
                                }
            
                                resolve()
                
                            }
                
                        },
                
                        error: (err)=> {
                            rej(err)
                        }
                
                    })
            
                })
                
            
            }
        }
    }
};