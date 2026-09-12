<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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
                'min:2',
                'max:3',
                'unique:countries,iso_code',
            ],
        ]);

        $country = Country::create($data);

        return response()->json([
            'message' => 'Country created successfully.',
            'country' => $country,
        ], 201);
    }

    public function update(Request $request, Country $country): JsonResponse
    {
        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('countries', 'name')
                    ->ignore($country->id),
            ],

            'code' => [
                'required',
                'string',
                'max:10',
                Rule::unique('countries', 'code')
                    ->ignore($country->id),
            ],

            'iso_code' => [
                'nullable',
                'string',
                'min:2',
                'max:3',
                Rule::unique('countries', 'iso_code')
                    ->ignore($country->id),
            ],
        ]);

        $country->update($data);

        return response()->json([
            'message' => 'Country updated successfully.',
            'country' => $country,
        ]);
    }

    public function destroy(Country $country): JsonResponse
    {
        if (
            $country->universities()->exists() ||
            $country->opportunities()->exists()
        ) {
            return response()->json([
                'message' => 'This country cannot be deleted because it is used by universities or opportunities.',
            ], 422);
        }

        $country->delete();

        return response()->json([
            'message' => 'Country deleted successfully.',
        ]);
    }
}
