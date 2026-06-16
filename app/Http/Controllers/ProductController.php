<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index()
    {
        return DB::table('produk')->get();
    }
}