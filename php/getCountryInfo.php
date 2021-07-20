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
    $restCtryData = curl_multi_getcontent($ch_1);
    $holidayData = curl_multi_getcontent($ch_2);
    
    $endTime = microtime(true);
    $totalTime = $endTime - $startTime;

    $holidays = json_decode($holidayData, true);
    
    $nationalHolidays = [];
    foreach ($holidays["response"]["holidays"] as $h_days) {
        if ($h_days["type"][0] === "National holiday") {
            $temp = [];
            $temp["date"] = $h_days["date"]["iso"];
            $temp["name"] = $h_days["name"];
            array_push($nationalHolidays, $temp);
        }                
    }

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "OK";
    $output["status"]["time"] = $totalTime;
    $output["data"]["restCtry"] = json_decode($restCtryData, true);
    $output["data"]["holidays"] = $nationalHolidays;
    

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);

?>
