<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recept extends Model
{
    use HasFactory;

    protected $table = 'recepts'; // Naziv tabele u bazi

    protected $fillable = [
        'naziv',
        'opis',
        'sastojci',          // JSON polje za listu sastojaka
        'nutritivne_vrednosti', // JSON polje za kalorije, proteine itd.
        'file_path', // Dodato za čuvanje putanje fajla
    ];

    public function stavkePlana()
    {
        return $this->hasMany(StavkaPlana::class);
    }
}
