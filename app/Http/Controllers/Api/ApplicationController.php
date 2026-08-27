<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use App\Models\ApplicationStatus;
use App\Models\Opportunity;
use App\Services\Eligibility\EligibilityEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApplicationController extends Controller
{
    public function store(
        StoreApplicationRequest $request,
        Opportunity $opportunity,
        EligibilityEngine $eligibilityEngine
    ): JsonResponse|ApplicationResource {
        $user = $request->user();

        /*
        |--------------------------------------------------------------------------
        | Check opportunity status
        |--------------------------------------------------------------------------
        */

        if ($opportunity->status !== 'published') {
            return response()->json([
                'message' => 'This opportunity is not available for applications.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Check deadline
        |--------------------------------------------------------------------------
        */

        if (
            $opportunity->deadline &&
            now()->greaterThan($opportunity->deadline)
        ) {
            return response()->json([
                'message' => 'The application deadline has passed.',
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Check duplicate application
        |--------------------------------------------------------------------------
        */

        $alreadyApplied = Application::query()
            ->where('user_id', $user->id)
            ->where('opportunity_id', $opportunity->id)
            ->exists();

        if ($alreadyApplied) {
            return response()->json([
                'message' => 'You have already applied to this opportunity.',
            ], 409);
        }

        /*
        |--------------------------------------------------------------------------
        | Check eligibility
        |--------------------------------------------------------------------------
        */

        $eligibility = $eligibilityEngine->check(
            $user,
            $opportunity
        );

        if (!$eligibility['eligible']) {
            return response()->json([
                'message' => 'You are not eligible for this opportunity.',
                'eligibility' => $eligibility,
            ], 422);
        }

        /*
        |--------------------------------------------------------------------------
        | Get initial status
        |--------------------------------------------------------------------------
        */

        $pendingStatus = ApplicationStatus::query()
            ->where('code', 'pending')
            ->first();

        if (!$pendingStatus) {
            return response()->json([
                'message' => 'Application status configuration is incomplete.',
            ], 500);
        }

        /*
        |--------------------------------------------------------------------------
        | Create application
        |--------------------------------------------------------------------------
        */

        $application = Application::create([
            'user_id' => $user->id,
            'opportunity_id' => $opportunity->id,
            'status_id' => $pendingStatus->id,
            'applied_at' => now(),
            'notes' => $request->validated('notes'),
        ]);

        /*
        |--------------------------------------------------------------------------
        | Load relations
        |--------------------------------------------------------------------------
        */

        $application->load([
            'status',
            'opportunity',
        ]);

        return (new ApplicationResource($application))
            ->response()
            ->setStatusCode(201);
    }

    public function index(
        \Illuminate\Http\Request $request
    ): AnonymousResourceCollection {
        $applications = Application::query()
            ->where('user_id', $request->user()->id)
            ->with([
                'status',
                'opportunity',
            ])
            ->latest('created_at')
            ->paginate(15);

        return ApplicationResource::collection(
            $applications
        );
    }

    public function show(
        \Illuminate\Http\Request $request,
        Application $application
    ): ApplicationResource|JsonResponse {
        if ($application->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You are not allowed to view this application.',
            ], 403);
        }

        $application->load([
            'status',
            'opportunity',
        ]);

        return new ApplicationResource(
            $application
        );
    }
}
