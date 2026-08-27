<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Country extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'iso_code',
    ];

    public function universities(): HasMany
    {
        return $this->hasMany(University::class);
    }

    public function opportunities(): HasMany
    {
        return $this->hasMany(Opportunity::class);
    }

    public function nationalities(): HasMany
    {
        return $this->hasMany(
            UserProfile::class,
            'nationality_id'
        );
    }

    public function residents(): HasMany
    {
        return $this->hasMany(
            UserProfile::class,
            'country_of_residence_id'
        );
    }

    public function opportunityNationalities(): HasMany
    {
        return $this->hasMany(
            OpportunityNationality::class
        );
    }
}
