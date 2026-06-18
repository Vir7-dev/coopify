<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\AdminProfilController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckoutController;

Route::post('/midtrans/notification', [PembayaranController::class, 'handleNotification']);

// Auth
Route::post('/login', [AuthController::class, 'login']);

Route::get('/kategori', [KategoriController::class, 'index']);

Route::get('/produk', [ProdukController::class, 'index']);
Route::get('/produk/{produk}', [ProdukController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/ganti-password', [AuthController::class, 'gantiPassword']);

    Route::post('/kategori', [KategoriController::class, 'store']);
    Route::put('/kategori/{id}', [KategoriController::class, 'update']);
    Route::delete('/kategori/{id}', [KategoriController::class, 'destroy']);

    Route::post('/produk', [ProdukController::class, 'store']);
    Route::put('/produk/{produk}', [ProdukController::class, 'update']);
    Route::post('/produk/{produk}', [ProdukController::class, 'update']);
    Route::delete('/produk/{produk}', [ProdukController::class, 'destroy']);

    Route::get('/keranjang', [KeranjangController::class, 'index']);
    Route::post('/keranjang', [KeranjangController::class, 'store']);
    Route::put('/keranjang/{id}', [KeranjangController::class, 'update']);
    Route::delete('/keranjang/{id}', [KeranjangController::class, 'destroy']);

    Route::post('/checkout', [CheckoutController::class, 'checkout']);
    Route::get('/pembayaran/{id}', [PembayaranController::class, 'show']);
    Route::post('/pembayaran/create', [PembayaranController::class, 'createTransaction']);

    Route::get('/admin/profil',  [AdminProfilController::class, 'index']);
    Route::post('/admin/profil', [AdminProfilController::class, 'update']);
});
