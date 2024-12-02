<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlanObrokaResource;
use App\Models\PlanObroka;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class PlanObrokaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = auth()->user(); // Preuzimanje ulogovanog korisnika
    
        // Preuzimanje filtera iz upita
        $naziv = $request->input('naziv'); 
        $period_od = $request->input('period_od'); 
        $period_do = $request->input('period_do');
    
        // Query sa filtriranjem
        $query = PlanObroka::where('korisnik_id', $user->id);
    
        if ($naziv) {
            $query->where('naziv', 'LIKE', "%$naziv%");
        }
    
        if ($period_od) {
            $query->where('period_od', '>=', $period_od);
        }
    
        if ($period_do) {
            $query->where('period_do', '<=', $period_do);
        }
    
        // Paginacija
        $planovi = $query->paginate(10); // 10 planova po stranici
    
        // Vraćanje resursa sa paginacijom
        return response()->json([
            'data' => PlanObrokaResource::collection($planovi),
            'pagination' => [
                'current_page' => $planovi->currentPage(),
                'last_page' => $planovi->lastPage(),
                'per_page' => $planovi->perPage(),
                'total' => $planovi->total(),
            ],
        ], 200);
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
        $user = auth()->user(); 

        // Kreiranje ključa za keširanje na osnovu korisnika i ID-ja plana
        $cacheKey = "plan_obroka_{$user->id}_{$id}";
    
        // Dohvatanje plana iz keša ili baze, cuva se 10 minuta
        $plan = Cache::remember($cacheKey, now()->addMinutes(10), function () use ($id, $user) {
            return PlanObroka::where('id', $id)
                             ->where('korisnik_id', $user->id)
                             ->firstOrFail();
        });
    
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
