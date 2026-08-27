<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MatchingResource;
use App\Models\Opportunity;
use App\Services\Matching\MatchingEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MatchingController extends Controller
{
    public function check(
        Request $request,
        Opportunity $opportunity,
        MatchingEngine $engine
    ): MatchingResource|JsonResponse {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $result = $engine->calculate(
            $user,
            $opportunity
        );

        return new MatchingResource($result);
    }
}
