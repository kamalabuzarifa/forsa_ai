<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\University;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUniversityController extends Controller
{
    public function index(): JsonResponse
    {
        $universities = University::query()
            ->with('country:id,name')
            ->orderBy('name')
            ->get([
                'id',
                'country_id',
                'name',
                'website',
                'description',
                'logo',
                'status',
            ]);

        return response()->json([
            'universities' => $universities,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'country_id' => [
                'required',
                'integer',
                'exists:countries,id',
            ],

            'name' => [
                'required',
                'string',
                'max:255',
                'unique:universities,name',
            ],

            'website' => [
                'nullable',
                'url',
                'max:500',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'logo' => [
                'nullable',
                'string',
                'max:500',
            ],

            'status' => [
                'required',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],
        ]);

        $university = University::create($data);

        $university->load('country:id,name');

        return response()->json([
            'message' => 'University created successfully.',
            'university' => $university,
        ], 201);
    }
}
