<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Services\AuditLogger;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'status', 'created_at'])
            ->with('roles:id,name,label')
            ->withCount('applications')
            ->when($request->query('search'), function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->query('role'), function ($query, $role) {
                $query->where('role', $role);
            })
            ->latest()
            ->paginate(min(max((int) $request->query('per_page', 15), 1), 50));

        return response()->json($users);
    }

    public function update(Request $request, User $user, AuditLogger $auditLogger): JsonResponse
    {
        $before = [
            'role' => $user->role,
            'status' => $user->status,
            'role_ids' => $user->roles()->pluck('roles.id')->all(),
        ];

        $data = $request->validate([
            'role' => ['sometimes', Rule::in(['admin', 'student'])],
            'status' => ['sometimes', Rule::in(['active', 'inactive', 'suspended'])],
            'role_ids' => ['sometimes', 'array'],
            'role_ids.*' => ['integer', 'distinct', 'exists:roles,id'],
        ]);

        if ($user->is($request->user()) && ($data['status'] ?? $user->status) !== 'active') {
            return response()->json(['message' => 'You cannot deactivate your own account.'], 422);
        }

        if (array_key_exists('role_ids', $data)) {
            $roleNames = \App\Models\Role::query()
                ->whereIn('id', $data['role_ids'])
                ->pluck('name');

            if (
                $roleNames->contains('super_admin') &&
                !$request->user()->hasRole('super_admin')
            ) {
                return response()->json([
                    'message' => 'Only a Super Admin can assign the Super Admin role.',
                ], 403);
            }

            if (
                $user->is($request->user()) &&
                !$roleNames->contains('admin') &&
                !$roleNames->contains('super_admin')
            ) {
                return response()->json([
                    'message' => 'You cannot remove your own administrative access.',
                ], 422);
            }

            $user->roles()->sync($data['role_ids']);
        }

        $user->update(collect($data)->except('role_ids')->all());

        $user->load('roles:id,name,label');

        $auditLogger->record(
            $request,
            'user.access_updated',
            $user,
            $before,
            [
                'role' => $user->role,
                'status' => $user->status,
                'role_ids' => $user->roles->pluck('id')->all(),
            ]
        );

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => array_merge(
                $user->only(['id', 'name', 'email', 'role', 'status', 'created_at']),
                ['roles' => $user->roles]
            ),
        ]);
    }

    public function destroy(Request $request, User $user, AuditLogger $auditLogger): JsonResponse
    {
        if ($user->is($request->user())) {
            return response()->json(['message' => 'You cannot delete your own account.'], 422);
        }

        if ($user->isAdmin() && User::where('role', 'admin')->count() <= 1) {
            return response()->json(['message' => 'At least one administrator must remain.'], 422);
        }

        $before = $user->only(['id', 'name', 'email', 'role', 'status']);

        $user->delete();

        $auditLogger->record(
            $request,
            'user.deleted',
            null,
            $before
        );

        return response()->json(['message' => 'User deleted successfully.']);
    }
}
