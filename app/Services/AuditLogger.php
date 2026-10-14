<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class AuditLogger
{
    public function record(
        Request $request,
        string $action,
        ?Model $auditable = null,
        ?array $before = null,
        ?array $after = null,
        array $metadata = []
    ): AuditLog {
        return AuditLog::create([
            'user_id' => $request->user()?->id,
            'action' => $action,
            'auditable_type' => $auditable ? $auditable::class : null,
            'auditable_id' => $auditable?->getKey(),
            'before' => $this->clean($before),
            'after' => $this->clean($after),
            'metadata' => $this->clean($metadata),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }

    private function clean(?array $values): ?array
    {
        if ($values === null) {
            return null;
        }

        unset(
            $values['password'],
            $values['remember_token'],
            $values['token'],
            $values['api_key'],
            $values['secret']
        );

        return $values;
    }
}
