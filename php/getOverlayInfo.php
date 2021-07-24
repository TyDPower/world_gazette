<?php

    $startTime = microtime(true);

    // create both cURL resources
    $ch_1 = curl_init();
    $ch_2 = curl_init();
    $ch_3 = curl_init();
    $ch_4 = curl_init();
    $ch_5 = curl_init();
    $ch_6 = curl_init();
    $ch_7 = curl_init();
    $ch_8 = curl_init();
    $ch_9 = curl_init();

    // set URL and other appropriate options
    curl_setopt($ch_1, CURLOPT_URL, "https://api.windy.com/api/webcams/v2/list/country=". $_REQUEST["code"] . "/category=beach/limit=50?show=webcams:image,location,player&key=TxgKAXiV7NHkKV8Jwv3KVJe0CwX0ohUB");
    curl_setopt($ch_1, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_1, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_2, CURLOPT_URL, "https://api.windy.com/api/webcams/v2/list/country=". $_REQUEST["code"] . "/category=traffic/limit=50?show=webcams:image,location,player&key=TxgKAXiV7NHkKV8Jwv3KVJe0CwX0ohUB");
    curl_setopt($ch_2, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_2, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_3, CURLOPT_URL, "https://api.windy.com/api/webcams/v2/list/country=". $_REQUEST["code"] . "/category=square/limit=50?show=webcams:image,location,player&key=TxgKAXiV7NHkKV8Jwv3KVJe0CwX0ohUB");
    curl_setopt($ch_3, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_3, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_4, CURLOPT_URL, "https://www.numbeo.com/api/cities?country=" . $_REQUEST["code"] . "&api_key=wvlo2tz1pwdnha");
    curl_setopt($ch_4, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_4, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_5, CURLOPT_URL, "http://api.geonames.org/searchJSON?q=&country=" . $_REQUEST["code"] . "&maxRows=1000&featureCode=MT&inclBbox=true&username=tydpower");
    curl_setopt($ch_5, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_5, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_6, CURLOPT_URL, "http://api.geonames.org/searchJSON?q=&country=" . $_REQUEST["code"] . "&maxRows=1000&featureCode=AIRP&inclBbox=true&username=tydpower");
    curl_setopt($ch_6, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_6, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_7, CURLOPT_URL, "http://api.geonames.org/searchJSON?q=&country=" . $_REQUEST["code"] . "&maxRows=1000&featureCode=BCH&inclBbox=true&username=tydpower");
    curl_setopt($ch_7, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_7, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_8, CURLOPT_URL, "http://api.geonames.org/searchJSON?q=&country=" . $_REQUEST["code"] . "&maxRows=1000&featureCode=CSTL&inclBbox=true&username=tydpower");
    curl_setopt($ch_8, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_8, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_9, CURLOPT_URL, "http://api.geonames.org/searchJSON?q=&country=" . $_REQUEST["code"] . "&maxRows=1000&featureCode=LK&inclBbox=true&username=tydpower");
    curl_setopt($ch_9, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_9, CURLOPT_RETURNTRANSFER, true);


    //create the multiple cURL handle
    $mh = curl_multi_init();

    //add the two handles
    curl_multi_add_handle($mh,$ch_1);
    curl_multi_add_handle($mh,$ch_2);
    curl_multi_add_handle($mh,$ch_3);
    curl_multi_add_handle($mh,$ch_4);
    curl_multi_add_handle($mh,$ch_5);
    curl_multi_add_handle($mh,$ch_6);
    curl_multi_add_handle($mh,$ch_7);
    curl_multi_add_handle($mh,$ch_8);
    curl_multi_add_handle($mh,$ch_9);

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
    curl_multi_remove_handle($mh, $ch_3);
    curl_multi_remove_handle($mh, $ch_4);
    curl_multi_remove_handle($mh, $ch_5);
    curl_multi_remove_handle($mh, $ch_6);
    curl_multi_remove_handle($mh, $ch_7);
    curl_multi_remove_handle($mh, $ch_8);
    curl_multi_remove_handle($mh, $ch_9);
    curl_multi_close($mh);

    //returned data
    $beachCams = curl_multi_getcontent($ch_1);
    $beachCams = json_decode($beachCams, true);

    $trafficCams = curl_multi_getcontent($ch_2);
    $trafficCams = json_decode($trafficCams, true);

    $squareCams = curl_multi_getcontent($ch_3);
    $squareCams = json_decode($squareCams, true);

    $cities = curl_multi_getcontent($ch_4);
    $cities = json_decode($cities, true);

    $mountainPOI = curl_multi_getcontent($ch_5);
    $mountainPOI = json_decode($mountainPOI, true);

    $airportPOI = curl_multi_getcontent($ch_6);
    $airportPOI = json_decode($airportPOI, true);

    $beachPOI = curl_multi_getcontent($ch_7);
    $beachPOI = json_decode($beachPOI, true);

    $castlePOI = curl_multi_getcontent($ch_8);
    $castlePOI = json_decode($castlePOI, true);

    $lakePOI = curl_multi_getcontent($ch_9);
    $lakePOI = json_decode($lakePOI, true);

    $endTime = microtime(true);
    $totalTime = $endTime - $startTime;

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "OK";
    $output["status"]["time"] = $totalTime;
    $output["data"]["beachCams"] = $beachCams["result"]["webcams"];
    $output["data"]["trafficCams"] = $trafficCams["result"]["webcams"];
    $output["data"]["squareCams"] = $squareCams["result"]["webcams"];
    $output["data"]["cities"] = $cities["cities"];
    $output["data"]["mountainPOI"] = $mountainPOI["geonames"];
    $output["data"]["airportPOI"] = $airportPOI["geonames"];
    $output["data"]["beachPOI"] = $beachPOI["geonames"];
    $output["data"]["castlePOI"] = $castlePOI["geonames"];
    $output["data"]["lakePOI"] = $lakePOI["geonames"];

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);

?>