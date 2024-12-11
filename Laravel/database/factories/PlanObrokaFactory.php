<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlanObrokaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'korisnik_id' => User::factory(), 
            'naziv' => $this->faker->sentence(3),
            'period_od' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'period_do' => $this->faker->dateTimeBetween('now', '+1 month'),
        ];
    }
}
