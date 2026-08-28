<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $user->load([
            'profile.nationality',
            'profile.countryOfResidence',
            'academicRecords.degree',
            'academicRecords.university',
            'academicRecords.field',
            'languages',
            'skills',
            'workExperiences',
        ]);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],

            'profile' => $user->profile,

            'academic_records' => $user->academicRecords,

            'languages' => $user->languages,

            'skills' => $user->skills,

            'work_experiences' => $user->workExperiences,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'date_of_birth' => [
                'nullable',
                'date',
            ],

            'nationality_id' => [
                'nullable',
                'exists:countries,id',
            ],

            'country_of_residence_id' => [
                'nullable',
                'exists:countries,id',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'bio' => [
                'nullable',
                'string',
                'max:5000',
            ],
        ]);

        DB::transaction(function () use ($user, $validated) {

            if (array_key_exists('name', $validated)) {
                $user->update([
                    'name' => $validated['name'],
                ]);
            }

            $profileData = collect($validated)
                ->except('name')
                ->toArray();

            if (!empty($profileData)) {
                UserProfile::updateOrCreate(
                    [
                        'user_id' => $user->id,
                    ],
                    $profileData
                );
            }
        });

        $user->load([
            'profile.nationality',
            'profile.countryOfResidence',
            'academicRecords.degree',
            'academicRecords.university',
            'academicRecords.field',
            'languages',
            'skills',
            'workExperiences',
        ]);

        return response()->json([
            'message' => 'Profile updated successfully.',

            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],

            'profile' => $user->profile,

            'academic_records' => $user->academicRecords,

            'languages' => $user->languages,

            'skills' => $user->skills,

            'work_experiences' => $user->workExperiences,
        ]);
    }

    public function lookups(): JsonResponse
    {
        return response()->json([
            'countries' => \App\Models\Country::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                    'code',
                    'iso_code',
                ]),

            'degrees' => \App\Models\Degree::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                    'code',
                ]),

            'universities' => \App\Models\University::query()
                ->where('status', 'active')
                ->with('country')
                ->orderBy('name')
                ->get(),

            'fields' => \App\Models\Field::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]),

            'languages' => \App\Models\Language::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                    'code',
                ]),

            'skills' => \App\Models\Skill::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                    'category',
                ]),
        ]);
    }
}
