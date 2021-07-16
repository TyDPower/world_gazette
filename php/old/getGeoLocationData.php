<?php

ini_set("display_error", "On");
error_reporting(E_ALL);

$startTime = microtime(true);
$apiKey = "efbd5efcc6254578986dc2d63c0edb90";

$url="https://api.opencagedata.com/geocode/v1/json?q=" . $_REQUEST["lat"] . "+" . $_REQUEST["lng"] . "&key=" . $apiKey;


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
$output["data"] = $result;

header("Content-Type: application/json; charset=UTF-8");

echo json_encode($output);

?>