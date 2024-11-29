<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReceptResource;
use App\Models\Recept;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class ReceptController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $recepti = Recept::all();
        return response()->json(ReceptResource::collection($recepti), 200);
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
            'opis' => 'nullable|string',
            'sastojci' => 'required|json',
            'nutritivne_vrednosti' => 'nullable|json',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $recept = Recept::create($request->all());
        return response()->json(new ReceptResource($recept), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $recept = Recept::findOrFail($id);
        return response()->json(new ReceptResource($recept), 200);
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
        $recept = Recept::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'naziv' => 'required|string|max:255',
            'opis' => 'nullable|string',
            'sastojci' => 'required|json',
            'nutritivne_vrednosti' => 'nullable|json',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $recept->update($request->all());
        return response()->json(new ReceptResource($recept), 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $recept = Recept::findOrFail($id);
        $recept->delete();

        return response()->json(['message' => 'Recept je uspešno obrisan.'], 200);
    }

    public function search(Request $request)
    {
        
        $naziv = $request->input('naziv');
        $sastojci = $request->input('sastojci');
        $kalorije_od = $request->input('kalorije_od');
        $kalorije_do = $request->input('kalorije_do');

        $query = Recept::query();

        if ($naziv) {
            $query->where('naziv', 'like', "%$naziv%");
        }

        if ($sastojci) {
            $query->whereJsonContains('sastojci', $sastojci);
        }

        if ($kalorije_od || $kalorije_do) {
            $query->where(function ($subquery) use ($kalorije_od, $kalorije_do) {
                if ($kalorije_od) {
                    $subquery->whereJsonContains('nutritivne_vrednosti->kalorije', '>=', $kalorije_od);
                }
                if ($kalorije_do) {
                    $subquery->whereJsonContains('nutritivne_vrednosti->kalorije', '<=', $kalorije_do);
                }
            });
        }

        $recepti = $query->paginate(10);

        return response()->json($recepti, 200);
    }

    public function addFile(Request $request, $id)
    {
        // Validacija fajla
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048', // Dozvoljeni formati i veličina
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Pronađi recept
        $recept = Recept::findOrFail($id);

        // Čuvanje fajla
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filePath = $file->store('uploads', 'public'); // Čuvanje u storage/app/public/uploads

            // Ažuriraj recept sa putanjom fajla
            $recept->update(['file_path' => $filePath]);

            // Vraćanje odgovora sa URL-om slike
            return response()->json([
                'message' => 'Fajl je uspešno dodat receptu.',
                'recept' => $recept,
                'file_url' => asset('storage/' . $filePath),
            ], 200);
        }

        return response()->json(['message' => 'Fajl nije uploadovan.'], 500);
    }

    public function exportCsv()
    {
        $recepti = Recept::all();

        $csvData = "ID,Naziv,Opis,Sastojci\n";

        foreach ($recepti as $recept) {
            $csvData .= "{$recept->id},\"{$recept->naziv}\",\"{$recept->opis}\",\"{$recept->sastojci}\"\n";
        }

        $fileName = 'recepti_' . now()->format('Y_m_d_H_i_s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$fileName\"",
        ];

        return Response::make($csvData, 200, $headers);
    }

    public function getNutritiveInfo(Request $request)
    {
        $request->validate([
            'query' => 'required|string|max:255', // Pretraga po nazivu proizvoda ili barkodu
        ]);

        $query = urlencode($request->input('query'));

        $apiUrl = "https://world.openfoodfacts.org/cgi/search.pl?search_terms={$query}&search_simple=1&json=1";

        try {
            $response = Http::get($apiUrl);

            if ($response->failed()) {
                return response()->json(['error' => 'Nije moguće preuzeti podatke za zadati upit.'], 404);
            }

            $data = $response->json();

            // Provera da li ima rezultata
            if (empty($data['products'])) {
                return response()->json(['error' => 'Nema rezultata za zadati upit.'], 404);
            }

            // Obrada rezultata
            $products = collect($data['products'])->map(function ($product) {
                return [
                    'ime' => $product['product_name'] ?? 'N/A',
                    'brend' => $product['brands'] ?? 'N/A',
                    'nutritivne_vrednosti' => $product['nutriments'] ?? [],
                    'slika' => $product['image_url'] ?? 'N/A',
                ];
            });

            return response()->json($products, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Došlo je do greške prilikom preuzimanja podataka.'], 500);
        }
    }
}
