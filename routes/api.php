<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PembayaranController;

Route::post('/midtrans/notification', [PembayaranController::class, 'handleNotification']);