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
        this.clusterGroup = L.markerClusterGroup();
        this.utils = {
            removeLayers(eventsObj) {
                if (eventsObj.clusterGroup) {
                    eventsObj.clusterGroup.clearLayers();
                }                
            },
            panToCenter(map) {
                map.panTo([0, 0])
                    if (map.getZoom() > 2) {
                        map.setZoom(2);
                    }
            },
            getEvents(event, eventsObj, mapObj) {
        
                return new Promise((resolve, rej)=> {
                    $.ajax({
                        url: "./php/getNaturalEvents.php",
                        type: "post",
                        dataType: "json",
                
                        success: (res)=> {
                
                            if (res.status.name == "ok") {
                                let events = res.data.events

                                events.forEach(res=> {

                                    let lng = res.geometries[0].coordinates[0]
                                    let lat = res.geometries[0].coordinates[1]

                                    if (res.categories[0].title === event) {

                                        eventsObj.clusterGroup.addLayer(L.marker([lat, lng], {icon: eventsObj.utils.getMarker(event, eventsObj)}).on("click", ()=> {
                                            alert(res.title)
                                        })).addTo(mapObj);

                                        eventsObj.utils.panToCenter(mapObj);
                                    }

                                })             
                                
            
                                resolve(eventsObj)
                
                            }
                
                        },
                
                        error: (err)=> {
                            rej(err)
                        }
                
                    })
            
                })
                
            
            },
            getMarker(event, eventsObj) {
                switch (event) {
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
            }
        }
    }
};