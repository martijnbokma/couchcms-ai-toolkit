# Wizard Implementation Guide - Step-by-Step Code Examples

## Overview

This guide provides detailed implementation code for the wizard redesign, focusing on the core components that ensure reliable state management and improved user experience.

## Table of Contents

1. [WizardStateManager Implementation](#wizardstatemanager-implementation)
2. [FormStateSync Implementation](#formstatesync-implementation)
3. [WizardNavigation Implementation](#wizardnavigation-implementation)
4. [HTMX Integration](#htmx-integration)
5. [State Indicator Component](#state-indicator-component)
6. [Migration Script](#migration-script)

---

## WizardStateManager Implementation

### File: `web/assets/js/core/wizard-state-manager.js`

```javascript
/**
 * Wizard State Manager
 * Centralized state management with validation and persistence
 * Single source of truth for all wizard selections
 */
(function() {
    'use strict'

    const STORAGE_KEY = 'couchcms-wizard-state'
    const STATE_VERSION = '2.0'

    /**
     * Wizard State Manager Class
     */
    class WizardStateManager {
        constructor() {
            this.storageKey = STORAGE_KEY
            this.stateVersion = STATE_VERSION
            this.listeners = new Set()
            this.initialState = this.getInitialState()
        }

        /**
         * Get initial state structure
         */
        getInitialState() {
            return {
                setupType: 'simple',
                projectName: '',
                projectDescription: '',
                preset: '',
                css: [],
                js: [],
                agents: [],
                editors: [],
                framework: false,
                framework_doctrine: false,
                framework_directives: false,
                framework_playbooks: false,
                framework_enhancements: false,
                contextDir: '.project',
                currentStep: 1,
                completedSteps: [],
                lastUpdated: Date.now(),
                version: this.stateVersion
            }
        }

        /**
         * Load state from sessionStorage with validation
         */
        load() {
            try {
                const stored = sessionStorage.getItem(this.storageKey)
                if (!stored) {
                    console.log('[WizardStateManager] No stored state, returning initial state')
                    return { ...this.initialState }
                }

                const state = JSON.parse(stored)
                console.log('[WizardStateManager] Loaded state:', state)

                // Validate state structure
                if (!this.validateState(state)) {
                    console.warn('[WizardStateManager] Invalid state structure, resetting')
                    return { ...this.initialState }
                }

                // Migrate old state if needed
                if (state.version !== this.stateVersion) {
                    console.log('[WizardStateManager] Migrating state from version', state.version)
                    return this.migrateState(state)
                }

                return state
            } catch (error) {
                console.error('[WizardStateManager] Error loading state:', error)
                return { ...this.initialState }
            }
        }

        /**
         * Save state to sessionStorage with validation
         */
        save(state) {
            try {
                const validated = this.validateAndNormalize(state)
                validated.lastUpdated = Date.now()
                validated.version = this.stateVersion

                sessionStorage.setItem(this.storageKey, JSON.stringify(validated))
                console.log('[WizardStateManager] Saved state:', validated)

                // Notify listeners
                this.notifyListeners(validated)

                return validated
            } catch (error) {
                console.error('[WizardStateManager] Error saving state:', error)
                throw error
            }
        }

        /**
         * Update specific fields in state
         */
        update(updates) {
            const current = this.load()
            const updated = { ...current, ...updates }
            return this.save(updated)
        }

        /**
         * Validate state structure
         */
        validateState(state) {
            if (!state || typeof state !== 'object') return false

            // Check required fields
            const required = ['setupType', 'currentStep', 'version']
            if (!required.every(key => key in state)) {
                return false
            }

            // Validate setupType
            if (!['simple', 'extended'].includes(state.setupType)) {
                return false
            }

            // Validate currentStep
            if (typeof state.currentStep !== 'number' || state.currentStep < 1) {
                return false
            }

            return true
        }

        /**
         * Validate and normalize state values
         */
        validateAndNormalize(state) {
            const normalized = { ...this.initialState, ...state }

            // Normalize arrays - ensure they're arrays and remove duplicates
            const arrayFields = ['css', 'js', 'agents', 'editors', 'completedSteps']
            arrayFields.forEach(key => {
                if (normalized[key] && !Array.isArray(normalized[key])) {
                    normalized[key] = []
                } else if (normalized[key]) {
                    normalized[key] = [...new Set(normalized[key].filter(v => v !== null && v !== undefined && v !== ''))]
                }
            })

            // Normalize strings - trim and validate
            const stringFields = ['projectName', 'projectDescription', 'preset', 'contextDir']
            stringFields.forEach(key => {
                if (normalized[key] !== null && normalized[key] !== undefined) {
                    normalized[key] = String(normalized[key]).trim()
                } else {
                    normalized[key] = this.initialState[key]
                }
            })

            // Normalize booleans
            const booleanFields = ['framework', 'framework_doctrine', 'framework_directives', 'framework_playbooks', 'framework_enhancements']
            booleanFields.forEach(key => {
                normalized[key] = Boolean(normalized[key])
            })

            // Normalize numbers
            normalized.currentStep = Math.max(1, parseInt(normalized.currentStep) || 1)
            normalized.lastUpdated = normalized.lastUpdated || Date.now()

            return normalized
        }

        /**
         * Migrate state from old version
         */
        migrateState(oldState) {
            console.log('[WizardStateManager] Migrating state from version', oldState.version)

            // Start with initial state
            const migrated = { ...this.initialState }

            // Map old fields to new structure
            if (oldState.setupType) migrated.setupType = oldState.setupType
            if (oldState.projectName) migrated.projectName = oldState.projectName
            if (oldState.projectDescription) migrated.projectDescription = oldState.projectDescription
            if (oldState.preset !== undefined) migrated.preset = oldState.preset

            // Migrate arrays
            const arrayFields = ['css', 'js', 'agents', 'editors']
            arrayFields.forEach(key => {
                if (oldState[key] && Array.isArray(oldState[key])) {
                    migrated[key] = [...new Set(oldState[key])]
                }
            })

            // Migrate framework options
            if (oldState.framework === 'true' || oldState.framework === true) {
                migrated.framework = true
            }
            const frameworkOptions = ['doctrine', 'directives', 'playbooks', 'enhancements']
            frameworkOptions.forEach(option => {
                const key = `framework_${option}`
                if (oldState[key] === 'true' || oldState[key] === true) {
                    migrated[key] = true
                }
            })

            // Migrate context directory
            if (oldState.contextDir) {
                migrated.contextDir = oldState.contextDir
            }

            // Set current step (try to infer from completed steps)
            if (oldState.completedSteps && Array.isArray(oldState.completedSteps) && oldState.completedSteps.length > 0) {
                migrated.completedSteps = [...oldState.completedSteps]
                migrated.currentStep = Math.max(...oldState.completedSteps) + 1
            }

            return this.save(migrated)
        }

        /**
         * Subscribe to state changes
         */
        subscribe(callback) {
            this.listeners.add(callback)
            return () => this.listeners.delete(callback)
        }

        /**
         * Notify listeners of state changes
         */
        notifyListeners(state) {
            this.listeners.forEach(callback => {
                try {
                    callback(state)
                } catch (error) {
                    console.error('[WizardStateManager] Error in state listener:', error)
                }
            })
        }

        /**
         * Clear state
         */
        clear() {
            try {
                sessionStorage.removeItem(this.storageKey)
                const initialState = { ...this.initialState }
                this.notifyListeners(initialState)
                console.log('[WizardStateManager] State cleared')
            } catch (error) {
                console.error('[WizardStateManager] Error clearing state:', error)
            }
        }

        /**
         * Export state as JSON
         */
        export() {
            return JSON.stringify(this.load(), null, 2)
        }

        /**
         * Import state from JSON
         */
        import(jsonString) {
            try {
                const state = JSON.parse(jsonString)
                if (this.validateState(state)) {
                    return this.save(state)
                } else {
                    throw new Error('Invalid state structure')
                }
            } catch (error) {
                console.error('[WizardStateManager] Error importing state:', error)
                throw error
            }
        }
    }

    // Create singleton instance
    window.WizardStateManager = WizardStateManager
    window.wizardStateManager = new WizardStateManager()

    console.log('[WizardStateManager] Initialized')
})()
```

---

## FormStateSync Implementation

### File: `web/assets/js/core/form-state-sync.js`

```javascript
/**
 * Form State Synchronization
 * Handles bidirectional sync between forms and wizard state
 */
(function() {
    'use strict'

    if (!window.wizardStateManager) {
        console.error('[FormStateSync] WizardStateManager not available')
        return
    }

    const stateManager = window.wizardStateManager

    /**
     * Form State Sync Class
     */
    class FormStateSync {
        constructor() {
            this.debounceTimers = new Map()
            this.debounceDelay = 300
        }

        /**
         * Collect form data and convert to state format
         */
        collectFormData(form) {
            if (!form || form.tagName !== 'FORM') {
                console.warn('[FormStateSync] Invalid form element')
                return {}
            }

            const formData = new FormData(form)
            const data = {}

            // Process all form fields
            for (const [key, value] of formData.entries()) {
                // Framework checkboxes (boolean)
                if (key.startsWith('framework_')) {
                    data[key] = value === 'true' || value === true
                }
                // Framework main checkbox
                else if (key === 'framework') {
                    data[key] = value === 'true' || value === true
                }
                // Array fields (checkboxes)
                else if (['css', 'js', 'agents', 'editors'].includes(key)) {
                    if (!data[key]) data[key] = []
                    if (value && value !== 'false' && value !== '') {
                        data[key].push(value)
                    }
                }
                // Setup type
                else if (key === 'setupType') {
                    data[key] = value || 'simple'
                }
                // Preset (radio button)
                else if (key === 'preset') {
                    data[key] = value || ''
                }
                // Context directory
                else if (key === 'contextDir') {
                    data[key] = value || '.project'
                }
                // Text fields
                else {
                    data[key] = value || ''
                }
            }

            // Remove duplicates from arrays
            ['css', 'js', 'agents', 'editors'].forEach(key => {
                if (data[key] && Array.isArray(data[key])) {
                    data[key] = [...new Set(data[key])]
                }
            })

            return data
        }

        /**
         * Apply state to form elements
         */
        applyStateToForm(form, state) {
            if (!form || form.tagName !== 'FORM') {
                console.warn('[FormStateSync] Invalid form element')
                return
            }

            console.log('[FormStateSync] Applying state to form:', state)

            // Apply text inputs and textareas
            Object.entries(state).forEach(([key, value]) => {
                if (['css', 'js', 'agents', 'editors'].includes(key)) {
                    // Checkboxes - check matching values
                    const checkboxes = form.querySelectorAll(`input[name="${key}"][type="checkbox"]`)
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = Array.isArray(value) && value.includes(checkbox.value)
                    })
                }
                else if (key === 'preset') {
                    // Radio button - check matching value
                    const radio = form.querySelector(`input[name="${key}"][type="radio"][value="${value}"]`)
                    if (radio) {
                        radio.checked = true
                    } else if (value === '') {
                        // Check "skip" option if value is empty
                        const skipRadio = form.querySelector(`input[name="${key}"][type="radio"][value=""]`)
                        if (skipRadio) skipRadio.checked = true
                    }
                }
                else if (key.startsWith('framework_')) {
                    // Framework option checkboxes
                    const checkbox = form.querySelector(`input[name="${key}"][type="checkbox"]`)
                    if (checkbox) {
                        checkbox.checked = value === true || value === 'true'
                    }
                }
                else if (key === 'framework') {
                    // Framework main checkbox
                    const checkbox = form.querySelector(`input[name="${key}"][type="checkbox"]`)
                    if (checkbox) {
                        checkbox.checked = value === true || value === 'true'
                        // Trigger visibility update if function exists
                        if (checkbox.checked && typeof window.updateFrameworkVisibility === 'function') {
                            window.updateFrameworkVisibility()
                        }
                    }
                }
                else {
                    // Text inputs and textareas
                    const input = form.querySelector(`input[name="${key}"], textarea[name="${key}"]`)
                    if (input && input.type !== 'hidden') {
                        input.value = value || ''
                    }
                }
            })

            console.log('[FormStateSync] State applied to form')
        }

        /**
         * Sync form to state (form → state)
         */
        syncFormToState(form) {
            const formData = this.collectFormData(form)
            stateManager.update(formData)
            console.log('[FormStateSync] Synced form to state:', formData)
        }

        /**
         * Restore state to form (state → form)
         */
        restoreStateToForm(form) {
            const state = stateManager.load()
            this.applyStateToForm(form, state)
            console.log('[FormStateSync] Restored state to form')
        }

        /**
         * Setup form event listeners
         */
        setupFormListeners(form) {
            if (!form || form.tagName !== 'FORM') {
                console.warn('[FormStateSync] Invalid form element')
                return
            }

            // Remove existing listeners if any
            const newForm = form.cloneNode(true)
            form.parentNode.replaceChild(newForm, form)

            // Input handler (debounced for text inputs, immediate for checkboxes/radios)
            newForm.addEventListener('input', (e) => {
                if (e.target.type === 'checkbox' || e.target.type === 'radio') {
                    // Immediate save for checkboxes/radios
                    this.syncFormToState(newForm)
                } else {
                    // Debounced save for text inputs
                    this.debouncedSync(newForm)
                }
            }, { capture: true })

            // Change handler for checkboxes/radios (backup)
            newForm.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox' || e.target.type === 'radio') {
                    this.syncFormToState(newForm)
                }
            }, { capture: true })

            // Form submit handler - ensure state is saved
            newForm.addEventListener('submit', (e) => {
                this.syncFormToState(newForm)
            }, { capture: true })

            console.log('[FormStateSync] Form listeners setup complete')
        }

        /**
         * Debounced sync
         */
        debouncedSync(form) {
            const timer = this.debounceTimers.get(form)
            if (timer) clearTimeout(timer)

            const newTimer = setTimeout(() => {
                this.syncFormToState(form)
                this.debounceTimers.delete(form)
            }, this.debounceDelay)

            this.debounceTimers.set(form, newTimer)
        }
    }

    // Create singleton instance
    window.FormStateSync = FormStateSync
    window.formStateSync = new FormStateSync()

    console.log('[FormStateSync] Initialized')
})()
```

---

## WizardNavigation Implementation

### File: `web/assets/js/core/wizard-navigation.js`

```javascript
/**
 * Wizard Navigation Manager
 * Handles navigation between wizard steps with state preservation
 */
(function() {
    'use strict'

    if (!window.wizardStateManager) {
        console.error('[WizardNavigation] WizardStateManager not available')
        return
    }

    const stateManager = window.wizardStateManager

    /**
     * Wizard Navigation Class
     */
    class WizardNavigation {
        constructor() {
            this.stepDefinitions = {
                simple: [
                    { num: 1, route: 'project', label: 'Project' },
                    { num: 2, route: 'editors', label: 'Editors' },
                    { num: 3, route: 'review', label: 'Review' }
                ],
                extended: [
                    { num: 1, route: 'project', label: 'Project' },
                    { num: 2, route: 'presets', label: 'Presets' },
                    { num: 3, route: 'frontend', label: 'Frontend' },
                    { num: 4, route: 'agents', label: 'Agents' },
                    { num: 5, route: 'editors', label: 'Editors' },
                    { num: 6, route: 'advanced', label: 'Advanced' },
                    { num: 7, route: 'review', label: 'Review' }
                ]
            }
        }

        /**
         * Get steps for current setup type
         */
        getSteps(setupType) {
            return this.stepDefinitions[setupType] || this.stepDefinitions.simple
        }

        /**
         * Navigate to specific step
         */
        async navigateToStep(stepNum, route) {
            console.log('[WizardNavigation] Navigating to step', stepNum, 'route:', route)

            // Save current form state before navigating
            const form = document.querySelector('form')
            if (form && window.formStateSync) {
                window.formStateSync.syncFormToState(form)
            }

            // Update state
            const state = stateManager.load()
            const updated = {
                ...state,
                currentStep: stepNum
            }

            // Mark previous steps as completed when moving forward
            if (stepNum > state.currentStep) {
                updated.completedSteps = [
                    ...new Set([...state.completedSteps, state.currentStep])
                ]
            }

            stateManager.save(updated)

            // Build URL with state
            const params = this.stateToURLParams(updated)
            const url = `/api/setup/step/${route}?${params.toString()}`

            console.log('[WizardNavigation] Navigation URL:', url)

            // Navigate via HTMX
            if (window.HTMXUtils && typeof window.HTMXUtils.htmxAjax === 'function') {
                return window.HTMXUtils.htmxAjax('GET', url, {
                    target: '#wizard-content',
                    swap: 'innerHTML'
                })
            } else {
                // Fallback to direct HTMX
                htmx.ajax('GET', url, {
                    target: '#wizard-content',
                    swap: 'innerHTML'
                })
            }
        }

        /**
         * Navigate back
         */
        async navigateBack() {
            const state = stateManager.load()
            const steps = this.getSteps(state.setupType)
            const currentIndex = steps.findIndex(s => s.num === state.currentStep)

            if (currentIndex > 0) {
                const prevStep = steps[currentIndex - 1]
                return this.navigateToStep(prevStep.num, prevStep.route)
            } else {
                console.warn('[WizardNavigation] Already at first step')
            }
        }

        /**
         * Navigate forward
         */
        async navigateForward() {
            const state = stateManager.load()
            const steps = this.getSteps(state.setupType)
            const currentIndex = steps.findIndex(s => s.num === state.currentStep)

            if (currentIndex < steps.length - 1) {
                const nextStep = steps[currentIndex + 1]
                return this.navigateToStep(nextStep.num, nextStep.route)
            } else {
                console.warn('[WizardNavigation] Already at last step')
            }
        }

        /**
         * Convert state to URL parameters
         */
        stateToURLParams(state) {
            const params = new URLSearchParams()

            Object.entries(state).forEach(([key, value]) => {
                // Skip metadata fields
                if (['lastUpdated', 'version', 'currentStep', 'completedSteps'].includes(key)) {
                    return
                }

                if (Array.isArray(value)) {
                    // Array fields - append each value
                    value.forEach(v => {
                        if (v !== null && v !== undefined && v !== '') {
                            params.append(key, v)
                        }
                    })
                } else if (value !== null && value !== undefined && value !== '') {
                    // Single values
                    params.append(key, value)
                }
            })

            return params
        }

        /**
         * Get current step info
         */
        getCurrentStepInfo() {
            const state = stateManager.load()
            const steps = this.getSteps(state.setupType)
            return steps.find(s => s.num === state.currentStep) || steps[0]
        }

        /**
         * Get progress percentage
         */
        getProgressPercentage() {
            const state = stateManager.load()
            const steps = this.getSteps(state.setupType)
            return Math.round((state.currentStep / steps.length) * 100)
        }
    }

    // Create singleton instance
    window.WizardNavigation = WizardNavigation
    window.wizardNavigation = new WizardNavigation()

    // Export global navigation functions for backward compatibility
    window.navigateToStep = function(stepNum, route, setupType) {
        // setupType parameter is kept for backward compatibility but not used
        return window.wizardNavigation.navigateToStep(stepNum, route)
    }

    window.goBack = function() {
        return window.wizardNavigation.navigateBack()
    }

    console.log('[WizardNavigation] Initialized')
})()
```

---

## HTMX Integration

### File: `web/assets/js/core/wizard-init.js`

```javascript
/**
 * Wizard Initialization
 * Sets up HTMX event listeners and form synchronization
 */
(function() {
    'use strict'

    if (!window.wizardStateManager || !window.formStateSync) {
        console.error('[WizardInit] Required dependencies not available')
        return
    }

    const stateManager = window.wizardStateManager
    const formSync = window.formStateSync

    /**
     * Initialize wizard on page load
     */
    function initializeWizard() {
        console.log('[WizardInit] Initializing wizard')

        // Get setup type from URL
        const urlParams = new URLSearchParams(window.location.search)
        const setupType = urlParams.get('type') || urlParams.get('setupType') || 'simple'

        // Initialize state with setup type
        stateManager.update({ setupType })

        // Setup form listeners for initial form
        const form = document.querySelector('form')
        if (form) {
            formSync.setupFormListeners(form)
            // Restore state to form
            setTimeout(() => {
                formSync.restoreStateToForm(form)
            }, 100)
        }

        // Setup HTMX event listeners
        setupHtmxListeners()

        console.log('[WizardInit] Wizard initialized')
    }

    /**
     * Setup HTMX event listeners
     */
    function setupHtmxListeners() {
        // After HTMX swaps content, restore form state
        document.body.addEventListener('htmx:afterSettle', function(event) {
            if (event.detail && event.detail.target && event.detail.target.id === 'wizard-content') {
                console.log('[WizardInit] HTMX content swapped, restoring form state')

                // Wait for DOM to be ready
                requestAnimationFrame(() => {
                    const form = document.querySelector('form')
                    if (form) {
                        // Setup listeners for new form
                        formSync.setupFormListeners(form)
                        // Restore state to form
                        formSync.restoreStateToForm(form)
                    }
                })
            }
        })

        // Before HTMX requests, save current form state
        document.body.addEventListener('htmx:beforeRequest', function(event) {
            const form = event.detail.elt
            if (form && form.tagName === 'FORM') {
                console.log('[WizardInit] HTMX request starting, saving form state')
                formSync.syncFormToState(form)
            }
        })
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWizard)
    } else {
        initializeWizard()
    }

    console.log('[WizardInit] Script loaded')
})()
```

---

## State Indicator Component

### File: `web/templates/partials/state-indicator.html`

```html
{# State Indicator - Shows when state is saved #}
<div
    id="state-indicator"
    class="fixed bottom-4 right-4 z-50 transition-all duration-300 opacity-0 pointer-events-none"
    aria-live="polite"
    aria-atomic="true"
>
    <div class="flex items-center gap-2 px-4 py-2 bg-success text-success-content rounded-lg shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span class="text-sm font-medium">All selections saved</span>
    </div>
</div>

<script>
(function() {
    'use strict'

    if (!window.wizardStateManager) return

    const indicator = document.getElementById('state-indicator')
    if (!indicator) return

    let hideTimeout = null

    function showIndicator() {
        indicator.classList.remove('opacity-0', 'pointer-events-none')
        indicator.classList.add('opacity-100')

        // Auto-hide after 2 seconds
        if (hideTimeout) clearTimeout(hideTimeout)
        hideTimeout = setTimeout(() => {
            indicator.classList.remove('opacity-100')
            indicator.classList.add('opacity-0', 'pointer-events-none')
        }, 2000)
    }

    // Subscribe to state changes
    window.wizardStateManager.subscribe(() => {
        showIndicator()
    })
})()
</script>
```

---

## Migration Script

### File: `web/assets/js/core/wizard-migration.js`

```javascript
/**
 * Wizard State Migration
 * Migrates old wizard state to new format
 */
(function() {
    'use strict'

    if (!window.wizardStateManager) {
        console.error('[WizardMigration] WizardStateManager not available')
        return
    }

    const stateManager = window.wizardStateManager
    const OLD_STORAGE_KEY = 'couchcms-wizard-state'

    /**
     * Migrate old state format to new format
     */
    function migrateOldState() {
        try {
            const oldState = sessionStorage.getItem(OLD_STORAGE_KEY)
            if (!oldState) {
                console.log('[WizardMigration] No old state found')
                return false
            }

            const parsed = JSON.parse(oldState)
            console.log('[WizardMigration] Found old state, migrating...')

            // Check if already migrated
            if (parsed.version === '2.0') {
                console.log('[WizardMigration] State already migrated')
                return false
            }

            // Migrate using state manager's migration method
            const migrated = stateManager.migrateState(parsed)
            console.log('[WizardMigration] Migration complete:', migrated)

            return true
        } catch (error) {
            console.error('[WizardMigration] Error migrating state:', error)
            return false
        }
    }

    // Run migration on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', migrateOldState)
    } else {
        migrateOldState()
    }
})()
```

---

## Usage Example

### Updated Wizard Template

```html
<!-- web/templates/setup/wizard.html -->
{% extends "base.html" %}

{% block title %}Setup Wizard - CouchCMS AI Toolkit Setup{% endblock %}

{% block content %}
<section class="relative w-full min-h-screen py-6 sm:py-10 md:py-16" aria-label="Setup wizard">
    <div class="relative px-4 sm:px-6 md:px-8 lg:px-12 mx-auto text-sm max-w-4xl md:text-base">
        {# Wizard Navigation #}
        {% include "partials/wizard-navigation.html" %}

        {# Progress indicator #}
        <div class="mb-6 sm:mb-8" id="progress-indicator" hx-swap-oob="true">
            {# Will be updated dynamically #}
        </div>

        {# State indicator #}
        {% include "partials/state-indicator.html" %}

        {# Wizard content container #}
        <div class="relative flex flex-col h-full px-4 sm:px-6 py-6 sm:py-8 bg-base-100 border shadow-sm border-base-300 rounded-2xl sm:rounded-3xl bg-opacity-30">
            <div class="card-body p-0" id="wizard-content" role="region" aria-label="Wizard step content">
                {# Initial step loader #}
                <div hx-get="/api/setup/step/project?setupType={{ setupType or 'simple' }}" hx-trigger="load" hx-swap="innerHTML" hx-target="#wizard-content">
                    <div class="flex justify-center items-center py-8 sm:py-12" role="status" aria-label="Loading wizard step">
                        <span class="loading loading-spinner loading-lg text-primary" aria-hidden="true"></span>
                        <span class="sr-only">Loading wizard step...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
{% endblock %}

{% block scripts %}
<script src="/public/dist/js/core/wizard-state-manager.js"></script>
<script src="/public/dist/js/core/form-state-sync.js"></script>
<script src="/public/dist/js/core/wizard-navigation.js"></script>
<script src="/public/dist/js/core/wizard-migration.js"></script>
<script src="/public/dist/js/core/wizard-init.js"></script>
{% endblock %}
```

---

## Testing Checklist

### State Management Tests

- [ ] State loads correctly on page load
- [ ] State saves correctly on form input
- [ ] State persists across navigation
- [ ] State restores correctly when navigating back
- [ ] State clears correctly on reset
- [ ] State migration works for old format

### Form Synchronization Tests

- [ ] Text inputs sync to state
- [ ] Checkboxes sync to state
- [ ] Radio buttons sync to state
- [ ] State restores to form correctly
- [ ] Debouncing works for text inputs
- [ ] Immediate sync works for checkboxes/radios

### Navigation Tests

- [ ] Forward navigation works
- [ ] Back navigation works
- [ ] Step jumping works
- [ ] Progress indicator updates
- [ ] URL parameters are correct
- [ ] State is preserved during navigation

### User Experience Tests

- [ ] State indicator shows on save
- [ ] Progress indicator is accurate
- [ ] Form validation works
- [ ] Error messages are clear
- [ ] Reset functionality works
- [ ] Export/import works

---

*Implementation Guide Version: 1.0*
*Last Updated: 2025-12-01*
