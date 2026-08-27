<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OpportunityField extends Model
{
    use HasFactory;

    protected $fillable = [
        'opportunity_id',
        'field_id',
    ];

    public function opportunity(): BelongsTo
    {
        return $this->belongsTo(Opportunity::class);
    }

    public function field(): BelongsTo
    {
        return $this->belongsTo(Field::class);
    }
}
