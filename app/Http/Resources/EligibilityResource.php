<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EligibilityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'eligible' => $this['eligible'],
            'status' => $this['status'],

            'user_id' => $this['user_id'],
            'opportunity_id' => $this['opportunity_id'],

            'checks' => $this['checks'],

            'failed_checks' => $this['failed_checks'],
        ];
    }
}
