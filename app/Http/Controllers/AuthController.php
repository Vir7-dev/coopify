<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'nim_nik' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('nim_nik', $request->nim_nik)->first();

        if (!$user) {
            return response()->json([
                'message' => 'NIM/NIK tidak ditemukan'
            ], 401);
        }

        //trim biar tidak gagal karena spasi
        if (trim($user->password) !== trim($request->password)) {
            return response()->json([
                'message' => 'Password salah'
            ], 401);
        }

        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }
}