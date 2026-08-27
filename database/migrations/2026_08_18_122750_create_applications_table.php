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
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('opportunity_id')->constrained('opportunities')->cascadeOnDelete();
            $table->foreignId('status_id')->constrained('application_statuses')->restrictOnDelete();
            $table->dateTime('applied_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->unique([
                'user_id',
                'opportunity_id'
            ]);
            $table->index('status_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
