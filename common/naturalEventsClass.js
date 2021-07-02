export class NaturalEvents {
    constructor() {
        this.category;
        this.events = [];
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
        };
        this.layerGroups = L.layerGroup();
        this.utils = {
            removeLayers(eventsObj) {
                if (eventsObj.layerGroups) {
                    eventsObj.layerGroups.clearLayers();
                }                
            },
            panToCenter(map) {
                map.panTo([0, 0])
                    if (map.getZoom() > 2) {
                        map.setZoom(2);
                    }
            },
            getEvents(period, event, eventsObj) {
        
                return new Promise((resolve, rej)=> {
                    $.ajax({
                        url: "./php/getNaturalEvents.php",
                        type: "post",
                        dataType: "json",
                        data: {
                            period: period,
                            event: event,
                        },
                
                        success: (res)=> {
                
                            if (res.status.name == "ok") {
                                var results = res.data.events

                
                                for (let i=0; i<results.length; i++) {
                
                                    var lat = results[i].geometries[0].coordinates[1]
                                    var lng = results[i].geometries[0].coordinates[0]
                
                                    if (results[i].categories[0].title === event) {
                                        eventsObj.events.push([lat, lng]);
                                    }
                                }

                                eventsObj.category = event;
            
                                resolve(eventsObj)
                
                            }
                
                        },
                
                        error: (err)=> {
                            rej(err)
                        }
                
                    })
            
                })
                
            
            },
            getMarker(eventsObj) {
                switch (eventsObj.category) {
                    case "Wildfires":
                        return eventsObj.markers.wildfires;
                    case "Volcanoes":
                        return eventsObj.markers.volcanos;
                    case "Severe Storms":
                        return eventsObj.markers.severeStorms;
                    case "Earthquakes":
                        return eventsObj.markers.earthquakes;
                    case "Sea and Lake Ice":
                        return eventsObj.markers.icebergs;
                }
            },
            addEvents(map, eventsObj) {

                if (eventsObj.category) {
                    eventsObj.events.forEach(res=> {
                        eventsObj.layerGroups.addLayer(L.marker(res, {icon: eventsObj.utils.getMarker(eventsObj)})).addTo(map);
                    })
                    eventsObj.utils.panToCenter(map);
                }

            }
        }
    }
};