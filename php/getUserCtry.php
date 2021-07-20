<?php

    ini_set("display_error", "On");
    error_reporting(E_ALL);

    $startTime = microtime(true);

    $url="https://api.opencagedata.com/geocode/v1/json?key=efbd5efcc6254578986dc2d63c0edb90&q=" . $_REQUEST["lat"] . "%2C" . $_REQUEST["lng"] . "&pretty=1";

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_URL, $url);

    $result = curl_exec($curl);
    $result = json_decode($result, true);

    curl_close($curl);

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["data"] = $result["results"][0]["components"]["ISO_3166-1_alpha-2"];

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);

?>