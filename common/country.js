export var placeObj = {
    _isoCodeA3: null,
    _isoCodeA2: null,
    _countryBorders: null,
    _countryLoaded: false,
    _countryName: null,
    _countryCoords: [],
    _rawData: null
}

export const updateIsoA3 = (isoA3) => {
    if (isoA3) {
        placeObj._isoCodeA3 = isoA3;
    }
    return placeObj._isoCodeA3;
}

export const updateIsoA2 = (isoA2) => {
    if (isoA2) {
        placeObj._isoCodeA2 = isoA2;
    }
    return placeObj._isoCodeA2;
}

export const updateCountryBorders = (borders) => {
    if (borders) {
        placeObj._countryBorders = borders;
    }
    return placeObj._countryBorders;
}

export const updateCountryLoaded = (loaded) => {
    if (loaded) {
        placeObj._countryLoaded = loaded;
    }
    return placeObj._countryLoaded;
}

export const updateCountryName = (name) => {
    if (name) {
        placeObj._countryName = name;
    }
    return placeObj._countryName;
}

export const updateCountryCoords = (latLng) => {
    if (latLng === "lat") {
        return placeObj._countryCoords[0]
    }

    if (latLng === "lng") {
        return placeObj._countryCoords[1]
    }

    if (Array.isArray(latLng)) {
        placeObj._countryCoords = latLng;
    }
}

export const updateRawData = (data) => {
    placeObj._rawData = data
}