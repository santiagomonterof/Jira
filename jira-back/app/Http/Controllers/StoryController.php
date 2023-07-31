<?php

namespace App\Http\Controllers;

use App\Models\Story;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class StoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stories  = Story::with('epic', 'state', 'project')->get();
        return $stories;
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
            'name'         => 'required',
            'description'       => 'required',
            'story_points'       => 'required',
            'epic_id'       => 'required',
            'state_id'       => 'required',
            'project_id'       => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
        }
        $story = new Story();
        $story->fill($request->json()->all());
        $story->save();

        return $story;
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $story = Story::find($id);
        if ($story == null) {
            return response()->json(['message' => 'Story not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        return $story;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Story $story)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $story = Story::find($id);
        if ($story == null) {
            return response()->json(['message' => 'Story not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        if ($request->method() != "PATCH") {
            $validator = Validator::make($request->json()->all(), [
                'name'         => 'required',
                'description'       => 'required',
                'story_points'       => 'required',
                'epic_id'       => 'required',
                'state_id'       => 'required',
                'project_id'       => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
            }
        }
        $story->fill($request->json()->all());
        $story->save();

        return $story;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $story = Story::find($id);
        if ($story == null) {
            return response()->json(['message' => 'Story not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $story->delete();
        return response()->json(['message' => 'Story deleted.']);
    }
}
