<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('language_id')
                ->constrained('languages')
                ->cascadeOnDelete();

            $table->enum('level', [
                'A1',
                'A2',
                'B1',
                'B2',
                'C1',
                'C2',
                'Native'
            ]);
            $table->string('test_type', 50)->nullable();
            $table->decimal('score', 4, 2)->nullable();
            $table->timestamps();
            $table->unique([
                'user_id',
                'language_id',
                'test_type'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_languages');
    }
};
