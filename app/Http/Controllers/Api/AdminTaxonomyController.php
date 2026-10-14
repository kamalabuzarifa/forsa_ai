<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Degree;
use App\Models\Field;
use App\Models\FundingType;
use App\Models\Language;
use App\Models\OpportunityType;
use App\Models\Skill;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminTaxonomyController extends Controller
{
    private const TYPES = [
        'fields' => Field::class,
        'degrees' => Degree::class,
        'skills' => Skill::class,
        'languages' => Language::class,
        'opportunity-types' => OpportunityType::class,
        'funding-types' => FundingType::class,
    ];

    public function index(string $taxonomy): JsonResponse
    {
        $model = $this->modelFor($taxonomy);

        return response()->json([
            'taxonomy' => $taxonomy,
            'items' => $model::query()->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request, string $taxonomy): JsonResponse
    {
        $model = $this->modelFor($taxonomy);
        $data = $this->validatedData($request, $taxonomy);

        $item = $model::create($data);

        return response()->json([
            'message' => 'Taxonomy item created successfully.',
            'item' => $item,
        ], 201);
    }

    public function update(Request $request, string $taxonomy, int $id): JsonResponse
    {
        $model = $this->modelFor($taxonomy);
        $item = $model::query()->findOrFail($id);
        $data = $this->validatedData($request, $taxonomy, $item->id);

        $item->update($data);

        return response()->json([
            'message' => 'Taxonomy item updated successfully.',
            'item' => $item->fresh(),
        ]);
    }

    public function destroy(string $taxonomy, int $id): JsonResponse
    {
        $model = $this->modelFor($taxonomy);
        $item = $model::query()->findOrFail($id);

        try {
            $item->delete();
        } catch (QueryException) {
            return response()->json([
                'message' => 'This item is referenced by existing records and cannot be deleted.',
            ], 422);
        }

        return response()->json([
            'message' => 'Taxonomy item deleted successfully.',
        ]);
    }

    private function modelFor(string $taxonomy): string
    {
        abort_unless(isset(self::TYPES[$taxonomy]), 404, 'Unknown taxonomy.');

        return self::TYPES[$taxonomy];
    }

    private function validatedData(
        Request $request,
        string $taxonomy,
        ?int $ignoreId = null
    ): array {
        $table = (new (self::TYPES[$taxonomy]))->getTable();
        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique($table, 'name')->ignore($ignoreId),
            ],
            'code' => ['sometimes', 'nullable', 'string', 'max:50'],
            'description' => ['sometimes', 'nullable', 'string'],
            'category' => ['sometimes', 'nullable', 'string', 'max:100'],
            'parent_id' => ['sometimes', 'nullable', 'integer', 'exists:fields,id'],
        ]);

        $allowed = ['name', 'code', 'description', 'category', 'parent_id'];

        return collect($data)
            ->only($allowed)
            ->map(fn($value) => is_string($value) ? Str::of($value)->trim()->toString() : $value)
            ->all();
    }
}
