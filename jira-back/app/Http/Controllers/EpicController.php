<?php

namespace App\Http\Controllers;

use App\Models\Epic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class EpicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $epics = Epic::all();
        return $epics;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->json()->all(), [
            'name' => 'required',
            'description' => 'required',
            'state_id' => 'required',
            'project_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
        }
        $epic = new Epic();
        $epic->fill($request->json()->all());
        $epic->save();

        return $epic;
    }


    /**
     * Display the specified resource.
     */
    public function show(Epic $epic)
    {
        //

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $epic = Epic::find($id);
        if ($epic == null) {
            return response()->json(['message' => 'Epic not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        return $epic;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $epic = Epic::find($id);
        if ($epic == null) {
            return response()->json(['message' => 'Project not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        if ($request->method() != "PATCH") {
            $validator = Validator::make($request->json()->all(), [
                'name'         => 'required',
                'description'       => 'required',
                'state_id'       => 'required',
                'project_id'       => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
            }
        }
        $epic->fill($request->json()->all());
        $epic->save();

        return $epic;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $epic = Epic::find($id);
        if ($epic == null) {
            return response()->json(['message' => 'Epic not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $epic->delete();
        return response()->json(['message' => 'Epic deleted.']);
    }
}
