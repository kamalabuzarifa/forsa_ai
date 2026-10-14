<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_page_id')->constrained('content_pages')->cascadeOnDelete();
            $table->string('key');
            $table->string('type')->default('text');
            $table->string('heading')->nullable();
            $table->text('body')->nullable();
            $table->string('image_url', 1000)->nullable();
            $table->string('cta_label')->nullable();
            $table->string('cta_url', 1000)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft')->index();
            $table->timestamp('published_at')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();

            $table->unique(['content_page_id', 'key']);
            $table->index(['content_page_id', 'status', 'is_visible', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_sections');
    }
};
