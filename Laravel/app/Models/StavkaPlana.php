<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StavkaPlana extends Model
{
    use HasFactory;

    protected $table = 'stavka_planas'; // Naziv tabele u bazi

    protected $fillable = [
        'plan_obroka_id', // Strani ključ koji povezuje stavku sa planom obroka
        'recept_id',      // Strani ključ koji povezuje stavku sa receptom
        'datum',          // Datum kada se planira obrok
        'tip_obroka',     // Tip obroka (doručak, ručak, večera)
    ];

    // Veza sa planom obroka (jedna stavka pripada jednom planu)
    public function planObroka()
    {
        return $this->belongsTo(PlanObroka::class);
    }

    // Veza sa receptom (jedna stavka može biti povezana sa jednim receptom)
    public function recept()
    {
        return $this->belongsTo(Recept::class);
    }
}
