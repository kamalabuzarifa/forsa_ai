<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OpportunityNationality extends Model
{
    use HasFactory;

    protected $fillable = [
        'opportunity_id',
        'country_id',
        'eligibility_type',
    ];

    public function opportunity(): BelongsTo
    {
        return $this->belongsTo(Opportunity::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }
}
