<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\PembayaranController;

// ================= ROOT =================
Route::get('/', function () {
    return view('welcome');
});

// ================= AUTH =================//
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// ================= PRODUCTS =================//
Route::get('/produk', [ProdukController::class, 'index']);


// ================= PEMBAYARAN =================
Route::middleware('auth')->group(function () {
    Route::get('/pembayaran/{id}', [PembayaranController::class, 'show']);
    Route::post('/pembayaran/create', [PembayaranController::class, 'createTransaction']);
});

// ================= SPA REACT =================
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');