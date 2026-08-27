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
        Schema::create('universities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('country_id')
                ->constrained('countries')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('name');
            $table->string('website', 500)->nullable();
            $table->text('description')->nullable();
            $table->string('logo', 500)->nullable();

            $table->enum('status', [
                'active',
                'inactive'
            ])->default('active');
            $table->timestamps();
            $table->index('name');
            $table->index('country_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('universities');
    }
};
