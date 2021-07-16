<?php

    $startTime = microtime(true);

    // create both cURL resources
    $ch_1 = curl_init();
    $ch_2 = curl_init();
    $ch_3 = curl_init();
    $ch_4 = curl_init();
    $ch_5 = curl_init();

    // set URL and other appropriate options
    curl_setopt($ch_1, CURLOPT_URL, "https://api.windy.com/api/webcams/v2/list/country=". $_REQUEST["code"] . "/category=" . $_REQUEST["category"] . "/limit=50?show=webcams:image,location,player&key=TxgKAXiV7NHkKV8Jwv3KVJe0CwX0ohUB");
    curl_setopt($ch_1, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_1, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_2, CURLOPT_URL, "https://api.windy.com/api/webcams/v2/list/country=". $_REQUEST["code"] . "/category=" . $_REQUEST["category"] . "/limit=50,51?show=webcams:image,location,player&key=TxgKAXiV7NHkKV8Jwv3KVJe0CwX0ohUB");
    curl_setopt($ch_2, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_2, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_3, CURLOPT_URL, "https://api.windy.com/api/webcams/v2/list/country=". $_REQUEST["code"] . "/category=" . $_REQUEST["category"] . "/limit=50,101?show=webcams:image,location,player&key=TxgKAXiV7NHkKV8Jwv3KVJe0CwX0ohUB");
    curl_setopt($ch_3, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_3, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_4, CURLOPT_URL, "https://api.windy.com/api/webcams/v2/list/country=". $_REQUEST["code"] . "/category=" . $_REQUEST["category"] . "/limit=50,151?show=webcams:image,location,player&key=TxgKAXiV7NHkKV8Jwv3KVJe0CwX0ohUB");
    curl_setopt($ch_4, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_4, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_5, CURLOPT_URL, "https://api.windy.com/api/webcams/v2/list/country=". $_REQUEST["code"] . "/category=" . $_REQUEST["category"] . "/limit=50,201?show=webcams:image,location,player&key=TxgKAXiV7NHkKV8Jwv3KVJe0CwX0ohUB");
    curl_setopt($ch_5, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_5, CURLOPT_RETURNTRANSFER, true);

    //create the multiple cURL handle
    $mh = curl_multi_init();

    //add the two handles
    curl_multi_add_handle($mh,$ch_1);
    curl_multi_add_handle($mh,$ch_2);
    curl_multi_add_handle($mh,$ch_3);
    curl_multi_add_handle($mh,$ch_4);
    curl_multi_add_handle($mh,$ch_5);

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
    curl_multi_close($mh);

    //returned data
    $page_1 = curl_multi_getcontent($ch_1);
    $page_2 = curl_multi_getcontent($ch_2);
    $page_3 = curl_multi_getcontent($ch_3);
    $page_4 = curl_multi_getcontent($ch_4);
    $page_5 = curl_multi_getcontent($ch_5);

    $endTime = microtime(true);
    $totalTime = $endTime - $startTime;

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "OK";
    $output["status"]["time"] = $totalTime;
    $output["page1"] = json_decode($page_1, true);
    $output["page2"] = json_decode($page_2, true);
    $output["page3"] = json_decode($page_3, true);
    $output["page4"] = json_decode($page_4, true);
    $output["page5"] = json_decode($page_5, true);

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);

?>