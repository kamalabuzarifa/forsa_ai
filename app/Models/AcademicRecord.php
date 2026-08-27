<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademicRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'degree_id',
        'university_id',
        'field_id',
        'gpa',
        'gpa_scale',
        'start_date',
        'end_date',
        'is_current',
    ];

    protected function casts(): array
    {
        return [
            'gpa' => 'decimal:2',
            'gpa_scale' => 'decimal:2',
            'start_date' => 'date',
            'end_date' => 'date',
            'is_current' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function degree(): BelongsTo
    {
        return $this->belongsTo(Degree::class);
    }

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function field(): BelongsTo
    {
        return $this->belongsTo(Field::class);
    }
}
