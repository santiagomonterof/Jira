<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->json()->all(), [
            'email'    => 'required',
            'password' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
        }
        $credentials = $request->only(['email', 'password']);
        if ( ! auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $user = auth()->user();
        $token = $user->createToken('Personal Access Token')->plainTextToken;

        return response()->json(['access_token' => $token]);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->json()->all(), [
            'full_name'     => 'required',
            'email'    => 'required',
            'password' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
        }
        $user = new User();
        $user->fill($request->json()->all());
        $user->password = bcrypt($request->password);
        $user->save();

        return $user;
    }

    public function userList()
    {
        $users = User::all();
        return $users;
    }

}
