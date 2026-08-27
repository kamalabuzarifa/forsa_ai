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
        Schema::create('opportunities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('description');
            $table->foreignId('university_id')->nullable()->constrained('universities')->nullOnDelete();
            $table->foreignId('country_id')->constrained('countries')->restrictOnDelete();
            $table->foreignId('opportunity_type_id')->constrained('opportunity_types')->restrictOnDelete();
            $table->foreignId('funding_type_id')->nullable()->constrained('funding_types')->nullOnDelete();
            $table->string('application_url', 1000);
            $table->string('source_url', 1000)->nullable();
            $table->dateTime('deadline')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->enum('status', [
                'draft',
                'published',
                'expired',
                'archived'
            ])->default('draft');
            $table->boolean('is_verified')->default(false);
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->index('status');
            $table->index('deadline');
            $table->index('country_id');
            $table->index('opportunity_type_id');
            $table->index('funding_type_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opportunities');
    }
};
