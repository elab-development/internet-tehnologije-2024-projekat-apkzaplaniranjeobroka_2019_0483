<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlanObrokasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('plan_obrokas', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('korisnik_id')->constrained('users')->onDelete('cascade'); 
            $table->string('naziv'); 
            $table->date('period_od'); 
            $table->date('period_do'); 
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('plan_obrokas');
    }
}
