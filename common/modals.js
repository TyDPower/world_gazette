import * as utilities from "./utilities.js"

export const countryModal = (selectedCountry, userCountry) => {
    
    const displayLanguages = () => {
        $("#languages").html("");
        selectedCountry.social.languages.forEach(res=>{$("#languages").append(`${res.name}<br>`)});
    }

    const displayTimezones = () => {
        $("#timezone").html("");
        for (let i=0; i<selectedCountry.timezones[0].length; i++) {
            $("#timezone").append(`${selectedCountry.timezones[0][i]}<br>`)
        }
    }

    $("#countryName").html(selectedCountry.admin.name);
    $("#countryRegion").html(` (${selectedCountry.admin.region},`);
    $("#countrySubRegion").html(` ${selectedCountry.admin.subregion})`);

    $("#capital").html(`Capital City: ${selectedCountry.admin.capital}`);
    $("#population").html("Population: " + selectedCountry.social.population);
    $("#languagesTitle").html(selectedCountry.admin.name + "'s languages:")
    $("#flag").attr("src", selectedCountry.flag.large);

    displayLanguages();
    
    $("#currencyName").html("Currency name: " + selectedCountry.currency.name);
    $("#currencySymbol").html("Symbol: " + selectedCountry.currency.symbol);

    $("#foreignExchange").html(utilities.checkValidCurrency(userCountry.currency.symbol) + "1 = " + selectedCountry.currency.symbol + selectedCountry.currency.exchangeRate[1].toFixed(3));

    $("#livingInfoComparison").html(`*This is a general comparison of living conditions in ${selectedCountry.admin.name} with ${userCountry.admin.name}`);

    $("#indexTableCountry1").html(selectedCountry.admin.iso[0]);
    $("#indexTableCountry2").html(userCountry.admin.iso[0]);
    $("#indexTableComparison").html(`${userCountry.admin.iso[0]} vs. ${selectedCountry.admin.iso[0]}`);

    $("#healthIndexCountry1").html(utilities.validIndexCheck(selectedCountry.index.healthcare));
    $("#healthIndexCountry2").html(utilities.validIndexCheck(userCountry.index.healthcare));
    $("#healthIndexComparison").html(utilities.compareIndex(selectedCountry.index.healthcare, userCountry.index.healthcare));

    $("#crimeIndexCountry1").html(utilities.validIndexCheck(selectedCountry.index.crime));
    $("#crimeIndexCountry2").html(utilities.validIndexCheck(userCountry.index.crime));
    $("#crimeIndexComparison").html(utilities.compareIndex(selectedCountry.index.crime, userCountry.index.crime));

    $("#pollutionIndexCountry1").html(utilities.validIndexCheck(selectedCountry.index.pollution));
    $("#pollutionIndexCountry2").html(utilities.validIndexCheck(userCountry.index.pollution));
    $("#pollutionIndexComparison").html(utilities.compareIndex(selectedCountry.index.pollution, userCountry.index.pollution));

    $("#trafficIndexCountry1").html(utilities.validIndexCheck(selectedCountry.index.traffic));
    $("#trafficIndexCountry2").html(utilities.validIndexCheck(userCountry.index.traffic));
    $("#trafficIndexComparison").html(utilities.compareIndex(selectedCountry.index.traffic, userCountry.index.traffic));

    displayTimezones();
    
    $("#countryModal").removeClass(" modalOff");
    
}

export const geoDataModal = (data) => {

    if (data) {
        $("#geoDataModal").removeClass(" modalOff");
        $("#geoDataModalTitle").html(data.geoName);
        $("#geoDataModalLat").html(`Lat: ${data.lat}`);
        $("#geoDataModalLng").html(`Lng: ${data.lng}`);
        $("#geoDataModalAddress").html(`Address: ${data.address}`);
        return;
    }

    $("#geoDataModalTitle").html("No data avalible");

}

export const naturalEventModal = (data) => {
    console.log(data)

    if (data) {
        $("#naturalEventsModal").removeClass(" modalOff");
        $("#naturalEventsModalTitle").html(data.title);
        $("#naturalEventsModalDate").html(`Date & Time: ${data.geometries[0].date}`);
        $("#naturalEventsModalLat").html(`Lat: ${data.geometries[0].coordinates[0]}`);
        $("#naturalEventsModalLng").html(`Lng: ${data.geometries[0].coordinates[1]}`);
        return;
    }

    $("#naturalEventsModalTitle").html("No data avalible");
}