<?php

    $startTime = microtime(true);

    $ch_1 = curl_init();
    $ch_2 = curl_init();
    $ch_3 = curl_init();
    $ch_4 = curl_init();
    $ch_5 = curl_init();

    curl_setopt($ch_1, CURLOPT_URL, "https://v6.exchangerate-api.com/v6/247d6cf5bdadac21866fe380/latest/" . $_REQUEST["currCode"]);
    curl_setopt($ch_1, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_1, CURLOPT_RETURNTRANSFER, true);

    curl_setopt_array($ch_2, [
        CURLOPT_URL => "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI?q=" . $_REQUEST["name"] . "&pageNumber=1&pageSize=50&autoCorrect=true&fromPublishedDate=null&toPublishedDate=null",
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

    curl_setopt($ch_3, CURLOPT_URL, "http://api.geonames.org/wikipediaSearchJSON?q=". $_REQUEST["name"] . "&maxRows=30&username=tydpower");
    curl_setopt($ch_3, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_3, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_4, CURLOPT_URL, "https://pixabay.com/api/?key=22562417-a852f90eda44cc531e1b38810&q=" . $_REQUEST["name"] . "&per_page=50");
    curl_setopt($ch_4, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_4, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch_5, CURLOPT_URL, "https://api.opencagedata.com/geocode/v1/json?q=" . $_REQUEST["name"] . "&key=efbd5efcc6254578986dc2d63c0edb90");
    curl_setopt($ch_5, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch_5, CURLOPT_RETURNTRANSFER, true);

    $mh = curl_multi_init();

    curl_multi_add_handle($mh,$ch_1);
    curl_multi_add_handle($mh,$ch_2);
    curl_multi_add_handle($mh,$ch_3);
    curl_multi_add_handle($mh,$ch_4);
    curl_multi_add_handle($mh,$ch_5);

    do {
        $status = curl_multi_exec($mh, $active);
        if ($active) {
            curl_multi_select($mh);
        }
    } while ($active && $status == CURLM_OK);

    curl_multi_remove_handle($mh, $ch_1);
    curl_multi_remove_handle($mh, $ch_2);
    curl_multi_remove_handle($mh, $ch_3);
    curl_multi_remove_handle($mh, $ch_4);
    curl_multi_remove_handle($mh, $ch_5);
    curl_multi_close($mh);

    $exRatesData = curl_multi_getcontent($ch_1);
    $newsData = curl_multi_getcontent($ch_2);
    $wikiData = curl_multi_getcontent($ch_3);
    $ImgData = curl_multi_getcontent($ch_4);
    $openCageData = curl_multi_getcontent($ch_5);

    $endTime = microtime(true);
    $totalTime = $endTime - $startTime;

    $news = json_decode($newsData, true);
    $imgs = json_decode($ImgData, true);
    $openCage = json_decode($openCageData, true);
    $exRates = json_decode($exRatesData, true);

    $images = [];
    foreach ($imgs["hits"] as $img) {
        $temp = [];
        $temp["large"] = $img["webformatURL"];
        $temp["thumb"] = $img["previewURL"];
        array_push($images, $temp);
    }

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "OK";
    $output["status"]["time"] = $totalTime;
    //$output["data"]["news"] = $news["value"];
    $output["data"]["wiki"] = json_decode($wikiData, true);
    $output["data"]["images"] = $images;
    $output["data"]["openCage"] = $openCage["results"];
    $output["data"]["exRates"] = [$exRates["conversion_rates"]];

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);
    
?>