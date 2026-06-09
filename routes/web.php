<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PembayaranController;

Route::get('/', function () {
    return view('welcome');
});

// auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// pembayaran routes
Route::middleware('auth')->group(function () {
    Route::get('/pembayaran/{id}', [PembayaranController::class, 'show'])->name('pembayaran.show');
    Route::post('/pembayaran/create', [PembayaranController::class, 'createTransaction'])->name('pembayaran.create');
});

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');