export const getMichelinRestaurants = (map) => {
    return new Promise((res, rej)=> {

        $.ajax(
            {
                url: "./php/getMichelinRestaurants.php",
                type: "post",
                dataType: "json",

            success: (res)=> {
                
                if (res.status.name == "ok") {

                    let rest = res.data.results;

                    rest.forEach((res)=> {
                        let latLng = [res.Location.latitude, res.Location.longitude];

                        let marker = L.icon({
                            iconUrl: "./images/restaurantMarker.svg",
                            iconSize: [39, 95]
                        });

                        L.marker(latLng, {icon: marker}).addTo(map);
                        
                    })
                }

            },

            error: (err)=> {
                console.error(err)
            }
        }
        )
    })
}