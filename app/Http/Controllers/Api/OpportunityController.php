<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminOpportunityResource;
use App\Models\Opportunity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class OpportunityController extends Controller
{
    /* =========================================================
       GET ALL PUBLISHED OPPORTUNITIES (SEARCH & FILTERS)
    ========================================================= */

    public function index(
        Request $request
    ): AnonymousResourceCollection {

        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'q' => ['nullable', 'string', 'max:100'],
            'opportunity_type' => ['nullable', 'string', 'max:100'],
            'opportunity_type_id' => ['nullable', 'integer'],
            'country' => ['nullable', 'string', 'max:100'],
            'country_id' => ['nullable', 'integer'],
            'funding_type' => ['nullable', 'string', 'max:100'],
            'funding_type_id' => ['nullable', 'integer'],
            'funding' => ['nullable', 'string', 'max:100'],
            'degree' => ['nullable', 'string', 'max:100'],
            'degree_id' => ['nullable', 'integer'],
            'field' => ['nullable', 'string', 'max:100'],
            'field_id' => ['nullable', 'integer'],
            'university_id' => ['nullable', 'integer'],
            'study_mode' => [
                'nullable',
                'string',
                Rule::in(['on_campus', 'online', 'hybrid']),
            ],
            'is_verified' => ['nullable', 'boolean'],
            'upcoming_only' => ['nullable', 'boolean'],
            'sort_by' => [
                'nullable',
                'string',
                Rule::in([
                    'latest',
                    'oldest',
                    'deadline_asc',
                    'deadline_desc',
                    'title_asc',
                    'title_desc',
                ]),
            ],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $query = Opportunity::query()
            ->where('status', 'published');

        /*
        |--------------------------------------------------------------------------
        | Search Keyword
        |--------------------------------------------------------------------------
        */

        $searchTerm = $validated['search'] ?? $validated['q'] ?? null;

        if (!empty($searchTerm)) {
            $escaped = '%' . addcslashes($searchTerm, '%_') . '%';

            $query->where(function ($q) use ($escaped) {
                $q->where('title', 'like', $escaped)
                    ->orWhere('description', 'like', $escaped)
                    ->orWhereHas('university', fn($uq) => $uq->where('name', 'like', $escaped))
                    ->orWhereHas('country', fn($cq) => $cq->where('name', 'like', $escaped));
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Opportunity Type Filter
        |--------------------------------------------------------------------------
        */

        if (!empty($validated['opportunity_type_id'])) {
            $query->where('opportunity_type_id', $validated['opportunity_type_id']);
        } elseif (!empty($validated['opportunity_type'])) {
            $typeVal = $validated['opportunity_type'];

            if (is_numeric($typeVal)) {
                $query->where('opportunity_type_id', (int) $typeVal);
            } else {
                $query->whereHas('type', function ($tq) use ($typeVal) {
                    $tq->where('code', $typeVal)
                        ->orWhere('name', 'like', $typeVal);
                });
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Country Filter
        |--------------------------------------------------------------------------
        */

        if (!empty($validated['country_id'])) {
            $query->where('country_id', $validated['country_id']);
        } elseif (!empty($validated['country'])) {
            $countryVal = $validated['country'];

            if (is_numeric($countryVal)) {
                $query->where('country_id', (int) $countryVal);
            } else {
                $query->whereHas('country', function ($cq) use ($countryVal) {
                    $cq->where('code', $countryVal)
                        ->orWhere('iso_code', $countryVal)
                        ->orWhere('name', 'like', $countryVal);
                });
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Funding Type Filter
        |--------------------------------------------------------------------------
        */

        $fundingVal = $validated['funding_type_id']
            ?? $validated['funding_type']
            ?? $validated['funding']
            ?? null;

        if (!empty($fundingVal) && $fundingVal !== 'all') {
            if (is_numeric($fundingVal)) {
                $query->where('funding_type_id', (int) $fundingVal);
            } else {
                $query->whereHas('fundingType', function ($fq) use ($fundingVal) {
                    $fq->where('code', $fundingVal)
                        ->orWhere('name', 'like', $fundingVal);
                });
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Degree Filter
        |--------------------------------------------------------------------------
        */

        $degreeVal = $validated['degree_id'] ?? $validated['degree'] ?? null;

        if (!empty($degreeVal) && $degreeVal !== 'all') {
            if (is_numeric($degreeVal)) {
                $query->whereHas('degrees', fn($dq) => $dq->where('degrees.id', (int) $degreeVal));
            } else {
                $query->whereHas('degrees', function ($dq) use ($degreeVal) {
                    $dq->where('degrees.code', $degreeVal)
                        ->orWhere('degrees.name', 'like', $degreeVal);
                });
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Field Filter
        |--------------------------------------------------------------------------
        */

        $fieldVal = $validated['field_id'] ?? $validated['field'] ?? null;

        if (!empty($fieldVal) && $fieldVal !== 'all') {
            if (is_numeric($fieldVal)) {
                $query->whereHas('fields', fn($fq) => $fq->where('fields.id', (int) $fieldVal));
            } else {
                $query->whereHas('fields', function ($fq) use ($fieldVal) {
                    $fq->where('fields.name', 'like', $fieldVal);
                });
            }
        }

        /*
        |--------------------------------------------------------------------------
        | University Filter
        |--------------------------------------------------------------------------
        */

        if (!empty($validated['university_id'])) {
            $query->where('university_id', $validated['university_id']);
        }

        /*
        |--------------------------------------------------------------------------
        | Study Mode Filter
        |--------------------------------------------------------------------------
        */

        if (!empty($validated['study_mode'])) {
            $query->where('study_mode', $validated['study_mode']);
        }

        /*
        |--------------------------------------------------------------------------
        | Verified Only
        |--------------------------------------------------------------------------
        */

        if (isset($validated['is_verified']) && $request->boolean('is_verified')) {
            $query->where('is_verified', true);
        }

        /*
        |--------------------------------------------------------------------------
        | Upcoming Only Filter
        |--------------------------------------------------------------------------
        */

        if ($request->boolean('upcoming_only', false)) {
            $query->where(function ($dq) {
                $dq->whereNull('deadline')
                    ->orWhere('deadline', '>=', now());
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */

        $sortBy = $validated['sort_by'] ?? 'latest';

        match ($sortBy) {
            'oldest' => $query->oldest('id'),
            'deadline_asc' => $query->orderByRaw('deadline IS NULL, deadline ASC'),
            'deadline_desc' => $query->orderByRaw('deadline IS NULL, deadline DESC'),
            'title_asc' => $query->orderBy('title', 'asc'),
            'title_desc' => $query->orderBy('title', 'desc'),
            default => $query->latest('id'),
        };

        /*
        |--------------------------------------------------------------------------
        | Pagination & Eager Loading
        |--------------------------------------------------------------------------
        */

        $perPage = min(
            max(
                (int) ($validated['per_page'] ?? 15),
                1
            ),
            50
        );

        $opportunities = $query
            ->with([
                'university',
                'country',
                'type',
                'fundingType',
                'fields',
                'degrees',
                'skills',
                'opportunityNationalities.country',
                'requirements.language',
            ])
            ->paginate($perPage);

        return AdminOpportunityResource::collection(
            $opportunities
        );
    }


    /* =========================================================
       GET SINGLE PUBLISHED OPPORTUNITY
       Supports ID and SLUG
    ========================================================= */

    public function show(
        string $identifier
    ): AdminOpportunityResource {

        $opportunity = Opportunity::query()
            ->where('status', 'published')
            ->where(function ($query) use ($identifier) {

                $query
                    ->where('id', $identifier)
                    ->orWhere('slug', $identifier);
            })
            ->with([
                'university',
                'country',
                'type',
                'fundingType',
                'fields',
                'degrees',
                'skills',
                'opportunityNationalities.country',
                'requirements.language',
            ])
            ->firstOrFail();

        return new AdminOpportunityResource(
            $opportunity
        );
    }
}
