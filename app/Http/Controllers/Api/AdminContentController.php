<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContentPage;
use App\Models\ContentSection;
use App\Services\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminContentController extends Controller
{
    public function pages(): JsonResponse
    {
        return response()->json([
            'pages' => ContentPage::query()
                ->withCount('sections')
                ->latest('id')
                ->get(),
        ]);
    }

    public function storePage(Request $request, AuditLogger $auditLogger): JsonResponse
    {
        $data = $this->pageData($request);
        $page = ContentPage::create([
            ...$data,
            'slug' => Str::slug($data['slug']),
        ]);

        $auditLogger->record($request, 'content_page.created', $page, null, $page->only([
            'slug',
            'title',
            'description',
            'status',
        ]));

        return response()->json(['page' => $page], 201);
    }

    public function updatePage(Request $request, ContentPage $page, AuditLogger $auditLogger): JsonResponse
    {
        $before = $page->only(['slug', 'title', 'description', 'status', 'published_at']);
        $data = $this->pageData($request, $page->id);
        $page->update([
            ...$data,
            'slug' => Str::slug($data['slug']),
        ]);

        $auditLogger->record($request, 'content_page.updated', $page, $before, $page->fresh()->only([
            'slug',
            'title',
            'description',
            'status',
            'published_at',
        ]));

        return response()->json(['page' => $page->fresh()->loadCount('sections')]);
    }

    public function publishPage(Request $request, ContentPage $page, AuditLogger $auditLogger): JsonResponse
    {
        $before = $page->only(['status', 'published_at']);
        $page->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        $auditLogger->record($request, 'content_page.published', $page, $before, $page->only([
            'status',
            'published_at',
        ]));

        return response()->json(['page' => $page->fresh()]);
    }

    public function unpublishPage(Request $request, ContentPage $page, AuditLogger $auditLogger): JsonResponse
    {
        $before = $page->only(['status', 'published_at']);
        $page->update([
            'status' => 'draft',
            'published_at' => null,
        ]);

        $auditLogger->record($request, 'content_page.unpublished', $page, $before, $page->only([
            'status',
            'published_at',
        ]));

        return response()->json(['page' => $page->fresh()]);
    }

    public function sections(ContentPage $page): JsonResponse
    {
        return response()->json([
            'sections' => $page->sections()->get(),
        ]);
    }

    public function storeSection(Request $request, ContentPage $page, AuditLogger $auditLogger): JsonResponse
    {
        $data = $this->sectionData($request);
        $section = $page->sections()->create($data);

        $auditLogger->record($request, 'content_section.created', $section, null, $section->only([
            'key',
            'type',
            'heading',
            'body',
            'status',
            'is_visible',
            'sort_order',
        ]));

        return response()->json(['section' => $section], 201);
    }

    public function updateSection(Request $request, ContentSection $section, AuditLogger $auditLogger): JsonResponse
    {
        $before = $section->only([
            'key',
            'type',
            'heading',
            'body',
            'status',
            'is_visible',
            'sort_order',
        ]);
        $section->update($this->sectionData($request, $section->id, $section->content_page_id));

        $auditLogger->record($request, 'content_section.updated', $section, $before, $section->fresh()->only([
            'key',
            'type',
            'heading',
            'body',
            'status',
            'is_visible',
            'sort_order',
        ]));

        return response()->json(['section' => $section->fresh()]);
    }

    public function destroySection(Request $request, ContentSection $section, AuditLogger $auditLogger): JsonResponse
    {
        $before = $section->only(['key', 'type', 'heading', 'body', 'status', 'is_visible', 'sort_order']);
        $section->delete();
        $auditLogger->record($request, 'content_section.deleted', null, $before);

        return response()->json(['message' => 'Content section deleted successfully.']);
    }

    private function pageData(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => [
                'required',
                'string',
                'max:120',
                'regex:/^[a-z0-9\s_-]+$/',
                Rule::unique('content_pages', 'slug')->ignore($ignoreId),
            ],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'status' => [Rule::in(['draft', 'published', 'archived'])],
        ]);
    }

    private function sectionData(
        Request $request,
        ?int $ignoreId = null,
        ?int $pageId = null
    ): array {
        return $request->validate([
            'key' => [
                'required',
                'string',
                'max:100',
                'regex:/^[a-z0-9_-]+$/',
                Rule::unique('content_sections', 'key')
                    ->where('content_page_id', $pageId ?? $request->route('page')?->id)
                    ->ignore($ignoreId),
            ],
            'type' => ['required', Rule::in(['text', 'hero', 'cta', 'notice'])],
            'heading' => ['nullable', 'string', 'max:255'],
            'body' => ['nullable', 'string', 'max:10000'],
            'image_url' => ['nullable', 'string', 'max:1000', 'regex:/^(https?:\/\/|\/)/'],
            'cta_label' => ['nullable', 'string', 'max:100'],
            'cta_url' => ['nullable', 'string', 'max:1000', 'regex:/^(https?:\/\/|\/)/'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:100000'],
            'is_visible' => ['sometimes', 'boolean'],
            'status' => [Rule::in(['draft', 'published', 'archived'])],
            'settings' => ['nullable', 'array'],
        ]);
    }
}
