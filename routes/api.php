<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\AdminProfilController;
use App\Http\Controllers\AuthController;  

Route::post('/midtrans/notification', [PembayaranController::class, 'handleNotification']);

// Auth
Route::post('/login', [AuthController::class, 'login']);  
Route::post('/logout', [AuthController::class, 'logout']);  

Route::get('/kategori', [KategoriController::class, 'index']);
Route::post('/kategori', [KategoriController::class, 'store']);
Route::put('/kategori/{id}', [KategoriController::class, 'update']);
Route::delete('/kategori/{id}', [KategoriController::class, 'destroy']);

Route::resource('produk', ProdukController::class);
Route::get('/keranjang', [KeranjangController::class, 'index']);
Route::post('/keranjang', [KeranjangController::class, 'store']); 
Route::put('/keranjang/{id}', [KeranjangController::class, 'update']);
Route::delete('/keranjang/{id}', [KeranjangController::class, 'destroy']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/profil',  [AdminProfilController::class, 'index']);
    Route::post('/admin/profil', [AdminProfilController::class, 'update']);
});
