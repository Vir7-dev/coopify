<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminProfilController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\ProdukController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Authentication (dengan rate limiting: 5 percobaan per 1 menit)
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// Midtrans Callback
Route::post('/midtrans/notification', [PembayaranController::class, 'handleNotification']);

// Produk & Kategori (Public)
Route::get('/kategori', [KategoriController::class, 'index']);
Route::get('/produk/search', [ProdukController::class, 'search']);
Route::get('/produk', [ProdukController::class, 'index']);
Route::get('/produk/{produk}', [ProdukController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/ganti-password', [AuthController::class, 'gantiPassword']);

    // Profil Pengguna
    Route::get('/profil-pengguna', [App\Http\Controllers\ProfilPenggunaController::class, 'index']);
    Route::post('/profil-pengguna', [App\Http\Controllers\ProfilPenggunaController::class, 'update']);

    // Keranjang
    Route::get('/keranjang', [KeranjangController::class, 'index']);
    Route::post('/keranjang', [KeranjangController::class, 'store']);
    Route::put('/keranjang/{id}', [KeranjangController::class, 'update']);
    Route::delete('/keranjang/{id}', [KeranjangController::class, 'destroy']);

    // Checkout & Pembayaran
    Route::post('/checkout', [CheckoutController::class, 'checkout']);
    Route::post('/pembayaran/create', [PembayaranController::class, 'createTransaction']);
    Route::get('/pembayaran/{id}', [PembayaranController::class, 'show']);

    /*
    |--------------------------------------------------------------------------
    | Admin Routes (memerlukan role 'admin')
    |--------------------------------------------------------------------------
    */

    Route::middleware('admin')->group(function () {
        // Kategori Management
        Route::post('/kategori', [KategoriController::class, 'store']);
        Route::put('/kategori/{id}', [KategoriController::class, 'update']);
        Route::delete('/kategori/{id}', [KategoriController::class, 'destroy']);

        // Produk Management
        Route::post('/produk', [ProdukController::class, 'store']);
        Route::put('/produk/{produk}', [ProdukController::class, 'update']);
        Route::delete('/produk/{produk}', [ProdukController::class, 'destroy']);
        Route::post('/produk/tambah-stok', [ProdukController::class, 'tambahStok']);

        // Admin Dashboard
        Route::get('/admin/profil', [AdminProfilController::class, 'index']);
        Route::post('/admin/profil', [AdminProfilController::class, 'update']);
        Route::get('/admin/chart', [AdminProfilController::class, 'chartData']);
    });
});
