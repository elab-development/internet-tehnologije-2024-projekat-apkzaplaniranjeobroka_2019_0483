<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanObroka extends Model
{
    use HasFactory;

    protected $table = 'plan_obrokas'; 

    protected $fillable = [
        'korisnik_id', 
        'naziv',
        'period_od',
        'period_do', 
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
