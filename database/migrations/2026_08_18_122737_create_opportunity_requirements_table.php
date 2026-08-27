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
        Schema::create('opportunity_requirements', function (Blueprint $table) {
            $table->id();

            $table->foreignId('opportunity_id')
                ->constrained('opportunities')
                ->cascadeOnDelete();

            $table->foreignId('language_id')
                ->nullable()
                ->constrained('languages')
                ->nullOnDelete();

            $table->string('requirement_type', 50);

            $table->string('operator', 10);

            $table->string('value', 255);

            $table->string('unit', 50)
                ->nullable();

            $table->json('metadata')
                ->nullable();

            $table->boolean('is_mandatory')
                ->default(true);

            $table->text('description')
                ->nullable();

            $table->timestamps();

            $table->index([
                'opportunity_id',
                'requirement_type',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opportunity_requirements');
    }
};
