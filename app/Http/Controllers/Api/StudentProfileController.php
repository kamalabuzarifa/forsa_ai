<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicRecord;
use App\Models\Country;
use App\Models\Degree;
use App\Models\Field;
use App\Models\Language;
use App\Models\Skill;
use App\Models\University;
use App\Models\UserProfile;
use App\Models\WorkExperience;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentProfileController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Show Profile
    |--------------------------------------------------------------------------
    */

    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $profile = UserProfile::firstOrCreate(
            [
                'user_id' => $user->id,
            ],
            [
                'profile_completion' => 10,
            ]
        );

        $this->calculateProfileCompletion($user);

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

        return $this->profileResponse($user);
    }


    /*
    |--------------------------------------------------------------------------
    | Update Personal Profile
    |--------------------------------------------------------------------------
    */

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

            UserProfile::updateOrCreate(
                [
                    'user_id' => $user->id,
                ],
                $profileData
            );

            $this->calculateProfileCompletion($user);
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
            ...$this->profileData($user),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Lookups
    |--------------------------------------------------------------------------
    */

    public function lookups(): JsonResponse
    {
        return response()->json([
            'countries' => Country::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                    'code',
                    'iso_code',
                ]),

            'degrees' => Degree::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                    'code',
                ]),

            'universities' => University::query()
                ->where('status', 'active')
                ->with('country')
                ->orderBy('name')
                ->get(),

            'fields' => Field::query()
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
                    'code',
                ]),

            'skills' => Skill::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                    'category',
                ]),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Academic Records
    |--------------------------------------------------------------------------
    */

    public function storeAcademicRecord(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'degree_id' => [
                'required',
                'exists:degrees,id',
            ],

            'university_id' => [
                'required',
                'exists:universities,id',
            ],

            'field_id' => [
                'required',
                'exists:fields,id',
            ],

            'gpa' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'gpa_scale' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'start_date' => [
                'nullable',
                'date',
            ],

            'end_date' => [
                'nullable',
                'date',
            ],

            'is_current' => [
                'nullable',
                'boolean',
            ],
        ]);

        DB::transaction(function () use ($user, $validated) {

            $user->academicRecords()->create(
                $validated
            );

            $this->calculateProfileCompletion($user);
        });

        return $this->profileResponseWithMessage(
            $user,
            'Academic record added successfully.'
        );
    }


    public function updateAcademicRecord(
        Request $request,
        int $id
    ): JsonResponse {

        $user = $request->user();

        $validated = $request->validate([
            'degree_id' => [
                'required',
                'exists:degrees,id',
            ],

            'university_id' => [
                'required',
                'exists:universities,id',
            ],

            'field_id' => [
                'required',
                'exists:fields,id',
            ],

            'gpa' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'gpa_scale' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'start_date' => [
                'nullable',
                'date',
            ],

            'end_date' => [
                'nullable',
                'date',
            ],

            'is_current' => [
                'nullable',
                'boolean',
            ],
        ]);

        $record = AcademicRecord::query()
            ->where('user_id', $user->id)
            ->findOrFail($id);

        $record->update($validated);

        $this->calculateProfileCompletion($user);

        return $this->profileResponseWithMessage(
            $user,
            'Academic record updated successfully.'
        );
    }


    public function destroyAcademicRecord(
        Request $request,
        int $id
    ): JsonResponse {

        $user = $request->user();

        $record = AcademicRecord::query()
            ->where('user_id', $user->id)
            ->findOrFail($id);

        $record->delete();

        $this->calculateProfileCompletion($user);

        return $this->profileResponseWithMessage(
            $user,
            'Academic record deleted successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Languages
    |--------------------------------------------------------------------------
    */

    public function storeLanguage(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'language_id' => [
                'required',
                'exists:languages,id',
            ],

            'level' => [
                'required',
                'string',
                'max:50',
            ],

            'test_type' => [
                'nullable',
                'string',
                'max:100',
            ],

            'score' => [
                'nullable',
                'numeric',
                'min:0',
            ],
        ]);

        DB::transaction(function () use ($user, $validated) {

            $user->languages()->syncWithoutDetaching([
                $validated['language_id'] => [
                    'level' => $validated['level'],
                    'test_type' => $validated['test_type'] ?? null,
                    'score' => $validated['score'] ?? null,
                ],
            ]);

            $this->calculateProfileCompletion($user);
        });

        return $this->profileResponseWithMessage(
            $user,
            'Language added successfully.'
        );
    }


    public function updateLanguage(
        Request $request,
        int $id
    ): JsonResponse {

        $user = $request->user();

        $validated = $request->validate([
            'level' => [
                'required',
                'string',
                'max:50',
            ],

            'test_type' => [
                'nullable',
                'string',
                'max:100',
            ],

            'score' => [
                'nullable',
                'numeric',
                'min:0',
            ],
        ]);

        $exists = $user->languages()
            ->where('languages.id', $id)
            ->exists();

        abort_if(
            !$exists,
            404,
            'Language not found.'
        );

        $user->languages()->updateExistingPivot(
            $id,
            [
                'level' => $validated['level'],
                'test_type' => $validated['test_type'] ?? null,
                'score' => $validated['score'] ?? null,
            ]
        );

        $this->calculateProfileCompletion($user);

        return $this->profileResponseWithMessage(
            $user,
            'Language updated successfully.'
        );
    }


    public function destroyLanguage(
        Request $request,
        int $id
    ): JsonResponse {

        $user = $request->user();

        $exists = $user->languages()
            ->where('languages.id', $id)
            ->exists();

        abort_if(
            !$exists,
            404,
            'Language not found.'
        );

        $user->languages()->detach($id);

        $this->calculateProfileCompletion($user);

        return $this->profileResponseWithMessage(
            $user,
            'Language deleted successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Skills
    |--------------------------------------------------------------------------
    */

    public function storeSkill(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'skill_id' => [
                'required',
                'exists:skills,id',
            ],

            'level' => [
                'required',
                'string',
                'max:50',
            ],

            'years_of_experience' => [
                'nullable',
                'numeric',
                'min:0',
            ],
        ]);

        DB::transaction(function () use ($user, $validated) {

            $user->skills()->syncWithoutDetaching([
                $validated['skill_id'] => [
                    'level' => $validated['level'],
                    'years_of_experience' =>
                    $validated['years_of_experience'] ?? null,
                ],
            ]);

            $this->calculateProfileCompletion($user);
        });

        return $this->profileResponseWithMessage(
            $user,
            'Skill added successfully.'
        );
    }


    public function updateSkill(
        Request $request,
        int $id
    ): JsonResponse {

        $user = $request->user();

        $validated = $request->validate([
            'level' => [
                'required',
                'string',
                'max:50',
            ],

            'years_of_experience' => [
                'nullable',
                'numeric',
                'min:0',
            ],
        ]);

        $exists = $user->skills()
            ->where('skills.id', $id)
            ->exists();

        abort_if(
            !$exists,
            404,
            'Skill not found.'
        );

        $user->skills()->updateExistingPivot(
            $id,
            [
                'level' => $validated['level'],
                'years_of_experience' =>
                $validated['years_of_experience'] ?? null,
            ]
        );

        $this->calculateProfileCompletion($user);

        return $this->profileResponseWithMessage(
            $user,
            'Skill updated successfully.'
        );
    }


    public function destroySkill(
        Request $request,
        int $id
    ): JsonResponse {

        $user = $request->user();

        $exists = $user->skills()
            ->where('skills.id', $id)
            ->exists();

        abort_if(
            !$exists,
            404,
            'Skill not found.'
        );

        $user->skills()->detach($id);

        $this->calculateProfileCompletion($user);

        return $this->profileResponseWithMessage(
            $user,
            'Skill deleted successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Work Experiences
    |--------------------------------------------------------------------------
    */

    public function storeWorkExperience(
        Request $request
    ): JsonResponse {

        $user = $request->user();

        $validated = $request->validate([
            'job_title' => [
                'required',
                'string',
                'max:255',
            ],

            'company' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'start_date' => [
                'nullable',
                'date',
            ],

            'end_date' => [
                'nullable',
                'date',
            ],

            'is_current' => [
                'nullable',
                'boolean',
            ],
        ]);

        DB::transaction(function () use ($user, $validated) {

            $user->workExperiences()->create(
                $validated
            );

            $this->calculateProfileCompletion($user);
        });

        return $this->profileResponseWithMessage(
            $user,
            'Work experience added successfully.'
        );
    }


    public function updateWorkExperience(
        Request $request,
        int $id
    ): JsonResponse {

        $user = $request->user();

        $validated = $request->validate([
            'job_title' => [
                'required',
                'string',
                'max:255',
            ],

            'company' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'start_date' => [
                'nullable',
                'date',
            ],

            'end_date' => [
                'nullable',
                'date',
            ],

            'is_current' => [
                'nullable',
                'boolean',
            ],
        ]);

        $experience = WorkExperience::query()
            ->where('user_id', $user->id)
            ->findOrFail($id);

        $experience->update($validated);

        $this->calculateProfileCompletion($user);

        return $this->profileResponseWithMessage(
            $user,
            'Work experience updated successfully.'
        );
    }


    public function destroyWorkExperience(
        Request $request,
        int $id
    ): JsonResponse {

        $user = $request->user();

        $experience = WorkExperience::query()
            ->where('user_id', $user->id)
            ->findOrFail($id);

        $experience->delete();

        $this->calculateProfileCompletion($user);

        return $this->profileResponseWithMessage(
            $user,
            'Work experience deleted successfully.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Profile Completion
    |--------------------------------------------------------------------------
    */

    private function calculateProfileCompletion($user): int
    {
        $user->loadMissing([
            'profile',
            'academicRecords',
            'languages',
            'skills',
            'workExperiences',
        ]);

        $profile = $user->profile;

        if (!$profile) {
            $profile = UserProfile::create([
                'user_id' => $user->id,
                'profile_completion' => 0,
            ]);

            $user->setRelation('profile', $profile);
        }

        $score = 0;

        /*
        |--------------------------------------------------------------------------
        | Personal Information
        |--------------------------------------------------------------------------
        */

        if (!empty($user->name)) {
            $score += 10;
        }

        if (!empty($profile->date_of_birth)) {
            $score += 10;
        }

        if (!empty($profile->nationality_id)) {
            $score += 10;
        }

        if (!empty($profile->country_of_residence_id)) {
            $score += 10;
        }

        if (!empty($profile->phone)) {
            $score += 10;
        }

        if (!empty($profile->bio)) {
            $score += 10;
        }

        /*
        |--------------------------------------------------------------------------
        | Academic
        |--------------------------------------------------------------------------
        */

        if ($user->academicRecords->count() > 0) {
            $score += 10;
        }

        /*
        |--------------------------------------------------------------------------
        | Languages
        |--------------------------------------------------------------------------
        */

        if ($user->languages->count() > 0) {
            $score += 10;
        }

        /*
        |--------------------------------------------------------------------------
        | Skills
        |--------------------------------------------------------------------------
        */

        if ($user->skills->count() > 0) {
            $score += 10;
        }

        /*
        |--------------------------------------------------------------------------
        | Work Experience
        |--------------------------------------------------------------------------
        */

        if ($user->workExperiences->count() > 0) {
            $score += 10;
        }

        $score = min(100, $score);

        $profile->update([
            'profile_completion' => $score,
        ]);

        return $score;
    }


    /*
    |--------------------------------------------------------------------------
    | Response Helpers
    |--------------------------------------------------------------------------
    */

    private function profileData($user): array
    {
        return [
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
        ];
    }


    private function profileResponse($user): JsonResponse
    {
        return response()->json(
            $this->profileData($user)
        );
    }


    private function profileResponseWithMessage(
        $user,
        string $message
    ): JsonResponse {

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
            'message' => $message,
            ...$this->profileData($user),
        ]);
    }
}
