<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecommendedOpportunityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $opportunity = $this['opportunity'];

        return [
            'opportunity_id' => $opportunity->id,

            'title' => $opportunity->title,

            'slug' => $opportunity->slug,

            'description' => $opportunity->description,

            'university_id' => $opportunity->university_id,

            'country_id' => $opportunity->country_id,

            'deadline' => $opportunity->deadline,

            'start_date' => $opportunity->start_date,

            'application_url' => $opportunity->application_url,

            'source_url' => $opportunity->source_url,

            'match_score' => $this['match_score'],

            'level' => $this['level'],

            'eligible' => $this['eligible'],

            'breakdown' => $this['breakdown'],
        ];
    }
}
