<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('opportunities', function (Blueprint $table) {

            $table->decimal('annual_tuition', 12, 2)
                ->nullable()
                ->after('funding_type_id');

            $table->string('currency', 10)
                ->default('USD')
                ->after('annual_tuition');

            $table->enum('study_mode', [
                'on_campus',
                'online',
                'hybrid',
            ])
                ->nullable()
                ->after('currency');
        });
    }

    public function down(): void
    {
        Schema::table('opportunities', function (Blueprint $table) {

            $table->dropColumn([
                'annual_tuition',
                'currency',
                'study_mode',
            ]);
        });
    }
};
