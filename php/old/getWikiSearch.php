<?php

ini_set("display_error", "On");
error_reporting(E_ALL);

$startTime = microtime(true);
$username = "tydpower";

$url="http://api.geonames.org/wikipediaSearchJSON?q=" . $_REQUEST["name"] . "&maxRows=10&username=" . $username;


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