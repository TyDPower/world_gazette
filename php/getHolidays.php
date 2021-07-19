<?php

    ini_set("display_error", "On");
    error_reporting(E_ALL);

    $startTime = microtime(true);

    $url="https://calendarific.com/api/v2/holidays?&api_key=52d3118105369c8e9aad61e7d6786890469695bc4b41189b42a4f1ac99028b3f&country=" . $_REQUEST['ctry'] . "&year=" . $_REQUEST["year"];


    $curl = curl_init();
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_URL, $url);

    $result = curl_exec($curl);
    $result = json_decode($result, true);

    curl_close($curl);

    $nationalHolidays = [];

    foreach ($result["response"]["holidays"] as $h_days) {

        if ($h_days["type"][0] === "National holiday") {

            $temp = [];
            $temp["date"] = $h_days["date"]["iso"];
            $temp["name"] = $h_days["name"];
            $temp["description"] = $h_days["description"];

            array_push($nationalHolidays, $temp);

        }
                        
    }

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["data"] = $nationalHolidays;

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);

?>