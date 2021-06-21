export var obj = {
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
    },
    marker: L.icon({
        iconUrl: "./images/icebergMarker.svg",
        iconSize: [38, 95]
    }),
    layerGroups: L.layerGroup(),             
        
}

export const updateIsoA3 = (isoA3) => {
    if (isoA3) {
        obj._isoCodeA3 = isoA3;
    }
    return obj._isoCodeA3;
}

export const updateIsoA2 = (isoA2) => {
    if (isoA2) {
        obj._isoCodeA2 = isoA2;
    }
    return obj._isoCodeA2;
}

export const updateCountryBorders = (borders) => {
    if (borders) {
        obj._countryBorders = borders;
    }
    return obj._countryBorders;
}

export const updateCountryName = (name) => {
    if (name) {
        obj._countryName = name;
    }
    return obj._countryName;
}

export const updateCountryCoords = (latLng) => {
    if (latLng === "lat") {
        return obj._countryCoords[0]
    }

    if (latLng === "lng") {
        return obj._countryCoords[1]
    }

    if (Array.isArray(latLng)) {
        obj._countryCoords = latLng;
    }

    return obj._countryCoords
}

export const updateCountryInfo = (dataObj) => {
    if (dataObj) {

        obj._countryName = dataObj.name;
        obj._countryCoords = dataObj.coords;
        obj._continent = dataObj.continent;
        obj._flag = dataObj.flag;
        obj.marker = dataObj.flag;
        obj.currencyInfo._unitName = dataObj.currencyName;
        obj.currencyInfo._subunitName = dataObj.currencySubunitName;
        obj.currencyInfo._symbol = dataObj.currencySymbol;
        obj.currencyInfo._symbolPosition = dataObj.symbolPos;
        obj.roadInfo._driveSide = dataObj.driveSide;
        obj.roadInfo._speedUnit = dataObj.speedUnit;
        obj.timezoneInfo._name = dataObj.timezoneName;
        obj.timezoneInfo._nowInDst = dataObj.dst;

    } else {
        
        var modalPlaceObj = {
            name: obj._countryName,
            coordsoords: obj._countryCoords,
            continent: obj._continent,
            flag: obj._flag,
            currencyInfo: {
                name: obj.currencyInfo._unitName,
                subunit: obj.currencyInfo._subunitName,
                symbol: obj.currencyInfo._symbol,
                symbolPos:obj.currencyInfo._symbolPosition,
            },
            roadInfo: {
                driveSide: obj.roadInfo._driveSide,
                speedUnit: obj.roadInfo._speedUnit,
            },
            timezoneInfo: {
                name: obj.timezoneInfo._name,
                dst: obj.timezoneInfo._nowInDst,
            }
        }

        return modalPlaceObj

    }

}