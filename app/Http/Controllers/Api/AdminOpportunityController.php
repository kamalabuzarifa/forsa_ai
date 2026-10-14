<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOpportunityRequest;
use App\Http\Requests\UpdateOpportunityRequest;
use App\Http\Resources\AdminOpportunityResource;
use App\Models\Opportunity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminOpportunityController extends Controller
{
    public function index(
        Request $request
    ) {
        $opportunities = Opportunity::query()
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
            ->latest('id')
            ->paginate(
                min(
                    max(
                        (int) $request->query('per_page', 15),
                        1
                    ),
                    50
                )
            );

        return AdminOpportunityResource::collection(
            $opportunities
        );
    }

    public function store(
        StoreOpportunityRequest $request
    ): AdminOpportunityResource {
        $data = $request->validated();

        $opportunity = DB::transaction(function () use (
            $data,
            $request
        ) {
            $opportunity = Opportunity::create([
                'title' => $data['title'],
                'slug' => $data['slug'],
                'description' => $data['description'],
                'university_id' =>
                $data['university_id'] ?? null,
                'country_id' => $data['country_id'],
                'opportunity_type_id' =>
                $data['opportunity_type_id'],
                'funding_type_id' =>
                $data['funding_type_id'] ?? null,
                'annual_tuition' =>
                $data['annual_tuition'] ?? null,
                'currency' =>
                $data['currency'] ?? null,
                'study_mode' =>
                $data['study_mode'] ?? null,
                'application_url' =>
                $data['application_url'],
                'source_url' =>
                $data['source_url'] ?? null,
                'deadline' =>
                $data['deadline'] ?? null,
                'start_date' =>
                $data['start_date'] ?? null,
                'end_date' =>
                $data['end_date'] ?? null,
                'status' =>
                $data['status'],
                'is_verified' =>
                $data['is_verified'] ?? false,
                'created_by' =>
                $request->user()->id,
            ]);

            $this->syncRelations(
                $opportunity,
                $data
            );

            return $opportunity;
        });

        $this->loadRelations($opportunity);

        return new AdminOpportunityResource(
            $opportunity
        );
    }

    public function show(
        Opportunity $opportunity
    ): AdminOpportunityResource {
        $this->loadRelations($opportunity);

        return new AdminOpportunityResource(
            $opportunity
        );
    }

    public function update(
        UpdateOpportunityRequest $request,
        Opportunity $opportunity
    ): AdminOpportunityResource {
        $data = $request->validated();

        DB::transaction(function () use (
            $data,
            $opportunity
        ) {
            $basicFields = [
                'title',
                'slug',
                'description',
                'university_id',
                'country_id',
                'opportunity_type_id',
                'funding_type_id',
                'annual_tuition',
                'currency',
                'study_mode',
                'application_url',
                'source_url',
                'deadline',
                'start_date',
                'end_date',
                'status',
                'is_verified',
            ];

            $updateData = [];

            foreach ($basicFields as $field) {
                if (array_key_exists($field, $data)) {
                    $updateData[$field] =
                        $data[$field];
                }
            }

            if (!empty($updateData)) {
                $opportunity->update(
                    $updateData
                );
            }

            $this->syncRelations(
                $opportunity,
                $data,
                false
            );
        });

        $this->loadRelations($opportunity);

        return new AdminOpportunityResource(
            $opportunity->fresh()
        );
    }

    public function destroy(
        Opportunity $opportunity
    ): JsonResponse {
        $opportunity->delete();

        return response()->json([
            'message' =>
            'Opportunity deleted successfully.',
        ]);
    }

    private function syncRelations(
        Opportunity $opportunity,
        array $data,
        bool $isCreate = true
    ): void {
        if (
            $isCreate ||
            array_key_exists(
                'field_ids',
                $data
            )
        ) {
            $opportunity->fields()->sync(
                $data['field_ids'] ?? []
            );
        }

        if (
            $isCreate ||
            array_key_exists(
                'degree_ids',
                $data
            )
        ) {
            $opportunity->degrees()->sync(
                $data['degree_ids'] ?? []
            );
        }

        if (
            $isCreate ||
            array_key_exists(
                'skills',
                $data
            )
        ) {
            $skills = [];

            foreach (
                $data['skills'] ?? []
                as $skill
            ) {
                $skills[$skill['skill_id']] = [
                    'is_mandatory' =>
                    $skill['is_mandatory'],
                ];
            }

            $opportunity->skills()->sync(
                $skills
            );
        }

        if (
            $isCreate ||
            array_key_exists(
                'nationalities',
                $data
            )
        ) {
            $opportunity
                ->opportunityNationalities()
                ->delete();

            foreach (
                $data['nationalities'] ?? []
                as $nationality
            ) {
                $opportunity
                    ->opportunityNationalities()
                    ->create([
                        'country_id' =>
                        $nationality['country_id'],

                        'eligibility_type' =>
                        $nationality['eligibility_type'],
                    ]);
            }
        }

        if (
            $isCreate ||
            array_key_exists(
                'requirements',
                $data
            )
        ) {
            $opportunity
                ->requirements()
                ->delete();

            foreach (
                $data['requirements'] ?? []
                as $requirement
            ) {
                $opportunity
                    ->requirements()
                    ->create([
                        'language_id' =>
                        $requirement['language_id'] ?? null,

                        'requirement_type' =>
                        $requirement['requirement_type'],

                        'operator' =>
                        $requirement['operator'],

                        'value' =>
                        $requirement['value'],

                        'unit' =>
                        $requirement['unit']
                            ?? null,

                        'metadata' =>
                        $requirement['metadata']
                            ?? null,

                        'is_mandatory' =>
                        $requirement['is_mandatory'],

                        'description' =>
                        $requirement['description'] ?? null,
                    ]);
            }
        }
    }

    private function loadRelations(
        Opportunity $opportunity
    ): void {
        $opportunity->load([
            'university',
            'country',
            'type',
            'fundingType',
            'fields',
            'degrees',
            'skills',
            'opportunityNationalities.country',
            'requirements.language',
        ]);
    }
}
