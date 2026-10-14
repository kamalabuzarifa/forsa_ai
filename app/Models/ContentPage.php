<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class ContentPage extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'description',
        'status',
        'published_at',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    public function sections(): HasMany
    {
        return $this->hasMany(ContentSection::class)->orderBy('sort_order');
    }
}
