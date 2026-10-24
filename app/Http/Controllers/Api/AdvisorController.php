<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\Degree;
use App\Models\Field;
use App\Models\Opportunity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdvisorController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Advisor Lookups
    |--------------------------------------------------------------------------
    */

    public function lookups(): JsonResponse
    {
        return response()->json([
            'fields' => Field::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]),

            'degrees' => Degree::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                    'code',
                ]),

            'countries' => Country::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                    'code',
                    'iso_code',
                ]),

            'study_modes' => [
                [
                    'value' => 'on_campus',
                    'label' => 'On Campus',
                ],
                [
                    'value' => 'online',
                    'label' => 'Online',
                ],
                [
                    'value' => 'hybrid',
                    'label' => 'Hybrid',
                ],
            ],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Recommend Opportunities
    |--------------------------------------------------------------------------
    */

    public function recommend(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'field_id' => [
                'nullable',
                'exists:fields,id',
            ],

            'degree_id' => [
                'nullable',
                'exists:degrees,id',
            ],

            'country_id' => [
                'nullable',
                'exists:countries,id',
            ],

            'study_mode' => [
                'nullable',
                'in:on_campus,online,hybrid',
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Base Query
        |--------------------------------------------------------------------------
        */

        $query = Opportunity::query()
            ->where('status', 'published')

            ->where(function ($query) {
                $query
                    ->whereNull('deadline')
                    ->orWhere('deadline', '>=', now());
            })

            ->with([
                'university',
                'country',
                'type',
                'fundingType',
                'fields',
                'degrees',
                'skills',
            ]);


        /*
        |--------------------------------------------------------------------------
        | Field
        |--------------------------------------------------------------------------
        */

        if (!empty($validated['field_id'])) {

            $query->whereHas(
                'fields',
                function ($query) use ($validated) {

                    $query->where(
                        'fields.id',
                        $validated['field_id']
                    );
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Degree
        |--------------------------------------------------------------------------
        */

        if (!empty($validated['degree_id'])) {

            $query->whereHas(
                'degrees',
                function ($query) use ($validated) {

                    $query->where(
                        'degrees.id',
                        $validated['degree_id']
                    );
                }
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Country
        |--------------------------------------------------------------------------
        */

        if (!empty($validated['country_id'])) {

            $query->where(
                'country_id',
                $validated['country_id']
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Study Mode
        |--------------------------------------------------------------------------
        */

        if (!empty($validated['study_mode'])) {

            $query->where(function ($query) use ($validated) {

                $query
                    ->whereNull('study_mode')
                    ->orWhere(
                        'study_mode',
                        $validated['study_mode']
                    );
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Results
        |--------------------------------------------------------------------------
        */

        $opportunities = $query
            ->orderByRaw(
                'deadline IS NULL, deadline ASC'
            )
            ->limit(50)
            ->get();


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'preferences' => $validated,

            'count' => $opportunities->count(),

            'data' => $opportunities,
        ]);
    }
}
