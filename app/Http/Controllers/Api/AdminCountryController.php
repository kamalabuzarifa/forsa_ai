<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCountryController extends Controller
{
    public function index(): JsonResponse
    {
        $countries = Country::query()
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'code',
                'iso_code',
            ]);

        return response()->json([
            'countries' => $countries,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                'unique:countries,name',
            ],

            'code' => [
                'required',
                'string',
                'max:10',
                'unique:countries,code',
            ],

            'iso_code' => [
                'nullable',
                'string',
                'size:3',
                'unique:countries,iso_code',
            ],
        ]);

        $country = Country::create($data);

        return response()->json([
            'message' => 'Country created successfully.',
            'country' => $country,
        ], 201);
    }
}
