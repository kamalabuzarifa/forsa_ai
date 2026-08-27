<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Field extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'parent_id',
        'description',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(
            Field::class,
            'parent_id'
        );
    }

    public function children(): HasMany
    {
        return $this->hasMany(
            Field::class,
            'parent_id'
        );
    }

    public function academicRecords(): HasMany
    {
        return $this->hasMany(
            AcademicRecord::class
        );
    }

    public function opportunityFields(): HasMany
    {
        return $this->hasMany(
            OpportunityField::class
        );
    }

    public function opportunities(): BelongsToMany
    {
        return $this->belongsToMany(
            Opportunity::class,
            'opportunity_fields'
        )->withTimestamps();
    }
}
