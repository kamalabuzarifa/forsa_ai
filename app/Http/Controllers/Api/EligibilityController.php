<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EligibilityResource;
use App\Models\Opportunity;
use App\Services\Eligibility\EligibilityEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EligibilityController extends Controller
{
    public function check(
        Request $request,
        Opportunity $opportunity,
        EligibilityEngine $engine
    ): EligibilityResource|JsonResponse {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $result = $engine->check(
            $user,
            $opportunity
        );

        return new EligibilityResource($result);
    }
}
