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
        Schema::create('academic_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            $table->foreignId('degree_id')->constrained('degrees')->restrictOnDelete();

            $table->foreignId('university_id')->nullable()->constrained('universities')->nullOnDelete();

            $table->foreignId('field_id')->nullable()->constrained('fields')->nullOnDelete();

            $table->decimal('gpa', 5, 2)->nullable();
            $table->decimal('gpa_scale', 5, 2)->nullable();

            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            $table->boolean('is_current')->default(false);
            $table->timestamps();
            $table->index('user_id');
            $table->index('degree_id');
            $table->index('field_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_records');
    }
};
