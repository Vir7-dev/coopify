<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\ProductController;

// ================= ROOT =================
Route::get('/', function () {
    return view('welcome');
});

// ================= PRODUCTS =================//
Route::get('/produk', [ProdukController::class, 'index']);

// ================= SPA REACT =================
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
