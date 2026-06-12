<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\KeranjangController;

// ================= LOGIN =================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// ================= PRODUCTS =================
Route::get('/products', [ProductController::class, 'index']);

// ================= CART =================
Route::post('/cart/add', [KeranjangController::class, 'add']);

// ================= SPA REACT =================
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');