<?php

use App\Http\Controllers\Api\AdminApplicationController;
use App\Http\Controllers\Api\AdminAuditLogController;
use App\Http\Controllers\Api\AdminContentController;
use App\Http\Controllers\Api\AdminCountryController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminLookupController;
use App\Http\Controllers\Api\AdminOpportunityController;
use App\Http\Controllers\Api\AdminRoleController;
use App\Http\Controllers\Api\AdminTaxonomyController;
use App\Http\Controllers\Api\AdminUniversityController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EligibilityController;
use App\Http\Controllers\Api\MatchingController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OpportunityController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\StudentProfileController;
use App\Http\Controllers\Api\AdvisorController;
use App\Http\Controllers\Api\SavedOpportunityController;
use App\Http\Controllers\Api\UniversityController;
use App\Http\Controllers\Api\ContentController;

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {

    Route::post(
        '/register',
        [AuthController::class, 'register']
    )->name('auth.register');

    Route::post(
        '/login',
        [AuthController::class, 'login']
    )->name('auth.login');

    Route::middleware('auth:sanctum')->group(function () {

        Route::get(
            '/me',
            [AuthController::class, 'me']
        )->name('auth.me');

        Route::post(
            '/logout',
            [AuthController::class, 'logout']
        )->name('auth.logout');
    });
});


Route::get(
    '/content/pages/{slug}',
    [ContentController::class, 'show']
)->name('content.pages.show');


/*
|--------------------------------------------------------------------------
| Protected API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::get(
        '/notifications',
        [NotificationController::class, 'index']
    )->name('notifications.index');

    Route::patch(
        '/notifications/{notification}/read',
        [NotificationController::class, 'markAsRead']
    )->name('notifications.read');

    Route::patch(
        '/notifications/read-all',
        [NotificationController::class, 'markAllAsRead']
    )->name('notifications.read-all');


    /*
    |--------------------------------------------------------------------------
    | Student - Opportunities
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/opportunities',
        [OpportunityController::class, 'index']
    )->name('opportunities.index');

    Route::get(
        '/opportunities/recommended',
        [RecommendationController::class, 'index']
    )->name('opportunities.recommended');


    /*
    |--------------------------------------------------------------------------
    | Student - Saved Opportunities
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/saved',
        [SavedOpportunityController::class, 'index']
    )->name('saved.index');

    Route::post(
        '/opportunities/{opportunity}/save',
        [SavedOpportunityController::class, 'store']
    )->name('opportunities.save');

    Route::delete(
        '/opportunities/{opportunity}/save',
        [SavedOpportunityController::class, 'destroy']
    )->name('opportunities.save.destroy');

    Route::get(
        '/opportunities/{opportunity}/saved',
        [SavedOpportunityController::class, 'show']
    )->name('opportunities.saved');


    /*
    |--------------------------------------------------------------------------
    | Student - Opportunity Details
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/opportunities/{opportunity}/eligibility',
        [EligibilityController::class, 'check']
    )->name('opportunities.eligibility');

    Route::get(
        '/opportunities/{opportunity}/match',
        [MatchingController::class, 'check']
    )->name('opportunities.match');

    Route::get(
        '/opportunities/{opportunity}',
        [OpportunityController::class, 'show']
    )->name('opportunities.show');


    /*
    |--------------------------------------------------------------------------
    | Student - Profile
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/profile',
        [StudentProfileController::class, 'show']
    )->name('student.profile.show');

    Route::get(
        '/profile/lookups',
        [StudentProfileController::class, 'lookups']
    )->name('student.profile.lookups');

    Route::put(
        '/profile',
        [StudentProfileController::class, 'update']
    )->name('student.profile.update');


    /*
    |--------------------------------------------------------------------------
    | Student - Academic Records
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/profile/academic-records',
        [StudentProfileController::class, 'storeAcademicRecord']
    )->name('student.profile.academic-records.store');

    Route::put(
        '/profile/academic-records/{id}',
        [StudentProfileController::class, 'updateAcademicRecord']
    )->name('student.profile.academic-records.update');

    Route::delete(
        '/profile/academic-records/{id}',
        [StudentProfileController::class, 'destroyAcademicRecord']
    )->name('student.profile.academic-records.destroy');


    /*
    |--------------------------------------------------------------------------
    | Student - Languages
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/profile/languages',
        [StudentProfileController::class, 'storeLanguage']
    )->name('student.profile.languages.store');

    Route::put(
        '/profile/languages/{id}',
        [StudentProfileController::class, 'updateLanguage']
    )->name('student.profile.languages.update');

    Route::delete(
        '/profile/languages/{id}',
        [StudentProfileController::class, 'destroyLanguage']
    )->name('student.profile.languages.destroy');


    /*
    |--------------------------------------------------------------------------
    | Student - Skills
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/profile/skills',
        [StudentProfileController::class, 'storeSkill']
    )->name('student.profile.skills.store');

    Route::put(
        '/profile/skills/{id}',
        [StudentProfileController::class, 'updateSkill']
    )->name('student.profile.skills.update');

    Route::delete(
        '/profile/skills/{id}',
        [StudentProfileController::class, 'destroySkill']
    )->name('student.profile.skills.destroy');


    /*
    |--------------------------------------------------------------------------
    | Student - Work Experiences
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/profile/work-experiences',
        [StudentProfileController::class, 'storeWorkExperience']
    )->name('student.profile.work-experiences.store');

    Route::put(
        '/profile/work-experiences/{id}',
        [StudentProfileController::class, 'updateWorkExperience']
    )->name('student.profile.work-experiences.update');

    Route::delete(
        '/profile/work-experiences/{id}',
        [StudentProfileController::class, 'destroyWorkExperience']
    )->name('student.profile.work-experiences.destroy');
    /*
    |--------------------------------------------------------------------------
    | Student - Universities
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/universities',
        [UniversityController::class, 'index']
    )->name('universities.index');

    Route::get(
        '/universities/{university}/programs',
        [UniversityController::class, 'programs']
    )->name('universities.programs');

    Route::get(
        '/universities/{university}',
        [UniversityController::class, 'show']
    )->name('universities.show');

    /*
    |--------------------------------------------------------------------------
    | Student - AI Advisor
    |--------------------------------------------------------------------------
    */

    Route::prefix('advisor')->group(function () {

        Route::get(
            '/lookups',
            [AdvisorController::class, 'lookups']
        )->name('advisor.lookups');

        Route::post(
            '/recommend',
            [AdvisorController::class, 'recommend']
        )->name('advisor.recommend');
    });


    /*
    |--------------------------------------------------------------------------
    | Student - Applications
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/opportunities/{opportunity}/applications',
        [ApplicationController::class, 'store']
    )->name('applications.store');

    Route::get(
        '/applications',
        [ApplicationController::class, 'index']
    )->name('applications.index');

    Route::get(
        '/applications/{application}',
        [ApplicationController::class, 'show']
    )->name('applications.show');


    /*
    |--------------------------------------------------------------------------
    | Admin
    |--------------------------------------------------------------------------
    */

    Route::prefix('admin')
        ->middleware('admin')
        ->group(function () {


            /*
            |--------------------------------------------------------------------------
            | Admin - Lookup Data
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/dashboard',
                [AdminDashboardController::class, 'index']
            )->name('admin.dashboard.index');

            Route::get(
                '/lookups',
                [AdminLookupController::class, 'index']
            )->name('admin.lookups.index');

            Route::get(
                '/users',
                [AdminUserController::class, 'index']
            )->middleware('permission:users.view')
                ->name('admin.users.index');

            Route::put(
                '/users/{user}',
                [AdminUserController::class, 'update']
            )->middleware('permission:users.manage')
                ->name('admin.users.update');

            Route::delete(
                '/users/{user}',
                [AdminUserController::class, 'destroy']
            )->middleware('permission:users.manage')
                ->name('admin.users.destroy');

            Route::get(
                '/roles',
                [AdminRoleController::class, 'index']
            )->middleware('permission:roles.manage')
                ->name('admin.roles.index');

            Route::post(
                '/roles',
                [AdminRoleController::class, 'store']
            )->middleware('permission:roles.manage')
                ->name('admin.roles.store');

            Route::put(
                '/roles/{role}',
                [AdminRoleController::class, 'update']
            )->middleware('permission:roles.manage')
                ->name('admin.roles.update');

            Route::delete(
                '/roles/{role}',
                [AdminRoleController::class, 'destroy']
            )->middleware('permission:roles.manage')
                ->name('admin.roles.destroy');

            Route::get(
                '/taxonomies/{taxonomy}',
                [AdminTaxonomyController::class, 'index']
            )->middleware('permission:taxonomies.manage')
                ->name('admin.taxonomies.index');

            Route::post(
                '/taxonomies/{taxonomy}',
                [AdminTaxonomyController::class, 'store']
            )->middleware('permission:taxonomies.manage')
                ->name('admin.taxonomies.store');

            Route::put(
                '/taxonomies/{taxonomy}/{id}',
                [AdminTaxonomyController::class, 'update']
            )->middleware('permission:taxonomies.manage')
                ->name('admin.taxonomies.update');

            Route::delete(
                '/taxonomies/{taxonomy}/{id}',
                [AdminTaxonomyController::class, 'destroy']
            )->middleware('permission:taxonomies.manage')
                ->name('admin.taxonomies.destroy');

            Route::get(
                '/audit-logs',
                [AdminAuditLogController::class, 'index']
            )->middleware('permission:audit_logs.view')
                ->name('admin.audit-logs.index');

            Route::get(
                '/content/pages',
                [AdminContentController::class, 'pages']
            )->middleware('permission:pages.view')
                ->name('admin.content.pages.index');

            Route::post(
                '/content/pages',
                [AdminContentController::class, 'storePage']
            )->middleware('permission:pages.create')
                ->name('admin.content.pages.store');

            Route::put(
                '/content/pages/{page}',
                [AdminContentController::class, 'updatePage']
            )->middleware('permission:pages.update')
                ->name('admin.content.pages.update');

            Route::post(
                '/content/pages/{page}/publish',
                [AdminContentController::class, 'publishPage']
            )->middleware('permission:pages.publish')
                ->name('admin.content.pages.publish');

            Route::post(
                '/content/pages/{page}/unpublish',
                [AdminContentController::class, 'unpublishPage']
            )->middleware('permission:pages.publish')
                ->name('admin.content.pages.unpublish');

            Route::get(
                '/content/pages/{page}/sections',
                [AdminContentController::class, 'sections']
            )->middleware('permission:pages.view')
                ->name('admin.content.sections.index');

            Route::post(
                '/content/pages/{page}/sections',
                [AdminContentController::class, 'storeSection']
            )->middleware('permission:pages.manage_sections')
                ->name('admin.content.sections.store');

            Route::put(
                '/content/sections/{section}',
                [AdminContentController::class, 'updateSection']
            )->middleware('permission:pages.manage_sections')
                ->name('admin.content.sections.update');

            Route::delete(
                '/content/sections/{section}',
                [AdminContentController::class, 'destroySection']
            )->middleware('permission:pages.manage_sections')
                ->name('admin.content.sections.destroy');


            /*
            |--------------------------------------------------------------------------
            | Admin - Countries
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/countries',
                [AdminCountryController::class, 'index']
            )->middleware('permission:universities.view')
                ->name('admin.countries.index');

            Route::post(
                '/countries',
                [AdminCountryController::class, 'store']
            )->middleware('permission:universities.create')
                ->name('admin.countries.store');

            Route::put(
                '/countries/{country}',
                [AdminCountryController::class, 'update']
            )->middleware('permission:universities.update')
                ->name('admin.countries.update');

            Route::delete(
                '/countries/{country}',
                [AdminCountryController::class, 'destroy']
            )->middleware('permission:universities.delete')
                ->name('admin.countries.destroy');


            /*
            |--------------------------------------------------------------------------
            | Admin - Universities
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/universities',
                [AdminUniversityController::class, 'index']
            )->middleware('permission:universities.view')
                ->name('admin.universities.index');

            Route::post(
                '/universities',
                [AdminUniversityController::class, 'store']
            )->middleware('permission:universities.create')
                ->name('admin.universities.store');

            Route::put(
                '/universities/{university}',
                [AdminUniversityController::class, 'update']
            )->middleware('permission:universities.update')
                ->name('admin.universities.update');

            Route::delete(
                '/universities/{university}',
                [AdminUniversityController::class, 'destroy']
            )->middleware('permission:universities.delete')
                ->name('admin.universities.destroy');


            /*
            |--------------------------------------------------------------------------
            | Admin - Opportunities
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/opportunities',
                [AdminOpportunityController::class, 'index']
            )->middleware('permission:opportunities.view')
                ->name('admin.opportunities.index');

            Route::post(
                '/opportunities',
                [AdminOpportunityController::class, 'store']
            )->middleware('permission:opportunities.create')
                ->name('admin.opportunities.store');

            Route::get(
                '/opportunities/{opportunity}',
                [AdminOpportunityController::class, 'show']
            )->middleware('permission:opportunities.view')
                ->name('admin.opportunities.show');

            Route::put(
                '/opportunities/{opportunity}',
                [AdminOpportunityController::class, 'update']
            )->middleware('permission:opportunities.update')
                ->name('admin.opportunities.update');

            Route::delete(
                '/opportunities/{opportunity}',
                [AdminOpportunityController::class, 'destroy']
            )->middleware('permission:opportunities.delete')
                ->name('admin.opportunities.destroy');


            /*
            |--------------------------------------------------------------------------
            | Admin - Applications
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/applications',
                [AdminApplicationController::class, 'index']
            )->middleware('permission:applications.view')
                ->name('admin.applications.index');

            Route::get(
                '/applications/{application}',
                [AdminApplicationController::class, 'show']
            )->middleware('permission:applications.view')
                ->name('admin.applications.show');

            Route::put(
                '/applications/{application}',
                [AdminApplicationController::class, 'update']
            )->middleware('permission:applications.review')
                ->name('admin.applications.update');
        });
});
