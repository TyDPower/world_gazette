export var obj = {
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
        Object.values(obj.layerGroups).forEach(val => val.clearLayers())
    }
}

export const onPageLoad = () => {
    $.ajax({
        url: "./php/getNaturalEvents.php",
        type: "post",
        dataType: "json",
        data: {
            period: obj.period
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

            }

        },

        error: (err)=> {
            console.log(err);
        }

    })
}