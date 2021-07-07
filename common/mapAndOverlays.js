export const worldTiles = {
    maps: {
        default: L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
            maxZoom: 20,
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }),
        outdoors: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }),

    },
    overlays: {
        hiking: L.tileLayer('https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }),
        cycling: L.tileLayer('https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }),
        railways: L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        })
    },
    utils: {
        onMap: [],
        loadOverlays(mapObj) {
            let mapTiles = $("#mapTiles").val();
            let hiking = $("input[name='hiking']:checked").val();
            let cycling = $("input[name='cycling']:checked").val();
            let railways = $("input[name='railways']:checked").val();

            if (mapTiles) {
                switch (mapTiles) {
                    case "default":
                        worldTiles.maps.default.addTo(mapObj);
                        break;
                    case "outdoors":
                        worldTiles.maps.outdoors.addTo(mapObj);
                        break;
                }
            }

            if (hiking) {
                worldTiles.overlays.hiking.addTo(mapObj);
                worldTiles.utils.onMap.push(worldTiles.overlays.hiking);
            }

            if (cycling) {
                worldTiles.overlays.cycling.addTo(mapObj);
                worldTiles.utils.onMap.push(worldTiles.overlays.cycling);
            }
            if (railways) {
                worldTiles.overlays.railways.addTo(mapObj);
                worldTiles.utils.onMap.push(worldTiles.overlays.railways);
            }

        },
        removeOverlays() {
            worldTiles.utils.onMap.forEach(res=> {
                res.remove();
            })
        }
    }
}