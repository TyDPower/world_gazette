<?php

    $startTime = microtime(true);

    // create both cURL resources
    $ch_1 = curl_init();

    // set URL and other appropriate options
    curl_setopt($ch_1, CURLOPT_URL, "https://api.windy.com/api/webcams/v2/list/country=". $_REQUEST["code"] . "/category=" . $_REQUEST["category"] . "/limit=50?show=webcams:image,location,player&key=TxgKAXiV7NHkKV8Jwv3KVJe0CwX0ohUB");
    curl_setopt($ch_1, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_1, CURLOPT_RETURNTRANSFER, true);

    //create the multiple cURL handle
    $mh = curl_multi_init();

    //add the two handles
    curl_multi_add_handle($mh,$ch_1);

    //execute the multi handle
    do {
        $status = curl_multi_exec($mh, $active);
        if ($active) {
            curl_multi_select($mh);
        }
    } while ($active && $status == CURLM_OK);

    //close the handles
    curl_multi_remove_handle($mh, $ch_1);
    curl_multi_close($mh);

    //returned data
    $page_1 = curl_multi_getcontent($ch_1);

    $endTime = microtime(true);
    $totalTime = $endTime - $startTime;

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "OK";
    $output["status"]["time"] = $totalTime;
    $output["page1"] = json_decode($page_1, true);

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);

?>