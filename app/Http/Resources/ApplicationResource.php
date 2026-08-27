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
                ]
            ),

            'applied_at' => $this->applied_at,

            'notes' => $this->notes,

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,
        ];
    }
}
