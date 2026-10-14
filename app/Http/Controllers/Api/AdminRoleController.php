<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Services\AuditLogger;

class AdminRoleController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'roles' => Role::query()
                ->with('permissions:id,name,label,module')
                ->withCount('users')
                ->orderBy('name')
                ->get(),
            'permissions' => Permission::query()
                ->orderBy('module')
                ->orderBy('name')
                ->get(['id', 'name', 'label', 'module']),
        ]);
    }

    public function store(Request $request, AuditLogger $auditLogger): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'regex:/^[a-z][a-z0-9_.-]*$/', 'unique:roles,name'],
            'label' => ['required', 'string', 'max:255'],
            'permission_ids' => ['sometimes', 'array'],
            'permission_ids.*' => ['integer', 'distinct', 'exists:permissions,id'],
        ]);

        $this->ensureDelegatablePermissions(
            $request,
            $data['permission_ids'] ?? []
        );

        $role = Role::create([
            'name' => Str::lower($data['name']),
            'label' => $data['label'],
        ]);

        $role->permissions()->sync($data['permission_ids'] ?? []);

        $auditLogger->record(
            $request,
            'role.created',
            $role,
            null,
            [
                'name' => $role->name,
                'label' => $role->label,
                'permission_ids' => $data['permission_ids'] ?? [],
            ]
        );

        return response()->json([
            'message' => 'Role created successfully.',
            'role' => $role->load('permissions:id,name,label,module'),
        ], 201);
    }

    public function update(Request $request, Role $role, AuditLogger $auditLogger): JsonResponse
    {
        $before = [
            'label' => $role->label,
            'permission_ids' => $role->permissions()->pluck('permissions.id')->all(),
        ];

        $data = $request->validate([
            'label' => ['sometimes', 'string', 'max:255'],
            'permission_ids' => ['sometimes', 'array'],
            'permission_ids.*' => ['integer', 'distinct', 'exists:permissions,id'],
        ]);

        if (array_key_exists('label', $data)) {
            $role->update(['label' => $data['label']]);
        }

        if (array_key_exists('permission_ids', $data)) {
            $this->ensureDelegatablePermissions(
                $request,
                $data['permission_ids']
            );

            $role->permissions()->sync($data['permission_ids']);
        }

        $auditLogger->record(
            $request,
            'role.updated',
            $role,
            $before,
            [
                'label' => $role->fresh()->label,
                'permission_ids' => $role->permissions()->pluck('permissions.id')->all(),
            ]
        );

        return response()->json([
            'message' => 'Role updated successfully.',
            'role' => $role->fresh()->load('permissions:id,name,label,module'),
        ]);
    }

    public function destroy(Request $request, Role $role, AuditLogger $auditLogger): JsonResponse
    {
        if (in_array($role->name, ['super_admin', 'admin', 'student'], true)) {
            return response()->json([
                'message' => 'Default roles cannot be deleted.',
            ], 422);
        }

        $before = [
            'name' => $role->name,
            'label' => $role->label,
            'permission_ids' => $role->permissions()->pluck('permissions.id')->all(),
        ];

        $role->delete();

        $auditLogger->record(
            $request,
            'role.deleted',
            null,
            $before
        );

        return response()->json([
            'message' => 'Role deleted successfully.',
        ]);
    }

    private function ensureDelegatablePermissions(
        Request $request,
        array $permissionIds
    ): void {
        if ($request->user()->hasRole('super_admin')) {
            return;
        }

        $allowedIds = $request->user()
            ->roles()
            ->with('permissions:id')
            ->get()
            ->pluck('permissions')
            ->flatten()
            ->pluck('id')
            ->unique()
            ->map(fn($id) => (int) $id)
            ->all();

        if (array_diff(array_map('intval', $permissionIds), $allowedIds)) {
            abort(403, 'You cannot delegate permissions you do not have.');
        }
    }
}
