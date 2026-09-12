<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\ApplicationStatus;
use App\Models\Country;
use App\Models\Opportunity;
use App\Models\University;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $now = now();
        $studentQuery = User::query()->where('role', 'student');
        $publishedOpportunityQuery = Opportunity::query()
            ->where('status', 'published');

        $applicationsByStatus = ApplicationStatus::query()
            ->withCount('applications')
            ->orderBy('code')
            ->get()
            ->mapWithKeys(fn($status) => [
                $status->code => $status->applications_count,
            ]);

        $recentApplications = Application::query()
            ->with(['user:id,name,email', 'opportunity:id,title', 'status:id,name,code'])
            ->latest('created_at')
            ->limit(6)
            ->get()
            ->map(fn($application) => [
                'id' => $application->id,
                'student' => $application->user?->name,
                'opportunity' => $application->opportunity?->title,
                'status' => $application->status?->code,
                'status_label' => $application->status?->name,
                'created_at' => $application->created_at,
            ]);

        $recentUsers = $studentQuery
            ->latest('created_at')
            ->limit(6)
            ->get(['id', 'name', 'email', 'created_at'])
            ->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
            ]);

        $recentOpportunities = Opportunity::query()
            ->with(['university:id,name', 'country:id,name'])
            ->latest('created_at')
            ->limit(6)
            ->get(['id', 'title', 'status', 'deadline', 'university_id', 'country_id', 'created_at'])
            ->map(fn($opportunity) => [
                'id' => $opportunity->id,
                'title' => $opportunity->title,
                'status' => $opportunity->status,
                'university' => $opportunity->university?->name,
                'country' => $opportunity->country?->name,
                'deadline' => $opportunity->deadline,
                'created_at' => $opportunity->created_at,
            ]);

        $profileStats = UserProfile::query()
            ->whereHas('user', fn($query) => $query->where('role', 'student'))
            ->selectRaw('COALESCE(AVG(profile_completion), 0) as average_completion')
            ->selectRaw('SUM(CASE WHEN profile_completion >= 100 THEN 1 ELSE 0 END) as complete_profiles')
            ->selectRaw('SUM(CASE WHEN profile_completion < 100 THEN 1 ELSE 0 END) as incomplete_profiles')
            ->first();

        $applicationsOverTime = Application::query()
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as period")
            ->selectRaw('COUNT(*) as total')
            ->where('created_at', '>=', $now->copy()->subMonths(5)->startOfMonth())
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        $opportunitiesByType = Opportunity::query()
            ->leftJoin('opportunity_types', 'opportunities.opportunity_type_id', '=', 'opportunity_types.id')
            ->selectRaw("COALESCE(opportunity_types.name, 'Unspecified') as label")
            ->selectRaw('COUNT(opportunities.id) as total')
            ->groupBy('label')
            ->orderByDesc('total')
            ->get();

        return response()->json([
            'metrics' => [
                'total_students' => (clone $studentQuery)->count(),
                'total_administrators' => User::query()->where('role', 'admin')->count(),
                'total_universities' => University::query()->count(),
                'total_countries' => Country::query()->count(),
                'total_opportunities' => Opportunity::query()->count(),
                'active_opportunities' => (clone $publishedOpportunityQuery)
                    ->where(fn($query) => $query
                        ->whereNull('deadline')
                        ->orWhere('deadline', '>=', $now))
                    ->count(),
                'expired_opportunities' => Opportunity::query()
                    ->whereNotNull('deadline')
                    ->where('deadline', '<', $now)
                    ->count(),
                'total_applications' => Application::query()->count(),
                'pending_applications' => Application::query()
                    ->whereHas('status', fn($query) => $query->where('code', 'pending'))
                    ->count(),
                'accepted_applications' => Application::query()
                    ->whereHas('status', fn($query) => $query->whereIn('code', ['accepted', 'approved']))
                    ->count(),
                'rejected_applications' => Application::query()
                    ->whereHas('status', fn($query) => $query->where('code', 'rejected'))
                    ->count(),
                'average_profile_completion' => round((float) ($profileStats?->average_completion ?? 0), 1),
                'complete_profiles' => (int) ($profileStats?->complete_profiles ?? 0),
                'incomplete_profiles' => (int) ($profileStats?->incomplete_profiles ?? 0),
                'academic_programs' => null,
            ],
            'applications_by_status' => $applicationsByStatus,
            'applications_over_time' => $applicationsOverTime,
            'opportunities_by_type' => $opportunitiesByType,
            'recent_users' => $recentUsers,
            'recent_applications' => $recentApplications,
            'recent_opportunities' => $recentOpportunities,
            'upcoming_deadlines' => Opportunity::query()
                ->whereNotNull('deadline')
                ->where('deadline', '>=', $now)
                ->orderBy('deadline')
                ->limit(6)
                ->get(['id', 'title', 'deadline', 'status'])
                ->map(fn($opportunity) => [
                    'id' => $opportunity->id,
                    'title' => $opportunity->title,
                    'deadline' => $opportunity->deadline,
                    'status' => $opportunity->status,
                ]),
        ]);
    }
}
