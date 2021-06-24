export const countryInfo = (data) => {

    var checkDST = (dst) => {
        if (dst === 1) {
            return "Daylight Savings Time is currently active"
        } else {
            return "No Daylight Savings Time currently active"
        }
    }

    $("#countryName").html(data.name);
    $("#continent").html(data.continent);
    $("#flag").html(data.flag);
    $("#currencyName").html(data.currencyInfo.name);
    $("#currencySubunit").html(data.currencyInfo.subunit);
    $("#currencySymbol").html(data.currencyInfo.symbol);
    $("#driveSide").html(data.roadInfo.driveSide);
    $("#speedUnit").html(data.roadInfo.speedUnit);
    $("#timezoneName").html(data.timezoneInfo.name);
    $("#timezoneDst").html(checkDST(data.timezoneInfo.dst));

    $("#population").html(data.societyInfo.population);
    $("#languagePrimary").html(data.societyInfo.languagePrimary);
    $("#languagesOther").html(data.societyInfo.languagesOther);
    $("#trafficIndex").html(data.indexes.traffic);
    $("#qualityOfLifeIndex").html(data.indexes.qualityOfLife);
    $("#healthcareIndex").html(data.indexes.healthcare);
    $("#crimeIndex").html(data.indexes.crime);
    $("#pollutionIndex").html(data.indexes.pollution);
    $("#countryModal").show();
    
}