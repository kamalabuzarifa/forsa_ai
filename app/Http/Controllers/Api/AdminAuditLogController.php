<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAuditLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $logs = AuditLog::query()
            ->with('user:id,name,email')
            ->when($request->query('action'), function ($query, $action) {
                $query->where('action', $action);
            })
            ->when($request->query('user_id'), function ($query, $userId) {
                $query->where('user_id', $userId);
            })
            ->latest('id')
            ->paginate(min(max((int) $request->query('per_page', 25), 1), 100));

        return response()->json($logs);
    }
}
