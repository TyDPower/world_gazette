export const getUserLatLng = () => {

    var options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
    };

    return new Promise((resolve, reject)=> {
        navigator.geolocation.getCurrentPosition((pos)=> {
            var latLng = [pos.coords.latitude, pos.coords.longitude];
            resolve(latLng);
        }, (err)=> {
            reject(err);
        }, options)
    })

}

export const getUserCtry = (latLngArr) => {

        return new Promise((resolve, reject)=> {

            $.ajax({
                url: "./php/getUserCtry.php",
                type: "post",
                dataType: "json",
                data: {
                    lat: latLngArr[0],
                    lng: latLngArr[1]
                },

                success: (res)=> {
                    resolve(res.data)
                },

                error: (err)=> {
                    console.error(err);
                }
            })
        })
}