<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\CheckoutController;

// ================= ROOT =================
Route::get('/', function () {
    return view('welcome');
});

// ================= PRODUCTS =================//
Route::get('/products', [ProductController::class, 'index']);



Route::middleware('auth')->group(function () {
    Route::get('/pembayaran/{id}', [PembayaranController::class, 'show'])->name('pembayaran.show');
    Route::post('/pembayaran/create', [PembayaranController::class, 'createTransaction'])->name('pembayaran.create');
    Route::get(
        '/keranjang',
        [KeranjangController::class, 'index']
    );

    Route::post(
        '/keranjang',
        [KeranjangController::class, 'store']
    );

    Route::put(
        '/keranjang/{id}',
        [KeranjangController::class, 'update']
    );

    Route::delete(
        '/keranjang/{id}',
        [KeranjangController::class, 'destroy']
    );

    Route::post(
        '/checkout',
        [CheckoutController::class, 'checkout']
    );
});

Route::post(
    '/midtrans/callback',
    [PembayaranController::class, 'handleNotification']
)->name('midtrans.callback');

// ================= PEMBAYARAN =================
Route::middleware('auth')->group(function () {
    Route::get('/pembayaran/{id}', [PembayaranController::class, 'show']);
    Route::post('/pembayaran/create', [PembayaranController::class, 'createTransaction']);
});

// ================= SPA REACT =================
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
