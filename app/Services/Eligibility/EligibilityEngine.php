<?php

namespace App\Services\Eligibility;

use App\Models\Opportunity;
use App\Models\User;

class EligibilityEngine
{
    public function check(
        User $user,
        Opportunity $opportunity
    ): array {
        $user->loadMissing([
            'profile.nationality',
            'academicRecords.degree',
            'academicRecords.university',
            'academicRecords.field',
            'languages',
            'skills',
            'workExperiences',
        ]);

        $opportunity->loadMissing([
            'fields',
            'degrees',
            'nationalities',
            'requirements.language',
            'skills',
        ]);

        $checks = [];
        $passed = true;

        $this->checkNationality(
            $user,
            $opportunity,
            $checks,
            $passed
        );

        $this->checkAcademicField(
            $user,
            $opportunity,
            $checks,
            $passed
        );

        $this->checkDegree(
            $user,
            $opportunity,
            $checks,
            $passed
        );

        $this->checkGpa(
            $user,
            $opportunity,
            $checks,
            $passed
        );

        $this->checkLanguages(
            $user,
            $opportunity,
            $checks,
            $passed
        );

        $this->checkLanguageScores(
            $user,
            $opportunity,
            $checks,
            $passed
        );

        $this->checkAge(
            $user,
            $opportunity,
            $checks,
            $passed
        );

        $this->checkExperience(
            $user,
            $opportunity,
            $checks,
            $passed
        );

        $this->checkSkills(
            $user,
            $opportunity,
            $checks,
            $passed
        );

        return [
            'eligible' => $passed,

            'status' => $passed
                ? 'eligible'
                : 'not_eligible',

            'user_id' => $user->id,

            'opportunity_id' => $opportunity->id,

            'checks' => $checks,

            'failed_checks' => collect($checks)
                ->where('passed', false)
                ->values()
                ->all(),
        ];
    }

    private function checkNationality(
        User $user,
        Opportunity $opportunity,
        array &$checks,
        bool &$passed
    ): void {
        $nationalityId = $user->profile?->nationality_id;

        if (!$nationalityId) {
            $checks[] = [
                'type' => 'nationality',
                'passed' => false,
                'message' => 'User nationality is missing.',
            ];

            $passed = false;

            return;
        }

        $rules = $opportunity->nationalities;

        if ($rules->isEmpty()) {
            $checks[] = [
                'type' => 'nationality',
                'passed' => true,
                'message' => 'No nationality restriction is defined.',
            ];

            return;
        }

        $excluded = $rules->first(
            fn($rule) =>
            (int) $rule->country_id === (int) $nationalityId &&
                $rule->eligibility_type === 'excluded'
        );

        if ($excluded) {
            $checks[] = [
                'type' => 'nationality',
                'passed' => false,
                'message' => 'User nationality is excluded.',
            ];

            $passed = false;

            return;
        }

        $eligibleCountries = $rules->where(
            'eligibility_type',
            'eligible'
        );

        if (
            $eligibleCountries->isNotEmpty() &&
            !$eligibleCountries->contains(
                'country_id',
                $nationalityId
            )
        ) {
            $checks[] = [
                'type' => 'nationality',
                'passed' => false,
                'message' => 'User nationality is not eligible for this opportunity.',
            ];

            $passed = false;

            return;
        }

        $checks[] = [
            'type' => 'nationality',
            'passed' => true,
            'message' => 'User nationality satisfies the opportunity rules.',
        ];
    }

    private function checkAcademicField(
        User $user,
        Opportunity $opportunity,
        array &$checks,
        bool &$passed
    ): void {
        if ($opportunity->fields->isEmpty()) {
            $checks[] = [
                'type' => 'field',
                'passed' => true,
                'message' => 'No academic field restriction is defined.',
            ];

            return;
        }

        $record = $this->getAcademicRecord($user);

        if (!$record || !$record->field_id) {
            $checks[] = [
                'type' => 'field',
                'passed' => false,
                'message' => 'User academic field is missing.',
            ];

            $passed = false;

            return;
        }

        $matches = $opportunity->fields->contains(
            'id',
            $record->field_id
        );

        if (!$matches) {
            $checks[] = [
                'type' => 'field',
                'passed' => false,
                'message' => 'User academic field does not match the opportunity fields.',
                'user_field' => $record->field?->name,
                'required_fields' => $opportunity->fields
                    ->pluck('name')
                    ->values()
                    ->all(),
            ];

            $passed = false;

            return;
        }

        $checks[] = [
            'type' => 'field',
            'passed' => true,
            'message' => 'User academic field matches the opportunity.',
            'user_field' => $record->field?->name,
        ];
    }

    private function checkDegree(
        User $user,
        Opportunity $opportunity,
        array &$checks,
        bool &$passed
    ): void {
        $requirement = $opportunity->requirements
            ->firstWhere('requirement_type', 'degree');

        if (!$requirement) {
            $checks[] = [
                'type' => 'degree',
                'passed' => true,
                'message' => 'No degree requirement is defined.',
            ];

            return;
        }

        $record = $this->getAcademicRecord($user);

        if (!$record || !$record->degree) {
            $checks[] = [
                'type' => 'degree',
                'passed' => false,
                'message' => 'User degree information is missing.',
            ];

            if ($requirement->is_mandatory) {
                $passed = false;
            }

            return;
        }

        $actual = strtoupper(
            $record->degree->code
        );

        $required = strtoupper(
            $requirement->value
        );

        $result = $this->compare(
            $actual,
            $requirement->operator,
            $required
        );

        $checks[] = [
            'type' => 'degree',
            'passed' => $result,
            'message' => $result
                ? 'User degree satisfies the requirement.'
                : 'User degree does not satisfy the requirement.',
            'actual' => $actual,
            'required' => $required,
            'operator' => $requirement->operator,
        ];

        if (!$result && $requirement->is_mandatory) {
            $passed = false;
        }
    }

    private function checkGpa(
        User $user,
        Opportunity $opportunity,
        array &$checks,
        bool &$passed
    ): void {
        $requirement = $opportunity->requirements
            ->firstWhere('requirement_type', 'gpa');

        if (!$requirement) {
            $checks[] = [
                'type' => 'gpa',
                'passed' => true,
                'message' => 'No GPA requirement is defined.',
            ];

            return;
        }

        $record = $this->getAcademicRecord($user);

        if (
            !$record ||
            $record->gpa === null
        ) {
            $checks[] = [
                'type' => 'gpa',
                'passed' => false,
                'message' => 'User GPA is missing.',
            ];

            if ($requirement->is_mandatory) {
                $passed = false;
            }

            return;
        }

        $actual = (float) $record->gpa;
        $required = (float) $requirement->value;

        $result = $this->compare(
            $actual,
            $requirement->operator,
            $required
        );

        $checks[] = [
            'type' => 'gpa',
            'passed' => $result,
            'message' => $result
                ? 'User GPA satisfies the requirement.'
                : 'User GPA does not satisfy the requirement.',
            'actual' => $actual,
            'required' => $required,
            'operator' => $requirement->operator,
            'unit' => $requirement->unit,
        ];

        if (!$result && $requirement->is_mandatory) {
            $passed = false;
        }
    }

    private function checkLanguages(
        User $user,
        Opportunity $opportunity,
        array &$checks,
        bool &$passed
    ): void {
        $requirements = $opportunity->requirements
            ->where('requirement_type', 'language');

        if ($requirements->isEmpty()) {
            return;
        }

        $levelOrder = [
            'A1' => 1,
            'A2' => 2,
            'B1' => 3,
            'B2' => 4,
            'C1' => 5,
            'C2' => 6,
            'Native' => 7,
        ];

        foreach ($requirements as $requirement) {
            $requiredLevel = strtoupper(
                $requirement->value
            );

            $language = null;

            if ($requirement->language_id) {
                $language = $user->languages
                    ->firstWhere(
                        'id',
                        $requirement->language_id
                    );
            } else {
                $language = $user->languages
                    ->firstWhere(
                        'code',
                        'en'
                    );
            }

            if (!$language) {
                $checks[] = [
                    'type' => 'language',
                    'passed' => false,
                    'message' => 'Required language information is missing.',
                    'language' => $requirement->language?->name
                        ?? 'English',
                    'required' => $requiredLevel,
                    'operator' => $requirement->operator,
                    'unit' => $requirement->unit,
                ];

                if ($requirement->is_mandatory) {
                    $passed = false;
                }

                continue;
            }

            $actualLevel = strtoupper(
                $language->pivot->level
            );

            $actualRank = $levelOrder[$actualLevel] ?? 0;

            $requiredRank = $levelOrder[$requiredLevel]
                ?? PHP_INT_MAX;

            $result = $this->compare(
                $actualRank,
                $requirement->operator,
                $requiredRank
            );

            $checks[] = [
                'type' => 'language',
                'passed' => $result,
                'message' => $result
                    ? 'Language level satisfies the requirement.'
                    : 'Language level does not satisfy the requirement.',
                'language' => $language->name,
                'actual' => $actualLevel,
                'required' => $requiredLevel,
                'operator' => $requirement->operator,
                'unit' => $requirement->unit,
            ];

            if (!$result && $requirement->is_mandatory) {
                $passed = false;
            }
        }
    }

    private function checkLanguageScores(
        User $user,
        Opportunity $opportunity,
        array &$checks,
        bool &$passed
    ): void {
        $requirements = $opportunity->requirements
            ->where('requirement_type', 'language_score');

        if ($requirements->isEmpty()) {
            return;
        }

        foreach ($requirements as $requirement) {
            $language = null;

            if ($requirement->language_id) {
                $language = $user->languages
                    ->firstWhere(
                        'id',
                        $requirement->language_id
                    );
            }

            if (!$language) {
                $checks[] = [
                    'type' => 'language_score',
                    'passed' => false,
                    'message' => 'Required language information is missing.',
                    'language' => $requirement->language?->name,
                    'required' => (float) $requirement->value,
                    'operator' => $requirement->operator,
                    'unit' => $requirement->unit,
                    'test_type' => $requirement->metadata['test_type']
                        ?? null,
                ];

                if ($requirement->is_mandatory) {
                    $passed = false;
                }

                continue;
            }

            $userScore = $language->pivot->score;

            if ($userScore === null) {
                $checks[] = [
                    'type' => 'language_score',
                    'passed' => false,
                    'message' => 'Language test score is missing.',
                    'language' => $language->name,
                    'required' => (float) $requirement->value,
                    'operator' => $requirement->operator,
                    'unit' => $requirement->unit,
                    'test_type' => $requirement->metadata['test_type']
                        ?? null,
                ];

                if ($requirement->is_mandatory) {
                    $passed = false;
                }

                continue;
            }

            $actual = (float) $userScore;

            $required = (float) $requirement->value;

            $result = $this->compare(
                $actual,
                $requirement->operator,
                $required
            );

            $checks[] = [
                'type' => 'language_score',
                'passed' => $result,
                'message' => $result
                    ? 'Language test score satisfies the requirement.'
                    : 'Language test score does not satisfy the requirement.',
                'language' => $language->name,
                'actual' => $actual,
                'required' => $required,
                'operator' => $requirement->operator,
                'unit' => $requirement->unit,
                'test_type' => $requirement->metadata['test_type']
                    ?? null,
            ];

            if (!$result && $requirement->is_mandatory) {
                $passed = false;
            }
        }
    }

    private function checkAge(
        User $user,
        Opportunity $opportunity,
        array &$checks,
        bool &$passed
    ): void {
        $requirements = $opportunity->requirements
            ->where('requirement_type', 'age');

        if ($requirements->isEmpty()) {
            return;
        }

        $dateOfBirth = $user->profile?->date_of_birth;

        if (!$dateOfBirth) {
            foreach ($requirements as $requirement) {
                $checks[] = [
                    'type' => 'age',
                    'passed' => false,
                    'message' => 'User date of birth is missing.',
                    'required' => (float) $requirement->value,
                    'operator' => $requirement->operator,
                    'unit' => $requirement->unit,
                ];

                if ($requirement->is_mandatory) {
                    $passed = false;
                }
            }

            return;
        }

        $age = $dateOfBirth->age;

        foreach ($requirements as $requirement) {
            $required = (float) $requirement->value;

            $result = $this->compare(
                $age,
                $requirement->operator,
                $required
            );

            $checks[] = [
                'type' => 'age',
                'passed' => $result,
                'message' => $result
                    ? 'User age satisfies the requirement.'
                    : 'User age does not satisfy the requirement.',
                'actual' => $age,
                'required' => $required,
                'operator' => $requirement->operator,
                'unit' => $requirement->unit,
            ];

            if (!$result && $requirement->is_mandatory) {
                $passed = false;
            }
        }
    }

    private function checkExperience(
        User $user,
        Opportunity $opportunity,
        array &$checks,
        bool &$passed
    ): void {
        $requirements = $opportunity->requirements
            ->where('requirement_type', 'experience');

        if ($requirements->isEmpty()) {
            return;
        }

        $totalMonths = 0;

        foreach ($user->workExperiences as $experience) {
            if (!$experience->start_date) {
                continue;
            }

            $endDate = $experience->is_current
                ? now()
                : $experience->end_date;

            if (!$endDate) {
                continue;
            }

            $months = $experience
                ->start_date
                ->diffInMonths($endDate);

            $totalMonths += max(
                0,
                $months
            );
        }

        $totalYears = $totalMonths / 12;

        foreach ($requirements as $requirement) {
            $required = (float) $requirement->value;

            $actual = match (strtolower((string) $requirement->unit)) {
                'months' => $totalMonths,
                'month' => $totalMonths,
                'years' => $totalYears,
                'year' => $totalYears,
                default => $totalYears,
            };

            $result = $this->compare(
                $actual,
                $requirement->operator,
                $required
            );

            $checks[] = [
                'type' => 'experience',
                'passed' => $result,
                'message' => $result
                    ? 'User work experience satisfies the requirement.'
                    : 'User work experience does not satisfy the requirement.',
                'actual' => round($actual, 2),
                'required' => $required,
                'operator' => $requirement->operator,
                'unit' => $requirement->unit,
            ];

            if (!$result && $requirement->is_mandatory) {
                $passed = false;
            }
        }
    }

    private function checkSkills(
        User $user,
        Opportunity $opportunity,
        array &$checks,
        bool &$passed
    ): void {
        foreach ($opportunity->skills as $requiredSkill) {
            if (!$requiredSkill->pivot->is_mandatory) {
                continue;
            }

            $userSkill = $user->skills->firstWhere(
                'id',
                $requiredSkill->id
            );

            $result = $userSkill !== null;

            $checks[] = [
                'type' => 'skill',
                'passed' => $result,
                'message' => $result
                    ? 'Required skill is available.'
                    : 'Required skill is missing.',
                'skill' => $requiredSkill->name,
            ];

            if (!$result) {
                $passed = false;
            }
        }
    }

    private function getAcademicRecord(User $user)
    {
        return $user->academicRecords
            ->sortByDesc(
                fn($record) =>
                $record->end_date?->timestamp ?? 0
            )
            ->first();
    }

    private function compare(
        mixed $actual,
        string $operator,
        mixed $required
    ): bool {
        return match ($operator) {
            '=' => $actual == $required,
            '==' => $actual == $required,
            '!=' => $actual != $required,
            '>' => $actual > $required,
            '>=' => $actual >= $required,
            '<' => $actual < $required,
            '<=' => $actual <= $required,
            default => false,
        };
    }
}
