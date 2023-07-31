<?php

namespace App\Http\Controllers;

use App\Models\Epic;
use App\Models\Project;
use App\Models\SprintStory;
use App\Models\Story;
use App\Models\User;
use App\Models\UserProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class SprintStoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //return all sprint stories with sprint and story
        $sprintStories = SprintStory::with('sprint', 'story')->get();
        return $sprintStories;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->json()->all(), [
            'sprint_id' => 'required',
            'story_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
        }
        $sprintStory = new SprintStory();
        $sprintStory->fill($request->json()->all());
        $sprintStory->save();

        return $sprintStory;
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $sprintStory = SprintStory::find($id);
        if ($sprintStory == null) {
            return response()->json(['message' => 'SprintStory not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        return $sprintStory;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SprintStory $sprintStory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $sprintStory = SprintStory::find($id);
        if ($sprintStory == null) {
            return response()->json(['message' => 'SprintStory not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        if ($request->method() != "PATCH") {
            $validator = Validator::make($request->json()->all(), [
                'sprint_id' => 'required',
                'story_id' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
            }
        }
        $sprintStory->fill($request->json()->all());
        $sprintStory->save();

        return $sprintStory;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $sprintStory = SprintStory::find($id);
        if ($sprintStory == null) {
            return response()->json(['message' => 'SprintStory not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $sprintStory->delete();
        return response()->json(['message' => 'SprintStory deleted.']);
    }


    //stories by column user_id
    public function storiesByColumn($id)
    {
        $stories = Story::where('user_id', $id)->get();
        // Obtener los IDs de las historias asignadas a un sprint
        $assignedStoryIds = SprintStory::pluck('story_id')->all();
        // Filtrar las historias que no están asignadas a un sprint
        $stories = $stories->whereNotIn('id', $assignedStoryIds);
        // Convertir la colección en un array con valores
        $stories = $stories->values();
        return $stories;
    }

    public function SprintsWithStories($userId)
    {
        $userProjects = UserProject::where('user_id', $userId)
            ->with('creator', 'project', 'project.epics', 'project.stories', 'project.sprints')
            ->get();
        $projects = [];
        foreach ($userProjects as $userProject) {
            $project = $userProject->project;
            $user = User::find($userProject->user_id); // Buscar el usuario por su ID
            $project->user = $user; // Agregar el objeto usuario al proyecto
            $projects[] = $project;
        }
        $sprintStories = SprintStory::all();
        $sprints = [];
        foreach ($projects as $project) {
            $sprints = array_merge($sprints, $project->sprints->toArray());
        }
        foreach ($sprints as $key => $sprint) {
            $sprints[$key]['stories'] = [];
            foreach ($sprintStories as $sprintStory) {
                if ($sprintStory->sprint_id == $sprint['id']) {
                    $story = $sprintStory->story;
                    $epic = Epic::find($story->epic_id); // Buscar el épico por su ID
                    $story->epic = $epic; // Agregar el objeto épico al story

                    $user = User::find($story->user_id); // Buscar el usuario por su ID
                    $story->user = $user; // Agregar el objeto usuario al story

                    $sprints[$key]['stories'][] = $story;
                }
            }
        }
        return $sprints;
    }

}
