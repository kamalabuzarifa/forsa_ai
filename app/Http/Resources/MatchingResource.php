<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MatchingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'user_id' => $this['user_id'],
            'opportunity_id' => $this['opportunity_id'],
            'match_score' => $this['match_score'],
            'level' => $this['level'],
            'eligible_for_opportunity' => $this['eligible_for_opportunity'],
            'breakdown' => $this['breakdown'],
        ];
    }
}
