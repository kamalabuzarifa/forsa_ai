<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'user_id' => $this->user_id,

            'user' => $this->whenLoaded(
                'user',
                fn() => [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ]
            ),

            'opportunity_id' => $this->opportunity_id,

            'status' => $this->whenLoaded(
                'status',
                fn() => [
                    'id' => $this->status->id,
                    'name' => $this->status->name,
                    'code' => $this->status->code,
                ]
            ),

            'opportunity' => $this->whenLoaded(
                'opportunity',
                fn() => [
                    'id' => $this->opportunity->id,
                    'title' => $this->opportunity->title,
                    'slug' => $this->opportunity->slug,

                    'description' => $this->opportunity->description,

                    'university' => $this->when(
                        $this->opportunity->relationLoaded('university'),
                        fn() => $this->opportunity->university
                            ? [
                                'id' => $this->opportunity->university->id,
                                'name' => $this->opportunity->university->name,
                            ]
                            : null
                    ),

                    'country' => $this->when(
                        $this->opportunity->relationLoaded('country'),
                        fn() => $this->opportunity->country
                            ? [
                                'id' => $this->opportunity->country->id,
                                'name' => $this->opportunity->country->name,
                            ]
                            : null
                    ),

                    'type' => $this->when(
                        $this->opportunity->relationLoaded('type'),
                        fn() => $this->opportunity->type
                            ? [
                                'id' => $this->opportunity->type->id,
                                'name' => $this->opportunity->type->name,
                            ]
                            : null
                    ),

                    'funding_type' => $this->when(
                        $this->opportunity->relationLoaded('fundingType'),
                        fn() => $this->opportunity->fundingType
                            ? [
                                'id' => $this->opportunity->fundingType->id,
                                'name' => $this->opportunity->fundingType->name,
                            ]
                            : null
                    ),

                    'application_url' =>
                    $this->opportunity->application_url,

                    'source_url' =>
                    $this->opportunity->source_url,

                    'deadline' =>
                    $this->opportunity->deadline,

                    'start_date' =>
                    $this->opportunity->start_date,

                    'end_date' =>
                    $this->opportunity->end_date,

                    'status' =>
                    $this->opportunity->status,

                    'is_verified' =>
                    $this->opportunity->is_verified,
                ]
            ),

            'applied_at' => $this->applied_at,

            'notes' => $this->notes,

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,
        ];
    }
}
