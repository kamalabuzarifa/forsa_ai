<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateApplicationStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'status_id' => [
                'required',
                'integer',
                'exists:application_statuses,id',
            ],

            'notes' => [
                'sometimes',
                'nullable',
                'string',
                'max:5000',
            ],
        ];
    }
}
