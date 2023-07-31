<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class SprintController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sprints = Sprint::all();
        return $sprints;
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
            'start_date' => 'required',
            'end_date' => 'required',
            'status' => 'required',
            'project_id' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
        }
        //extraer la lista de estador por projectos id
        $sprints = Sprint::where('project_id', $request->json()->get('project_id'))->get();
        //hacer que el order sea la suma de todos los estados +1
        $order = $sprints->count() + 1;
        $request->json()->add(['order' => $order]);
        //guardar el estado
        $sprint = new Sprint();
        $sprint->fill($request->json()->all());
        $sprint->save();
        return $sprint;
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $sprint = Sprint::find($id);
        if ($sprint == null) {
            return response()->json(['message' => 'Sprint not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        return $sprint;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sprint $sprint)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $sprint = Sprint::find($id);
        if ($sprint == null) {
            return response()->json(['message' => 'State not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        if ($request->method() != "PATCH") {
            $validator = Validator::make($request->json()->all(), [
                'start_date' => 'required',
                'end_date' => 'required',
                'status' => 'required',
                'project_id' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
            }
        }
        $sprint->fill($request->json()->all());
        $sprint->save();

        return $sprint;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $sprintFocus = Sprint::find($id);
        if ($sprintFocus == null) {
            return response()->json(['message' => 'Sprint not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $sprintFocus->delete();
        //hacer que los demas resten 1 al order si es mayor al que se elimino
        //validar si es el primero o el ultimo
        $sprints = Sprint::where('project_id', $sprintFocus->project_id)->get();
        foreach ($sprints as $sprint) {
            if ($sprint->order > $sprintFocus->order) {
                $sprint->order = $sprint->order - 1;
                $sprint->save();
            }
        }
        return response()->json(['message' => 'Sprint deleted.']);
    }

    public function getSprintsByProjectId($id)
    {
        $sprints = Sprint::where('project_id', $id)->get();
        return $sprints;
    }

    public function getStoriesBySprintId($id)
    {
        $sprint = Sprint::find($id);
        if ($sprint == null) {
            return response()->json(['message' => 'Sprint not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $stories = $sprint->stories;
        return $stories;
    }
}
