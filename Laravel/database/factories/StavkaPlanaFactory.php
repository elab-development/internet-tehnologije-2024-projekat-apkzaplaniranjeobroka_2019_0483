<?php

namespace Database\Factories;

use App\Models\PlanObroka;
use App\Models\Recept;
use Illuminate\Database\Eloquent\Factories\Factory;

class StavkaPlanaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'plan_obroka_id' => PlanObroka::factory(), 
            'recept_id' => Recept::factory(),
            'datum' => $this->faker->dateTimeBetween('-1 month', '+1 month'),
            'tip_obroka' => $this->faker->randomElement(['Doručak', 'Ručak', 'Večera']),
        ];
    }
}
