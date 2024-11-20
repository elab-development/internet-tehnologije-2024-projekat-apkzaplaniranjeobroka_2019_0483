<?php

namespace Database\Seeders;

use App\Models\StavkaPlana;
use Illuminate\Database\Seeder;

class StavkaPlanaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        StavkaPlana::factory()->count(50)->create();
    }
}
