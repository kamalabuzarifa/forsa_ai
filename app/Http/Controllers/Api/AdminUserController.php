<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'status', 'created_at'])
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

    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'role' => ['sometimes', Rule::in(['admin', 'student'])],
            'status' => ['sometimes', Rule::in(['active', 'inactive', 'suspended'])],
        ]);

        if ($user->is($request->user()) && ($data['status'] ?? $user->status) !== 'active') {
            return response()->json(['message' => 'You cannot deactivate your own account.'], 422);
        }

        $user->update($data);

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $user->only(['id', 'name', 'email', 'role', 'status', 'created_at']),
        ]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($user->is($request->user())) {
            return response()->json(['message' => 'You cannot delete your own account.'], 422);
        }

        if ($user->isAdmin() && User::where('role', 'admin')->count() <= 1) {
            return response()->json(['message' => 'At least one administrator must remain.'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }
}
