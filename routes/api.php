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
