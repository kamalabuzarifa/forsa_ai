<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminOpportunityResource;
use App\Models\Opportunity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OpportunityController extends Controller
{
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

    public function show(
        Opportunity $opportunity
    ): AdminOpportunityResource {
        if ($opportunity->status !== 'published') {
            abort(404);
        }

        $opportunity->load([
            'university',
            'country',
            'type',
            'fundingType',
            'fields',
            'degrees',
            'skills',
            'opportunityNationalities.country',
            'requirements.language',
        ]);

        return new AdminOpportunityResource(
            $opportunity
        );
    }
}
