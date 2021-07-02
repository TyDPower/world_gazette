<?php

    ini_set("display_error", "On");
    error_reporting(E_ALL);

    $startTime = microtime(true);

    $apiKey = "pk.f2bf0b5badcdea09dc5a78b51cb4ad4f";

    $url="https://eu1.locationiq.com/v1/search.php?key=" . $apiKey . "&q=" . $_REQUEST["country"] . "&format=json";

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