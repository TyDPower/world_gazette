<?php

    ini_set("display_error", "On");
    error_reporting(E_ALL);

    $startTime = microtime(true);
    $apiKey = "ed1630ff0d2f3272f421";

    $url="https://free.currconv.com/api/v7/convert?q=" . $_REQUEST["currencies"] . "&compact=ultra&apiKey=" . $apiKey;

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