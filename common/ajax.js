export const getOverlayInfo = (isoCodeA2) => {

    let data;

    return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getOverlayInfo.php",
                type: "post",
                dataType: "json",
                data: {
                    code: isoCodeA2
                },

                success: (res)=> {
                    resolve(
                        data = {
                            overlays: res.data,
                            code: isoCodeA2
                        })
                },

                error: (err)=> {
                    reject(err);
                }
            })
    })
}

export const getCountryInfo = (data) => {

    const date = new Date();

    return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getCountryInfo.php",
                type: "post",
                dataType: "json",
                data: {
                    code: data,
                    year: date.getFullYear()
                },

                success: (res)=> {
                    resolve(res.data)
                },

                error: (err)=> {
                    reject(err);
                }
            })
    })
}

export const getCtryBorders = (data) => {

        let ctryInfo;

        return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getCtryBorders.php",
                type: "post",
                dataType: "json",
                data: {
                    code: data.restCtry.alpha2Code
                },

                success: (res)=> {
                    resolve(ctryInfo = {
                        borders: res.data[0].geometry,
                        ctryInfo: data
                    })
                },

                error: (err)=> {
                    reject(err);
                }
            })
        })

}

export const getPopupInfo = (latLng) => {
    return new Promise((resolve, reject)=> {

        $.ajax({
                url: "./php/getPopupInfo.php",
                type: "post",
                dataType: "json",
                data: {
                    lat: latLng[0],
                    lng: latLng[1]
                },

                success: (res)=> {
                    resolve(res.data)
                },

                error: (err)=> {
                    reject(err)
                }
        })
    })
}