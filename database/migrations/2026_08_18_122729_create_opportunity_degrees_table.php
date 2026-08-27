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
        Schema::create('opportunity_degrees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('opportunity_id')->constrained('opportunities')->cascadeOnDelete();
            $table->foreignId('degree_id')->constrained('degrees')->cascadeOnDelete();
            $table->timestamps();
            $table->unique([
                'opportunity_id',
                'degree_id'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opportunity_degrees');
    }
};
