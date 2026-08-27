<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'opportunity_id',
        'status_id',
        'applied_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'applied_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class
        );
    }

    public function opportunity(): BelongsTo
    {
        return $this->belongsTo(
            Opportunity::class
        );
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(
            ApplicationStatus::class,
            'status_id'
        );
    }
}
