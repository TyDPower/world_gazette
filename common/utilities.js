export const compareIndex = (indexType, selectedCountry, userCountry) => {
    
    let res;
    let value;
    
    let getComparisonValue = (selectedCountryIndex, userCountryIndex) => {
        let x = selectedCountryIndex * 100
        x = x / userCountryIndex
        return x
    } 
    
    let comparison = (whichIndex, value) => {
        if (value <= 100) {
            let z = 100 - value
            z = z.toFixed(2)
            return `${userCountry.admin.name} ${whichIndex} index is ${z}% higher than in ${selectedCountry.admin.name}`
        } else if (value > 100 && value < 1000) {
            let a = value - 100
            a = a.toFixed(2)
            return `${userCountry.admin.name} ${whichIndex} index is ${a}% lower than in ${selectedCountry.admin.name}`
        } else {
            return `Not enough information is avalible for this comparison. Either enable location sharing by refreshing your browser or please see "About API's" if you have any data relating to ${whichIndex} in ${selectedCountry.admin.name}.`
        }
    }  

    switch (indexType) {
        case "traffic":
            value = getComparisonValue(selectedCountry.index.traffic, userCountry.index.traffic)
            res = comparison(indexType, value);
            break;

        case "quality of life":
            value = getComparisonValue(selectedCountry.index.qualityOfLife, userCountry.index.qualityOfLife)
            res = comparison(indexType, value);
            break;

        case "healthcare":
            value = getComparisonValue(selectedCountry.index.healthcare, userCountry.index.healthcare)
            res = comparison(indexType, value);
            break;

        case "crime":
            value = getComparisonValue(selectedCountry.index.crime, userCountry.index.crime)
            res = comparison(indexType, value);
            break;

        case "safety":
            value = getComparisonValue(selectedCountry.index.safety, userCountry.index.safety)
            res = comparison(indexType, value);
            break;

        case "pollution":
            value = getComparisonValue(selectedCountry.index.pollution, userCountry.index.pollution)
            res = comparison(indexType, value);
            break;

        case "cost of living":
            value = getComparisonValue(selectedCountry.index.costOfLiving, userCountry.index.costOfLiving)
            res = comparison(indexType, value);
            break;

        case "rent":
            value = getComparisonValue(selectedCountry.index.rent, userCountry.index.rent)
            res = comparison(indexType, value);
            break;

        case "groceries": case "food":
            value = getComparisonValue(selectedCountry.index.groceries, userCountry.index.groceries)
            res = comparison(indexType, value);
            break;

        case "resturant":
            value = getComparisonValue(selectedCountry.index.resturant, userCountry.index.resturant)
            res = comparison(indexType, value);
            break;

        case "purchasing power":
            value = getComparisonValue(selectedCountry.index.purchasingPower, userCountry.index.purchasingPower)
            res = comparison(indexType, value);
            break;

        default:
            console.error(indexType)
    }

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