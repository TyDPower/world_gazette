<?php

    $startTime = microtime(true);

    // create both cURL resources
    $ch_1 = curl_init();
    $ch_2 = curl_init();
    $ch_3 = curl_init();
    $ch_4 = curl_init();

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

    //create the multiple cURL handle
    $mh = curl_multi_init();

    //add the two handles
    curl_multi_add_handle($mh,$ch_1);
    curl_multi_add_handle($mh,$ch_2);
    curl_multi_add_handle($mh,$ch_3);
    curl_multi_add_handle($mh,$ch_4);

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
    curl_multi_close($mh);

    //returned data
    $beaches = curl_multi_getcontent($ch_1);
    $beaches = json_decode($beaches, true);

    $traffic = curl_multi_getcontent($ch_2);
    $traffic = json_decode($traffic, true);

    $squares = curl_multi_getcontent($ch_3);
    $squares = json_decode($squares, true);

    $cities = curl_multi_getcontent($ch_4);
    $cities = json_decode($cities, true);

    $endTime = microtime(true);
    $totalTime = $endTime - $startTime;

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "OK";
    $output["status"]["time"] = $totalTime;
    $output["data"]["beaches"] = $beaches["result"]["webcams"];
    $output["data"]["traffic"] = $traffic["result"]["webcams"];
    $output["data"]["squares"] = $squares["result"]["webcams"];
    $output["data"]["cities"] = $cities["cities"];

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);

?>