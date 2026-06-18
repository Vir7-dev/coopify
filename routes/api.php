<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\DashboardController;

Route::post('/midtrans/notification', [PembayaranController::class, 'handleNotification']);
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('/produk/search', [ProdukController::class, 'search']);
Route::get('/kategori', [KategoriController::class, 'index']);
Route::post('/kategori', [KategoriController::class, 'store']);
Route::put('/kategori/{id}', [KategoriController::class, 'update']);
Route::delete('/kategori/{id}', [KategoriController::class, 'destroy']);
Route::resource('produk', ProdukController::class);