<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\PlanObrokaController;
use App\Http\Controllers\ReceptController;
use App\Http\Controllers\StavkaPlanaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);



Route::middleware('auth:sanctum')->group(function () {
    Route::get('/recepti', [ReceptController::class, 'index']);
    Route::get('/recepti/{id}', [ReceptController::class, 'show']);
    Route::post('/recepti', [ReceptController::class, 'store']);
    Route::put('/recepti/{id}', [ReceptController::class, 'update']);
    Route::delete('/recepti/{id}', [ReceptController::class, 'destroy']);
    Route::get('/pretragarecepata', [ReceptController::class, 'search']);
    Route::post('/recepti/addFile/{id}', [ReceptController::class, 'addFile']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/stavke-plana', [StavkaPlanaController::class, 'index']);
    Route::get('/stavke-plana/{id}', [StavkaPlanaController::class, 'show']);
    Route::post('/stavke-plana', [StavkaPlanaController::class, 'store']);
    Route::put('/stavke-plana/{id}', [StavkaPlanaController::class, 'update']);
    Route::delete('/stavke-plana/{id}', [StavkaPlanaController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::resource('planovi-obroka', PlanObrokaController::class);
});


// resetovanje lozinke
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
