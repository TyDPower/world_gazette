<?php

    ini_set("display_error", "On");
    error_reporting(E_ALL);

    $startTime = microtime(true);

    $url="https//www.numbeo.com/api/" . $_REQUEST["searchTerm"] . "?api_key=" . $_REQUEST["apiKey"] . "&country=" . $_REQUEST["countryName"];

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_URL, $url);

    $result = curl_exec($curl);

    curl_close($curl);

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["data"] = json_decode($result, true);

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);

?>