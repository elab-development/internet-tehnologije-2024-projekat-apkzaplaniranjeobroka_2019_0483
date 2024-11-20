<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanObroka extends Model
{
    use HasFactory;

    protected $table = 'plan_obrokas'; // Naziv tabele u bazi

    protected $fillable = [
        'korisnik_id', // Strani ključ koji povezuje plan sa korisnikom
        'naziv',
        'period_od', // Datum početka plana
        'period_do', // Datum završetka plana
    ];

    public function korisnik()
    {
        return $this->belongsTo(User::class);
    }

    public function stavkePlana()
    {
        return $this->hasMany(StavkaPlana::class);
    }
}
