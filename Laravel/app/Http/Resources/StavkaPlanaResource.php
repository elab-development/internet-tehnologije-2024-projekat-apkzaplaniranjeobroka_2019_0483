<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StavkaPlanaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'plan_obroka_id' => $this->plan_obroka_id,
            'recept_id' => $this->recept_id,
            'datum' => $this->datum,
            'tip_obroka' => $this->tip_obroka,
            'plan_obroka' => $this->planObroka, 
            'recept' => $this->recept,        
        ];
    }
}
