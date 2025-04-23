<?php

namespace Database\Seeders;

use App\Models\PlanObroka;
use Illuminate\Database\Seeder;

class PlanObrokaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        PlanObroka::factory()->count(20)->create();
    }
}
