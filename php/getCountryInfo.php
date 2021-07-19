<?php

    $startTime = microtime(true);

    // create both cURL resources
    $ch_1 = curl_init();
    $ch_2 = curl_init();
    $ch_3 = curl_init();

    // set URL and other appropriate options
    curl_setopt($ch_1, CURLOPT_URL, "https://restcountries.eu/rest/v2/alpha/" . $_REQUEST["code"]);
    curl_setopt($ch_1, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_1, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_2, CURLOPT_URL, "https://newsapi.org/v2/top-headlines?country=" . $_REQUEST["code"] . "&apiKey=6cb4d0937da54886a88827b772c14726");
    curl_setopt($ch_2, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_2, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_3, CURLOPT_URL, "http://api.geonames.org/wikipediaSearchJSON?q=". urlencode($_REQUEST["name"]) . "&maxRows=30&username=tydpower");
    curl_setopt($ch_3, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_3, CURLOPT_RETURNTRANSFER, true);

    //create the multiple cURL handle
    $mh = curl_multi_init();

    //add the two handles
    curl_multi_add_handle($mh,$ch_1);
    curl_multi_add_handle($mh,$ch_2);
    curl_multi_add_handle($mh,$ch_3);

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
    curl_multi_close($mh);

    //returned data
    $restCtry = curl_multi_getcontent($ch_1);
    $news = curl_multi_getcontent($ch_2);
    $wiki = curl_multi_getcontent($ch_3);

    $endTime = microtime(true);
    $totalTime = $endTime - $startTime;

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "OK";
    $output["status"]["time"] = $totalTime;
    $output["restCtry"] = json_decode($restCtry, true);
    $output["news"] = json_decode($news, true);
    $output["wiki"] = json_decode($wiki, true);

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);

?>
