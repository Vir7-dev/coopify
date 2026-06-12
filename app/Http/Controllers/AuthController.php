<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
//
    public function gantiPassword(Request $request)
    {
        $request->validate([
            'old_password' => 'required',
            'new_password' => 'required|min:6|confirmed',
        ]);

        $user = User::find(1); // sementara

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json([
                'message' => 'Password lama salah'
            ], 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Password berhasil diubah'
        ]);
    }
}