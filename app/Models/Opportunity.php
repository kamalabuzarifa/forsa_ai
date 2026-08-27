<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Opportunity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'university_id',
        'country_id',
        'opportunity_type_id',
        'funding_type_id',
        'application_url',
        'source_url',
        'deadline',
        'start_date',
        'end_date',
        'status',
        'is_verified',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'deadline' => 'datetime',
            'start_date' => 'date',
            'end_date' => 'date',
            'is_verified' => 'boolean',
        ];
    }

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(
            OpportunityType::class,
            'opportunity_type_id'
        );
    }

    public function fundingType(): BelongsTo
    {
        return $this->belongsTo(FundingType::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }

    public function opportunityFields(): HasMany
    {
        return $this->hasMany(
            OpportunityField::class
        );
    }

    public function opportunityDegrees(): HasMany
    {
        return $this->hasMany(
            OpportunityDegree::class
        );
    }

    public function opportunityNationalities(): HasMany
    {
        return $this->hasMany(
            OpportunityNationality::class
        );
    }

    public function nationalities(): HasMany
    {
        return $this->hasMany(
            OpportunityNationality::class
        );
    }

    public function requirements(): HasMany
    {
        return $this->hasMany(
            OpportunityRequirement::class
        );
    }

    public function opportunitySkills(): HasMany
    {
        return $this->hasMany(
            OpportunitySkill::class
        );
    }

    public function savedByUsers(): HasMany
    {
        return $this->hasMany(
            SavedOpportunity::class
        );
    }

    public function applications(): HasMany
    {
        return $this->hasMany(
            Application::class
        );
    }

    public function fields(): BelongsToMany
    {
        return $this->belongsToMany(
            Field::class,
            'opportunity_fields'
        )->withTimestamps();
    }

    public function degrees(): BelongsToMany
    {
        return $this->belongsToMany(
            Degree::class,
            'opportunity_degrees'
        )->withTimestamps();
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(
            Skill::class,
            'opportunity_skills'
        )
            ->withPivot('is_mandatory')
            ->withTimestamps();
    }
}
