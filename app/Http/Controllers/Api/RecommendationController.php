<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RecommendedOpportunityResource;
use App\Services\Matching\RecommendationService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RecommendationController extends Controller
{
    public function index(
        Request $request,
        RecommendationService $recommendationService
    ): AnonymousResourceCollection {
        $limit = (int) $request->query('limit', 10);

        $limit = max(
            1,
            min($limit, 50)
        );

        $recommendations = $recommendationService->recommend(
            $request->user(),
            $limit
        );

        return RecommendedOpportunityResource::collection(
            $recommendations
        );
    }
}
