<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OpportunityRequirement extends Model
{
    use HasFactory;

    protected $fillable = [
        'opportunity_id',
        'language_id',
        'requirement_type',
        'operator',
        'value',
        'unit',
        'metadata',
        'is_mandatory',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'is_mandatory' => 'boolean',
        ];
    }

    public function opportunity(): BelongsTo
    {
        return $this->belongsTo(
            Opportunity::class
        );
    }

    public function language(): BelongsTo
    {
        return $this->belongsTo(
            Language::class
        );
    }
}
