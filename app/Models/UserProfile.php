<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date_of_birth',
        'nationality_id',
        'country_of_residence_id',
        'phone',
        'bio',
        'profile_completion',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'profile_completion' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function nationality(): BelongsTo
    {
        return $this->belongsTo(
            Country::class,
            'nationality_id'
        );
    }

    public function countryOfResidence(): BelongsTo
    {
        return $this->belongsTo(
            Country::class,
            'country_of_residence_id'
        );
    }
}
