export const compareIndex = (selectedCountryIndex, userCountryIndex) => {
    
    let res;
    let value;
    
    let getComparisonValue = (selectedCountryIndex, userCountryIndex) => {

        if (!selectedCountryIndex || !userCountryIndex) {
            return "No data"
        }

        let x = selectedCountryIndex * 100
        x = x / userCountryIndex
        return x
    } 
    
    let comparison = (value) => {

        if (!value) {
            return "No data"
        }

        if (value <= 100) {
            let z = 100 - value
            z = z.toFixed(2)
            return `${z}% higher`
        } else if (value > 100 && value < 1000) {
            let a = value - 100
            a = a.toFixed(2)
            return `${a}% lower`
        } else {
            return `N/A`
        }
    }
    
    value = getComparisonValue(selectedCountryIndex, userCountryIndex);
    res = comparison(value);

    return res;
};

export const checkValidCurrency = (userCurrency) => {
    if (!userCurrency) {
        return "$"
    } else {
        return userCurrency
    }
};

export const clearAllLayers = (countryObj, eventsObj, geoDataObj, worldTilesObj, mapObj) => {
    $(".modal").addClass(" modalOff");
    if (!eventsObj && !countryObj) {
        geoDataObj.clusters.clearLayers();
    } else if (!eventsObj) {
        countryObj.utils.removeLayers(countryObj);
        geoDataObj.clusters.clearLayers();
    } else if (!countryObj) {
        eventsObj.utils.removeLayers(eventsObj);
        geoDataObj.clusters.clearLayers();
    } else {
        countryObj.utils.removeLayers(countryObj);
        eventsObj.utils.removeLayers(eventsObj);
        geoDataObj.clusters.clearLayers();
    }
    worldTilesObj.utils.removeOverlays();
    mapObj.panTo([0, 0])
    if (mapObj.getZoom() > 2) {
        mapObj.setZoom(2);
    }  
}

export const validIndexCheck = (index) => {

    if (!index) {
        return "No data"
    }
    return index.toFixed(2);
}