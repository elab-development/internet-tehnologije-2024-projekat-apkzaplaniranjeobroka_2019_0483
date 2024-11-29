<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFilePathToReceptsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('recepts', function (Blueprint $table) {
            $table->string('file_path')->nullable()->after('nutritivne_vrednosti');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('recepts', function (Blueprint $table) {
            $table->dropColumn('file_path');
        });
    }
}
