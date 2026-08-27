<?php

namespace App\Services\Matching;

use App\Models\Opportunity;
use App\Models\User;
use App\Services\Eligibility\EligibilityEngine;

class MatchingEngine
{
    private const FIELD_WEIGHT = 30;

    private const SKILLS_WEIGHT = 25;

    private const GPA_WEIGHT = 20;

    private const LANGUAGE_WEIGHT = 15;

    private const EXPERIENCE_WEIGHT = 10;

    public function __construct(
        private readonly EligibilityEngine $eligibilityEngine
    ) {}

    public function calculate(
        User $user,
        Opportunity $opportunity
    ): array {
        $user->loadMissing([
            'profile',
            'academicRecords.field',
            'academicRecords.degree',
            'languages',
            'skills',
            'workExperiences',
        ]);

        $opportunity->loadMissing([
            'fields',
            'degrees',
            'skills',
        ]);

        $fieldScore = $this->calculateFieldScore(
            $user,
            $opportunity
        );

        $skillsScore = $this->calculateSkillsScore(
            $user,
            $opportunity
        );

        $gpaScore = $this->calculateGpaScore(
            $user
        );

        $languageScore = $this->calculateLanguageScore(
            $user
        );

        $experienceScore = $this->calculateExperienceScore(
            $user
        );

        $totalScore = round(
            $fieldScore +
                $skillsScore +
                $gpaScore +
                $languageScore +
                $experienceScore,
            2
        );

        $eligibility = $this->eligibilityEngine->check(
            $user,
            $opportunity
        );

        return [
            'user_id' => $user->id,

            'opportunity_id' => $opportunity->id,

            'match_score' => $totalScore,

            'level' => $this->getMatchLevel(
                $totalScore
            ),

            'eligible_for_opportunity' =>
            $eligibility['eligible'],

            'breakdown' => [
                'academic_field' => [
                    'score' => round(
                        $fieldScore,
                        2
                    ),
                    'max_score' =>
                    self::FIELD_WEIGHT,
                ],

                'skills' => [
                    'score' => round(
                        $skillsScore,
                        2
                    ),
                    'max_score' =>
                    self::SKILLS_WEIGHT,
                ],

                'gpa' => [
                    'score' => round(
                        $gpaScore,
                        2
                    ),
                    'max_score' =>
                    self::GPA_WEIGHT,
                ],

                'language' => [
                    'score' => round(
                        $languageScore,
                        2
                    ),
                    'max_score' =>
                    self::LANGUAGE_WEIGHT,
                ],

                'experience' => [
                    'score' => round(
                        $experienceScore,
                        2
                    ),
                    'max_score' =>
                    self::EXPERIENCE_WEIGHT,
                ],
            ],
        ];
    }

    private function calculateFieldScore(
        User $user,
        Opportunity $opportunity
    ): float {
        if ($opportunity->fields->isEmpty()) {
            return self::FIELD_WEIGHT;
        }

        $record = $this->getAcademicRecord($user);

        if (!$record || !$record->field) {
            return 0;
        }

        $userFieldId = $record->field->id;

        if (
            $opportunity->fields->contains(
                'id',
                $userFieldId
            )
        ) {
            return self::FIELD_WEIGHT;
        }

        $userParentId = $record->field->parent_id;

        if (
            $userParentId !== null &&
            $opportunity->fields->contains(
                'id',
                $userParentId
            )
        ) {
            return self::FIELD_WEIGHT * 0.8;
        }

        $fieldParentIds = $opportunity->fields
            ->pluck('parent_id')
            ->filter()
            ->values();

        if (
            $fieldParentIds->contains(
                $userFieldId
            )
        ) {
            return self::FIELD_WEIGHT * 0.8;
        }

        return 0;
    }

    private function calculateSkillsScore(
        User $user,
        Opportunity $opportunity
    ): float {
        if ($opportunity->skills->isEmpty()) {
            return self::SKILLS_WEIGHT;
        }

        $mandatorySkills = $opportunity->skills
            ->filter(
                fn($skill) =>
                (bool) $skill->pivot->is_mandatory
            );

        $optionalSkills = $opportunity->skills
            ->filter(
                fn($skill) =>
                !(bool) $skill->pivot->is_mandatory
            );

        $mandatoryScore = 0;

        if ($mandatorySkills->isNotEmpty()) {
            $matchedMandatory = $mandatorySkills
                ->filter(
                    fn($skill) =>
                    $user->skills->contains(
                        'id',
                        $skill->id
                    )
                );

            $mandatoryRatio =
                $matchedMandatory->count()
                / $mandatorySkills->count();

            $mandatoryScore =
                $mandatoryRatio * 18;
        } else {
            $mandatoryScore = 18;
        }

        $optionalScore = 0;

        if ($optionalSkills->isNotEmpty()) {
            $matchedOptional = $optionalSkills
                ->filter(
                    fn($skill) =>
                    $user->skills->contains(
                        'id',
                        $skill->id
                    )
                );

            $optionalRatio =
                $matchedOptional->count()
                / $optionalSkills->count();

            $optionalScore =
                $optionalRatio * 7;
        } else {
            $optionalScore = 7;
        }

        return min(
            self::SKILLS_WEIGHT,
            $mandatoryScore + $optionalScore
        );
    }

    private function calculateGpaScore(
        User $user
    ): float {
        $record = $this->getAcademicRecord($user);

        if (
            !$record ||
            $record->gpa === null ||
            $record->gpa_scale === null
        ) {
            return 0;
        }

        $gpa = (float) $record->gpa;

        $scale = (float) $record->gpa_scale;

        if ($scale <= 0) {
            return 0;
        }

        $ratio = $gpa / $scale;

        $ratio = max(
            0,
            min(1, $ratio)
        );

        return $ratio * self::GPA_WEIGHT;
    }

    private function calculateLanguageScore(
        User $user
    ): float {
        $english = $user->languages
            ->firstWhere('code', 'en');

        if (!$english) {
            return 0;
        }

        $levelOrder = [
            'A1' => 1,
            'A2' => 2,
            'B1' => 3,
            'B2' => 4,
            'C1' => 5,
            'C2' => 6,
            'Native' => 6,
        ];

        $level = $english->pivot->level;

        $rank = $levelOrder[$level] ?? 0;

        $ratio = $rank / 6;

        return max(
            0,
            min(
                self::LANGUAGE_WEIGHT,
                $ratio * self::LANGUAGE_WEIGHT
            )
        );
    }

    private function calculateExperienceScore(
        User $user
    ): float {
        if ($user->workExperiences->isEmpty()) {
            return 0;
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

        if ($totalMonths <= 0) {
            return 0;
        }

        $years = $totalMonths / 12;

        /*
         * Three years of relevant experience
         * reaches the maximum score.
         */
        $ratio = min(
            1,
            $years / 3
        );

        return $ratio * self::EXPERIENCE_WEIGHT;
    }

    private function getAcademicRecord(
        User $user
    ): ?object {
        return $user->academicRecords
            ->sortByDesc(
                fn($record) =>
                $record->end_date?->timestamp ?? 0
            )
            ->first();
    }

    private function getMatchLevel(
        float $score
    ): string {
        return match (true) {
            $score >= 90 => 'excellent',
            $score >= 75 => 'very_good',
            $score >= 60 => 'good',
            $score >= 40 => 'fair',
            default => 'low',
        };
    }
}
