<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()
            ->notifications()
            ->where(function ($query) {
                $query
                    ->whereNull('scheduled_at')
                    ->orWhere('scheduled_at', '<=', now());
            })
            ->latest()
            ->limit(20)
            ->get();

        return response()->json([
            'data' => $notifications,
            'unread_count' => $request->user()
                ->notifications()
                ->whereNull('read_at')
                ->where(function ($query) {
                    $query
                        ->whereNull('scheduled_at')
                        ->orWhere('scheduled_at', '<=', now());
                })
                ->count(),
        ]);
    }

    public function markAsRead(
        Request $request,
        int $notification
    ): JsonResponse {
        $updated = $request->user()
            ->notifications()
            ->whereKey($notification)
            ->update([
                'read_at' => now(),
            ]);

        if ($updated === 0) {
            return response()->json([
                'message' => 'Notification not found.',
            ], 404);
        }

        return response()->json([
            'message' => 'Notification marked as read.',
        ]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()
            ->notifications()
            ->whereNull('read_at')
            ->update([
                'read_at' => now(),
            ]);

        return response()->json([
            'message' => 'Notifications marked as read.',
        ]);
    }
}
