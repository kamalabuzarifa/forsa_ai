<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminOpportunityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'title' => $this->title,

            'slug' => $this->slug,

            'description' => $this->description,

            'university' => $this->whenLoaded(
                'university',
                fn() => [
                    'id' => $this->university->id,
                    'name' => $this->university->name,
                ]
            ),

            'country' => $this->whenLoaded(
                'country',
                fn() => [
                    'id' => $this->country->id,
                    'name' => $this->country->name,
                ]
            ),

            'opportunity_type' => $this->whenLoaded(
                'type',
                fn() => [
                    'id' => $this->type->id,
                    'name' => $this->type->name,
                ]
            ),

            'funding_type' => $this->whenLoaded(
                'fundingType',
                fn() => [
                    'id' => $this->fundingType->id,
                    'name' => $this->fundingType->name,
                ]
            ),

            'application_url' => $this->application_url,

            'source_url' => $this->source_url,

            'deadline' => $this->deadline,

            'start_date' => $this->start_date,

            'end_date' => $this->end_date,

            'status' => $this->status,

            'is_verified' => $this->is_verified,

            'created_by' => $this->created_by,

            'fields' => $this->whenLoaded(
                'fields',
                fn() => $this->fields
                    ->map(fn($field) => [
                        'id' => $field->id,
                        'name' => $field->name,
                    ])
                    ->values()
            ),

            'degrees' => $this->whenLoaded(
                'degrees',
                fn() => $this->degrees
                    ->map(fn($degree) => [
                        'id' => $degree->id,
                        'name' => $degree->name,
                        'code' => $degree->code,
                    ])
                    ->values()
            ),

            'skills' => $this->whenLoaded(
                'skills',
                fn() => $this->skills
                    ->map(fn($skill) => [
                        'id' => $skill->id,
                        'name' => $skill->name,
                        'category' => $skill->category,
                        'is_mandatory' =>
                        (bool) $skill->pivot->is_mandatory,
                    ])
                    ->values()
            ),

            'nationalities' => $this->whenLoaded(
                'opportunityNationalities',
                fn() => $this->opportunityNationalities
                    ->map(fn($nationality) => [
                        'country_id' =>
                        $nationality->country_id,

                        'country_name' =>
                        $nationality->country?->name,

                        'eligibility_type' =>
                        $nationality->eligibility_type,
                    ])
                    ->values()
            ),

            'requirements' => $this->whenLoaded(
                'requirements',
                fn() => $this->requirements
                    ->map(fn($requirement) => [
                        'id' => $requirement->id,

                        'requirement_type' =>
                        $requirement->requirement_type,

                        'language_id' =>
                        $requirement->language_id,

                        'language_name' =>
                        $requirement->language?->name,

                        'operator' =>
                        $requirement->operator,

                        'value' =>
                        $requirement->value,

                        'unit' =>
                        $requirement->unit,

                        'metadata' =>
                        $requirement->metadata,

                        'is_mandatory' =>
                        (bool) $requirement->is_mandatory,

                        'description' =>
                        $requirement->description,
                    ])
                    ->values()
            ),

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,
        ];
    }
}
