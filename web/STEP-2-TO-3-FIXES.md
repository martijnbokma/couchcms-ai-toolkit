# Step 2 to Step 3 Transition - Immediate Fixes

**Date**: 2025-12-01
**Priority**: HIGH
**Status**: Ready to implement

---

## 🎯 Quick Fix Summary

This document provides immediate, actionable fixes for console errors during step 2→3 transition. Each fix is self-contained and can be applied independently.

---

## Fix 1: Add Type Guards (CRITICAL)

**File**: `web/assets/js/core/type-guards.ts` (NEW FILE)

**Problem**: Window object extensions not type-safe, causing runtime errors

**Solution**: Create type guard utilities

```typescript
/**
 * Type Guards for Window Object Extensions
 * Ensures type safety when accessing window properties
 */

export interface WizardWindow extends Window {
    formStateSync?: {
        syncFormToState: (form: HTMLFormElement | null, immediate?: boolean) => void
        restoreStateToForm: (form: HTMLFormElement | null) => void
        setupFormListeners: (form: HTMLFormElement | null) => void
        cleanupFormListeners: (form: HTMLFormElement | null) => void
    }
    wizardStateManager?: {
        load: () => WizardState
        save: (state: Partial<WizardState>) => WizardState
        update: (updates: Partial<WizardState>) => WizardState
    }
    wizardNavigation?: {
        navigateToStep: (stepNum: number, route: string) => Promise<unknown>
        getCurrentStep: () => StepDefinition | null
        getNextStep: () => StepDefinition | null
    }
    StepConfig?: {
        simple: StepDefinition[]
        extended: StepDefinition[]
        presets: StepDefinition[]
    }
    HTMXUtils?: {
        htmxAjax: (method: string, url: string, options: unknown) => Promise<unknown>
    }
}

interface WizardState {
    setupType: 'simple' | 'extended'
    currentStep?: number
    css?: string[]
    js?: string[]
    agents?: string[]
    editors?: string[]
    [key: string]: unknown
}

interface StepDefinition {
    num: number
    route: string
    label: string
}

/**
 * Type guard: Check if window has formStateSync
 */
export function hasFormStateSync(win: Window): win is WizardWindow {
    return (
        'formStateSync' in win &&
        win.formStateSync !== null &&
        win.formStateSync !== undefined &&
        typeof (win as WizardWindow).formStateSync?.syncFormToState === 'function'
    )
}

/**
 * Type guard: Check if window has wizardStateManager
 */
export function hasWizardStateManager(win: Window): win is WizardWindow {
    return (
        'wizardStateManager' in win &&
        win.wizardStateManager !== null &&
        win.wizardStateManager !== undefined &&
        typeof (win as WizardWindow).wizardStateManager?.load === 'function'
    )
}

/**
 * Type guard: Check if window has wizardNavigation
 */
export function hasWizardNavigation(win: Window): win is WizardWindow {
    return (
        'wizardNavigation' in win &&
        win.wizardNavigation !== null &&
        win.wizardNavigation !== undefined &&
        typeof (win as WizardWindow).wizardNavigation?.navigateToStep === 'function'
    )
}

/**
 * Type guard: Check if window has StepConfig
 */
export function hasStepConfig(win: Window): win is WizardWindow {
    return (
        'StepConfig' in win &&
        win.StepConfig !== null &&
        win.StepConfig !== undefined &&
        typeof (win as WizardWindow).StepConfig === 'object'
    )
}

/**
 * Type guard: Check if window has HTMXUtils
 */
export function hasHTMXUtils(win: Window): win is WizardWindow {
    return (
        'HTMXUtils' in win &&
        win.HTMXUtils !== null &&
        win.HTMXUtils !== undefined &&
        typeof (win as WizardWindow).HTMXUtils?.htmxAjax === 'function'
    )
}

/**
 * Safe access to formStateSync
 */
export function getFormStateSync(): WizardWindow['formStateSync'] {
    if (hasFormStateSync(window)) {
        return window.formStateSync
    }
    console.error('[TypeGuards] formStateSync not available')
    return undefined
}

/**
 * Safe access to wizardStateManager
 */
export function getWizardStateManager(): WizardWindow['wizardStateManager'] {
    if (hasWizardStateManager(window)) {
        return window.wizardStateManager
    }
    console.error('[TypeGuards] wizardStateManager not available')
    return undefined
}

/**
 * Safe access to wizardNavigation
 */
export function getWizardNavigation(): WizardWindow['wizardNavigation'] {
    if (hasWizardNavigation(window)) {
        return window.wizardNavigation
    }
    console.error('[TypeGuards] wizardNavigation not available')
    return undefined
}

/**
 * Safe access to StepConfig
 */
export function getStepConfig(): WizardWindow['StepConfig'] {
    if (hasStepConfig(window)) {
        return window.StepConfig
    }
    console.warn('[TypeGuards] StepConfig not available, using fallback')
    return undefined
}

/**
 * Safe access to HTMXUtils
 */
export function getHTMXUtils(): WizardWindow['HTMXUtils'] {
    if (hasHTMXUtils(window)) {
        return window.HTMXUtils
    }
    console.error('[TypeGuards] HTMXUtils not available')
    return undefined
}
```

**Usage Example**:
```typescript
// Before (unsafe):
window.formStateSync.syncFormToState(form) // Might throw error

// After (safe):
const formSync = getFormStateSync()
if (formSync) {
    formSync.syncFormToState(form, true)
} else {
    console.error('Cannot sync form state - formStateSync not available')
}
```

---

## Fix 2: Fix Checkbox Array Preservation (CRITICAL)

**File**: `web/assets/js/core/form-state-sync.ts`

**Problem**: Checkbox arrays lost when navigating between steps

**Location**: `collectFormData` method (line ~149)

**Current Code** (PROBLEMATIC):
```typescript
collectFormData(form: HTMLFormElement | null): Partial<WizardState> {
    if (!this.isValidForm(form)) {
        return {}
    }

    const existingState = stateManager.load()
    const data: Partial<WizardState> = { ...existingState }

    // Collect checkbox arrays directly from DOM
    this.collectCheckboxFields(form, data, existingState)
    // ...
}
```

**Fixed Code**:
```typescript
collectFormData(form: HTMLFormElement | null): Partial<WizardState> {
    if (!this.isValidForm(form)) {
        return {}
    }

    // CRITICAL: Always start with existing state to preserve selections
    const existingState = stateManager.load()
    const data: Partial<WizardState> = { ...existingState }

    // Collect checkbox arrays - preserve if field doesn't exist in form
    CHECKBOX_FIELDS.forEach(key => {
        const checkboxes = form.querySelectorAll<HTMLInputElement>(
            `input[name="${key}"][type="checkbox"]`
        )

        if (checkboxes.length > 0) {
            // Field exists in form - collect checked values from DOM
            const checkedValues = getCheckboxValues(form, key)
            data[key] = checkedValues
            console.log(`[FormStateSync] Collected ${key} from form:`, checkedValues)
        } else {
            // Field doesn't exist in form - preserve from existing state
            if (existingState[key] && Array.isArray(existingState[key]) && existingState[key].length > 0) {
                data[key] = [...existingState[key]] as string[]
                console.log(`[FormStateSync] Preserved ${key} from state:`, data[key])
            } else {
                // Ensure empty array if not set
                data[key] = []
            }
        }
    })

    // Process other form fields from FormData
    this.collectFormDataFields(form, data)

    // Remove duplicates from arrays
    this.deduplicateArrays(data)

    return data
}
```

**Key Changes**:
1. Always start with existing state (`{ ...existingState }`)
2. Only update checkbox fields if they exist in current form
3. Preserve checkbox arrays from existing state if field doesn't exist
4. Add logging for debugging

---

## Fix 3: Fix Race Condition in Navigation (HIGH PRIORITY)

**File**: `web/assets/js/core/wizard-navigation.ts`

**Problem**: Navigation happens before state sync completes

**Location**: `navigateToStep` method (line ~203)

**Current Code** (PROBLEMATIC):
```typescript
async navigateToStep(stepNum: number, route: string, setupType?: 'simple' | 'extended'): Promise<unknown> {
    console.log('[WizardNavigation] Navigating to step', stepNum, 'route:', route)

    const form = document.querySelector('form')
    if (form && window.formStateSync) {
        await new Promise(resolve => setTimeout(resolve, 50))
        window.formStateSync.syncFormToState(form, true)
        // ... verification ...
    }
    // Navigation happens here - might be too early
}
```

**Fixed Code**:
```typescript
async navigateToStep(stepNum: number, route: string, setupType?: 'simple' | 'extended'): Promise<unknown> {
    console.log('[WizardNavigation] Navigating to step', stepNum, 'route:', route)

    // CRITICAL: Save current form state before navigating
    const form = document.querySelector('form')
    if (form) {
        const formSync = getFormStateSync()
        if (formSync) {
            try {
                console.log('[WizardNavigation] Syncing form state before navigation')

                // Step 1: Immediate sync
                formSync.syncFormToState(form, true)

                // Step 2: Wait for DOM updates (checkboxes might have async handlers)
                await new Promise<void>(resolve => {
                    setTimeout(() => {
                        // Double-check: sync again after delay
                        formSync.syncFormToState(form, true)
                        resolve()
                    }, 50)
                })

                // Step 3: Verify state was saved correctly
                const stateManager = getWizardStateManager()
                if (stateManager) {
                    const savedState = stateManager.load()
                    const checkboxFields = ['css', 'js', 'agents', 'editors'] as const

                    checkboxFields.forEach(key => {
                        const checkboxes = form.querySelectorAll<HTMLInputElement>(
                            `input[name="${key}"][type="checkbox"]`
                        )

                        // If field doesn't exist in form but exists in state, verify it's preserved
                        if (checkboxes.length === 0) {
                            const existingValue = savedState[key]
                            if (existingValue && Array.isArray(existingValue) && existingValue.length > 0) {
                                console.log(`[WizardNavigation] Verified ${key} preserved:`, existingValue)
                            } else {
                                console.warn(`[WizardNavigation] ${key} array might be lost!`)
                            }
                        }
                    })

                    console.log('[WizardNavigation] State verified before navigation:', {
                        css: savedState.css,
                        js: savedState.js,
                        agents: savedState.agents,
                        editors: savedState.editors
                    })
                }
            } catch (error) {
                console.error('[WizardNavigation] Error syncing form state:', error)
                // Continue anyway - don't block navigation
            }
        } else {
            console.warn('[WizardNavigation] formStateSync not available')
        }
    }

    // Update state
    const stateManager = getWizardStateManager()
    if (!stateManager) {
        console.error('[WizardNavigation] wizardStateManager not available')
        return Promise.reject(new Error('wizardStateManager not available'))
    }

    const state = stateManager.load()
    const currentStep = state.currentStep || 1
    const updated: WizardState = {
        ...state,
        currentStep: stepNum
    }

    // Mark previous steps as completed when moving forward
    if (stepNum > currentStep) {
        updated.completedSteps = [
            ...new Set([...(state.completedSteps || []), currentStep])
        ]
    }

    stateManager.save(updated)

    // Build URL with state
    const params = this.stateToURLParams(updated)
    const url = `/api/setup/step/${route}?${params.toString()}`

    console.log('[WizardNavigation] Navigation URL:', url)

    // Navigate via HTMX
    const htmxUtils = getHTMXUtils()
    if (!htmxUtils) {
        console.error('[WizardNavigation] HTMXUtils not available')
        return Promise.reject(new Error('HTMXUtils not available'))
    }

    return htmxUtils.htmxAjax('GET', url, {
        target: '#wizard-content',
        swap: 'innerHTML'
    }).catch(error => {
        console.error('[WizardNavigation] Navigation error:', error)
        throw error
    })
}
```

**Key Changes**:
1. Use type guards (`getFormStateSync()`, etc.)
2. Double-sync with delay to catch async checkbox handlers
3. Verify state after sync
4. Proper error handling
5. Don't block navigation on errors

---

## Fix 4: Improve Step Detection (MEDIUM PRIORITY)

**File**: `web/assets/js/core/wizard-navigation.ts`

**Problem**: Step detection might be incorrect

**Location**: `getCurrentStep` method (line ~90)

**Fixed Code**:
```typescript
getCurrentStep(): StepDefinition | null {
    const stateManager = getWizardStateManager()
    if (!stateManager) {
        console.error('[WizardNavigation] wizardStateManager not available')
        return null
    }

    const state = stateManager.load()
    const setupType = (state.setupType || 'simple') as 'simple' | 'extended' | 'presets'
    const steps = this.getSteps(setupType)

    // First try: use state.currentStep (most reliable)
    if (state.currentStep) {
        const step = steps.find(s => s.num === state.currentStep)
        if (step) {
            // Validate: does form action match?
            const form = document.querySelector('form')
            const formAction = form?.getAttribute('hx-post') || ''
            const expectedRoute = `/api/setup/step/${step.route}`

            if (formAction.includes(expectedRoute) ||
                (formAction.includes('/api/setup/generate') && step.route === 'review')) {
                console.log('[WizardNavigation.getCurrentStep] Using state.currentStep:', state.currentStep)
                return step
            } else {
                console.warn('[WizardNavigation.getCurrentStep] State step mismatch, detecting from form')
                console.warn('  State step:', state.currentStep, 'Form action:', formAction)
            }
        }
    }

    // Fallback: detect from form action
    const form = document.querySelector('form')
    if (form) {
        const formAction = form.getAttribute('hx-post') || ''
        console.log('[WizardNavigation.getCurrentStep] Detecting from form action:', formAction, 'setupType:', setupType)

        // Setup-type aware route mapping
        const routeMap: Record<string, number> = {}
        const currentSteps = this.getSteps(setupType)
        currentSteps.forEach(step => {
            routeMap[`/api/setup/step/${step.route}`] = step.num
        })
        // Add generate route (always last step)
        if (currentSteps.length > 0) {
            routeMap['/api/setup/generate'] = currentSteps.length
        }

        for (const [action, stepNum] of Object.entries(routeMap)) {
            if (formAction.includes(action)) {
                const step = steps.find(s => s.num === stepNum)
                if (step) {
                    console.log('[WizardNavigation.getCurrentStep] Detected step', stepNum, 'from form action:', action)
                    // Update state with detected step
                    stateManager.update({ currentStep: stepNum })
                    return step
                }
            }
        }

        console.warn('[WizardNavigation.getCurrentStep] Could not detect step from form action:', formAction)
    }

    // Default: first step
    console.log('[WizardNavigation.getCurrentStep] Using default: first step')
    const firstStep = steps[0]
    if (firstStep) {
        stateManager.update({ currentStep: firstStep.num })
        return firstStep
    }

    return null
}
```

**Key Changes**:
1. Use type guards
2. Validate state step against form action
3. Better logging
4. Always update state when detecting step

---

## Fix 5: Add Error Boundary (MEDIUM PRIORITY)

**File**: `web/assets/js/core/wizard-init.ts`

**Problem**: Errors in event handlers might block navigation

**Location**: `beforeRequestHandler` (line ~228)

**Fixed Code**:
```typescript
const beforeRequestHandler = function(event: Event): void {
    try {
        const htmxEvent = event as CustomEvent
        const form = htmxEvent.detail?.elt as HTMLFormElement | undefined

        if (!form || form.tagName !== 'FORM') {
            return
        }

        console.log('[WizardInit] HTMX request starting, saving form state')
        console.log('[WizardInit] Form action:', form.getAttribute('hx-post'))

        // Save form state (with error boundary)
        try {
            const formSync = getFormStateSync()
            const stateManager = getWizardStateManager()

            if (formSync && stateManager) {
                const existingState = stateManager.load()
                formSync.syncFormToState(form, true)

                // Verify state preservation
                const savedState = stateManager.load()
                const checkboxFields = ['css', 'js', 'agents', 'editors'] as const

                checkboxFields.forEach(key => {
                    const checkboxes = form.querySelectorAll<HTMLInputElement>(
                        `input[name="${key}"][type="checkbox"]`
                    )

                    if (checkboxes.length === 0 &&
                        existingState[key] &&
                        Array.isArray(existingState[key]) &&
                        existingState[key].length > 0) {

                        if (!savedState[key] ||
                            !Array.isArray(savedState[key]) ||
                            savedState[key].length === 0) {
                            console.warn(`[WizardInit] WARNING: ${key} array was lost in beforeRequest! Restoring.`)
                            stateManager.update({ [key]: existingState[key] })
                        }
                    }
                })
            } else {
                console.warn('[WizardInit] formStateSync or wizardStateManager not available')
            }
        } catch (syncError) {
            console.error('[WizardInit] Error syncing form state:', syncError)
            // Continue - don't block submission
        }

        // Determine next step (with error boundary)
        try {
            const formAction = form.getAttribute('hx-post') || ''
            const stateManager = getWizardStateManager()

            if (stateManager) {
                const state = stateManager.load()
                const nextStep = determineNextStepFromForm(formAction, state.setupType || 'simple')

                if (nextStep) {
                    console.log('[WizardInit] Determined next step:', nextStep.num, nextStep.route)
                    stateManager.update({ currentStep: nextStep.num })
                }
            }
        } catch (stepError) {
            console.error('[WizardInit] Error determining next step:', stepError)
            // Continue - don't block submission
        }

    } catch (error) {
        console.error('[WizardInit] Error in beforeRequestHandler:', error)
        // CRITICAL: Don't prevent default - let HTMX handle the request
        // Don't throw - let the request proceed
    }
}
```

**Key Changes**:
1. Use type guards
2. Separate try-catch for each operation
3. Never block submission on errors
4. Better error logging

---

## Implementation Order

1. **Fix 1** (Type Guards) - Create new file, no breaking changes
2. **Fix 2** (Checkbox Preservation) - Critical fix, apply immediately
3. **Fix 3** (Race Condition) - High priority, depends on Fix 1
4. **Fix 4** (Step Detection) - Medium priority, depends on Fix 1
5. **Fix 5** (Error Boundary) - Medium priority, improves robustness

---

## Testing Checklist

After applying fixes, test:

- [ ] Navigate from Step 2 (Presets) to Step 3 (Frontend)
- [ ] Check browser console for errors
- [ ] Verify checkbox selections are preserved
- [ ] Navigate back from Step 3 to Step 2
- [ ] Verify selections are still there
- [ ] Navigate forward again
- [ ] Check state in console: `window.wizardStateManager.load()`
- [ ] Verify all checkbox arrays (`css`, `js`, `agents`, `editors`) are preserved

---

## Quick Test Script

Run this in browser console after applying fixes:

```javascript
// Test state preservation
const state = window.wizardStateManager?.load()
console.log('Current state:', state)
console.log('CSS selections:', state?.css)
console.log('JS selections:', state?.js)

// Test navigation
const nav = window.wizardNavigation
if (nav) {
    console.log('Current step:', nav.getCurrentStep())
    console.log('Next step:', nav.getNextStep())
}

// Test form sync
const form = document.querySelector('form')
const formSync = window.formStateSync
if (formSync && form) {
    formSync.syncFormToState(form, true)
    const newState = window.wizardStateManager?.load()
    console.log('State after sync:', newState)
}
```

---

*Apply these fixes in order, test after each fix, and monitor console for errors.*
