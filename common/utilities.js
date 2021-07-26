export const reverseStr = (str) => {
    let splitStr = str.split("-");
    let revArr = splitStr.reverse();
    let revStr = revArr.join("-");
    return revStr;
}

export const checkValue = (symbol, val) => {
    if (val) {
        return symbol + val.toFixed(2);
    }

    return "No data"
}

export const getCountryList = (iso) => {

    let country = $("#countrySelector");

    return new Promise((resolve, reject)=> {

        $.ajax({
                url: "./php/getCountryList.php",
                type: "post",
                dataType: "json",
                success: (res)=> {
                    if (res.status.name == "ok") {
                        res.data.forEach((res) => {
                            $("#countrySelector").append(
                                $("<option>", {
                                    value: res.code,
                                    text: res.name,
                                })
                            );
                        })

                        for (let i=0; i<country[0].length; i++) {
                            if (country[0][i].value === iso.toUpperCase()) {
                                country[0][i].defaultSelected = true;
                                resolve(iso)
                            }
                        }
                    }
                },
                error: (err)=> {
                    reject(err)
                }
        })
    })
        
}

export const addCtryLayer = (data, ctryLayerGroup) => {

    ctryLayerGroup.addLayer(L.geoJSON(data.borders)).addTo(map);

    let crds = data.ctryInfo.openCage.bounds
    let bounds = [
            [crds.northeast.lat, crds.northeast.lng], [crds.southwest.lat, crds.southwest.lng]
    ]
    map.fitBounds(bounds)

    return data;
}

export const getName = (data) => {
    if (data.location.city) {
        return data.location.city
    } else if (data.location.town) {
        return data.location.town
    } else {
        return "Name not avalible"
    }
}