<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StavkaPlana extends Model
{
    use HasFactory;

    protected $table = 'stavka_planas'; 

    protected $fillable = [
        'plan_obroka_id', 
        'recept_id',      
        'datum',          
        'tip_obroka',     // Tip obroka (doručak, ručak, večera)
    ];

    public function planObroka()
    {
        return $this->belongsTo(PlanObroka::class);
    }

    public function recept()
    {
        return $this->belongsTo(Recept::class);
    }
}
