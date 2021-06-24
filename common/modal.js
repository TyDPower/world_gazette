export const countryInfo = (data) => {

    var checkDST = (dst) => {
        if (dst === 1) {
            return "Daylight Savings Time is currently active"
        } else {
            return "No Daylight Savings Time currently active"
        }
    }

    $("#countryName").html(data.countryName);
    $("#continent").html(data.continent);
    $("#population").html(data.societyInfo.population);
    $("#languagePrimary").html(data.societyInfo.languagePrimary);
    $("#languagesOther").html(data.societyInfo.languagesOther);
    $("#flag").html(data.flag);
    $("#currencyName").html("Currency name: " + data.currencyInfo.name);
    $("#currencySubunit").html("Smallest unit: " + data.currencyInfo.subunit);
    $("#currencySymbol").html("Symbol: " + data.currencyInfo.symbol);
    $("#foreignExchange").html("USD to " + data.currencyInfo.name + ": " + "$" + data.currencyInfo.foreignExchange[1]);
    $("#driveSide").html("Drive on the " + data.roadInfo.driveSide + " side of the road.");
    $("#speedUnit").html("Speed is mesured in " + data.roadInfo.speedUnit);
    $("#trafficIndex").html(data.indexes.traffic);
    $("#qualityOfLifeIndex").html(data.indexes.qualityOfLife);
    $("#healthcareIndex").html(data.indexes.healthcare);
    $("#crimeIndex").html(data.indexes.crime);
    $("#pollutionIndex").html(data.indexes.pollution);
    $("#timezoneName").html(data.timezoneInfo.name);
    $("#timezoneDst").html(checkDST(data.timezoneInfo.dst));

    
    
    
    $("#countryModal").show();
    
}