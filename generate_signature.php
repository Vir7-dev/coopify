<?php

$orderId = "ORD-FVJHL1";
$statusCode = "200";
$grossAmount = "4000.00";
$serverKey = "Mid-server-VY_ajzWiW7i5O_u0xuKJ231q";

echo hash(
    'sha512',
    $orderId .
    $statusCode .
    $grossAmount .
    $serverKey
);