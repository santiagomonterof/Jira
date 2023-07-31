<?php

namespace App\Http\Controllers;

use App\Models\UserProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UserProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //user projects with creator project and epics
        $userProjects = UserProject::with('creator', 'project', 'project.epics')->get();
        return $userProjects;
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
            'user_id' => 'required',
            'project_id' => 'required',
            'is_admin' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
        }
        $userProject = UserProject::where('user_id', $request->json()->get('user_id'))
            ->where('project_id', $request->json()->get('project_id'))
            ->first();
        if ($userProject != null) {
            return response()->json(['message' => 'User already in project.'], ResponseAlias::HTTP_BAD_REQUEST);
        }
        $userProject = new UserProject();
        $userProject->fill($request->json()->all());
        $userProject->save();

        return $userProject;
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $userProject = UserProject::find($id);
        if ($userProject == null) {
            return response()->json(['message' => 'UserProject not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        return $userProject::with('creator', 'project')->get();
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserProject $userProject)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $userProject = UserProject::find($id);
        if ($userProject == null) {
            return response()->json(['message' => 'UserProject not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $validator = Validator::make($request->json()->all(), [
            'user_id' => 'required',
            'project_id' => 'required',
            'is_admin' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
        }
        $userProject->fill($request->json()->all());
        $userProject->save();

        return $userProject;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $userProject = UserProject::find($id);
        if ($userProject == null) {
            return response()->json(['message' => 'UserProject not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $userProject->delete();
        return response()->json(['message' => 'UserProject deleted.']);
    }

    public function getProjectsByUserId($userId)
    {
        $userProjects = UserProject::where('user_id', $userId)->with('creator', 'project', 'project.epics.stories.tasks', 'project.stories')->get();
        return $userProjects;
    }

    public function getCurrentSprintByUserId($userId)
    {
        $userProjects = UserProject::where('user_id', $userId)
            ->with('creator', 'project', 'project.epics', 'project.stories', 'project.sprints')
            ->get();

        // Find the sprint that has the status active
        $currentSprint = null;
        foreach ($userProjects as $userProject) {
            foreach ($userProject->project->sprints as $sprint) {
                if ($sprint->status == 1) {
                    $currentSprint = $sprint;
                    break 2; // Exit both loops when the sprint is found
                }
            }
        }

        if ($currentSprint == null) {
            return response()->json(['message' => 'No active sprint found.'], ResponseAlias::HTTP_NOT_FOUND);
        }

        // Find the project that has the current sprint and return the project with only the current sprint
        $project = null;
        foreach ($userProjects as $userProject) {
            foreach ($userProject->project->sprints as $sprint) {
                if ($sprint->id == $currentSprint->id) {
                    $project = $userProject->project;
                    break 2; // Exit both loops when the project is found
                }
            }
        }

        return $project;
    }

    public function searchElement(Request $request, $idUser)
    {
        $userProjects = UserProject::where('user_id', $idUser)->with('project.epics', 'project.stories', 'project.stories.tasks')->get();
        $search = $request->json()->get('search');
        $result = [];
        foreach ($userProjects as $userProject) {
            foreach ($userProject->project->epics as $epic) {
                if (str_contains(strtolower($epic->name), strtolower($search))) {
                    $result[] = [
                        'type' => 'epic',
                        'element' => $this->transformEpic($epic)
                    ];
                }
            }
            foreach ($userProject->project->stories as $story) {
                if (str_contains(strtolower($story->name), strtolower($search))) {
                    $result[] = [
                        'type' => 'story',
                        'element' => $this->transformStory($story)
                    ];
                }
                foreach ($story->tasks as $task) {
                    if (str_contains(strtolower($task->title), strtolower($search))) {
                        $result[] = [
                            'type' => 'task',
                            'element' => $this->transformTask($task, $story)
                        ];
                    }
                }
            }
        }

        return $result;
    }

    private function transformEpic($epic)
    {
        return [
            'id' => $epic->id,
            'name' => $epic->name,
            'description' => $epic->description,
            'state' => $epic->state->name,
            'project' => $epic->project->name
        ];
    }

    private function transformStory($story)
    {
        return [
            'id' => $story->id,
            'name' => $story->name,
            'story_points' => $story->story_points,
            'description' => $story->description,
            'epic' => $story->epic->name,
            'state' => $story->state->name,
            'project' => $story->project->name,
            'user' => $story->user->name
        ];
    }

    private function transformTask($task, $story)
    {
        return [
            'id' => $task->id,
            'title' => $task->title,
            'status' => $task->status,
            'order' => $task->order,
            'story' => $story->name
        ];
    }

    public function search2($userId)
    {
        $userProjects = UserProject::where('user_id', $userId)->with('project.epics', 'project.stories','project.stories.tasks' )->get();
        return $userProjects;
    }



}
