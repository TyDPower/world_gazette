<?php

    $countryData = json_decode(file_get_contents("../common/countryBorders.geo.json"), true);

    $borders = [];

    foreach ($countryData['features'] as $feature) {

        if ($feature["properties"]['iso_a2'] === $_REQUEST["code"]) {

            $temp = null;
            $temp['geometry'] = $feature["geometry"];
            
            array_push($borders, $temp);
        }
        
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['data'] = $borders;
    
    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

?>