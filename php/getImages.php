<?php

    ini_set("display_error", "On");
    error_reporting(E_ALL);

    $startTime = microtime(true);

    $url="https://pixabay.com/api/?key=22562417-a852f90eda44cc531e1b38810&q=" . $_REQUEST["search"] . "&per_page=100";

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_URL, $url);

    $result = curl_exec($curl);
    $result = json_decode($result, true);

    curl_close($curl);

    $images = [];

    foreach ($result["hits"] as $img) {

        $temp = [];
        $temp["img"] = $img["webformatURL"];
        $temp["thumb"] = $img["previewURL"];

        array_push($images, $temp);

    }

    $output["status"]["code"] = "200";
    $output["status"]["name"] = "ok";
    $output["status"]["description"] = "success";
    $output["data"] = $images;

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode($output);

?>