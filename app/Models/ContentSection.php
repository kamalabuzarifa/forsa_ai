<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class ContentSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'content_page_id',
        'key',
        'type',
        'heading',
        'body',
        'image_url',
        'cta_label',
        'cta_url',
        'sort_order',
        'is_visible',
        'status',
        'published_at',
        'settings',
    ];

    protected function casts(): array
    {
        return [
            'is_visible' => 'boolean',
            'published_at' => 'datetime',
            'settings' => 'array',
        ];
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(ContentPage::class, 'content_page_id');
    }
}
