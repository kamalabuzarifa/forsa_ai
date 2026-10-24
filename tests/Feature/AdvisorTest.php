<?php

namespace Tests\Feature;

use App\Models\Country;
use App\Models\Degree;
use App\Models\Field;
use App\Models\Opportunity;
use App\Models\OpportunityType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdvisorTest extends TestCase
{
    use RefreshDatabase;

    public function test_advisor_lookups_requires_authentication(): void
    {
        $this->getJson('/api/advisor/lookups')
            ->assertUnauthorized();
    }

    public function test_advisor_lookups_returns_structured_taxonomy_data(): void
    {
        $field = Field::create(['name' => 'Data Science']);
        $degree = Degree::create(['name' => 'Master of Science', 'code' => 'MSC']);
        $country = Country::create(['name' => 'Germany', 'code' => 'DEU', 'iso_code' => 'DE']);

        $user = User::factory()->create([
            'role' => 'student',
            'status' => 'active',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/advisor/lookups');

        $response->assertOk()
            ->assertJsonStructure([
                'fields' => [
                    '*' => ['id', 'name'],
                ],
                'degrees' => [
                    '*' => ['id', 'name', 'code'],
                ],
                'countries' => [
                    '*' => ['id', 'name', 'code', 'iso_code'],
                ],
                'study_modes' => [
                    '*' => ['value', 'label'],
                ],
            ]);

        $this->assertTrue(collect($response->json('fields'))->contains('name', 'Data Science'));
        $this->assertTrue(collect($response->json('degrees'))->contains('code', 'MSC'));
        $this->assertTrue(collect($response->json('countries'))->contains('code', 'DEU'));
    }

    public function test_advisor_recommend_filters_published_opportunities(): void
    {
        $country = Country::create(['name' => 'Canada', 'code' => 'CAN', 'iso_code' => 'CA']);
        $degree = Degree::create(['name' => 'Bachelor', 'code' => 'BSC']);
        $field = Field::create(['name' => 'Informatics']);
        $type = OpportunityType::create(['name' => 'Scholarship', 'code' => 'scholarship']);

        $creator = User::factory()->create(['role' => 'admin', 'status' => 'active']);

        $matchingOpportunity = Opportunity::create([
            'title' => 'Canada Tech Scholarship',
            'slug' => 'canada-tech-scholarship',
            'description' => 'Generous scholarship for informatics students.',
            'country_id' => $country->id,
            'opportunity_type_id' => $type->id,
            'study_mode' => 'on_campus',
            'application_url' => 'https://example.com/canada-apply',
            'deadline' => now()->addMonths(3),
            'status' => 'published',
            'created_by' => $creator->id,
        ]);
        $matchingOpportunity->fields()->attach($field->id);
        $matchingOpportunity->degrees()->attach($degree->id);

        $student = User::factory()->create(['role' => 'student', 'status' => 'active']);
        Sanctum::actingAs($student);

        $response = $this->postJson('/api/advisor/recommend', [
            'field_id' => $field->id,
            'degree_id' => $degree->id,
            'country_id' => $country->id,
            'study_mode' => 'on_campus',
        ]);

        $response->assertOk()
            ->assertJsonPath('count', 1)
            ->assertJsonPath('data.0.id', $matchingOpportunity->id);
    }
}
