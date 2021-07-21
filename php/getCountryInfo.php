<?php

    $startTime = microtime(true);

    // create both cURL resources
    $ch_1 = curl_init();
    $ch_2 = curl_init();

    // set URL and other appropriate options
    curl_setopt($ch_1, CURLOPT_URL, "https://restcountries.eu/rest/v2/alpha/" . $_REQUEST["code"]);
    curl_setopt($ch_1, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_1, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_2, CURLOPT_URL, "https://calendarific.com/api/v2/holidays?&api_key=52d3118105369c8e9aad61e7d6786890469695bc4b41189b42a4f1ac99028b3f&country=" . $_REQUEST['code'] . "&year=" . $_REQUEST["year"]);
    curl_setopt($ch_2, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_2, CURLOPT_RETURNTRANSFER, true);

    //create the multiple cURL handle
    $mh = curl_multi_init();

    //add the two handles
    curl_multi_add_handle($mh,$ch_1);
    curl_multi_add_handle($mh,$ch_2);

    //execute the multi handle
    do {
        $status = curl_multi_exec($mh, $active);
        if ($active) {
            curl_multi_select($mh);
        }
    } while ($active && $status == CURLM_OK);

    //close the handles
    curl_multi_remove_handle($mh, $ch_1);
    curl_multi_remove_handle($mh, $ch_2);
    curl_multi_close($mh);

    //returned data
    $restCtry = curl_multi_getcontent($ch_1);
    $restCtry = json_decode($restCtry, true);

    $holidays = curl_multi_getcontent($ch_2);
    $holidays = json_decode($holidays, true);

    //---------------- NEW CALLS

    // create both cURL resources
    $ch_3 = curl_init();

    // set URL and other appropriate options
    curl_setopt($ch_3, CURLOPT_URL, "https://api.opencagedata.com/geocode/v1/json?q=" . urlencode($restCtry["name"]) . "&key=efbd5efcc6254578986dc2d63c0edb90");
    curl_setopt($ch_3, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_3, CURLOPT_RETURNTRANSFER, true);

    $openCage = curl_exec($ch_3);
    $openCage = json_decode($openCage, true);

    //------ End second call

    //------ NEW MULTI CALLS

    $ctryName = $openCage["results"][0]["formatted"];
    $CurCode = $openCage["results"][0]["annotations"]["currency"]["iso_code"];

    $ch_4 = curl_init();
    $ch_5 = curl_init();
    $ch_6 = curl_init();
    $ch_7 = curl_init();
    $ch_8 = curl_init();
    $ch_9 = curl_init();

    curl_setopt($ch_4, CURLOPT_URL, "https://v6.exchangerate-api.com/v6/247d6cf5bdadac21866fe380/latest/" . urlencode($CurCode));
    curl_setopt($ch_4, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_4, CURLOPT_RETURNTRANSFER, true);

    curl_setopt_array($ch_5, [
        CURLOPT_URL => "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI?q=" . urlencode($ctryName) . "&pageNumber=1&pageSize=50&autoCorrect=true&fromPublishedDate=null&toPublishedDate=null",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "x-rapidapi-host: contextualwebsearch-websearch-v1.p.rapidapi.com",
            "x-rapidapi-key: 50caf53eb7mshba8f533cc18d2dfp1cfbbejsnbd804f79fce6"
        ],
    ]);

    curl_setopt($ch_6, CURLOPT_URL, "http://api.geonames.org/wikipediaSearchJSON?q=". urlencode($ctryName) . "&maxRows=30&username=tydpower");
    curl_setopt($ch_6, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_6, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_7, CURLOPT_URL, "https://pixabay.com/api/?key=22562417-a852f90eda44cc531e1b38810&q=" . urlencode($ctryName) . "&per_page=50");
    curl_setopt($ch_7, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_7, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_8, CURLOPT_URL, "https://www.numbeo.com/api/country_prices?api_key=wvlo2tz1pwdnha&country=" . urlencode($ctryName));
    curl_setopt($ch_8, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_8, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_9, CURLOPT_URL, "https://www.numbeo.com/api/country_indices?api_key=wvlo2tz1pwdnha&country=" . urlencode($ctryName));
    curl_setopt($ch_9, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_9, CURLOPT_RETURNTRANSFER, true);

    $mh = curl_multi_init();

    curl_multi_add_handle($mh,$ch_4);
    curl_multi_add_handle($mh,$ch_5);
    curl_multi_add_handle($mh,$ch_6);
    curl_multi_add_handle($mh,$ch_7);
    curl_multi_add_handle($mh,$ch_8);
    curl_multi_add_handle($mh,$ch_9);

    do {
        $status = curl_multi_exec($mh, $active);
        if ($active) {
            curl_multi_select($mh);
        }
    } while ($active && $status == CURLM_OK);

    curl_multi_remove_handle($mh, $ch_4);
    curl_multi_remove_handle($mh, $ch_5);
    curl_multi_remove_handle($mh, $ch_6);
    curl_multi_remove_handle($mh, $ch_7);
    curl_multi_remove_handle($mh, $ch_8);
    curl_multi_remove_handle($mh, $ch_9);
    curl_multi_close($mh);

    $exRates = curl_multi_getcontent($ch_4);
    $news = curl_multi_getcontent($ch_5);
    $wiki = curl_multi_getcontent($ch_6);
    $Imgs = curl_multi_getcontent($ch_7);
    $numbeoPrice = curl_multi_getcontent($ch_8);
    $numbeoIndex = curl_multi_getcontent($ch_9);

    
    $endTime = microtime(true);
    $totalTime = $endTime - $startTime;

    $news = json_decode($news, true);
    $imgs = json_decode($Imgs, true);
    $exRates = json_decode($exRates, true);

    $images = [];
    foreach ($imgs["hits"] as $img) {
        $temp = [];
        $temp["large"] = $img["webformatURL"];
        $temp["thumb"] = $img["previewURL"];
        array_push($images, $temp);
    }
    
    $nationalHolidays = [];
    if (isset($holidays["response"]["holidays"])) {
        foreach ($holidays["response"]["holidays"] as $h_days) {
            if ($h_days["type"][0] === "National holiday") {
                $temp = [];
                $temp["date"] = $h_days["date"]["iso"];
                $temp["name"] = $h_days["name"];
                array_push($nationalHolidays, $temp);
            }                
        }
    }

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "OK";
    $output["status"]["time"] = $totalTime;
    $output["data"]["restCtry"] = $restCtry;
    $output["data"]["holidays"] = $nationalHolidays;
    $output["data"]["openCage"] = $openCage["results"][0];
    $output["data"]["news"] = $news["value"];
    $output["data"]["wiki"] = json_decode($wiki, true);
    $output["data"]["images"] = $images;
    $output["data"]["exRates"] = [$exRates["conversion_rates"]];
    $output["data"]["numbeoPrices"] = json_decode($numbeoPrice, true);
    $output["data"]["numbeoIndexs"] = json_decode($numbeoIndex, true);
    

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);

?>
