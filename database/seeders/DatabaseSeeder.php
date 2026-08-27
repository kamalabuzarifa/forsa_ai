<?php

namespace Database\Seeders;

use App\Models\AcademicRecord;
use App\Models\ApplicationStatus;
use App\Models\Country;
use App\Models\Degree;
use App\Models\Field;
use App\Models\FundingType;
use App\Models\Language;
use App\Models\Opportunity;
use App\Models\OpportunityRequirement;
use App\Models\OpportunityType;
use App\Models\Skill;
use App\Models\University;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\WorkExperience;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Countries
        |--------------------------------------------------------------------------
        */

        $palestine = Country::firstOrCreate(
            ['code' => 'PAL'],
            [
                'name' => 'Palestine',
                'iso_code' => 'PS',
            ]
        );

        $uk = Country::firstOrCreate(
            ['code' => 'GBR'],
            [
                'name' => 'United Kingdom',
                'iso_code' => 'GB',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Universities
        |--------------------------------------------------------------------------
        */

        $university = University::firstOrCreate(
            [
                'name' => 'University of Example',
                'country_id' => $uk->id,
            ],
            [
                'website' => 'https://example.edu',
                'description' => 'Example university for development testing.',
                'status' => 'active',
            ]
        );

        $alAzhar = University::firstOrCreate(
            [
                'name' => 'Al-Azhar University - Gaza',
                'country_id' => $palestine->id,
            ],
            [
                'website' => null,
                'description' => 'Test academic institution.',
                'status' => 'active',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Degrees
        |--------------------------------------------------------------------------
        */

        $bachelor = Degree::firstOrCreate(
            ['code' => 'BSC'],
            [
                'name' => 'Bachelor',
                'description' => 'Bachelor degree.',
            ]
        );

        $master = Degree::firstOrCreate(
            ['code' => 'MSC'],
            [
                'name' => 'Master',
                'description' => 'Master degree.',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Fields
        |--------------------------------------------------------------------------
        */

        $computerScience = Field::firstOrCreate(
            ['name' => 'Computer Science'],
            [
                'parent_id' => null,
                'description' => 'Computer Science.',
            ]
        );

        $artificialIntelligence = Field::firstOrCreate(
            ['name' => 'Artificial Intelligence'],
            [
                'parent_id' => $computerScience->id,
                'description' => 'Artificial Intelligence and Machine Learning.',
            ]
        );

        $dataScience = Field::firstOrCreate(
            ['name' => 'Data Science'],
            [
                'parent_id' => $computerScience->id,
                'description' => 'Data Science and Analytics.',
            ]
        );

        $softwareEngineering = Field::firstOrCreate(
            ['name' => 'Software Engineering'],
            [
                'parent_id' => $computerScience->id,
                'description' => 'Software Engineering.',
            ]
        );

        $cyberSecurity = Field::firstOrCreate(
            ['name' => 'Cyber Security'],
            [
                'parent_id' => $computerScience->id,
                'description' => 'Cyber Security.',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Languages
        |--------------------------------------------------------------------------
        */

        $arabic = Language::firstOrCreate(
            ['code' => 'ar'],
            [
                'name' => 'Arabic',
            ]
        );

        $english = Language::firstOrCreate(
            ['code' => 'en'],
            [
                'name' => 'English',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Skills
        |--------------------------------------------------------------------------
        */

        $php = Skill::firstOrCreate(
            ['name' => 'PHP'],
            [
                'category' => 'Programming',
            ]
        );

        $laravel = Skill::firstOrCreate(
            ['name' => 'Laravel'],
            [
                'category' => 'Backend',
            ]
        );

        $javascript = Skill::firstOrCreate(
            ['name' => 'JavaScript'],
            [
                'category' => 'Programming',
            ]
        );

        $python = Skill::firstOrCreate(
            ['name' => 'Python'],
            [
                'category' => 'Programming',
            ]
        );

        $machineLearning = Skill::firstOrCreate(
            ['name' => 'Machine Learning'],
            [
                'category' => 'Artificial Intelligence',
            ]
        );

        $dataAnalysis = Skill::firstOrCreate(
            ['name' => 'Data Analysis'],
            [
                'category' => 'Data Science',
            ]
        );

        $cyberSecuritySkill = Skill::firstOrCreate(
            ['name' => 'Cyber Security'],
            [
                'category' => 'Security',
            ]
        );

        $docker = Skill::firstOrCreate(
            ['name' => 'Docker'],
            [
                'category' => 'DevOps',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Opportunity Types
        |--------------------------------------------------------------------------
        */

        $scholarship = OpportunityType::firstOrCreate(
            ['name' => 'Scholarship'],
            [
                'description' => 'Scholarship opportunity.',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Funding Types
        |--------------------------------------------------------------------------
        */

        $fullyFunded = FundingType::firstOrCreate(
            ['name' => 'Fully Funded'],
            [
                'description' => 'Tuition and living expenses are covered.',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Application Statuses
        |--------------------------------------------------------------------------
        */

        $pendingStatus = ApplicationStatus::updateOrCreate(
            ['code' => 'pending'],
            [
                'name' => 'Pending',
            ]
        );

        $underReviewStatus = ApplicationStatus::updateOrCreate(
            ['code' => 'under_review'],
            [
                'name' => 'Under Review',
            ]
        );

        $acceptedStatus = ApplicationStatus::updateOrCreate(
            ['code' => 'accepted'],
            [
                'name' => 'Accepted',
            ]
        );

        $rejectedStatus = ApplicationStatus::updateOrCreate(
            ['code' => 'rejected'],
            [
                'name' => 'Rejected',
            ]
        );

        $withdrawnStatus = ApplicationStatus::updateOrCreate(
            ['code' => 'withdrawn'],
            [
                'name' => 'Withdrawn',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Test User
        |--------------------------------------------------------------------------
        */

        $user = User::firstOrCreate(
            ['email' => 'kamal.test@example.com'],
            [
                'name' => 'Kamal Abu Zarifa',
                'password' => Hash::make('password'),
                'role' => 'student',
                'status' => 'active',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Admin User
        |--------------------------------------------------------------------------
        */

        $admin = User::firstOrCreate(
            ['email' => 'admin.test@example.com'],
            [
                'name' => 'Forsa Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | User Profile
        |--------------------------------------------------------------------------
        */

        UserProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'date_of_birth' => '2003-09-13',
                'nationality_id' => $palestine->id,
                'country_of_residence_id' => $palestine->id,
                'phone' => '+970000000000',
                'bio' => 'Computer Systems Engineering graduate.',
                'profile_completion' => 90,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Academic Record
        |--------------------------------------------------------------------------
        */

        AcademicRecord::updateOrCreate(
            [
                'user_id' => $user->id,
                'degree_id' => $bachelor->id,
            ],
            [
                'university_id' => $alAzhar->id,
                'field_id' => $computerScience->id,
                'gpa' => 88.19,
                'gpa_scale' => 100,
                'start_date' => '2021-09-01',
                'end_date' => '2026-06-14',
                'is_current' => false,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | User Languages
        |--------------------------------------------------------------------------
        */

        $user->languages()->syncWithoutDetaching([
            $arabic->id => [
                'level' => 'Native',
                'test_type' => null,
                'score' => null,
            ],

            $english->id => [
                'level' => 'B2',
                'test_type' => 'Internal',
                'score' => null,
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | User Skills
        |--------------------------------------------------------------------------
        */

        $user->skills()->syncWithoutDetaching([
            $php->id => [
                'level' => 'Advanced',
                'years_of_experience' => 2.5,
            ],

            $laravel->id => [
                'level' => 'Advanced',
                'years_of_experience' => 2.0,
            ],

            $javascript->id => [
                'level' => 'Intermediate',
                'years_of_experience' => 2.0,
            ],

            $python->id => [
                'level' => 'Intermediate',
                'years_of_experience' => 1.5,
            ],

            $machineLearning->id => [
                'level' => 'Intermediate',
                'years_of_experience' => 1.0,
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Work Experience
        |--------------------------------------------------------------------------
        */

        WorkExperience::updateOrCreate(
            [
                'user_id' => $user->id,
                'job_title' => 'Software Engineering Trainee',
                'company' => 'Nasser Medical Hospital',
            ],
            [
                'description' => 'Worked with the IT team on database updates and software testing.',
                'start_date' => '2026-04-01',
                'end_date' => '2026-06-30',
                'is_current' => false,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Opportunity 1
        | MSc Artificial Intelligence
        |--------------------------------------------------------------------------
        */

        $opportunity = Opportunity::updateOrCreate(
            [
                'slug' => 'msc-artificial-intelligence-example',
            ],
            [
                'title' => 'MSc Artificial Intelligence',
                'description' => 'Test scholarship opportunity for Artificial Intelligence.',
                'university_id' => $university->id,
                'country_id' => $uk->id,
                'opportunity_type_id' => $scholarship->id,
                'funding_type_id' => $fullyFunded->id,
                'application_url' => 'https://example.edu/apply',
                'source_url' => 'https://example.edu/scholarships',
                'deadline' => now()->addMonths(3),
                'start_date' => now()->addMonths(6)->startOfMonth(),
                'end_date' => null,
                'status' => 'published',
                'is_verified' => true,
                'created_by' => $admin->id,
            ]
        );

        $opportunity->fields()->syncWithoutDetaching([
            $artificialIntelligence->id,
            $computerScience->id,
        ]);

        $opportunity->degrees()->syncWithoutDetaching([
            $master->id,
        ]);

        $opportunity->opportunityNationalities()->updateOrCreate(
            [
                'country_id' => $palestine->id,
            ],
            [
                'eligibility_type' => 'eligible',
            ]
        );

        $opportunity->skills()->syncWithoutDetaching([
            $python->id => [
                'is_mandatory' => true,
            ],

            $machineLearning->id => [
                'is_mandatory' => true,
            ],

            $javascript->id => [
                'is_mandatory' => false,
            ],
        ]);

        $requirements = [
            [
                'requirement_type' => 'gpa',
                'language_id' => null,
                'operator' => '>=',
                'value' => '70',
                'unit' => 'percentage',
                'metadata' => null,
                'is_mandatory' => true,
                'description' => 'Minimum GPA is 70%.',
            ],

            [
                'requirement_type' => 'degree',
                'language_id' => null,
                'operator' => '=',
                'value' => 'BSC',
                'unit' => null,
                'metadata' => null,
                'is_mandatory' => true,
                'description' => 'Applicant must hold a Bachelor degree.',
            ],

            [
                'requirement_type' => 'language',
                'language_id' => $english->id,
                'operator' => '>=',
                'value' => 'B2',
                'unit' => 'CEFR',
                'metadata' => null,
                'is_mandatory' => true,
                'description' => 'Minimum English level is B2.',
            ],
        ];

        foreach ($requirements as $requirement) {
            OpportunityRequirement::updateOrCreate(
                [
                    'opportunity_id' => $opportunity->id,
                    'requirement_type' => $requirement['requirement_type'],
                ],
                [
                    'language_id' => $requirement['language_id'] ?? null,
                    'operator' => $requirement['operator'],
                    'value' => $requirement['value'],
                    'unit' => $requirement['unit'],
                    'metadata' => $requirement['metadata'] ?? null,
                    'is_mandatory' => $requirement['is_mandatory'],
                    'description' => $requirement['description'],
                ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Opportunity 2
        | MSc Data Science
        |--------------------------------------------------------------------------
        */

        $dataScienceOpportunity = Opportunity::updateOrCreate(
            [
                'slug' => 'msc-data-science-example',
            ],
            [
                'title' => 'MSc Data Science',
                'description' => 'Test scholarship opportunity for Data Science.',
                'university_id' => $university->id,
                'country_id' => $uk->id,
                'opportunity_type_id' => $scholarship->id,
                'funding_type_id' => $fullyFunded->id,
                'application_url' => 'https://example.edu/data-science/apply',
                'source_url' => 'https://example.edu/data-science',
                'deadline' => now()->addMonths(4),
                'start_date' => now()->addMonths(8)->startOfMonth(),
                'end_date' => null,
                'status' => 'published',
                'is_verified' => true,
                'created_by' => $admin->id,
            ]
        );

        $dataScienceOpportunity->fields()->syncWithoutDetaching([
            $computerScience->id,
            $dataScience->id,
        ]);

        $dataScienceOpportunity->degrees()->syncWithoutDetaching([
            $master->id,
        ]);

        $dataScienceOpportunity->opportunityNationalities()->updateOrCreate(
            [
                'country_id' => $palestine->id,
            ],
            [
                'eligibility_type' => 'eligible',
            ]
        );

        $dataScienceOpportunity->skills()->syncWithoutDetaching([
            $python->id => [
                'is_mandatory' => true,
            ],

            $dataAnalysis->id => [
                'is_mandatory' => false,
            ],

            $docker->id => [
                'is_mandatory' => false,
            ],
        ]);

        $dataScienceRequirements = [
            [
                'requirement_type' => 'gpa',
                'language_id' => null,
                'operator' => '>=',
                'value' => '75',
                'unit' => 'percentage',
                'metadata' => null,
                'is_mandatory' => true,
                'description' => 'Minimum GPA is 75%.',
            ],

            [
                'requirement_type' => 'degree',
                'language_id' => null,
                'operator' => '=',
                'value' => 'BSC',
                'unit' => null,
                'metadata' => null,
                'is_mandatory' => true,
                'description' => 'Applicant must hold a Bachelor degree.',
            ],

            [
                'requirement_type' => 'language',
                'language_id' => $english->id,
                'operator' => '>=',
                'value' => 'B2',
                'unit' => 'CEFR',
                'metadata' => null,
                'is_mandatory' => true,
                'description' => 'Minimum English level is B2.',
            ],
        ];

        foreach ($dataScienceRequirements as $requirement) {
            OpportunityRequirement::updateOrCreate(
                [
                    'opportunity_id' => $dataScienceOpportunity->id,
                    'requirement_type' => $requirement['requirement_type'],
                ],
                [
                    'language_id' => $requirement['language_id'] ?? null,
                    'operator' => $requirement['operator'],
                    'value' => $requirement['value'],
                    'unit' => $requirement['unit'],
                    'metadata' => $requirement['metadata'] ?? null,
                    'is_mandatory' => $requirement['is_mandatory'],
                    'description' => $requirement['description'],
                ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Opportunity 3
        | MSc Software Engineering
        |--------------------------------------------------------------------------
        */

        $softwareOpportunity = Opportunity::updateOrCreate(
            [
                'slug' => 'msc-software-engineering-example',
            ],
            [
                'title' => 'MSc Software Engineering',
                'description' => 'Test scholarship opportunity for Software Engineering.',
                'university_id' => $university->id,
                'country_id' => $uk->id,
                'opportunity_type_id' => $scholarship->id,
                'funding_type_id' => $fullyFunded->id,
                'application_url' => 'https://example.edu/software/apply',
                'source_url' => 'https://example.edu/software',
                'deadline' => now()->addMonths(5),
                'start_date' => now()->addMonths(9)->startOfMonth(),
                'end_date' => null,
                'status' => 'published',
                'is_verified' => true,
                'created_by' => $admin->id,
            ]
        );

        $softwareOpportunity->fields()->syncWithoutDetaching([
            $computerScience->id,
            $softwareEngineering->id,
        ]);

        $softwareOpportunity->degrees()->syncWithoutDetaching([
            $master->id,
        ]);

        $softwareOpportunity->opportunityNationalities()->updateOrCreate(
            [
                'country_id' => $palestine->id,
            ],
            [
                'eligibility_type' => 'eligible',
            ]
        );

        $softwareOpportunity->skills()->syncWithoutDetaching([
            $php->id => [
                'is_mandatory' => true,
            ],

            $laravel->id => [
                'is_mandatory' => false,
            ],

            $javascript->id => [
                'is_mandatory' => false,
            ],

            $docker->id => [
                'is_mandatory' => false,
            ],
        ]);

        $softwareRequirements = [
            [
                'requirement_type' => 'gpa',
                'language_id' => null,
                'operator' => '>=',
                'value' => '70',
                'unit' => 'percentage',
                'metadata' => null,
                'is_mandatory' => true,
                'description' => 'Minimum GPA is 70%.',
            ],

            [
                'requirement_type' => 'degree',
                'language_id' => null,
                'operator' => '=',
                'value' => 'BSC',
                'unit' => null,
                'metadata' => null,
                'is_mandatory' => true,
                'description' => 'Applicant must hold a Bachelor degree.',
            ],

            [
                'requirement_type' => 'language',
                'language_id' => $english->id,
                'operator' => '>=',
                'value' => 'B1',
                'unit' => 'CEFR',
                'metadata' => null,
                'is_mandatory' => true,
                'description' => 'Minimum English level is B1.',
            ],
        ];

        foreach ($softwareRequirements as $requirement) {
            OpportunityRequirement::updateOrCreate(
                [
                    'opportunity_id' => $softwareOpportunity->id,
                    'requirement_type' => $requirement['requirement_type'],
                ],
                [
                    'language_id' => $requirement['language_id'] ?? null,
                    'operator' => $requirement['operator'],
                    'value' => $requirement['value'],
                    'unit' => $requirement['unit'],
                    'metadata' => $requirement['metadata'] ?? null,
                    'is_mandatory' => $requirement['is_mandatory'],
                    'description' => $requirement['description'],
                ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Opportunity 4
        | MSc Cyber Security
        |--------------------------------------------------------------------------
        */

        $cyberOpportunity = Opportunity::updateOrCreate(
            [
                'slug' => 'msc-cyber-security-example',
            ],
            [
                'title' => 'MSc Cyber Security',
                'description' => 'Test scholarship opportunity for Cyber Security.',
                'university_id' => $university->id,
                'country_id' => $uk->id,
                'opportunity_type_id' => $scholarship->id,
                'funding_type_id' => $fullyFunded->id,
                'application_url' => 'https://example.edu/cyber/apply',
                'source_url' => 'https://example.edu/cyber',
                'deadline' => now()->addMonths(6),
                'start_date' => now()->addMonths(10)->startOfMonth(),
                'end_date' => null,
                'status' => 'published',
                'is_verified' => true,
                'created_by' => $admin->id,
            ]
        );

        $cyberOpportunity->fields()->syncWithoutDetaching([
            $computerScience->id,
            $cyberSecurity->id,
        ]);

        $cyberOpportunity->degrees()->syncWithoutDetaching([
            $master->id,
        ]);

        $cyberOpportunity->opportunityNationalities()->updateOrCreate(
            [
                'country_id' => $palestine->id,
            ],
            [
                'eligibility_type' => 'eligible',
            ]
        );

        $cyberOpportunity->skills()->syncWithoutDetaching([
            $python->id => [
                'is_mandatory' => true,
            ],

            $cyberSecuritySkill->id => [
                'is_mandatory' => false,
            ],

            $docker->id => [
                'is_mandatory' => false,
            ],
        ]);

        $cyberRequirements = [
            [
                'requirement_type' => 'gpa',
                'language_id' => null,
                'operator' => '>=',
                'value' => '75',
                'unit' => 'percentage',
                'metadata' => null,
                'is_mandatory' => true,
                'description' => 'Minimum GPA is 75%.',
            ],

            [
                'requirement_type' => 'degree',
                'language_id' => null,
                'operator' => '=',
                'value' => 'BSC',
                'unit' => null,
                'metadata' => null,
                'is_mandatory' => true,
                'description' => 'Applicant must hold a Bachelor degree.',
            ],

            [
                'requirement_type' => 'language',
                'language_id' => $english->id,
                'operator' => '>=',
                'value' => 'B2',
                'unit' => 'CEFR',
                'metadata' => null,
                'is_mandatory' => true,
                'description' => 'Minimum English level is B2.',
            ],
        ];

        foreach ($cyberRequirements as $requirement) {
            OpportunityRequirement::updateOrCreate(
                [
                    'opportunity_id' => $cyberOpportunity->id,
                    'requirement_type' => $requirement['requirement_type'],
                ],
                [
                    'language_id' => $requirement['language_id'] ?? null,
                    'operator' => $requirement['operator'],
                    'value' => $requirement['value'],
                    'unit' => $requirement['unit'],
                    'metadata' => $requirement['metadata'] ?? null,
                    'is_mandatory' => $requirement['is_mandatory'],
                    'description' => $requirement['description'],
                ]
            );
        }
    }
}
