<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Degree extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
    ];

    public function academicRecords(): HasMany
    {
        return $this->hasMany(
            AcademicRecord::class
        );
    }

    public function opportunityDegrees(): HasMany
    {
        return $this->hasMany(
            OpportunityDegree::class
        );
    }

    public function opportunities(): BelongsToMany
    {
        return $this->belongsToMany(
            Opportunity::class,
            'opportunity_degrees'
        )->withTimestamps();
    }
}
