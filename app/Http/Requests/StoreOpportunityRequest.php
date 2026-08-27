<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOpportunityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'slug' => [
                'required',
                'string',
                'max:255',
                'unique:opportunities,slug',
            ],

            'description' => [
                'required',
                'string',
            ],

            'university_id' => [
                'nullable',
                'integer',
                'exists:universities,id',
            ],

            'country_id' => [
                'required',
                'integer',
                'exists:countries,id',
            ],

            'opportunity_type_id' => [
                'required',
                'integer',
                'exists:opportunity_types,id',
            ],

            'funding_type_id' => [
                'nullable',
                'integer',
                'exists:funding_types,id',
            ],

            'application_url' => [
                'required',
                'url',
                'max:1000',
            ],

            'source_url' => [
                'nullable',
                'url',
                'max:1000',
            ],

            'deadline' => [
                'nullable',
                'date',
            ],

            'start_date' => [
                'nullable',
                'date',
            ],

            'end_date' => [
                'nullable',
                'date',
                'after_or_equal:start_date',
            ],

            'status' => [
                'required',
                Rule::in([
                    'draft',
                    'published',
                    'expired',
                    'archived',
                ]),
            ],

            'is_verified' => [
                'sometimes',
                'boolean',
            ],

            'field_ids' => [
                'sometimes',
                'array',
            ],

            'field_ids.*' => [
                'integer',
                'distinct',
                'exists:fields,id',
            ],

            'degree_ids' => [
                'sometimes',
                'array',
            ],

            'degree_ids.*' => [
                'integer',
                'distinct',
                'exists:degrees,id',
            ],

            'skills' => [
                'sometimes',
                'array',
            ],

            'skills.*.skill_id' => [
                'required',
                'integer',
                'distinct',
                'exists:skills,id',
            ],

            'skills.*.is_mandatory' => [
                'required',
                'boolean',
            ],

            'nationalities' => [
                'sometimes',
                'array',
            ],

            'nationalities.*.country_id' => [
                'required',
                'integer',
                'distinct',
                'exists:countries,id',
            ],

            'nationalities.*.eligibility_type' => [
                'required',
                Rule::in([
                    'eligible',
                    'restricted',
                    'excluded',
                ]),
            ],

            'requirements' => [
                'sometimes',
                'array',
            ],

            'requirements.*.requirement_type' => [
                'required',
                'string',
                'max:50',
            ],

            'requirements.*.language_id' => [
                'nullable',
                'integer',
                'exists:languages,id',
            ],

            'requirements.*.operator' => [
                'required',
                'string',
                'max:10',
            ],

            'requirements.*.value' => [
                'required',
                'string',
                'max:255',
            ],

            'requirements.*.unit' => [
                'nullable',
                'string',
                'max:50',
            ],

            'requirements.*.metadata' => [
                'nullable',
                'array',
            ],

            'requirements.*.is_mandatory' => [
                'required',
                'boolean',
            ],

            'requirements.*.description' => [
                'nullable',
                'string',
            ],
        ];
    }
}
