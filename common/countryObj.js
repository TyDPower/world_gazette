export class Country {
    constructor() {
        this.admin = {
            name: null,
            iso: null,
            capital: null,
            region: null,
            subregion: null,
            latlng: null
        };
        this.social = {
            population: null,
            languages: null
        };
        this.timezones = null;
        this.currency = {
            currencyName: null,
            currencyCode: null,
            currencySymbol: null,
        };
        this.index = {
            crime: null,
            safety: null,
            healthcare: null,
            qualityOfLife: null,
            costOfLiving: null,
            rent: null,
            groceries: null,
            traffic: null,
            pollution: null,
            restaurant: null,
            purchasingPower: null,
        };
        this.borders = {
            obj: null,
            isLoaded: null
        };
        this.layerGroups = L.layerGroup();
        this.isLoaded = null;
    }
}

export const URLs = {
    restcountriestAPI: "./php/getCountryInfo.php",
    numbeoCountryIndexAPI: "./php/getCountryIndices.php"
}

export const getCountryInfo = (countryObj, phpUrl, isoCode) => {

    let setCountryInfo = (data) => {
        {if (!countryObj.admin.name) {countryObj.admin.name = data.name}};
        {if (!countryObj.admin.iso) {countryObj.admin.iso = [data.alpha2Code, data.alpha3Code]}};
        {if (!countryObj.admin.capital) {countryObj.admin.capital = data.capital}};
        {if (!countryObj.admin.region) {countryObj.admin.region = data.region}};
        {if (!countryObj.admin.subregion) {countryObj.admin.subregion = data.subregion}};
        {if (!countryObj.admin.latlng) {countryObj.admin.latlng = [data.latlng[0], data.latlng[1]]}};

        {if (!countryObj.social.population) {countryObj.social.population = data.population}};
        {if (!countryObj.social.languages) {countryObj.social.languages = data.languages}};

        {if (!countryObj.timezones) {countryObj.timezones = [data.timezones]}};

        {if (!countryObj.currency.currencyName) {countryObj.currency.currencyName = data.currencies[0].name}};
        {if (!countryObj.currency.currencyCode) {countryObj.currency.currencyCode = data.currencies[0].code}};
        {if (!countryObj.currency.currencySymbol) {countryObj.currency.currencySymbol = data.currencies[0].symbol}};
         
    };

    let setIndexes = (data) => {
        if (!countryObj.index.crime) {countryObj.index.crime = data.crime_index}
        if (!countryObj.index.safety) {countryObj.index.safety = data.safety_index}
        if (!countryObj.index.healthcare) {countryObj.index.healthcare = data.health_care_index}
        if (!countryObj.index.qualityOfLife) {countryObj.index.qualityOfLife = data.quality_of_life_index}
        if (!countryObj.index.costOfLiving) {countryObj.index.costOfLiving = data.contributors_cost_of_living}
        if (!countryObj.index.rent) {countryObj.index.rent = data.rent_index}
        if (!countryObj.index.groceries) {countryObj.index.groceries = data.groceries_index}
        if (!countryObj.index.traffic) {countryObj.index.traffic = data.traffic_index}
        if (!countryObj.index.pollution) {countryObj.index.pollution = data.pollution_index}
        if (!countryObj.index.restaurant) {countryObj.index.restaurant = data.restaurant_price_index}
        if (!countryObj.index.purchasingPower) {countryObj.index.purchasingPower = data.purchasing_power_incl_rent_index}
    };

    let setIsLoaded = (data) => {return countryObj.isLoaded = data};

    return new Promise((resolve, reject)=> {

        let code;

        if (isoCode) {
            code = isoCode;
        } else {
            code = countryObj.admin.iso[1]
        }

        $.ajax(
            {
                url: phpUrl,
                type: "post",
                dataType: "json",
                data: {
                    isoCode: code,
                },

                success: (res)=> {
                    if (res.status.name == "ok") {

                        let data = res.data;
                        setCountryInfo(data);
                        setIndexes(data);
                        setIsLoaded(true);


                        if (countryObj.isLoaded) {
                            countryObj.isLoaded = false;
                            resolve(countryObj);
                        } else {
                            reject();
                        };
                    }
                },

                error: (err)=> {
                    console.error(err);
                }
            }
        )
    })

};

export const getCountryBorders = (countryObj) => {

    let codeA3 = countryObj.admin.iso[1];

    return new Promise((resolve, reject)=> {

        $.getJSON("./common/countries.geo.json", (data)=> {
            for (let i=0; i<data.features.length; i++) {
                if (data.features[i].properties.ISO_A3 === codeA3) {
                    countryObj.borders.obj = data.features[i]
                    countryObj.borders.isLoaded = true
                    if (countryObj.borders.isLoaded) {
                        resolve(countryObj);
                    } else {
                        reject();
                    }
                }
            }
        })
    })

}