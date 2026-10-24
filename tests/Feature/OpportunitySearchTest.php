<?php

namespace Tests\Feature;

use App\Models\Country;
use App\Models\Degree;
use App\Models\FundingType;
use App\Models\Opportunity;
use App\Models\OpportunityType;
use App\Models\University;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OpportunitySearchTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $student;
    private Country $defaultCountry;
    private OpportunityType $defaultType;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        $this->student = User::factory()->create([
            'role' => 'student',
            'status' => 'active',
        ]);

        $this->defaultCountry = Country::create([
            'name' => 'Default Country',
            'code' => 'DEF',
            'iso_code' => 'DF',
        ]);

        $this->defaultType = OpportunityType::create([
            'name' => 'General Opportunity',
            'code' => 'general',
        ]);
    }

    private function createOpportunity(array $attributes = []): Opportunity
    {
        static $counter = 1;

        return Opportunity::create(array_merge([
            'title' => 'Opportunity ' . $counter,
            'slug' => 'opportunity-' . $counter++,
            'description' => 'Default test description for opportunity.',
            'country_id' => $this->defaultCountry->id,
            'opportunity_type_id' => $this->defaultType->id,
            'application_url' => 'https://example.com/apply',
            'status' => 'published',
            'created_by' => $this->admin->id,
        ], $attributes));
    }

    public function test_only_published_opportunities_are_returned(): void
    {
        Sanctum::actingAs($this->student);

        $this->createOpportunity([
            'title' => 'Published Opportunity',
            'slug' => 'published-opp',
            'status' => 'published',
        ]);

        $this->createOpportunity([
            'title' => 'Draft Opportunity',
            'slug' => 'draft-opp',
            'status' => 'draft',
        ]);

        $this->createOpportunity([
            'title' => 'Archived Opportunity',
            'slug' => 'archived-opp',
            'status' => 'archived',
        ]);

        $response = $this->getJson('/api/opportunities');

        $response->assertOk();
        $titles = collect($response->json('data'))->pluck('title')->all();

        $this->assertContains('Published Opportunity', $titles);
        $this->assertNotContains('Draft Opportunity', $titles);
        $this->assertNotContains('Archived Opportunity', $titles);
    }

    public function test_search_filters_by_title_and_description(): void
    {
        Sanctum::actingAs($this->student);

        $this->createOpportunity([
            'title' => 'Quantum Computing Fellowship',
            'slug' => 'quantum-computing-fellowship',
            'description' => 'Research grant for quantum algorithms.',
        ]);

        $this->createOpportunity([
            'title' => 'Biotechnology Grant',
            'slug' => 'biotech-grant',
            'description' => 'Laboratory research in genomics.',
        ]);

        $response = $this->getJson('/api/opportunities?search=quantum');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertSame('Quantum Computing Fellowship', $data[0]['title']);
    }

    public function test_filters_by_opportunity_type_and_country(): void
    {
        Sanctum::actingAs($this->student);

        $germany = Country::create(['name' => 'Germany', 'code' => 'DEU', 'iso_code' => 'DE']);
        $japan = Country::create(['name' => 'Japan', 'code' => 'JPN', 'iso_code' => 'JP']);

        $scholarshipType = OpportunityType::create(['name' => 'Scholarship', 'code' => 'scholarship']);
        $internshipType = OpportunityType::create(['name' => 'Internship', 'code' => 'internship']);

        $this->createOpportunity([
            'title' => 'DAAD Germany Scholarship',
            'slug' => 'daad-germany-scholarship',
            'country_id' => $germany->id,
            'opportunity_type_id' => $scholarshipType->id,
        ]);

        $this->createOpportunity([
            'title' => 'Tokyo Robotics Internship',
            'slug' => 'tokyo-robotics-internship',
            'country_id' => $japan->id,
            'opportunity_type_id' => $internshipType->id,
        ]);

        $response = $this->getJson('/api/opportunities?opportunity_type=scholarship&country=DEU');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertSame('DAAD Germany Scholarship', $data[0]['title']);
    }

    public function test_pagination_returns_meta_and_links(): void
    {
        Sanctum::actingAs($this->student);

        for ($i = 1; $i <= 5; $i++) {
            $this->createOpportunity([
                'title' => "Opportunity {$i}",
                'slug' => "opportunity-{$i}",
            ]);
        }

        $response = $this->getJson('/api/opportunities?per_page=2&page=1');

        $response->assertOk()
            ->assertJsonStructure([
                'data',
                'links',
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total',
                ],
            ]);

        $this->assertCount(2, $response->json('data'));
        $this->assertSame(5, $response->json('meta.total'));
        $this->assertSame(3, $response->json('meta.last_page'));
    }
}
