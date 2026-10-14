<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'super_admin' => 'Super Admin',
            'admin' => 'Admin',
            'content_manager' => 'Content Manager',
            'opportunity_manager' => 'Opportunity Manager',
            'application_manager' => 'Application Manager',
            'student' => 'Student',
        ];

        foreach ($roles as $name => $label) {
            Role::updateOrCreate(
                ['name' => $name],
                ['label' => $label]
            );
        }

        $permissions = [
            ['name' => 'roles.manage', 'label' => 'Manage roles', 'module' => 'access'],
            ['name' => 'permissions.assign', 'label' => 'Assign permissions', 'module' => 'access'],
            ['name' => 'taxonomies.manage', 'label' => 'Manage taxonomies', 'module' => 'taxonomies'],
            ['name' => 'pages.view', 'label' => 'View CMS pages', 'module' => 'pages'],
            ['name' => 'pages.create', 'label' => 'Create CMS pages', 'module' => 'pages'],
            ['name' => 'pages.update', 'label' => 'Update CMS pages', 'module' => 'pages'],
            ['name' => 'pages.delete', 'label' => 'Delete CMS pages', 'module' => 'pages'],
            ['name' => 'pages.publish', 'label' => 'Publish CMS pages', 'module' => 'pages'],
            ['name' => 'pages.manage_sections', 'label' => 'Manage CMS sections', 'module' => 'pages'],
            ['name' => 'universities.view', 'label' => 'View universities', 'module' => 'universities'],
            ['name' => 'universities.create', 'label' => 'Create universities', 'module' => 'universities'],
            ['name' => 'universities.update', 'label' => 'Update universities', 'module' => 'universities'],
            ['name' => 'universities.delete', 'label' => 'Delete universities', 'module' => 'universities'],
            ['name' => 'opportunities.view', 'label' => 'View opportunities', 'module' => 'opportunities'],
            ['name' => 'opportunities.create', 'label' => 'Create opportunities', 'module' => 'opportunities'],
            ['name' => 'opportunities.update', 'label' => 'Update opportunities', 'module' => 'opportunities'],
            ['name' => 'opportunities.publish', 'label' => 'Publish opportunities', 'module' => 'opportunities'],
            ['name' => 'applications.view', 'label' => 'View applications', 'module' => 'applications'],
            ['name' => 'applications.review', 'label' => 'Review applications', 'module' => 'applications'],
            ['name' => 'users.view', 'label' => 'View users', 'module' => 'users'],
            ['name' => 'users.manage', 'label' => 'Manage users', 'module' => 'users'],
            ['name' => 'pages.manage', 'label' => 'Manage website pages', 'module' => 'pages'],
            ['name' => 'media.manage', 'label' => 'Manage media', 'module' => 'media'],
            ['name' => 'notifications.manage', 'label' => 'Manage notifications', 'module' => 'notifications'],
            ['name' => 'ai_advisor.manage', 'label' => 'Manage AI Advisor', 'module' => 'ai_advisor'],
            ['name' => 'system_settings.manage', 'label' => 'Manage system settings', 'module' => 'system_settings'],
            ['name' => 'audit_logs.view', 'label' => 'View audit logs', 'module' => 'audit_logs'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['name' => $permission['name']],
                $permission
            );
        }

        $allPermissions = Permission::pluck('id');
        Role::where('name', 'super_admin')->first()?->permissions()->sync($allPermissions);
        Role::where('name', 'admin')->first()?->permissions()->sync($allPermissions);

        $adminRole = Role::where('name', 'admin')->first();
        $studentRole = Role::where('name', 'student')->first();

        User::where('role', 'admin')->get()->each(
            fn(User $user) => $user->roles()->syncWithoutDetaching([$adminRole->id])
        );

        User::where('role', 'student')->get()->each(
            fn(User $user) => $user->roles()->syncWithoutDetaching([$studentRole->id])
        );
    }
}
