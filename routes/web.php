<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

// ================= ROOT =================
Route::get('/', function () {
    return view('welcome');
});

// ================= PRODUCTS =================//
Route::get('/products', [ProductController::class, 'index']);

// ================= SPA REACT =================
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
