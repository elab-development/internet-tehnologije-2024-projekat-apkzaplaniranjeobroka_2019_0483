<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\PlanObroka;
use App\Models\StavkaPlana;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'alergije' => 'nullable|json',
            'dijetetske_preferencije' => 'nullable|json',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user', 
            'alergije' => $request->alergije,
            'dijetetske_preferencije' => $request->dijetetske_preferencije,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }




     // 1. Vraća sve korisnike
     public function getAllUsers()
     {
         $users = User::all();
         return response()->json(UserResource::collection($users), 200);
     }
 
     // 2. Menja ulogu korisnika
     public function changeUserRole(Request $request, $id)
     {
         $validator = Validator::make($request->all(), [
             'role' => 'required|string|in:user,admin',
         ]);
 
         if ($validator->fails()) {
             return response()->json(['errors' => $validator->errors()], 422);
         }
 
         $user = User::findOrFail($id);
         $user->role = $request->role;
         $user->save();
 
         return response()->json([
             'message' => 'User role updated successfully.',
             'user' => new UserResource($user),
         ], 200);
     }
 
     // 3. Briše korisnika i njegove planove obroka
     public function deleteUserWithPlans($id)
     {
         try {
             DB::beginTransaction();
 
             $user = User::findOrFail($id);
 
             // Briši planove obroka i njihove stavke
             $plans = PlanObroka::where('korisnik_id', $user->id)->get();
             foreach ($plans as $plan) {
                 StavkaPlana::where('plan_obroka_id', $plan->id)->delete();
                 $plan->delete();
             }
 
             // Briši korisnika
             $user->delete();
 
             DB::commit();
 
             return response()->json(['message' => 'User and associated plans deleted successfully.'], 200);
         } catch (\Exception $e) {
             DB::rollBack();
             return response()->json(['message' => 'Error occurred while deleting user and plans.', 'error' => $e->getMessage()], 500);
         }
     }
}
