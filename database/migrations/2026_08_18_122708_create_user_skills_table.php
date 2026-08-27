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
        Schema::create('user_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            $table->foreignId('skill_id')->constrained('skills')->cascadeOnDelete();
            $table->enum('level', [
                'Beginner',
                'Intermediate',
                'Advanced',
                'Expert'
            ]);
            $table->decimal('years_of_experience', 4, 1)->nullable();
            $table->timestamps();
            $table->unique([
                'user_id',
                'skill_id'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_skills');
    }
};
