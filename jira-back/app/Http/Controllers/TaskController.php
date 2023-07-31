<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class TaskController extends Controller
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
        $tasks = Task::all();
        return $tasks;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->json()->all(), [
            'title' => 'required',
            'status' => 'required',
            'story_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
        }
        //extraer la lista de estador por projectos id
        $tasks = Task::where('story_id', $request->json()->get('story_id'))->get();
        //validar que no exista un estado con el mismo nombre
        foreach ($tasks as $task) {
            if ($task->title == $request->json()->get('title')) {
                return response()->json(['message' => 'Task already exists.'], ResponseAlias::HTTP_BAD_REQUEST);
            }
        }
        //hacer que el order sea la suma de todos los estados +1
        $order = $tasks->count() + 1;
        $request->json()->add(['order' => $order]);
        //guardar el estado
        $task = new Task();
        $task->fill($request->json()->all());
        $task->save();
        return $task;
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $task = Task::find($id);
        if ($task == null) {
            return response()->json(['message' => 'Task not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        return $task;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $task = Task::find($id);
        if ($task == null) {
            return response()->json(['message' => 'Task not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        if ($request->method() != "PATCH") {
            $validator = Validator::make($request->json()->all(), [
                'title' => 'required',
                'status' => 'required',
                'story_id' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
            }
        }
        $task->fill($request->json()->all());
        $task->save();

        return $task;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $taskFocus = Task::find($id);
        if ($taskFocus == null) {
            return response()->json(['message' => 'Task not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $taskFocus->delete();
        //hacer que los demas resten 1 al order si es mayor al que se elimino
        $tasks = Task::where('story_id', $taskFocus->story_id)->get();
        foreach ($tasks as $task) {
            if ($task->order > $taskFocus->order) {
                $task->order = $task->order - 1;
                $task->save();
            }
        }
        return response()->json(['message' => 'Task deleted.']);
    }
}
