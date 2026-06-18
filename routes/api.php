<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminProfilController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\UbahSandiController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Authentication
Route::post('/login', [AuthController::class, 'login']);

// Midtrans Callback
Route::post('/midtrans/notification', [PembayaranController::class, 'handleNotification']);

// Produk & Kategori (Public)
Route::get('/kategori', [KategoriController::class, 'index']);
<<<<<<< HEAD
Route::post('/kategori', [KategoriController::class, 'store']);
Route::put('/kategori/{id}', [KategoriController::class, 'update']);
Route::delete('/kategori/{id}', [KategoriController::class, 'destroy']);
Route::resource('produk', ProdukController::class);
Route::post('/ubah-sandi', [UbahSandiController::class, 'ubahPassword']);
=======

Route::get('/produk/search', [ProdukController::class, 'search']);
Route::get('/produk', [ProdukController::class, 'index']);
Route::get('/produk/{produk}', [ProdukController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/ganti-password', [AuthController::class, 'gantiPassword']);

    // Kategori
    Route::post('/kategori', [KategoriController::class, 'store']);
    Route::put('/kategori/{id}', [KategoriController::class, 'update']);
    Route::delete('/kategori/{id}', [KategoriController::class, 'destroy']);

    // Produk
    Route::post('/produk', [ProdukController::class, 'store']);
    Route::put('/produk/{produk}', [ProdukController::class, 'update']);
    Route::delete('/produk/{produk}', [ProdukController::class, 'destroy']);

    // Keranjang
    Route::get('/keranjang', [KeranjangController::class, 'index']);
    Route::post('/keranjang', [KeranjangController::class, 'store']);
    Route::put('/keranjang/{id}', [KeranjangController::class, 'update']);
    Route::delete('/keranjang/{id}', [KeranjangController::class, 'destroy']);

    // Checkout & Pembayaran
    Route::post('/checkout', [CheckoutController::class, 'checkout']);
    Route::post('/pembayaran/create', [PembayaranController::class, 'createTransaction']);
    Route::get('/pembayaran/{id}', [PembayaranController::class, 'show']);

    // Profil Admin
    Route::get('/admin/profil', [AdminProfilController::class, 'index']);
    Route::post('/admin/profil', [AdminProfilController::class, 'update']);
});
>>>>>>> 6542abf70738f9fd6a1ff37abb05c22f5eea2168
