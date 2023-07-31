<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EpicController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\SprintStoryController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\StoryController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});

Route::post("login", [AuthController::class, "login"]);
Route::post("register", [AuthController::class, "register"]);


Route::group(["middleware" => "auth:sanctum"], function () {
    Route::get("project", [ProjectController::class, "index"]);
    Route::post("project", [ProjectController::class, "store"]);
    Route::get("project/{id}", [ProjectController::class, "show"]);
    Route::put("project/{id}", [ProjectController::class, "update"]);
    Route::patch("project/{id}", [ProjectController::class, "update"]);
    Route::delete("project/{id}", [ProjectController::class, "destroy"]);
});

Route::resource("userProject", UserProjectController::class);
Route::resource("sprintStory", SprintStoryController::class);
Route::resource("state", StateController::class);
Route::resource("sprint", SprintController::class);
Route::resource("epic", EpicController::class);
Route::resource("story", StoryController::class);
Route::resource("task", TaskController::class);
Route::get("projectsByUserId/{id}", [UserProjectController::class, "getProjectsByUserId"]);
Route::get("sprintByUserId/{id}", [UserProjectController::class, "getCurrentSprintByUserId"]);
Route::get("projectByCode/{code}", [ProjectController::class, "getProjectByCode"]);
Route::get("stateByProjectId/{id}", [StateController::class, "getStatesByProjectId"]);
Route::get("sprintByProjectId/{id}", [SprintController::class, "getSprintsByProjectId"]);
Route::get("storiesBySprintId/{id}", [SprintController::class, "getStoriesBySprintId"]);
Route::get("storiesNotAssigned/{id}", [SprintStoryController::class, "storiesByColumn"]);
Route::get("getUserList", [AuthController::class, "userList"]);
Route::get("sprintsWithStoriesByUser/{id}", [SprintStoryController::class, "SprintsWithStories"]);
Route::post("searchElement/{id}", [UserProjectController::class, "searchElement"]);

