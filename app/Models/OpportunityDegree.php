<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OpportunityDegree extends Model
{
    use HasFactory;

    protected $fillable = [
        'opportunity_id',
        'degree_id',
    ];

    public function opportunity(): BelongsTo
    {
        return $this->belongsTo(Opportunity::class);
    }

    public function degree(): BelongsTo
    {
        return $this->belongsTo(Degree::class);
    }
}
