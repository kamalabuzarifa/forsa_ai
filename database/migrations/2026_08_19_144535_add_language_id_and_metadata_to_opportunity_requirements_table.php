<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The columns already exist in the current database.
        // This migration is intentionally left empty so Laravel
        // can record it as executed without changing the schema.
    }

    public function down(): void
    {
        // Do not remove the existing columns here.
        // They may have been created by an earlier migration.
    }
};
