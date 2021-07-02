import * as utilities from "./utilities.js"

export const countryInfo = (selectedCountry, userCountry) => {

    const displayLanguages = () => {
        $("#languages").html("");
        selectedCountry.social.languages.forEach(res=>{$("#languages").append(`${res.name}<br>`)});
    }

    $("#countryName").html(selectedCountry.admin.name);
    $("#population").html("Population: " + selectedCountry.social.population);
    $("#languagesTitle").html("Some of " + selectedCountry.admin.name + "'s languages:")
    $("#flag").attr("src", selectedCountry.flag.large);

    displayLanguages();
    
    $("#currencyName").html("Currency name: " + selectedCountry.currency.name);
    $("#currencySymbol").html("Symbol: " + selectedCountry.currency.symbol);

    $("#foreignExchange").html(utilities.checkValidCurrency(userCountry.currency.symbol) + "1 = " + selectedCountry.currency.symbol + selectedCountry.currency.exchangeRate[1].toFixed(3));

    $("#driveSide").html("Drive on the ?? side of the road.");
    $("#speedUnit").html("Speed is mesured in ??");

    $("#trafficIndex").html(utilities.compareIndex("traffic", selectedCountry, userCountry));
    $("#qualityOfLifeIndex").html(utilities.compareIndex("qualityOfLife", selectedCountry, userCountry));
    $("#healthcareIndex").html(utilities.compareIndex("healthcare", selectedCountry, userCountry));
    $("#crimeIndex").html(utilities.compareIndex("crime", selectedCountry, userCountry));
    $("#pollutionIndex").html(utilities.compareIndex("pollution", selectedCountry, userCountry));

    $("#timezoneName").html(); //Copy displayLanguages function
    
    //$("#countryModal").show();
    
}