<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminOpportunityResource;
use App\Models\Opportunity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OpportunityController extends Controller
{
    /* =========================================================
       GET ALL PUBLISHED OPPORTUNITIES
    ========================================================= */

    public function index(
        Request $request
    ): AnonymousResourceCollection {

        $opportunities = Opportunity::query()
            ->where('status', 'published')
            ->with([
                'university',
                'country',
                'type',
                'fundingType',
                'fields',
                'degrees',
                'skills',
                'opportunityNationalities.country',
                'requirements.language',
            ])
            ->latest('id')
            ->paginate(
                min(
                    max(
                        (int) $request->query('per_page', 15),
                        1
                    ),
                    50
                )
            );

        return AdminOpportunityResource::collection(
            $opportunities
        );
    }


    /* =========================================================
       GET SINGLE PUBLISHED OPPORTUNITY
       Supports ID and SLUG
    ========================================================= */

    public function show(
        string $identifier
    ): AdminOpportunityResource {

        $opportunity = Opportunity::query()
            ->where('status', 'published')
            ->where(function ($query) use ($identifier) {

                $query
                    ->where('id', $identifier)
                    ->orWhere('slug', $identifier);
            })
            ->with([
                'university',
                'country',
                'type',
                'fundingType',
                'fields',
                'degrees',
                'skills',
                'opportunityNationalities.country',
                'requirements.language',
            ])
            ->firstOrFail();

        return new AdminOpportunityResource(
            $opportunity
        );
    }
}
