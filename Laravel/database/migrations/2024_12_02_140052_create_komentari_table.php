<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKomentariTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('komentari', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('recept_id'); 
            $table->unsignedBigInteger('user_id');   
            $table->text('tekst');                   
            $table->timestamps();

            $table->foreign('recept_id')->references('id')->on('recepts')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('komentari');
    }
}
