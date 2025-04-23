<?php

namespace Database\Seeders;

use App\Models\Recept;
use Illuminate\Database\Seeder;

class ReceptSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Recept::factory()->count(30)->create();
    }
}
