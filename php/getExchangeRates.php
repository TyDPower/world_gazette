<?php

    ini_set("display_error", "On");
    error_reporting(E_ALL);

    $startTime = microtime(true);

    $url="https://v6.exchangerate-api.com/v6/247d6cf5bdadac21866fe380/latest/" . $_REQUEST["currCode"];

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_URL, $url);

    $result = curl_exec($curl);

    curl_close($curl);

    $data = json_decode($result, true);

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["rates"] = [$data["conversion_rates"]];

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);
    
?>