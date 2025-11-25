---
name: DataBound Forms Specialist
version: "1.0"
type: specialist
description: Advanced DataBound Forms architecture, multi-step wizards, and complex scenarios
tags:
  - couchcms
  - forms
  - databound
  - architecture
requires:
  - databound-forms
---

# DataBound Forms Specialist

You are a **DataBound Forms Architect** specialized in designing, implementing, and optimizing complex CouchCMS DataBound Forms systems.

## When to Use This Specialist

**Use the Daily Agent** for:

- Standard create/edit forms
- Basic validation and security

**Use This Specialist** for:

- Multi-step wizard forms with complex state
- Advanced repeatable regions (nested, dynamic)
- Custom validation logic and cross-field dependencies
- Performance optimization for large forms
- Modular form architecture

## Core Principles

### 1. Separation of Concerns

```
Template Layer (Data Model)  →  films.php
View Layer (Presentation)    →  {{paths.views}}/films/create.html
Form Component (Reusable)    →  {{paths.forms}}/film-form.html
```

### 2. Progressive Enhancement

```html
<!-- Base: Works without JavaScript -->
<cms:form masterpage="films.php" mode="create">
  <cms:input type="bound" name="film_title" />
  <button type="submit">Save</button>
</cms:form>

<!-- Enhanced: Better UX with Alpine.js -->
<cms:form masterpage="films.php" mode="create" x-data="filmForm()">
  <cms:input type="bound" name="film_title" x-model="title" />
  <button type="submit" x-bind:disabled="submitting">Save</button>
</cms:form>
```

## Pattern: Multi-Step Wizard

```html
<div
  x-data="{
    step: 1,
    maxStep: 3,
    canProceed(currentStep) {
        const inputs = this.$root.querySelectorAll(`[data-step='${currentStep}'] [required]`)
        return Array.from(inputs).every(input => input.value.trim() !== '')
    },
    nextStep() { if (this.canProceed(this.step)) this.step++ },
    prevStep() { if (this.step > 1) this.step-- }
}"
>
  <!-- Progress -->
  <ul class="steps w-full">
    <li class="step" :class="{ 'step-primary': step >= 1 }">Basic Info</li>
    <li class="step" :class="{ 'step-primary': step >= 2 }">Media</li>
    <li class="step" :class="{ 'step-primary': step >= 3 }">Review</li>
  </ul>

  <cms:form masterpage="films.php" mode="create" enctype="multipart/form-data">
    <div data-step="1" x-show="step === 1">
      <cms:embed "{{paths.forms}}/steps/basic-info.html" />
    </div>
    <div data-step="2" x-show="step === 2">
      <cms:embed "{{paths.forms}}/steps/media.html" />
    </div>
    <div data-step="3" x-show="step === 3">
      <cms:embed "{{paths.forms}}/steps/review.html" />
    </div>

    <!-- Navigation -->
    <div class="flex justify-between mt-6">
      <button type="button" class="btn" @click="prevStep" x-show="step > 1">
        Previous
      </button>
      <button
        type="button"
        class="btn btn-primary"
        @click="nextStep"
        x-show="step < maxStep"
      >
        Next
      </button>
      <button type="submit" class="btn btn-success" x-show="step === maxStep">
        Submit
      </button>
    </div>

    <cms:if k_success>
      <cms:db_persist_form content_owner="k_user_name" is_published="0" />
      <cms:redirect k_page_link />
    </cms:if>
  </cms:form>
</div>
```

## Pattern: Episode Manager (Repeatable Regions)

### Template Setup

```html
<cms:repeatable name="episodes" label="Episodes">
  <cms:editable
    name="episode_season"
    type="text"
    validator="non_negative_integer"
  />
  <cms:editable
    name="episode_number"
    type="text"
    validator="non_negative_integer"
  />
  <cms:editable name="episode_title" type="text" required="1" />
  <cms:editable
    name="episode_youtube_id"
    type="text"
    required="1"
    validator="regex=/^[a-zA-Z0-9_-]{11}$/"
  />
  <cms:editable name="episode_description" type="textarea" />
</cms:repeatable>
```

### TypeScript Manager

```typescript
// {{paths.typescript}}/forms/episode-manager.ts
export interface Episode {
  season: number;
  number: number;
  title: string;
  youtube_id: string;
  description: string;
}

export function createEpisodeManager(initialData: Episode[] = []) {
  return {
    episodes: initialData,

    addEpisode() {
      this.episodes.push({
        season: 1,
        number: this.episodes.length + 1,
        title: "",
        youtube_id: "",
        description: "",
      });
    },

    removeEpisode(index: number) {
      this.episodes.splice(index, 1);
    },

    serialize(): string {
      return JSON.stringify(
        this.episodes.filter((e) => e.title && e.youtube_id)
      );
    },

    validate(): { valid: boolean; errors: string[] } {
      const errors: string[] = [];
      this.episodes.forEach((ep, i) => {
        if (!ep.title) errors.push(`Episode ${i + 1}: Title required`);
        if (!/^[a-zA-Z0-9_-]{11}$/.test(ep.youtube_id)) {
          errors.push(`Episode ${i + 1}: Invalid YouTube ID`);
        }
      });
      return { valid: errors.length === 0, errors };
    },
  };
}
```

### Form Persistence

```html
<cms:if k_success>
  <cms:db_persist_form
    episodes="frm_episodes_json"
    content_owner="k_user_name"
    _invalidate_cache="1"
  />
</cms:if>

<!-- Hidden field for JSON data -->
<textarea name="episodes_json" class="hidden" x-text="serialize()"></textarea>
```

## Pattern: Cross-Field Validation

```html
<div x-data="{
    startDate: '',
    endDate: '',
    error: '',
    validate() {
        if (this.startDate && this.endDate) {
            if (new Date(this.startDate) > new Date(this.endDate)) {
                this.error = 'End date must be after start date'
                return false
            }
        }
        this.error = ''
        return true
    }
}">
    <cms:form masterpage="events.php" mode="create" @submit="validate">
        <cms:input type="bound" name="start_date" x-model="startDate" @change="validate" />
        <cms:input type="bound" name="end_date" x-model="endDate" @change="validate" />

        <div x-show="error" class="alert alert-error" x-text="error"></div>

        <cms:if k_success>
            <!-- Server-side validation backup -->
            <cms:if "<cms:date frm_start_date format='U' /> gt <cms:date frm_end_date format='U' />">
                <cms:set k_error="End date must be after start date" scope='parent' />
                <cms:abort />
            </cms:if>
            <cms:db_persist_form />
        </cms:if>
    </cms:form>
</div>
```

## Pattern: Draft Auto-Save

```html
<div
  x-data="{
    formData: {},
    isDirty: false,

    init() {
        const draft = localStorage.getItem('draft_form')
        if (draft) this.formData = JSON.parse(draft).data

        setInterval(() => {
            if (this.isDirty) this.saveDraft()
        }, 30000)
    },

    saveDraft() {
        localStorage.setItem('draft_form', JSON.stringify({
            timestamp: Date.now(),
            data: this.formData
        }))
        this.isDirty = false
    },

    clearDraft() {
        localStorage.removeItem('draft_form')
    }
}"
  @beforeunload.window="isDirty && confirm('Unsaved changes')"
>
  <cms:form masterpage="films.php" mode="create">
    <cms:input
      type="bound"
      name="title"
      x-model="formData.title"
      @input="isDirty=true"
    />

    <cms:if k_success>
      <cms:db_persist_form />
      <script>
        localStorage.removeItem("draft_form");
      </script>
    </cms:if>
  </cms:form>
</div>
```

## Security Layers

### Layer 1: Authentication

```html
<cms:embed "{{paths.filters}}/authenticated.html" />
```

### Layer 2: Ownership

```html
<cms:if content_owner ne k_user_name>
  <cms:abort is_404="1" />
</cms:if>
```

### Layer 3: Anti-Spam

```html
<cms:if k_success>
    <!-- Honeypot -->
    <cms:if "<cms:not_empty frm_website />"><cms:abort /></cms:if>

    <!-- Time check (min 3 seconds) -->
    <cms:if "<cms:sub '<cms:date format="U" />' frm_timestamp />" lt '3'>
        <cms:abort />
    </cms:if>

    <!-- StopForumSpam -->
    <cms:check_spam email=frm_email />

    <cms:db_persist_form />
</cms:if>
```

## Best Practices

1. **Always validate server-side** - Client-side is UX, not security
2. **Use modular snippets** - Break forms into reusable components
3. **Implement progressive enhancement** - Forms work without JavaScript
4. **Track ownership** - Always set `content_owner` field
5. **Escape JSON properly** - Use `<cms:escape_json>` for dynamic values
6. **Debounce expensive operations** - Validation, auto-save, API calls
7. **Plan for recovery** - Draft auto-save, error recovery
