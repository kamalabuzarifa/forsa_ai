<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class University extends Model
{
    use HasFactory;

    protected $fillable = [
        'country_id',
        'name',
        'website',
        'description',
        'logo',
        'status',
    ];

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function academicRecords(): HasMany
    {
        return $this->hasMany(AcademicRecord::class);
    }

    public function opportunities(): HasMany
    {
        return $this->hasMany(Opportunity::class);
    }
}
