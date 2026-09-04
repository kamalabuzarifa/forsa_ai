<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\University;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UniversityController extends Controller
{
    /**
     * Get all active universities.
     */
    public function index(Request $request): JsonResponse
    {
        $universities = University::query()
            ->where('status', 'active')

            /*
            |--------------------------------------------------------------------------
            | Country
            |--------------------------------------------------------------------------
            */
            ->with([
                'country:id,name',
            ])

            /*
            |--------------------------------------------------------------------------
            | Count published opportunities
            |--------------------------------------------------------------------------
            */
            ->withCount([
                'opportunities' => function ($query) {
                    $query->where(
                        'status',
                        'published'
                    );
                },
            ])

            /*
            |--------------------------------------------------------------------------
            | Order
            |--------------------------------------------------------------------------
            */
            ->orderBy('name')

            /*
            |--------------------------------------------------------------------------
            | University columns
            |--------------------------------------------------------------------------
            */
            ->get([
                'id',
                'country_id',
                'name',
                'website',
                'description',
                'logo',
                'status',
                'created_at',
                'updated_at',
            ]);


        return response()->json([
            'universities' => $universities,
        ]);
    }


    /**
     * Get university details.
     */
    public function show(
        Request $request,
        University $university
    ): JsonResponse {

        /*
        |--------------------------------------------------------------------------
        | Only active universities
        |--------------------------------------------------------------------------
        */
        if (
            $university->status !== 'active'
        ) {

            return response()->json([
                'message' =>
                'University not found.',
            ], 404);
        }


        /*
        |--------------------------------------------------------------------------
        | Load country
        |--------------------------------------------------------------------------
        */
        $university->load([
            'country:id,name',
        ]);


        /*
        |--------------------------------------------------------------------------
        | Count published opportunities
        |--------------------------------------------------------------------------
        */
        $university->loadCount([
            'opportunities' => function ($query) {
                $query->where(
                    'status',
                    'published'
                );
            },
        ]);


        return response()->json([
            'university' => $university,
        ]);
    }


    /**
     * Get published programs for a university.
     */
    public function programs(
        Request $request,
        University $university
    ): JsonResponse {

        /*
        |--------------------------------------------------------------------------
        | Only active universities
        |--------------------------------------------------------------------------
        */
        if (
            $university->status !== 'active'
        ) {

            return response()->json([
                'message' =>
                'University not found.',
            ], 404);
        }


        /*
        |--------------------------------------------------------------------------
        | Published programs
        |--------------------------------------------------------------------------
        */
        $programs = $university
            ->opportunities()
            ->where(
                'status',
                'published'
            )
            ->with([
                'university',
                'country',
                'type',
                'fundingType',
                'fields',
                'degrees',
            ])
            ->latest('id')
            ->get();


        return response()->json([
            'university' => [
                'id' =>
                $university->id,

                'name' =>
                $university->name,
            ],

            'programs' =>
            $programs,
        ]);
    }
}
