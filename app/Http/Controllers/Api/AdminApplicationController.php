<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateApplicationStatusRequest;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminApplicationController extends Controller
{
    public function index(
        Request $request
    ): AnonymousResourceCollection {
        $applications = Application::query()
            ->with([
                'user',
                'status',
                'opportunity',
            ])
            ->latest('created_at')
            ->paginate(15);

        return ApplicationResource::collection(
            $applications
        );
    }

    public function show(
        Application $application
    ): ApplicationResource {
        $application->load([
            'user',
            'status',
            'opportunity',
        ]);

        return new ApplicationResource(
            $application
        );
    }

    public function update(
        UpdateApplicationStatusRequest $request,
        Application $application
    ): ApplicationResource {
        $data = $request->validated();

        $application->loadMissing([
            'status',
            'user',
            'opportunity',
        ]);

        $previousStatusId = $application->status_id;

        $application->update([
            'status_id' => $data['status_id'],
            'notes' => array_key_exists('notes', $data)
                ? $data['notes']
                : $application->notes,
        ]);

        if ($previousStatusId !== $application->status_id) {
            $application->load('status');

            $statusLabel = $application->status?->name
                ?? $application->status?->code
                ?? 'updated';

            $application->user?->notifications()->create([
                'type' => 'application_status_updated',
                'title' => 'Application status updated',
                'message' => sprintf(
                    'Your application for %s is now %s.',
                    $application->opportunity?->title
                        ?? 'your opportunity',
                    str_replace('_', ' ', $statusLabel)
                ),
            ]);
        }

        $application->load([
            'user',
            'status',
            'opportunity',
        ]);

        return new ApplicationResource(
            $application
        );
    }
}
