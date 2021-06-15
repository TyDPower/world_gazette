export var _placeParams = {
    _isoCodeA3: null,
    _isoCodeA2: null,
    _borders: null,
    _isLoaded: false,
    _name: null,
    _latLng: []
}

export const updateIsoA3 = (isoA3) => {
    if (isoA3) {
        _placeParams._isoCodeA3 = isoA3;
    }
    return _placeParams._isoCodeA3;
}

export const updateIsoA2 = (isoA2) => {
    if (isoA2) {
        _placeParams._isoCodeA2 = isoA2;
    }
    return _placeParams._isoCodeA2;
}

export const updateBorders = (borders) => {
    if (borders) {
        _placeParams._borders = borders;
    }
    return _placeParams._borders;
}

export const updateIsLoaded = (loaded) => {
    if (loaded) {
        _placeParams._isLoaded = loaded;
    }
    return _placeParams._isLoaded;
}

export const updateName = (name) => {
    if (name) {
        _placeParams._name = name;
    }
    return _placeParams._name;
}

export const updateLatLng = (latLng) => {
    if (latLng === "lat") {
        return _placeParams._latLng[0]
    }

    if (latLng === "lng") {
        return _placeParams._latLng[1]
    }

    if (Array.isArray(latLng)) {
        _placeParams._latLng = latLng;
    }
}