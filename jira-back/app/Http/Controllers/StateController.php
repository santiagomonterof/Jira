<?php

namespace App\Http\Controllers;

use App\Models\State;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class StateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $states = State::all();
        return $states;
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
            'project_id' => 'required',
            'is_finalized' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
        }
        //extraer la lista de estador por projectos id
        $states = State::where('project_id', $request->json()->get('project_id'))->get();
        //validar que no exista un estado con el mismo nombre
        foreach ($states as $state) {
            if ($state->name == $request->json()->get('name')) {
                return response()->json(['message' => 'State already exists.'], ResponseAlias::HTTP_BAD_REQUEST);
            }
        }
        //hacer que el order sea la suma de todos los estados +1
        $order = $states->count() + 1;
        $request->json()->add(['order' => $order]);
        //guardar el estado
        $state = new State();
        $state->fill($request->json()->all());
        $state->save();
        return $state;
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $state = State::find($id);
        if ($state == null) {
            return response()->json(['message' => 'State not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        return $state;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(State $state)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $state = State::find($id);
        if ($state == null) {
            return response()->json(['message' => 'State not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        if ($request->method() != "PATCH") {
            $validator = Validator::make($request->json()->all(), [
                'name' => 'required',
                'is_finalized' => 'required',
                'project_id' => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json($validator->messages(), ResponseAlias::HTTP_BAD_REQUEST);
            }
        }
        $state->fill($request->json()->all());
        $state->save();

        return $state;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $stateFocus = State::find($id);
        if ($stateFocus == null) {
            return response()->json(['message' => 'State not found.'], ResponseAlias::HTTP_NOT_FOUND);
        }
        $stateFocus->delete();
        //hacer que los demas resten 1 al order si es mayor al que se elimino
        $states = State::where('project_id', $stateFocus->project_id)->get();
        foreach ($states as $state) {
            if ($state->order > $stateFocus->order) {
                $state->order = $state->order - 1;
                $state->save();
            }
        }
        return response()->json(['message' => 'State deleted.']);
    }

    public function getStatesByProjectId($id)
    {
        $states = State::where('project_id', $id)->get();
        return $states;
    }
}
