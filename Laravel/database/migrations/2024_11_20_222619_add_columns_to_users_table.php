<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->json('alergije')->nullable()->after('password'); // Dodajemo JSON kolonu za alergije
            $table->json('dijetetske_preferencije')->nullable()->after('alergije'); // Dodajemo JSON kolonu za dijetetske preferencije
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['alergije', 'dijetetske_preferencije']);
        });
    }
}
