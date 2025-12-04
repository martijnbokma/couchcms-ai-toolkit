# Wizard Steps Analysis & Improvement Recommendations

**Date:** 2025-01-01
**Scope:** Complete analysis of all wizard step templates with actionable improvements

---

## Executive Summary

This document provides a comprehensive analysis of each wizard step in the CouchCMS AI Toolkit setup wizard. Each step is evaluated for:
- **Accessibility** (WCAG 2.1 AA compliance)
- **User Experience** (clarity, guidance, error prevention)
- **Code Quality** (consistency, maintainability, best practices)
- **Functionality** (state management, validation, error handling)

**Total Steps Analyzed:** 10
**Critical Issues Found:** 8
**Enhancement Opportunities:** 23

---

## Step-by-Step Analysis

### Step 1: Project Information (`project.html`)

**Current State:** ✅ Good foundation, needs enhancements

#### Issues Found

1. **Missing Input Validation Feedback**
   - No real-time validation feedback
   - No character count indicators
   - No format validation (project name should be URL-safe)

2. **Accessibility Gaps**
   - Missing `aria-describedby` for form fields
   - No error message containers
   - Placeholder text used as labels (accessibility anti-pattern)

3. **User Experience**
   - Default values might confuse users ("my-project" suggests it's required)
   - No help text explaining naming conventions
   - Description field has no character limit indicator

#### Recommended Improvements

```html
<!-- Add validation attributes and feedback -->
<input
    type="text"
    id="projectName"
    name="projectName"
    placeholder="my-awesome-project"
    class="input input-bordered w-full focus:input-primary rounded-xl text-sm sm:text-base"
    required
    aria-required="true"
    aria-describedby="projectName-help projectName-error"
    pattern="[a-z0-9-]+"
    minlength="3"
    maxlength="100"
    value="{{ projectName or '' }}"
/>
<div id="projectName-help" class="text-xs text-base-content/60 mt-1">
    Use lowercase letters, numbers, and hyphens only. 3-100 characters.
</div>
<div id="projectName-error" class="text-xs text-error mt-1 hidden" role="alert"></div>

<!-- Add character counter for description -->
<div class="form-control mb-4 sm:mb-6">
    <label for="projectDescription" class="label py-1 sm:py-2">
        <span class="label-text text-sm sm:text-base font-medium text-base-content">
            Project Description
            <span class="text-xs font-normal text-base-content/60 ml-2">(optional)</span>
        </span>
    </label>
    <textarea
        id="projectDescription"
        name="projectDescription"
        placeholder="A CouchCMS web application for..."
        class="textarea textarea-bordered w-full focus:textarea-primary rounded-xl text-sm sm:text-base"
        rows="3"
        maxlength="500"
        aria-describedby="projectDescription-help projectDescription-counter"
    >{{ projectDescription or '' }}</textarea>
    <div class="flex justify-between items-center mt-1">
        <div id="projectDescription-help" class="text-xs text-base-content/60">
            Brief description of your project (optional)
        </div>
        <div id="projectDescription-counter" class="text-xs text-base-content/60" aria-live="polite">
            <span id="description-count">0</span>/500 characters
        </div>
    </div>
</div>
```

**Priority:** High
**Impact:** Improves accessibility, prevents invalid inputs, better UX

---

### Step 2: Presets (`presets.html`)

**Current State:** ⚠️ Needs significant improvements

#### Issues Found

1. **Inconsistent Emoji Usage**
   - Some presets have emojis (🔍, 📝), others don't
   - Emojis don't match preset types (🔍 for Blog, 📝 for E-commerce)
   - Accessibility: Screen readers will announce emojis awkwardly

2. **Missing Preset Descriptions**
   - No detailed explanation of what each preset includes
   - Users can't see what will be configured
   - No preview of selected preset's impact

3. **No Visual Differentiation**
   - "Skip Presets" option looks identical to preset options
   - No indication of recommended presets
   - No "popular" or "recommended" badges

4. **Accessibility Issues**
   - Radio buttons not properly grouped with `fieldset`
   - Missing `aria-label` for preset groups
   - No keyboard navigation hints

#### Recommended Improvements

```html
<form hx-post="/api/setup/step/presets" hx-target="#wizard-content" hx-swap="innerHTML">
    {% include "partials/hidden-fields.html" %}

    <fieldset class="mb-4 sm:mb-6">
        <legend class="sr-only">Choose a preset configuration or skip to manual setup</legend>

        <!-- Skip Option - Visually Distinct -->
        <div class="mb-4 sm:mb-6">
            <label class="relative flex items-start gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 bg-base-100 border-2 border-dashed border-base-300 cursor-pointer hover:bg-base-200 transition-all shadow-sm rounded-xl">
                <input
                    type="radio"
                    name="preset"
                    value=""
                    class="radio radio-primary radio-sm mt-1"
                    {% if not preset or preset == '' %}checked{% endif %}
                    aria-describedby="skip-preset-description"
                />
                <div class="flex-1 min-w-0">
                    <h3 class="text-xs sm:text-sm font-semibold text-base-content mb-1">
                        Skip Presets
                    </h3>
                    <p id="skip-preset-description" class="text-xs text-base-content/60">
                        Continue with manual configuration - full control over all options
                    </p>
                </div>
            </label>
        </div>

        <!-- Presets Grid -->
        <div class="grid gap-2 mb-4 sm:mb-6">
            {% for presetOption in presets %}
            <label class="relative flex items-start gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 bg-base-200 cursor-pointer hover:bg-base-300 transition-all shadow-sm border border-transparent hover:border-primary/30 rounded-xl">
                <input
                    type="radio"
                    name="preset"
                    value="{{ presetOption.id }}"
                    class="radio radio-primary radio-sm mt-1"
                    {% if preset == presetOption.id %}checked{% endif %}
                    aria-describedby="preset-{{ presetOption.id }}-description"
                />
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <h3 class="text-xs sm:text-sm font-semibold text-base-content">
                            {{ presetOption.name }}
                        </h3>
                        {% if presetOption.recommended %}
                        <span class="badge badge-primary badge-xs">Recommended</span>
                        {% endif %}
                        {% if presetOption.popular %}
                        <span class="badge badge-secondary badge-xs">Popular</span>
                        {% endif %}
                    </div>
                    <p id="preset-{{ presetOption.id }}-description" class="text-xs text-base-content/60 mb-1">
                        {{ presetOption.description }}
                    </p>
                    {% if presetOption.includes %}
                    <details class="mt-1">
                        <summary class="text-xs text-primary cursor-pointer hover:underline">
                            What's included?
                        </summary>
                        <ul class="text-xs text-base-content/70 mt-1 ml-4 list-disc">
                            {% for item in presetOption.includes %}
                            <li>{{ item }}</li>
                            {% endfor %}
                        </ul>
                    </details>
                    {% endif %}
                </div>
            </label>
            {% endfor %}
        </div>
    </fieldset>

    {% set nextButtonLabel = 'Next: Frontend Frameworks' %}
    {% set showBackButton = true %}
    {% include "partials/form-navigation.html" %}
</form>
```

**Priority:** Medium
**Impact:** Better user understanding, improved accessibility, clearer choices

---

### Step 3: Frontend Frameworks (`frontend.html`)

**Current State:** ✅ Good structure, needs enhancements

#### Issues Found

1. **No Dependency Warnings**
   - Selecting daisyUI without TailwindCSS should show warning
   - No indication of framework compatibility
   - Missing dependency explanations

2. **Missing "Select All" / "Deselect All"**
   - Users might want to quickly clear selections
   - No quick actions for common scenarios

3. **No Framework Information**
   - No links to documentation
   - No version information
   - No "why choose this" guidance

4. **Accessibility**
   - Checkbox groups not properly grouped with `fieldset`
   - Missing `aria-describedby` for framework descriptions

#### Recommended Improvements

```html
<form hx-post="/api/setup/step/frontend" hx-target="#wizard-content" hx-swap="innerHTML">
    {% include "partials/hidden-fields.html" %}

    <!-- CSS Framework Section -->
    <fieldset class="mb-4 sm:mb-6">
        <legend class="text-xs sm:text-sm font-semibold mb-2 text-base-content">
            CSS Framework
            <span class="text-xs font-normal text-base-content/60 ml-2">(select one or more)</span>
        </legend>

        <div class="flex flex-wrap gap-2 mb-3">
            <button
                type="button"
                onclick="selectAllCheckboxes('css')"
                class="btn btn-xs btn-ghost"
                aria-label="Select all CSS frameworks"
            >
                Select All
            </button>
            <button
                type="button"
                onclick="deselectAllCheckboxes('css')"
                class="btn btn-xs btn-ghost"
                aria-label="Deselect all CSS frameworks"
            >
                Deselect All
            </button>
        </div>

        <div class="grid gap-2 grid-cols-1 sm:grid-cols-2">
            {% for option in frontendOptions.css %}
            <label class="relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-base-200 cursor-pointer hover:bg-base-300 transition-all shadow-sm border border-transparent hover:border-primary/30 rounded-xl">
                <input
                    type="checkbox"
                    name="css"
                    value="{{ option.id }}"
                    class="checkbox checkbox-primary checkbox-sm shrink-0"
                    {% if option.selected %}checked{% endif %}
                    {% if option.id == 'daisyui' %}data-requires="tailwindcss"{% endif %}
                    aria-describedby="css-{{ option.id }}-description"
                    onchange="checkDependencies(this)"
                />
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <h4 class="text-xs sm:text-sm font-semibold text-base-content">
                            {{ option.name }}
                        </h4>
                        {% if option.version %}
                        <span class="badge badge-ghost badge-xs">{{ option.version }}</span>
                        {% endif %}
                    </div>
                    <p id="css-{{ option.id }}-description" class="text-xs text-base-content/60 line-clamp-2">
                        {{ option.description }}
                    </p>
                    {% if option.docs %}
                    <a
                        href="{{ option.docs }}"
                        target="_blank"
                        class="text-xs text-primary hover:underline mt-1 inline-block"
                        onclick="event.stopPropagation()"
                    >
                        Learn more →
                    </a>
                    {% endif %}
                </div>
            </label>
            {% endfor %}
        </div>

        <!-- Dependency Warning -->
        <div id="daisyui-warning" class="alert alert-warning mt-3 hidden" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="text-xs sm:text-sm">
                <strong>Note:</strong> daisyUI requires TailwindCSS. Please select TailwindCSS as well.
            </span>
        </div>
    </fieldset>

    <!-- JavaScript Framework Section -->
    <!-- Similar structure as CSS section -->

    {% set nextButtonLabel = 'Next: AI Agents' %}
    {% set showBackButton = true %}
    {% include "partials/form-navigation.html" %}
</form>

<script>
function checkDependencies(checkbox) {
    const requires = checkbox.dataset.requires;
    if (requires && checkbox.checked) {
        const requiredCheckbox = document.querySelector(`input[name="${checkbox.name}"][value="${requires}"]`);
        if (requiredCheckbox && !requiredCheckbox.checked) {
            const warning = document.getElementById(`${checkbox.value}-warning`);
            if (warning) warning.classList.remove('hidden');
        }
    }
}

function selectAllCheckboxes(groupName) {
    document.querySelectorAll(`input[name="${groupName}"]`).forEach(cb => cb.checked = true);
}

function deselectAllCheckboxes(groupName) {
    document.querySelectorAll(`input[name="${groupName}"]`).forEach(cb => cb.checked = false);
}
</script>
```

**Priority:** Medium
**Impact:** Prevents configuration errors, better user guidance

---

### Step 4: AI Agents (`agents.html`)

**Current State:** ✅ Good, needs minor enhancements

#### Issues Found

1. **Missing Agent Descriptions**
   - No explanation of what each agent does
   - No indication of agent capabilities
   - Users might select unnecessary agents

2. **No Agent Grouping Logic**
   - Frontend agents and dev tools mixed visually
   - No indication of which agents work together
   - Missing "recommended based on selections" feature

3. **Accessibility**
   - Missing `fieldset` grouping
   - No `aria-describedby` for agent descriptions

#### Recommended Improvements

```html
<form hx-post="/api/setup/step/agents" hx-target="#wizard-content" hx-swap="innerHTML">
    {% include "partials/hidden-fields.html" %}

    <!-- Recommended Agents Section -->
    {% if recommendedAgents|length > 0 %}
    <div class="alert alert-info mb-4 sm:mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div class="text-xs sm:text-sm">
            <p class="font-semibold">Recommended Agents:</p>
            <p>Based on your frontend selections, we recommend these agents:</p>
            <div class="flex flex-wrap gap-2 mt-2">
                {% for agent in recommendedAgents %}
                <span class="badge badge-primary badge-sm">{{ agent }}</span>
                {% endfor %}
            </div>
        </div>
    </div>
    {% endif %}

    <!-- Frontend Agents -->
    <fieldset class="mb-4 sm:mb-6">
        <legend class="text-xs sm:text-sm font-semibold mb-2 text-base-content">
            Frontend Agents
            <span class="text-xs font-normal text-base-content/60 ml-2">(optional)</span>
        </legend>
        <p class="text-xs text-base-content/60 mb-3">
            Agents for frontend frameworks and tools. Select agents that match your chosen frameworks.
        </p>
        <!-- Agent checkboxes with enhanced descriptions -->
    </fieldset>

    <!-- Development Tools -->
    <fieldset class="mb-4 sm:mb-6">
        <legend class="text-xs sm:text-sm font-semibold mb-2 text-base-content">
            Development Tools
            <span class="text-xs font-normal text-base-content/60 ml-2">(optional)</span>
        </legend>
        <p class="text-xs text-base-content/60 mb-3">
            Optional agents for development tools and workflows.
        </p>
        <!-- Agent checkboxes -->
    </fieldset>

    {% set nextButtonLabel = 'Next: Editors' %}
    {% set showBackButton = true %}
    {% include "partials/form-navigation.html" %}
</form>
```

**Priority:** Low
**Impact:** Better user guidance, prevents over-selection

---

### Step 5: Editors (`editors.html`)

**Current State:** ⚠️ Needs improvements

#### Issues Found

1. **Missing Function Definitions**
   - `selectAllEditors()` and `deselectAllEditors()` referenced but not defined in template
   - Functions should be in global scope or inline script

2. **No Editor Icons**
   - Visual identification would help users
   - Missing brand colors/logos

3. **Accessibility**
   - Missing `fieldset` grouping
   - No keyboard shortcuts mentioned
   - Missing `aria-describedby`

4. **User Experience**
   - No indication of what configuration files will be generated
   - No preview of editor-specific configs

#### Recommended Improvements

```html
<form hx-post="/api/setup/step/editors" hx-target="#wizard-content" hx-swap="innerHTML">
    {% include "partials/hidden-fields.html" %}

    <!-- Popular Editors -->
    <fieldset class="mb-4 sm:mb-6">
        <legend class="text-xs sm:text-sm font-semibold mb-2 flex items-center gap-2 text-base-content">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Popular Editors & AI Tools
        </legend>
        <p class="text-xs text-base-content/60 mb-3">
            Configuration files will be generated for selected editors.
        </p>
        <div class="grid gap-2 grid-cols-1 sm:grid-cols-2">
            {% for editor in popularEditors %}
            <label class="relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-base-200 cursor-pointer hover:bg-base-300 transition-all shadow-sm border border-transparent hover:border-primary/30 rounded-xl">
                <input
                    type="checkbox"
                    name="editors"
                    value="{{ editor.id }}"
                    class="checkbox checkbox-primary checkbox-sm shrink-0"
                    {% if editor.selected %}checked{% endif %}
                    aria-describedby="editor-{{ editor.id }}-description"
                />
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <h4 class="text-xs sm:text-sm font-semibold text-base-content">
                            {{ editor.name }}
                        </h4>
                        {% if editor.configFiles %}
                        <span class="badge badge-ghost badge-xs" title="Generates: {{ editor.configFiles|join(', ') }}">
                            {{ editor.configFiles|length }} file{{ editor.configFiles|length != 1 ? 's' : '' }}
                        </span>
                        {% endif %}
                    </div>
                    <p id="editor-{{ editor.id }}-description" class="text-xs text-base-content/60 line-clamp-2">
                        {{ editor.description }}
                    </p>
                    {% if editor.configFiles %}
                    <details class="mt-1">
                        <summary class="text-xs text-primary cursor-pointer hover:underline">
                            Config files
                        </summary>
                        <ul class="text-xs text-base-content/70 mt-1 ml-4 list-disc">
                            {% for file in editor.configFiles %}
                            <li><code class="bg-base-300 px-1 rounded">{{ file }}</code></li>
                            {% endfor %}
                        </ul>
                    </details>
                    {% endif %}
                </div>
            </label>
            {% endfor %}
        </div>
    </fieldset>

    <!-- Other Editors -->
    <!-- Similar structure -->

    <!-- Quick Actions -->
    <div class="flex flex-wrap gap-2 mb-4 sm:mb-6">
        <button
            type="button"
            onclick="selectAllEditors()"
            class="btn btn-sm btn-ghost"
            aria-label="Select all editors"
        >
            Select All
        </button>
        <button
            type="button"
            onclick="deselectAllEditors()"
            class="btn btn-sm btn-ghost"
            aria-label="Deselect all editors"
        >
            Deselect All
        </button>
    </div>

    {% set nextButtonLabel = 'Next: Advanced Options' %}
    {% set showBackButton = true %}
    {% include "partials/form-navigation.html" %}
</form>

<script>
function selectAllEditors() {
    document.querySelectorAll('input[name="editors"]').forEach(cb => cb.checked = true);
}

function deselectAllEditors() {
    document.querySelectorAll('input[name="editors"]').forEach(cb => cb.checked = false);
}
</script>
```

**Priority:** High
**Impact:** Fixes broken functionality, improves UX

---

### Step 6: Advanced Options (`advanced.html`)

**Current State:** ✅ Good, needs minor improvements

#### Issues Found

1. **Missing JavaScript Functions**
   - `toggleInfo()` and `updateFrameworkVisibility()` referenced but not defined
   - Functions should be in template or global scope

2. **Accessibility**
   - Info buttons use `onclick` instead of proper event handlers
   - Missing `aria-expanded` state management
   - Collapsible sections should use proper ARIA attributes

3. **User Experience**
   - Context directory is hardcoded, but explanation suggests it can be changed
   - No visual indication of what CADS framework includes
   - Missing "why enable this" guidance

#### Recommended Improvements

```html
<form hx-post="/api/setup/step/advanced" hx-target="#wizard-content" hx-swap="innerHTML" onsubmit="return handleAdvancedSubmit(event)" aria-label="Advanced options configuration form">
    {% include "partials/hidden-fields.html" %}

    <!-- CADS Framework Section -->
    <fieldset class="relative flex flex-col h-full px-3 sm:px-4 py-3 sm:py-4 bg-base-200 shadow-sm border border-base-300 rounded-xl mb-3 sm:mb-4">
        <legend class="sr-only">CADS Framework Configuration</legend>
        <div class="w-full">
            <div class="flex items-center gap-2 mb-2 sm:mb-3">
                <h3 class="flex items-center gap-2 text-base sm:text-lg font-semibold text-base-content">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span class="flex-1">CADS Framework</span>
                    <span class="text-xs sm:text-sm text-base-content/60 font-normal">(CouchCMS AI Development Standards)</span>
                </h3>
                <button
                    type="button"
                    id="cads-info-toggle"
                    class="btn btn-circle btn-xs sm:btn-sm btn-ghost text-info hover:bg-info/10 tooltip tooltip-left flex items-center justify-center shrink-0 cursor-pointer"
                    data-tip="More information about CADS Framework"
                    aria-label="Show more information about CADS Framework"
                    aria-expanded="false"
                    aria-controls="cads-info"
                    onclick="toggleInfo('cads-info', this)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </button>
            </div>

            <div id="cads-info" class="mb-3 sm:mb-4 hidden" role="region" aria-labelledby="cads-info-heading">
                <!-- Info content -->
            </div>

            <!-- Framework checkbox with proper change handler -->
            <div class="form-control">
                <label class="label cursor-pointer justify-start gap-4">
                    <input
                        type="checkbox"
                        name="framework"
                        value="true"
                        class="checkbox checkbox-primary rounded-xl"
                        {% if framework %}checked{% endif %}
                        onchange="updateFrameworkVisibility()"
                        aria-describedby="framework-description"
                        id="framework-checkbox"
                    />
                    <span class="label-text font-medium text-base-content">Enable CADS Framework</span>
                </label>
                <span id="framework-description" class="sr-only">Enables structured AI agent behavior for CouchCMS projects</span>
            </div>

            <!-- Framework options with proper visibility control -->
            <div id="framework-options" class="mt-3 sm:mt-4 {% if not framework %}hidden{% endif %}" role="group" aria-labelledby="framework-components-heading">
                <!-- Component checkboxes -->
            </div>
        </div>
    </fieldset>

    <!-- Context Directory Section -->
    <!-- Similar improvements -->

    {% set nextButtonLabel = 'Next: Review' %}
    {% set showBackButton = true %}
    {% include "partials/form-navigation.html" %}
</form>

<script>
function toggleInfo(infoId, button) {
    const info = document.getElementById(infoId);
    const isHidden = info.classList.contains('hidden');

    if (isHidden) {
        info.classList.remove('hidden');
        button.setAttribute('aria-expanded', 'true');
    } else {
        info.classList.add('hidden');
        button.setAttribute('aria-expanded', 'false');
    }
}

function updateFrameworkVisibility() {
    const checkbox = document.getElementById('framework-checkbox');
    const options = document.getElementById('framework-options');

    if (checkbox.checked) {
        options.classList.remove('hidden');
    } else {
        options.classList.add('hidden');
        // Uncheck all framework component checkboxes
        options.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    }
}

function handleAdvancedSubmit(event) {
    // Add any validation logic here
    return true;
}
</script>
```

**Priority:** High
**Impact:** Fixes broken functionality, improves accessibility

---

### Step 7: Review (`review.html`)

**Current State:** ✅ Good, needs enhancements

#### Issues Found

1. **Missing Edit Navigation Logic**
   - `data-edit-step` and `data-edit-route` attributes not handled
   - Edit buttons don't navigate back to steps
   - No JavaScript to handle edit clicks

2. **Incomplete State Display**
   - Agents section missing from review
   - No summary of selected presets' impact
   - Missing validation summary

3. **Accessibility**
   - Edit buttons need proper `aria-label`
   - Missing keyboard navigation for edit actions

4. **User Experience**
   - No "change summary" showing what will be generated
   - Missing file count/preview
   - No warning if critical options are missing

#### Recommended Improvements

```html
<div>
    {% set sectionTitle = 'Review Configuration' %}
    {% set sectionDescription = 'Review your settings before generating the configuration.' %}
    {% include "partials/section-header.html" %}

    <!-- Validation Summary -->
    {% if validationErrors|length > 0 %}
    <div class="alert alert-error mb-4 sm:mb-6" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
            <h3 class="font-bold">Please fix the following issues:</h3>
            <ul class="list-disc list-inside">
                {% for error in validationErrors %}
                <li>{{ error }}</li>
                {% endfor %}
            </ul>
        </div>
    </div>
    {% endif %}

    <!-- Configuration Summary -->
    <div class="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        <!-- All review sections with edit buttons -->

        <!-- Agents Section (if extended) -->
        {% if setupType == 'extended' and agents|length > 0 %}
        <div class="relative flex flex-col h-full px-4 sm:px-5 py-3 sm:py-4 bg-base-200/50 shadow-sm border border-base-300 rounded-xl hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between gap-3">
                <div class="flex-1 min-w-0">
                    <h3 class="flex items-center gap-2 text-base sm:text-lg font-semibold mb-3 text-base-content">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AI Agents
                    </h3>
                    <div class="flex flex-wrap gap-2 mt-2">
                        {% for agent in agents %}
                        <span class="badge badge-primary badge-md font-medium">{{ agent }}</span>
                        {% endfor %}
                    </div>
                </div>
                <button
                    type="button"
                    data-edit-step="4"
                    data-edit-route="agents"
                    class="btn btn-sm btn-ghost btn-circle text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
                    aria-label="Edit AI Agents"
                    onclick="editStep(this)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
            </div>
        </div>
        {% endif %}

        <!-- File Generation Preview -->
        <div class="alert alert-info mb-4 sm:mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="text-xs sm:text-sm">
                <p class="font-semibold">Files to be generated:</p>
                <ul class="list-disc list-inside mt-1">
                    <li><code>config/standards.md</code> (always generated)</li>
                    {% for editor in editors %}
                    {% for file in editor.configFiles %}
                    <li><code>{{ file }}</code> (for {{ editor }})</li>
                    {% endfor %}
                    {% endfor %}
                </ul>
            </div>
        </div>
    </div>

    <!-- Generate Form -->
    <form hx-post="/api/setup/generate" hx-target="#wizard-content" hx-swap="innerHTML" class="mt-6" id="generate-form">
        <!-- Form fields -->
    </form>
</div>

<script>
function editStep(button) {
    const stepNum = button.getAttribute('data-edit-step');
    const route = button.getAttribute('data-edit-route');

    if (window.wizardNavigation) {
        window.wizardNavigation.navigateToStep(parseInt(stepNum), route);
    } else {
        console.error('wizardNavigation not available');
    }
}

// Add event listeners for all edit buttons
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-edit-step]').forEach(button => {
        button.addEventListener('click', function() {
            editStep(this);
        });
    });
});
</script>
```

**Priority:** High
**Impact:** Fixes broken edit functionality, improves review completeness

---

### Step 8: Success (`success.html`)

**Current State:** ✅ Excellent, minor enhancements possible

#### Issues Found

1. **Missing Dynamic Content**
   - No project name in success message
   - No link to generated files
   - No copy-to-clipboard for commands

2. **Accessibility**
   - Links should have proper `rel` attributes
   - Missing skip links for keyboard navigation

#### Recommended Improvements

```html
<div>
    <div class="mb-4 sm:mb-6">
        <div class="flex items-center gap-2 sm:gap-3 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-success shrink-0 h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-xl sm:text-2xl font-semibold text-base-content">
                Setup Complete{% if projectName %} for {{ projectName }}{% endif %}!
            </h2>
        </div>
        <p class="text-xs sm:text-sm text-base-content/60">
            Your CouchCMS AI Toolkit is now configured and ready to use. Follow the steps below to get started.
        </p>
    </div>

    <!-- Quick Start with Copy-to-Clipboard -->
    <div class="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <div class="relative flex flex-col h-full px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/20 rounded-xl shadow-sm">
            <div>
                <h3 class="flex items-center gap-2 text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-base-content">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick Start - Next Steps
                </h3>
                <ol class="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-base-content/90">
                    <li class="flex gap-3 items-start">
                        <span class="flex-shrink-0 w-6 h-6 rounded-full bg-success text-success-content text-xs font-bold flex items-center justify-center">1</span>
                        <div class="flex-1 pt-0.5">
                            <strong class="text-base-content">Review your configuration:</strong>
                            <div class="flex items-center gap-2 mt-1">
                                <code class="bg-base-300 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-mono border border-base-content/10">config/standards.md</code>
                                <button
                                    type="button"
                                    onclick="copyToClipboard('config/standards.md')"
                                    class="btn btn-xs btn-ghost"
                                    aria-label="Copy path to clipboard"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                            <p class="text-xs text-base-content/60 mt-1">Check and customize your project settings if needed.</p>
                        </div>
                    </li>
                    <!-- Similar for other steps with copy buttons -->
                </ol>
            </div>
        </div>
    </div>

    <!-- Rest of success page -->
</div>

<script>
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show toast notification
        const toast = document.createElement('div');
        toast.className = 'toast toast-top toast-end';
        toast.innerHTML = `
            <div class="alert alert-success">
                <span>Copied to clipboard!</span>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    });
}
</script>
```

**Priority:** Low
**Impact:** Better user experience, convenience features

---

### Step 9: Error (`error.html`)

**Current State:** ⚠️ Needs improvements

#### Issues Found

1. **Poor Error Handling**
   - Generic error message only
   - No error code or type
   - No recovery suggestions

2. **Accessibility**
   - Error message not in proper `role="alert"`
   - Missing error context

3. **User Experience**
   - `history.back()` might not work as expected
   - No option to retry or contact support

#### Recommended Improvements

```html
<div>
    {% set sectionTitle = 'Error' %}
    {% include "partials/section-header.html" %}

    <div class="relative flex flex-col h-full px-3 sm:px-4 py-2.5 sm:py-3 bg-error/10 border border-error/20 rounded-xl mb-4 sm:mb-6" role="alert">
        <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-error shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
                <h3 class="font-semibold text-error-content mb-1">
                    {% if errorTitle %}{{ errorTitle }}{% else %}An Error Occurred{% endif %}
                </h3>
                <p class="text-xs sm:text-sm text-error-content break-words">
                    {{ errorMessage }}
                </p>
                {% if errorCode %}
                <p class="text-xs text-error-content/60 mt-2">
                    Error Code: <code class="bg-error/20 px-1 rounded">{{ errorCode }}</code>
                </p>
                {% endif %}
            </div>
        </div>
    </div>

    {% if errorSuggestions|length > 0 %}
    <div class="alert alert-info mb-4 sm:mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
            <h4 class="font-semibold mb-2">Try these solutions:</h4>
            <ul class="list-disc list-inside space-y-1">
                {% for suggestion in errorSuggestions %}
                <li class="text-xs sm:text-sm">{{ suggestion }}</li>
                {% endfor %}
            </ul>
        </div>
    </div>
    {% endif %}

    <div class="flex flex-col sm:flex-row justify-between gap-3">
        <button
            onclick="if (window.wizardNavigation) { window.wizardNavigation.navigateBack(); } else { history.back(); }"
            class="relative inline-flex items-center justify-center h-auto px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors bg-base-100 rounded-full border border-base-300 hover:bg-base-200 focus:outline-none cursor-pointer"
            aria-label="Go back to previous step"
        >
            ← Back
        </button>
        <a
            href="/setup/wizard"
            class="relative inline-flex items-center justify-center h-auto px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors bg-primary rounded-full text-primary-content hover:bg-primary/90 focus:outline-none cursor-pointer"
        >
            Start Over
        </a>
    </div>
</div>
```

**Priority:** Medium
**Impact:** Better error recovery, user guidance

---

### Step 10: Complexity (`complexity.html`)

**Current State:** ⚠️ Not currently used, but needs review

#### Issues Found

1. **Not Integrated**
   - This step exists but isn't in the navigation flow
   - May be legacy or planned feature

2. **Missing Implementation**
   - No server-side handling for complexity selection
   - No routing logic

#### Recommendation

**Either:**
- Remove if not needed
- **Or:** Integrate as first step to determine `setupType` dynamically

**Priority:** Low (depends on product decision)
**Impact:** Cleanup or feature completion

---

## Cross-Cutting Improvements

### 1. Form Validation

**Issue:** No client-side validation before submission

**Solution:** Add HTML5 validation + custom JavaScript validation

```javascript
// Add to wizard-init.js or new validation module
function validateStep(stepName, form) {
    const errors = [];

    switch(stepName) {
        case 'project':
            const projectName = form.querySelector('[name="projectName"]').value;
            if (!/^[a-z0-9-]+$/.test(projectName)) {
                errors.push('Project name must contain only lowercase letters, numbers, and hyphens');
            }
            break;
        // Add other step validations
    }

    return errors;
}
```

### 2. Loading States

**Issue:** No loading indicators during HTMX requests

**Solution:** Add HTMX loading indicators

```html
<!-- Add to each form -->
<form
    hx-post="..."
    hx-target="#wizard-content"
    hx-swap="innerHTML"
    hx-indicator="#loading-spinner"
>
    <!-- Form content -->
</form>

<div id="loading-spinner" class="htmx-indicator fixed top-4 right-4">
    <span class="loading loading-spinner loading-lg text-primary"></span>
</div>
```

### 3. Error Handling

**Issue:** No consistent error handling across steps

**Solution:** Standardize error display

```html
<!-- Add to each step template -->
<div id="step-errors" class="alert alert-error hidden mb-4" role="alert">
    <ul id="error-list" class="list-disc list-inside"></ul>
</div>
```

### 4. State Persistence

**Issue:** Form state might be lost on navigation errors

**Solution:** Enhanced state sync

```javascript
// Ensure state is saved before every navigation
document.addEventListener('htmx:beforeRequest', function(event) {
    if (window.formStateSync) {
        const form = event.detail.elt.closest('form');
        if (form) {
            window.formStateSync.syncFormToState(form);
        }
    }
});
```

---

## Priority Summary

### Critical (Fix Immediately)
1. ✅ **Editors Step** - Missing JavaScript functions
2. ✅ **Advanced Step** - Missing JavaScript functions
3. ✅ **Review Step** - Broken edit navigation

### High Priority (Fix Soon)
4. ⚠️ **Project Step** - Input validation and accessibility
5. ⚠️ **Presets Step** - Better descriptions and visual hierarchy
6. ⚠️ **Frontend Step** - Dependency warnings

### Medium Priority (Enhance When Possible)
7. 💡 **Agents Step** - Recommended agents feature
8. 💡 **Error Step** - Better error recovery
9. 💡 **Success Step** - Copy-to-clipboard features

### Low Priority (Nice to Have)
10. 📝 **Complexity Step** - Integration or removal decision
11. 📝 Cross-cutting improvements (validation, loading states)

---

## Implementation Checklist

- [ ] Fix missing JavaScript functions in Editors step
- [ ] Fix missing JavaScript functions in Advanced step
- [ ] Implement edit navigation in Review step
- [ ] Add input validation to Project step
- [ ] Enhance Presets step with better descriptions
- [ ] Add dependency warnings to Frontend step
- [ ] Add recommended agents to Agents step
- [ ] Improve Error step recovery options
- [ ] Add copy-to-clipboard to Success step
- [ ] Decide on Complexity step integration/removal
- [ ] Add cross-cutting form validation
- [ ] Add loading states to all forms
- [ ] Standardize error handling
- [ ] Enhance state persistence

---

## Testing Recommendations

1. **Accessibility Testing**
   - Test with screen readers (NVDA, JAWS, VoiceOver)
   - Test keyboard navigation (Tab, Enter, Space)
   - Validate ARIA attributes

2. **Browser Testing**
   - Chrome/Edge (Chromium)
   - Firefox
   - Safari
   - Mobile browsers

3. **State Management Testing**
   - Navigate back/forward through steps
   - Refresh page mid-wizard
   - Test with browser back button

4. **Error Scenario Testing**
   - Network failures
   - Invalid inputs
   - Server errors
   - Session expiration

---

**Document Version:** 1.0
**Last Updated:** 2025-01-01
**Next Review:** After implementation of critical fixes
