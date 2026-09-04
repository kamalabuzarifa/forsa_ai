<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Opportunity;
use App\Models\SavedOpportunity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SavedOpportunityController extends Controller
{
    /**
     * Get all saved opportunities for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $savedOpportunities = SavedOpportunity::query()
            ->where('user_id', $request->user()->id)
            ->with([
                'opportunity.university',
                'opportunity.country',
                'opportunity.type',
                'opportunity.fundingType',
                'opportunity.fields',
                'opportunity.degrees',
            ])
            ->latest()
            ->get();

        return response()->json([
            'data' => $savedOpportunities->map(
                function (SavedOpportunity $saved) {
                    $opportunity = $saved->opportunity;

                    return [
                        'id' => $saved->id,
                        'saved_at' => $saved->created_at,

                        'opportunity' => [
                            'id' => $opportunity->id,
                            'title' => $opportunity->title,
                            'slug' => $opportunity->slug,
                            'description' => $opportunity->description,

                            'university' => $opportunity->university
                                ? [
                                    'id' => $opportunity->university->id,
                                    'name' => $opportunity->university->name,
                                ]
                                : null,

                            'country' => $opportunity->country
                                ? [
                                    'id' => $opportunity->country->id,
                                    'name' => $opportunity->country->name,
                                ]
                                : null,

                            'opportunity_type' => $opportunity->type
                                ? [
                                    'id' => $opportunity->type->id,
                                    'name' => $opportunity->type->name,
                                ]
                                : null,

                            'funding_type' => $opportunity->fundingType
                                ? [
                                    'id' => $opportunity->fundingType->id,
                                    'name' => $opportunity->fundingType->name,
                                ]
                                : null,

                            'annual_tuition' =>
                            $opportunity->annual_tuition,

                            'currency' =>
                            $opportunity->currency,

                            'study_mode' =>
                            $opportunity->study_mode,

                            'application_url' =>
                            $opportunity->application_url,

                            'source_url' =>
                            $opportunity->source_url,

                            'deadline' =>
                            $opportunity->deadline,

                            'start_date' =>
                            $opportunity->start_date,

                            'end_date' =>
                            $opportunity->end_date,

                            'status' =>
                            $opportunity->status,

                            'is_verified' =>
                            (bool) $opportunity->is_verified,

                            'fields' => $opportunity->fields
                                ->map(fn($field) => [
                                    'id' => $field->id,
                                    'name' => $field->name,
                                ])
                                ->values(),

                            'degrees' => $opportunity->degrees
                                ->map(fn($degree) => [
                                    'id' => $degree->id,
                                    'name' => $degree->name,
                                    'code' => $degree->code,
                                ])
                                ->values(),
                        ],
                    ];
                }
            ),
        ]);
    }


    /**
     * Save an opportunity.
     */
    public function store(
        Request $request,
        Opportunity $opportunity
    ): JsonResponse {
        if ($opportunity->status !== 'published') {
            return response()->json([
                'message' => 'This opportunity is not available for saving.',
            ], 422);
        }

        $saved = SavedOpportunity::firstOrCreate([
            'user_id' => $request->user()->id,
            'opportunity_id' => $opportunity->id,
        ]);

        return response()->json([
            'message' => 'Opportunity saved successfully.',
            'saved' => true,
            'data' => [
                'id' => $saved->id,
                'opportunity_id' => $opportunity->id,
            ],
        ], 201);
    }


    /**
     * Remove a saved opportunity.
     */
    public function destroy(
        Request $request,
        Opportunity $opportunity
    ): JsonResponse {
        $deleted = SavedOpportunity::query()
            ->where('user_id', $request->user()->id)
            ->where('opportunity_id', $opportunity->id)
            ->delete();

        if ($deleted === 0) {
            return response()->json([
                'message' => 'Opportunity is not saved.',
                'saved' => false,
            ], 404);
        }

        return response()->json([
            'message' => 'Opportunity removed from saved items.',
            'saved' => false,
        ]);
    }


    /**
     * Check whether an opportunity is saved.
     */
    public function show(
        Request $request,
        Opportunity $opportunity
    ): JsonResponse {
        $saved = SavedOpportunity::query()
            ->where('user_id', $request->user()->id)
            ->where('opportunity_id', $opportunity->id)
            ->exists();

        return response()->json([
            'saved' => $saved,
        ]);
    }
}
