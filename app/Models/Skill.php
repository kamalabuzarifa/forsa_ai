<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'user_skills'
        )
            ->withPivot([
                'level',
                'years_of_experience',
            ])
            ->withTimestamps();
    }

    public function opportunitySkills(): HasMany
    {
        return $this->hasMany(
            OpportunitySkill::class
        );
    }

    public function opportunities(): BelongsToMany
    {
        return $this->belongsToMany(
            Opportunity::class,
            'opportunity_skills'
        )
            ->withPivot('is_mandatory')
            ->withTimestamps();
    }
}
