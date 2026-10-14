<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function profile(): HasOne
    {
        return $this->hasOne(UserProfile::class);
    }

    public function academicRecords(): HasMany
    {
        return $this->hasMany(AcademicRecord::class);
    }

    public function languages(): BelongsToMany
    {
        return $this->belongsToMany(
            Language::class,
            'user_languages'
        )
            ->withPivot([
                'level',
                'test_type',
                'score',
            ])
            ->withTimestamps();
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(
            Skill::class,
            'user_skills'
        )
            ->withPivot([
                'level',
                'years_of_experience',
            ])
            ->withTimestamps();
    }

    public function workExperiences(): HasMany
    {
        return $this->hasMany(WorkExperience::class);
    }

    public function savedOpportunities(): HasMany
    {
        return $this->hasMany(SavedOpportunity::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public function createdOpportunities(): HasMany
    {
        return $this->hasMany(
            Opportunity::class,
            'created_by'
        );
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin' ||
            $this->hasRole('super_admin');
    }

    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    public function hasRole(string $role): bool
    {
        return $this->roles()
            ->where('name', $role)
            ->exists();
    }

    public function hasPermission(string $permission): bool
    {
        if ($this->hasRole('super_admin')) {
            return true;
        }

        return $this->roles()
            ->whereHas(
                'permissions',
                fn($query) => $query->where('name', $permission)
            )
            ->exists();
    }
}
