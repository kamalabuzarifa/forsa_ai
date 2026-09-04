<?php

use App\Http\Controllers\Api\AdminApplicationController;
use App\Http\Controllers\Api\AdminCountryController;
use App\Http\Controllers\Api\AdminLookupController;
use App\Http\Controllers\Api\AdminOpportunityController;
use App\Http\Controllers\Api\AdminUniversityController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EligibilityController;
use App\Http\Controllers\Api\MatchingController;
use App\Http\Controllers\Api\OpportunityController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\StudentProfileController;
use App\Http\Controllers\Api\AdvisorController;
use App\Http\Controllers\Api\SavedOpportunityController;
use App\Http\Controllers\Api\UniversityController;

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


/*
|--------------------------------------------------------------------------
| Protected API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {


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
                '/lookups',
                [AdminLookupController::class, 'index']
            )->name('admin.lookups.index');


            /*
            |--------------------------------------------------------------------------
            | Admin - Countries
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/countries',
                [AdminCountryController::class, 'index']
            )->name('admin.countries.index');

            Route::post(
                '/countries',
                [AdminCountryController::class, 'store']
            )->name('admin.countries.store');


            /*
            |--------------------------------------------------------------------------
            | Admin - Universities
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/universities',
                [AdminUniversityController::class, 'index']
            )->name('admin.universities.index');

            Route::post(
                '/universities',
                [AdminUniversityController::class, 'store']
            )->name('admin.universities.store');


            /*
            |--------------------------------------------------------------------------
            | Admin - Opportunities
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/opportunities',
                [AdminOpportunityController::class, 'index']
            )->name('admin.opportunities.index');

            Route::post(
                '/opportunities',
                [AdminOpportunityController::class, 'store']
            )->name('admin.opportunities.store');

            Route::get(
                '/opportunities/{opportunity}',
                [AdminOpportunityController::class, 'show']
            )->name('admin.opportunities.show');

            Route::put(
                '/opportunities/{opportunity}',
                [AdminOpportunityController::class, 'update']
            )->name('admin.opportunities.update');

            Route::delete(
                '/opportunities/{opportunity}',
                [AdminOpportunityController::class, 'destroy']
            )->name('admin.opportunities.destroy');


            /*
            |--------------------------------------------------------------------------
            | Admin - Applications
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/applications',
                [AdminApplicationController::class, 'index']
            )->name('admin.applications.index');

            Route::get(
                '/applications/{application}',
                [AdminApplicationController::class, 'show']
            )->name('admin.applications.show');

            Route::put(
                '/applications/{application}',
                [AdminApplicationController::class, 'update']
            )->name('admin.applications.update');
        });
});
