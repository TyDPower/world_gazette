import { geoDataModal } from "./modals.js";

export var clusters = L.markerClusterGroup();

export const removeLayers = () => {
    clusters.clearLayers();
}

const markers = {
    airports: L.icon({
        iconUrl: "./images/plane.svg",
        iconSize: [38, 95]
    }),
    railways: L.icon({
        iconUrl: "./images/train.svg",
        iconSize: [38, 95]
    }),
    golfCourses: L.icon({
        iconUrl: "./images/golf.svg",
        iconSize: [38, 95]
    }),
    raceTracks: L.icon({
        iconUrl: "./images/raceTrack.svg",
        iconSize: [38, 95]
    }),
    stadiums: L.icon({
        iconUrl: "./images/stadium.svg",
        iconSize: [38, 95]
    }),
    beaches: L.icon({
        iconUrl: "./images/beach.svg",
        iconSize: [38, 95]
    }),
    mountains: L.icon({
        iconUrl: "./images/mountains.svg",
        iconSize: [38, 95]
    }),
    lighthouses: L.icon({
        iconUrl: "./images/lighthouse.svg",
        iconSize: [38, 95]
    }),
    forts: L.icon({
        iconUrl: "./images/tower.svg",
        iconSize: [38, 95]
    }),
    castles: L.icon({
        iconUrl: "./images/castle.svg",
        iconSize: [38, 95]
    }),
    caves: L.icon({
        iconUrl: "./images/cave.svg",
        iconSize: [38, 95]
    }),
    amusmentParks: L.icon({
        iconUrl: "./images/amusmentParks.svg",
        iconSize: [38, 95]
    }),
    natureReserves: L.icon({
        iconUrl: "./images/nature.svg",
        iconSize: [38, 95]
    }),
    lakes: L.icon({
        iconUrl: "./images/lake.svg",
        iconSize: [38, 95]
    }),
    harbours: L.icon({
        iconUrl: "./images/boat.svg",
        iconSize: [38, 95]
    }),
    campsites: L.icon({
        iconUrl: "./images/camping.svg",
        iconSize: [38, 95]
    }),
    population: L.icon({
        iconUrl: "./images/people.svg",
        iconSize: [38, 95]
    }),
    observation: L.icon({
        iconUrl: "./images/observation.svg",
        iconSize: [38, 95]
    })
}

const getMarkers = (markers, fcode) => {
    switch (fcode) {
        case "AIRP":
            return markers.airports;
        case "RSTP":
            return markers.railways;
        case "RECP":
            return markers.golfCourses;
        case "RECR":
            return markers.raceTracks
        case "STDM":
            return markers.stadiums;
        case "BCH":
            return markers.beaches;
        case "MT":
            return markers.mountains;
        case "LTHSE":
            return markers.lighthouses;
        case "FT":
            return markers.forts;
        case "CSTL":
            return markers.castles;
        case "CAVE":
            return markers.caves;
        case "AMUS":
            return markers.amusmentParks;
        case "RESN":
            return markers.natureReserves;
        case "LK":
            return markers.lakes;
        case "HBR":
            return markers.harbours;
        case "CMP":
            return markers.campsites;
        case "OBPT":
            return markers.observation;
        case "PPL":
            return markers.population;
        default:
            return console.error(fCode)

    }
}

export const getGeoData = (countryObj, mapObj, fcode) => {

    return new Promise((resolve, reject)=> {

        $.ajax({
            url: "./php/getGeoData.php",
            type: "post",
            dataType: "json",
            data: {
                isoCode: countryObj.admin.iso[0],
                filter: fcode,
            },

            success: (res)=> {

                if (res.status.name == "ok") {
                    let geo = res.data.geonames;

                        geo.forEach(res=> {
                            clusters.addLayer(L.marker([res.lat, res.lng], {icon: getMarkers(markers, fcode)}).on("click", ()=> {
                                getGeoLocationData(res)
                            })).addTo(mapObj);
                        });

                    resolve(countryObj);

                } else {
                    reject(res.status);
                }

            },

            error: (err)=> {
                reject(err);
            }
        })
    })
}

export const getGeoLocationData = (geoData) => {

    return new Promise((resolve, reject)=> {

        $.ajax({
            url: "./php/getGeoLocationData.php",
            type: "post",
            dataType: "json",
            data: {
                lat: geoData.lat,
                lng: geoData.lng
            },

            success: (res)=> {

                if (res.status.name == "ok") {

                    let data = res.data.results[0];

                    let geoInfo = {
                        geoName: geoData.toponymName,
                        lat: geoData.lat,
                        lng: geoData.lng,
                        address: data.formatted
                    }

                    geoDataModal(geoInfo);

                    resolve()

                } else {
                    reject(res.status);
                }

            },

            error: (err)=> {
                reject(err);
            }
        })
    })

}