<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UbahSandiController extends Controller
{
    public function gantiPassword(Request $request)
    {
        $request->validate([
            'old_password' => 'required',
            'new_password' => 'required|min:6|confirmed',
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();

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
