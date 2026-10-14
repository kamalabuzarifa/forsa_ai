<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_legacy_admin_without_assigned_permissions_is_denied(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/admin/opportunities')
            ->assertForbidden();
    }

    public function test_user_with_opportunity_view_permission_can_read_opportunities(): void
    {
        $permission = Permission::create([
            'name' => 'opportunities.view',
            'label' => 'View opportunities',
            'module' => 'opportunities',
        ]);

        $role = Role::create([
            'name' => 'opportunity_reader',
            'label' => 'Opportunity reader',
        ]);

        $role->permissions()->attach($permission);

        $user = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        $user->roles()->attach($role);

        Sanctum::actingAs($user);

        $this->getJson('/api/admin/opportunities')
            ->assertOk();
    }

    public function test_role_creation_is_recorded_in_audit_logs(): void
    {
        $permission = Permission::create([
            'name' => 'roles.manage',
            'label' => 'Manage roles',
            'module' => 'access',
        ]);

        $role = Role::create([
            'name' => 'access_manager',
            'label' => 'Access manager',
        ]);

        $role->permissions()->attach($permission);

        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        $admin->roles()->attach($role);

        Sanctum::actingAs($admin);

        $this->postJson('/api/admin/roles', [
            'name' => 'reviewer',
            'label' => 'Reviewer',
            'permission_ids' => [],
        ])->assertCreated();

        $this->assertDatabaseHas('audit_logs', [
            'action' => 'role.created',
            'user_id' => $admin->id,
        ]);
    }
}
