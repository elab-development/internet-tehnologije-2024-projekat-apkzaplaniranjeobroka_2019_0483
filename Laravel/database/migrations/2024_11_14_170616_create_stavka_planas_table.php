<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStavkaPlanasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stavka_planas', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('plan_obroka_id')->constrained('plan_obrokas')->onDelete('cascade'); 
            $table->foreignId('recept_id')->constrained('recepts')->onDelete('cascade');
            $table->date('datum');
            $table->string('tip_obroka');
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
        Schema::dropIfExists('stavka_planas');
    }
}
