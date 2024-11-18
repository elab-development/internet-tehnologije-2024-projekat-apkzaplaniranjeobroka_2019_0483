<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\StavkaPlanaResource;
use App\Models\StavkaPlana;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StavkaPlanaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $stavke = StavkaPlana::all();
        return response()->json(StavkaPlanaResource::collection($stavke), 200);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plan_obroka_id' => 'required|integer|exists:planovi_obroka,id',
            'recept_id' => 'required|integer|exists:recepti,id',
            'datum' => 'required|date',
            'tip_obroka' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $stavka = StavkaPlana::create($request->all());

        return response()->json(new StavkaPlanaResource($stavka), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $stavka = StavkaPlana::findOrFail($id);
        return response()->json(new StavkaPlanaResource($stavka), 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $stavka = StavkaPlana::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'plan_obroka_id' => 'required|integer|exists:planovi_obroka,id',
            'recept_id' => 'required|integer|exists:recepti,id',
            'datum' => 'required|date',
            'tip_obroka' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $stavka->update($request->all());

        return response()->json(new StavkaPlanaResource($stavka), 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $stavka = StavkaPlana::findOrFail($id);
        $stavka->delete();

        return response()->json(['message' => 'Stavka plana uspešno obrisana.'], 200);
    }
}
