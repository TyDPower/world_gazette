export var naturalEvents = {
    period: 365,
    events: {
        wildfiresArr: [],
        earthquakesArr: [],
        volcanosArr: [],
        severeStormsArr: [],
        icebergsArr: []
    },
    layerGroups: {
        wildfiresGroup: L.layerGroup(),
        earthquakesGroup: L.layerGroup(),
        volcanosGroup: L.layerGroup(),
        severeStormsGroup: L.layerGroup(),
        icebergsGroup: L.layerGroup()
    },
    clearMarkers: () => {
        Object.keys(naturalEvents.layerGroups).forEach(key => {
            naturalEvents.layerGroups[key].clearLayers()
        })
    }
}

export const onLoad = () => {
    $.ajax({
        url: "./php/getNaturalEvents.php",
        type: "post",
        dataType: "json",
        data: {
            period: naturalEvents.period
        },

        success: (res)=> {

            if (res.status.name == "ok") {
                var results = res.data.events

                for (let i=0; i<results.length; i++) {

                    var lat = results[i].geometries[0].coordinates[1]
                    var lng = results[i].geometries[0].coordinates[0]

                    if (results[i].categories[0].title === "Wildfires") {
                        naturalEvents.events.wildfiresArr.push([lat, lng]);
                    } else if (results[i].categories[0].title === "Severe Storms") {
                        naturalEvents.events.severeStormsArr.push([lat, lng]);
                    } else if (results[i].categories[0].title === "Sea and Lake Ice") {
                        naturalEvents.events.icebergsArr.push([lat, lng]);
                    } else if (results[i].categories[0].title === "Volcanoes") {
                        naturalEvents.events.volcanosArr.push([lat, lng]);
                    } else {
                        naturalEvents.events.earthquakesArr.push([lat, lng]);
                    }
                }

            }

        },

        error: (err)=> {
            console.log(err);
        }

    })
}