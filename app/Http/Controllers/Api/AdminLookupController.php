<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\Degree;
use App\Models\Field;
use App\Models\FundingType;
use App\Models\Language;
use App\Models\OpportunityType;
use App\Models\Skill;
use App\Models\University;
use Illuminate\Http\JsonResponse;

class AdminLookupController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'universities' => University::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                    'country_id',
                ]),

            'countries' => Country::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]),

            'opportunity_types' => OpportunityType::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]),

            'funding_types' => FundingType::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]),

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

            'skills' => Skill::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]),

            'languages' => Language::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]),
        ]);
    }
}
