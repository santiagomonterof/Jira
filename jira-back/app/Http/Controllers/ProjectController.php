<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\UserProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::with("states")->get();
        return $projects;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->json()->all(), [
            'name' => 'required',
            'code' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
        }
        $project = new Project();
        $project->fill($request->json()->all());
        $project->save();

        return $project;
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $project = Project::find($id);
        if ($project == null) {
            return response()->json(['message' => 'Project not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        return $project;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $project = Project::find($id);
        if ($project == null) {
            return response()->json(['message' => 'Project not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        if ($request->method() != "PATCH") {
            $validator = Validator::make($request->json()->all(), [
                'name' => 'required',
                'code' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
            }
        }
        $project->fill($request->json()->all());
        $project->save();

        return $project;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $project = Project::find($id);
        if ($project == null) {
            return response()->json(['message' => 'Project not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $project->delete();
        return response()->json(['message' => 'Project deleted.']);
    }

    public function getProjectByCode($code)
    {
        $project = Project::where('code', $code)->first();
        if ($project == null) {
            return response()->json(['message' => 'Project not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        return $project;
    }





}
