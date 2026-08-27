<?php

namespace App\Services\Matching;

use App\Models\Opportunity;
use App\Models\User;
use Illuminate\Support\Collection;

class RecommendationService
{
    public function __construct(
        private readonly MatchingEngine $matchingEngine
    ) {}

    public function recommend(
        User $user,
        int $limit = 10
    ): Collection {
        $opportunities = Opportunity::query()
            ->where('status', 'published')
            ->where(function ($query) {
                $query
                    ->whereNull('deadline')
                    ->orWhere('deadline', '>=', now());
            })
            ->with([
                'fields',
                'degrees',
                'skills',
                'nationalities',
                'requirements',
            ])
            ->orderBy('deadline')
            ->get();

        $recommendations = $opportunities
            ->map(function (Opportunity $opportunity) use ($user) {
                $result = $this->matchingEngine->calculate(
                    $user,
                    $opportunity
                );

                return [
                    'opportunity' => $opportunity,
                    'match_score' => $result['match_score'],
                    'level' => $result['level'],
                    'eligible' => $result['eligible_for_opportunity'],
                    'breakdown' => $result['breakdown'],
                ];
            })
            ->filter(
                fn(array $result) =>
                $result['eligible'] === true
            )
            ->sortByDesc('match_score')
            ->values()
            ->take($limit);

        return $recommendations;
    }
}
