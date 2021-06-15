$(document).ready(()=> {

    var _placeParams = {
        _isoCodeA3: null,
        _isoCodeA2: null,
        _borders: null,
        _isLoaded: false,
        _name: null,
        _latLng: []
    }

    const updateIsoA3 = (isoA3) => {
        if (isoA3) {
            _placeParams._isoCodeA3 = isoA3;
        }
        return _placeParams._isoCodeA3;
    }

    const updateIsoA2 = (isoA2) => {
        if (isoA2) {
            _placeParams._isoCodeA2 = isoA2;
        }
        return _placeParams._isoCodeA2;
    }

    const updateBorders = (borders) => {
        if (borders) {
            _placeParams._borders = borders;
        }
        return _placeParams._borders;
    }

    const updateIsLoaded = (loaded) => {
        if (loaded) {
            _placeParams._isLoaded = loaded;
        }
        return _placeParams._isLoaded;
    }

    const updateName = (name) => {
        if (name) {
            _placeParams._name = name;
        }
        return _placeParams._name;
    }

    const updateLatLng = (latLng) => {
        if (latLng === "lat") {
            return _placeParams._latLng[0]
        }

        if (latLng === "lng") {
            return _placeParams._latLng[1]
        }

        if (Array.isArray(latLng)) {
            _placeParams._latLng = latLng;
        }
    }

    

    //Initial World map tiles
    var map = L.map('map').fitWorld();
    const worldMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });
    worldMap.addTo(map);

    //Grab user location with marker and country select
    map.locate({setView: true, maxZoom: 16});
    const onLocationFound = (e) => {
        var radius = e.accuracy;

        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();

        L.circle(e.latlng, radius).addTo(map);

        if (e.latlng) {
            $.getJSON("./common/countries.geo.json", (data)=> {
                $.ajax(
                    {
                        url: "./php/getUserCountryInfo.php",
                        type: "post",
                        dataType: "json",
                        data: {
                            lat: e.latlng.lat,
                            lng: e.latlng.lng
                        },
            
                        success: (res)=> {
                            if (res.status.name == "ok") {
                                country = res.data.results[0].components["ISO_3166-1_alpha-3"]
                                for (let i=0; i<data.features.length; i++) {
                                    if (data.features[i].properties.ISO_A3 == country) {
                                        let countryBorder = data.features[i];
                                        L.geoJSON(countryBorder).addTo(map);
                                        break;
                                    }
                                }
                            }
                        },
            
                        error: (err)=> {
                            console.log(err);
                        }
                    }
                )
            })
        }
        
    }
    map.on('locationfound', onLocationFound);
    const onLocationError = (e) => {
        alert(e.message);
    }
    map.on('locationerror', onLocationError);

    //Select new country with html drop down menu
    $("#countryList").change(()=> {

        var codeA3 = $("#countryList").val().slice(7, 10);
        var codeA2 = $("#countryList").val().slice(19, 21);

        updateIsoA3(codeA3);
        updateIsoA2(codeA2);


        $.getJSON("./common/countries.geo.json", (data)=> {
            for (let i=0; i<data.features.length; i++) {
                if (data.features[i].properties.ISO_A3 == updateIsoA3()) {
                    updateBorders(data.features[i]);
                    updateName(data.features[i].properties.ADMIN);
                    $(".leaflet-interactive")[1].remove();
                    L.geoJSON(updateBorders()).addTo(map);

                    $.ajax(
                        {
                            url: "./php/getPlaceInfo.php",
                            type: "post",
                            dataType: "json",
                            data: {
                                isoCode: updateIsoA2(),
                                countryName: updateName().replace(/\s+/g, "_")
                            },
                
                            success: (res)=> {
                                if (res.status.name == "ok") {
                                    var results = res.data.results[0].geometry
                                    updateLatLng([results.lat, results.lng])
                                    map.panTo([updateLatLng("lat"), updateLatLng("lng")]).setZoom(5)
                                    setTimeout(()=> {
                                        $(".modal").show();
                                    }, 1000)
                
                                    $("#closeBtn").click(()=> {
                                        $(".modal").hide();
                                    })
                                    updateIsLoaded(true);

                                }
                            },
                
                            error: (err)=> {
                                console.log(err);
                            }
                        }
                    )

                }
            }
        })

    })

})