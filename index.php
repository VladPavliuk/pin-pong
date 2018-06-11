<?php
    header("Access-Control-Allow-Origin: *");
    $script = file_get_contents('./index.js');
    echo $script;