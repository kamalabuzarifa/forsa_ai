<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContentPage;
use Illuminate\Http\JsonResponse;

class ContentController extends Controller
{
    public function show(string $slug): JsonResponse
    {
        $page = ContentPage::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->with([
                'sections' => fn($query) => $query
                    ->where('status', 'published')
                    ->where('is_visible', true)
                    ->orderBy('sort_order'),
            ])
            ->first();

        if (!$page) {
            return response()->json([
                'message' => 'Published content page not found.',
            ], 404);
        }

        return response()->json([
            'page' => $page,
        ]);
    }
}
