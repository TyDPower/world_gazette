import * as utilities from "./utilities.js"

export const countryInfo = (selectedCountry, userCountry ) => {

    let slctCntry = selectedCountry;
    let slctScty = selectedCountry.societyInfo;
    let slctCurr = selectedCountry.currencyInfo;
    let slctIdx = selectedCountry.indexes;
    let slctRd = selectedCountry.roadInfo;
    let slctTz = selectedCountry.timezoneInfo;

    let userCntry = userCountry
    let userCurr = userCountry.currencyInfo;
    let userIdx = userCountry.indexes;

    let indexes = {
        user: {
            country: userCntry.countryName,
            traffic: userIdx.traffic,
            qualityOfLife: userIdx.qualityOfLife,
            healthcare: userIdx.healthcare,
            crime: userIdx.crime,
            safety: userIdx.safety,
            pollution: userIdx.pollution,
            costOfLiving: userIdx.costOfLiving,
            rent: userIdx.rent,
            groceries: userIdx.groceries,
            resturant: userIdx.resturant,
            purchasingPower: userIdx.purchasingPower,
        },
        selected: {
            country: slctCntry.countryName,
            traffic: slctIdx.traffic,
            qualityOfLife: slctIdx.qualityOfLife,
            healthcare: slctIdx.healthcare,
            crime: slctIdx.crime,
            safety: slctIdx.safety,
            pollution: slctIdx.pollution,
            costOfLiving: slctIdx.costOfLiving,
            rent: slctIdx.rent,
            groceries: slctIdx.groceries,
            resturant: slctIdx.resturant,
            purchasingPower: slctIdx.purchasingPower,
        }
    }


    $("#countryName").html(slctCntry.countryName);
    $("#population").html(slctScty.population);
    $("#languagePrimary").html(slctScty.languagePrimary);
    $("#languagesOther").html(slctScty.languagesOther);
    $("#flag").html(slctCntry.flag);
    $("#currencyName").html("Currency name: " + slctCurr.name);
    $("#currencySubunit").html("Smallest unit: " + slctCurr.subunit);
    $("#currencySymbol").html("Symbol: " + slctCurr.symbol);

    $("#foreignExchange").html(utilities.checkValidCurrency(userCurr.symbol) + "1 = " + slctCurr.symbol + slctCurr.foreignExchange[1]);

    $("#driveSide").html("Drive on the " + slctRd.driveSide + " side of the road.");
    $("#speedUnit").html("Speed is mesured in " + slctRd.speedUnit);

    $("#trafficIndex").html(utilities.compareIndex("traffic", [indexes.user.country, indexes.user.traffic], [indexes.selected.country, indexes.selected.traffic]));

    $("#qualityOfLifeIndex").html(utilities.compareIndex("quality of life", [indexes.user.country, indexes.user.qualityOfLife], [indexes.selected.country, indexes.selected.qualityOfLife]));

    $("#healthcareIndex").html(utilities.compareIndex("healthcare", [indexes.user.country, indexes.user.healthcare], [indexes.selected.country, indexes.selected.healthcare]));
    
    $("#crimeIndex").html(utilities.compareIndex("crime", [indexes.user.country, indexes.user.crime], [indexes.selected.country, indexes.selected.crime]));

    $("#pollutionIndex").html(utilities.compareIndex("pollution", [indexes.user.country, indexes.user.pollution], [indexes.selected.country, indexes.selected.pollution]));
    $("#timezoneName").html(slctTz.name);
    $("#timezoneDst").html(utilities.checkDST(slctTz.dst));
    
    $("#countryModal").show();
    
}