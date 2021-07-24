<?php

    $startTime = microtime(true);

    // create both cURL resources
    $ch_1 = curl_init();
    $ch_2 = curl_init();

    // set URL and other appropriate options
    curl_setopt($ch_1, CURLOPT_URL, "https://api.openweathermap.org/data/2.5/onecall?lat=" . $_REQUEST["lat"] . "&lon=" . $_REQUEST["lng"] . "&units=metric&appid=fffa38b5d38e396289bfd70c9ea8ac3a");
    curl_setopt($ch_1, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_1, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_2, CURLOPT_URL, "https://api.opencagedata.com/geocode/v1/json?q=" . $_REQUEST["lat"] . "+" . $_REQUEST["lng"] . "&key=efbd5efcc6254578986dc2d63c0edb90");
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
    $weather = curl_multi_getcontent($ch_1);
    $weather = json_decode($weather, true);

    $location = curl_multi_getcontent($ch_2);
    $location = json_decode($location, true);


    $endTime = microtime(true);
    $totalTime = $endTime - $startTime;

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "OK";
    $output["status"]["time"] = $totalTime;
    $output["data"]["weather"] = $weather;
    $output["data"]["location"] = $location["results"][0]["components"];


    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);

?>