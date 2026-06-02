<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // validasi input
        $credentials = $request->validate([
            'nim_nik' => 'required',
            'password' => 'required',
        ]);

        // attempt login
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return response()->json([
                'message' => 'Login berhasil',
                'user' => Auth::user()
            ]);
        }

        return response()->json([
            'message' => 'NIM/NIK atau password salah'
        ], 401);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }
public function gantiPassword(Request $request)
{
    $request->validate([
        'old_password' => 'required',
        'new_password' => 'required|min:6|confirmed',
    ]);

    $user = User::find(1); // sementara ambil user id 1

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
