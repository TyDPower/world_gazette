<?php

    ini_set("display_error", "On");
    error_reporting(E_ALL);

    $startTime = microtime(true);

    $url="https://api.opencagedata.com/geocode/v1/json?q=" . $_REQUEST["placename"] . "&key=efbd5efcc6254578986dc2d63c0edb90";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    $result = curl_exec($ch);

    curl_close($ch);

    $decode = json_decode($result, true);

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["data"] = json_decode($result, true);

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);

?>