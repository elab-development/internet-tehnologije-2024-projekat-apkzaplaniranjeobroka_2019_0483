<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ReceptFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'naziv' => $this->faker->sentence(3),
            'opis' => $this->faker->paragraph(),
            'sastojci' => json_encode($this->faker->words(5)),
            'nutritivne_vrednosti' => json_encode([
                'kalorije' => $this->faker->numberBetween(100, 500),
                'proteini' => $this->faker->numberBetween(5, 50),
                'masti' => $this->faker->numberBetween(5, 30),
                'ugljeni_hidrati' => $this->faker->numberBetween(20, 80),
            ]),
        ];
    }
}
