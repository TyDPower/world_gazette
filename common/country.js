export var placeObj = {
    _isoCodeA3: null,
    _isoCodeA2: null,
    _countryBorders: null,
    _countryLoaded: false,
    _countryName: null,
    _countryCoords: [],
    _continent: null,
    _flag: null,
    currencyInfo: {
        _unitName: null,
        _subunitName: null,
        _smallest: null,
        _symbol: null,
        _symbolPosition: null,
    },
    roadInfo: {
        _driveSide: null,
        _speedUnit: null,
    },
    timezoneInfo: {
        _name: null,
        _nowInDst: null,
    }
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

export const updatCountryInfo = (dataObj) => {
    placeObj._countryName = dataObj.name;
    placeObj._countryCoords = dataObj.coords;
    placeObj._continent = dataObj.continent;
    placeObj._flag = dataObj.flag;
    placeObj.currencyInfo._unitName = dataObj.unitName;
    placeObj.currencyInfo._subunitName = dataObj.subunitName;
    placeObj.currencyInfo._smallest = dataObj.smallest;
    placeObj.currencyInfo._symbol = dataObj.symbol;
    placeObj.currencyInfo._symbolPosition = dataObj.symbolPos;
    placeObj.roadInfo._driveSide = dataObj.driveSide;
    placeObj.roadInfo._speedUnit = dataObj.speedUnit;
    placeObj.timezoneInfo._name = dataObj.timezoneName;
    placeObj.timezoneInfo._nowInDst = dataObj.dst;
}