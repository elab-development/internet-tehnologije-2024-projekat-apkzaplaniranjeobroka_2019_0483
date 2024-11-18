<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlanObrokaResource;
use App\Models\PlanObroka;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PlanObrokaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = auth()->user(); // Preuzimanje ulogovanog korisnika
        $planovi = PlanObroka::where('korisnik_id', $user->id)->get();
        return response()->json(PlanObrokaResource::collection($planovi), 200);
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
            'naziv' => 'required|string|max:255',
            'period_od' => 'required|date',
            'period_do' => 'required|date|after_or_equal:period_od',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        $plan = PlanObroka::create([
            'korisnik_id' => $user->id,
            'naziv' => $request->naziv,
            'period_od' => $request->period_od,
            'period_do' => $request->period_do,
        ]);

        return response()->json(new PlanObrokaResource($plan), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $plan = PlanObroka::where('id', $id)
        ->where('korisnik_id', auth()->id())
        ->firstOrFail();
        return response()->json(new PlanObrokaResource($plan), 200);
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
        $plan = PlanObroka::where('id', $id)
                          ->where('korisnik_id', auth()->id())
                          ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'period_od' => 'required|date',
            'period_do' => 'required|date|after_or_equal:period_od',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $plan->update($request->all());

        return response()->json(new PlanObrokaResource($plan), 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $plan = PlanObroka::where('id', $id)
        ->where('korisnik_id', auth()->id())
        ->firstOrFail();
        $plan->delete();

        return response()->json(['message' => 'Plan obroka uspešno obrisan.'], 200);
    }
}
