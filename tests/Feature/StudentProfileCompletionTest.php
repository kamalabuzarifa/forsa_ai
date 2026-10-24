<?php

namespace Tests\Feature;

use App\Models\Country;
use App\Models\Degree;
use App\Models\Field;
use App\Models\Language;
use App\Models\Skill;
use App\Models\University;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StudentProfileCompletionTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_without_work_experience_can_achieve_full_profile_completion(): void
    {
        $country = Country::create([
            'name' => 'Palestine',
            'code' => 'PAL',
            'iso_code' => 'PS',
        ]);

        $degree = Degree::create([
            'name' => 'Bachelor',
            'code' => 'BSC',
        ]);

        $university = University::create([
            'name' => 'Birzeit University',
            'country_id' => $country->id,
            'status' => 'active',
        ]);

        $field = Field::create([
            'name' => 'Computer Science',
        ]);

        $language = Language::create([
            'name' => 'Arabic',
            'code' => 'ar',
        ]);

        $skill = Skill::create([
            'name' => 'PHP',
            'category' => 'Programming',
        ]);

        $student = User::factory()->create([
            'role' => 'student',
            'status' => 'active',
        ]);

        UserProfile::create([
            'user_id' => $student->id,
            'date_of_birth' => '2000-01-01',
            'nationality_id' => $country->id,
            'country_of_residence_id' => $country->id,
            'phone' => '+970599000000',
            'bio' => 'Aspiring software engineer passionate about web technology.',
            'profile_completion' => 0,
        ]);

        $student->academicRecords()->create([
            'degree_id' => $degree->id,
            'university_id' => $university->id,
            'field_id' => $field->id,
            'gpa' => 3.8,
            'gpa_scale' => 4.0,
            'is_current' => false,
        ]);

        $student->languages()->attach($language->id, [
            'level' => 'Native',
        ]);

        $student->skills()->attach($skill->id, [
            'level' => 'Intermediate',
            'years_of_experience' => 2,
        ]);

        Sanctum::actingAs($student);

        // Fetching the profile recalculates completion
        $response = $this->getJson('/api/profile');

        $response->assertOk()
            ->assertJsonPath('profile.profile_completion', 100);
    }

    public function test_profile_completion_awards_points_for_each_valid_section(): void
    {
        $student = User::factory()->create([
            'name' => 'Jane Doe',
            'role' => 'student',
            'status' => 'active',
        ]);

        Sanctum::actingAs($student);

        // Name only gives 10%
        $response = $this->getJson('/api/profile');
        $response->assertOk()
            ->assertJsonPath('profile.profile_completion', 10);

        $country = Country::create([
            'name' => 'Jordan',
            'code' => 'JOR',
            'iso_code' => 'JO',
        ]);

        // Update personal profile fields
        $this->putJson('/api/profile', [
            'name' => 'Jane Doe',
            'date_of_birth' => '2001-05-15',
            'nationality_id' => $country->id,
            'country_of_residence_id' => $country->id,
            'phone' => '+962790000000',
            'bio' => 'Biology student researching bioinformatics.',
        ])->assertOk()
            ->assertJsonPath('profile.profile_completion', 60);
    }

    public function test_work_experience_adds_bonus_without_exceeding_one_hundred_percent(): void
    {
        $country = Country::create([
            'name' => 'Germany',
            'code' => 'DEU',
            'iso_code' => 'DE',
        ]);

        $degree = Degree::create([
            'name' => 'Master',
            'code' => 'MSC',
        ]);

        $university = University::create([
            'name' => 'TU Munich',
            'country_id' => $country->id,
            'status' => 'active',
        ]);

        $field = Field::create([
            'name' => 'Engineering',
        ]);

        $language = Language::create([
            'name' => 'German',
            'code' => 'de',
        ]);

        $skill = Skill::create([
            'name' => 'Robotics',
            'category' => 'Engineering',
        ]);

        $student = User::factory()->create([
            'role' => 'student',
            'status' => 'active',
        ]);

        UserProfile::create([
            'user_id' => $student->id,
            'date_of_birth' => '1998-03-20',
            'nationality_id' => $country->id,
            'country_of_residence_id' => $country->id,
            'phone' => '+491500000000',
            'bio' => 'Robotics graduate.',
            'profile_completion' => 0,
        ]);

        $student->academicRecords()->create([
            'degree_id' => $degree->id,
            'university_id' => $university->id,
            'field_id' => $field->id,
        ]);

        $student->languages()->attach($language->id, ['level' => 'B2']);
        $student->skills()->attach($skill->id, ['level' => 'Advanced']);

        // Full score 100 reached without work experience
        Sanctum::actingAs($student);
        $this->getJson('/api/profile')->assertJsonPath('profile.profile_completion', 100);

        // Add work experience
        $student->workExperiences()->create([
            'job_title' => 'Lab Assistant',
            'company' => 'TU Munich',
            'start_date' => '2023-01-01',
            'is_current' => true,
        ]);

        // Score must stay capped at 100
        $this->getJson('/api/profile')->assertJsonPath('profile.profile_completion', 100);
    }
}
