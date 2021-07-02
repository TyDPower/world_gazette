<?php

    ini_set("display_error", "On");
    error_reporting(E_ALL);

    $startTime = microtime(true);

    $where = urlencode('{
        "region": "United Kingdom"
    }');

    $url = "https://parseapi.back4app.com/classes/MichelinGuide_Restaurants?count=1&limit=99999"/*&where=" . $where*/;

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        //App application id
        'X-Parse-Application-Id: IxgSIq5SvdAZTlqPZxH11VL2p4dA80tlAqTaTTJH',
        //API key
        'X-Parse-REST-API-Key: aKBSt4IbRUnPIpVsK1EMnNJBuuQh8ZlEgwwMP7h1'
    ));

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