<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\PembayaranController;

// ================= ROOT =================
Route::get('/', function () {
    return view('welcome');
});

// ================= PRODUCTS =================//
Route::get('/products', [ProductController::class, 'index']);


// ================= PEMBAYARAN =================
Route::middleware('auth')->group(function () {
    Route::get('/pembayaran/{id}', [PembayaranController::class, 'show']);
    Route::post('/pembayaran/create', [PembayaranController::class, 'createTransaction']);
});

// ================= SPA REACT =================
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');