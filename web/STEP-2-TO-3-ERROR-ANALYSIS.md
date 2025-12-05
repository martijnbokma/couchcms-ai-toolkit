# Step 2 to Step 3 Transition Error Analysis

**Date**: 2025-12-01
**Issue**: Console errors when transitioning from Step 2 (Presets) to Step 3 (Frontend)
**Flow**: Extended setup flow

---

## 🔍 Executive Summary

This document provides a comprehensive TypeScript-focused analysis of console errors occurring during the step 2→3 transition in the wizard navigation system. The analysis covers common pitfalls, root causes, and practical solutions.

---

## 📋 Step Configuration Context

### Extended Flow Steps
- **Step 1**: Project (`/api/setup/step/project`)
- **Step 2**: Presets (`/api/setup/step/presets`) ← **FROM**
- **Step 3**: Frontend (`/api/setup/step/frontend`) ← **TO**
- **Step 4**: Agents (`/api/setup/step/agents`)
- **Step 5**: Editors (`/api/setup/step/editors`)
- **Step 6**: Advanced (`/api/setup/step/advanced`)
- **Step 7**: Review (`/api/setup/generate`)

---

## 🐛 Common Error Patterns

### 1. **TypeScript Type Assertion Errors**

**Problem**: Window object extensions not properly typed

```typescript
// ❌ PROBLEMATIC: Type assertion might fail at runtime
const StepConfig = (window as { StepConfig?: unknown }).StepConfig

// ✅ SOLUTION: Proper type guard
function getStepConfig(): StepConfigType | null {
    if (typeof window !== 'undefined' && 'StepConfig' in window) {
        const config = (window as { StepConfig: StepConfigType }).StepConfig
        if (config && typeof config === 'object') {
            return config
        }
    }
    return null
}
```

**Location**: `wizard-navigation.ts:32-34`

**Impact**:
- `StepConfig` might be `undefined` at runtime
- Fallback definitions used instead of actual config
- Step detection might fail

---

### 2. **Race Condition: Async State Sync**

**Problem**: Form state sync happens asynchronously, but navigation proceeds immediately

```typescript
// ❌ PROBLEMATIC: Race condition
async navigateToStep(stepNum: number, route: string) {
    const form = document.querySelector('form')
    if (form && window.formStateSync) {
        // This is async but we don't wait properly
        window.formStateSync.syncFormToState(form, true)
    }
    // Navigation happens immediately - state might not be saved!
    return HTMXUtils.htmxAjax('GET', url, ...)
}
```

**Location**: `wizard-navigation.ts:203-280`

**Impact**:
- Form selections lost during navigation
- Checkbox arrays (`css`, `js`, `agents`, `editors`) might be empty
- State inconsistency between steps

**Solution**:
```typescript
// ✅ FIXED: Proper async/await with timeout safety
async navigateToStep(stepNum: number, route: string) {
    const form = document.querySelector('form')
    if (form && window.formStateSync) {
        // Wait for sync with timeout
        await new Promise<void>((resolve) => {
            window.formStateSync.syncFormToState(form, true)
            // Small delay to ensure DOM updates complete
            setTimeout(resolve, 50)
        })

        // Verify state was saved
        const savedState = stateManager.load()
        console.log('[WizardNavigation] State verified:', savedState)
    }
    // Now safe to navigate
    return HTMXUtils.htmxAjax('GET', url, ...)
}
```

---

### 3. **Step Detection Logic Issues**

**Problem**: Current step detection relies on form action, which might not match state

```typescript
// ❌ PROBLEMATIC: Form action might not match actual step
getCurrentStep(): StepDefinition | null {
    const state = stateManager.load()
    if (state.currentStep) {
        const step = steps.find(s => s.num === state.currentStep)
        if (step) return step
    }

    // Fallback: detect from form action
    const form = document.querySelector('form')
    const formAction = form?.getAttribute('hx-post') || ''
    // This might not match the actual step if state is out of sync
}
```

**Location**: `wizard-navigation.ts:90-145`

**Impact**:
- Wrong step detected
- Navigation goes to incorrect step
- State and UI out of sync

**Solution**:
```typescript
// ✅ FIXED: Validate step detection with multiple sources
getCurrentStep(): StepDefinition | null {
    const state = stateManager.load()
    const form = document.querySelector('form')
    const formAction = form?.getAttribute('hx-post') || ''

    // 1. Try state first (most reliable)
    if (state.currentStep) {
        const step = steps.find(s => s.num === state.currentStep)
        if (step) {
            // Validate: does form action match?
            const expectedRoute = `/api/setup/step/${step.route}`
            if (formAction.includes(expectedRoute) || formAction.includes('/api/setup/generate')) {
                return step
            } else {
                console.warn('[WizardNavigation] State step mismatch, detecting from form')
            }
        }
    }

    // 2. Fallback: detect from form action
    // ... detection logic ...

    // 3. Update state with detected step
    if (detectedStep) {
        stateManager.update({ currentStep: detectedStep.num })
    }

    return detectedStep
}
```

---

### 4. **Checkbox Array Preservation**

**Problem**: Checkbox arrays from previous steps are lost when navigating

```typescript
// ❌ PROBLEMATIC: Arrays might be lost during sync
collectFormData(form: HTMLFormElement): Partial<WizardState> {
    const data: Partial<WizardState> = {}

    // Only collects fields that exist in current form
    CHECKBOX_FIELDS.forEach(key => {
        const checkboxes = form.querySelectorAll(`input[name="${key}"]`)
        if (checkboxes.length > 0) {
            data[key] = getCheckboxValues(form, key)
        }
        // ❌ If field doesn't exist in form, it's lost!
    })

    return data
}
```

**Location**: `form-state-sync.ts:149-167`

**Impact**:
- Selections from step 2 (presets) lost when going to step 3 (frontend)
- CSS/JS selections from step 3 lost when going to step 4 (agents)
- User has to re-select everything

**Solution**:
```typescript
// ✅ FIXED: Always merge with existing state
collectFormData(form: HTMLFormElement | null): Partial<WizardState> {
    if (!form) return {}

    // CRITICAL: Start with existing state to preserve selections
    const existingState = stateManager.load()
    const data: Partial<WizardState> = { ...existingState }

    // Only update fields that exist in current form
    CHECKBOX_FIELDS.forEach(key => {
        const checkboxes = form.querySelectorAll(`input[name="${key}"]`)
        if (checkboxes.length > 0) {
            // Field exists in form - update from DOM
            data[key] = getCheckboxValues(form, key)
        }
        // If field doesn't exist, keep existing state value (preserved)
    })

    return data
}
```

---

### 5. **HTMX Event Handler Conflicts**

**Problem**: Multiple event handlers might conflict or fire in wrong order

```typescript
// ❌ PROBLEMATIC: Multiple handlers, unclear execution order
document.body.addEventListener('htmx:beforeRequest', handler1)
document.body.addEventListener('htmx:beforeRequest', handler2) // Might conflict
```

**Location**: `wizard-init.ts:159-338`

**Impact**:
- State saved multiple times
- Race conditions
- Unpredictable behavior

**Solution**:
```typescript
// ✅ FIXED: Single handler with proper cleanup
function setupHtmxListeners(): void {
    // Cleanup existing listeners first
    cleanupHtmxListeners()

    // Single comprehensive handler
    const beforeRequestHandler = function(event: Event): void {
        // All logic in one place
    }

    document.body.addEventListener('htmx:beforeRequest', beforeRequestHandler)

    // Track for cleanup
    htmxListeners.push({ event: 'htmx:beforeRequest', handler: beforeRequestHandler })
}
```

---

### 6. **Type Safety: Window Object Extensions**

**Problem**: Window object extensions not properly typed, causing runtime errors

```typescript
// ❌ PROBLEMATIC: No type safety
window.formStateSync.syncFormToState(form)

// If formStateSync is undefined, this throws:
// TypeError: Cannot read property 'syncFormToState' of undefined
```

**Location**: Multiple files

**Impact**:
- Runtime errors when dependencies not loaded
- No compile-time type checking
- Hard to debug

**Solution**:
```typescript
// ✅ FIXED: Type guards and proper checks
interface WindowWithWizard {
    formStateSync?: {
        syncFormToState: (form: HTMLFormElement | null, immediate?: boolean) => void
        restoreStateToForm: (form: HTMLFormElement | null) => void
    }
    wizardStateManager?: WizardStateManager
    wizardNavigation?: WizardNavigation
}

function syncFormState(form: HTMLFormElement | null): void {
    const win = window as unknown as WindowWithWizard
    if (win.formStateSync && typeof win.formStateSync.syncFormToState === 'function') {
        win.formStateSync.syncFormToState(form, true)
    } else {
        console.error('[Error] formStateSync not available')
        throw new Error('formStateSync not initialized')
    }
}
```

---

## 🔧 Practical Solutions

### Solution 1: Add Type Guards

Create a utility file for type-safe window access:

```typescript
// web/assets/js/core/type-guards.ts

export interface WizardWindow extends Window {
    formStateSync?: FormStateSync
    wizardStateManager?: WizardStateManager
    wizardNavigation?: WizardNavigation
    StepConfig?: StepConfigType
    HTMXUtils?: HTMXUtilsType
}

export function hasFormStateSync(win: Window): win is WizardWindow {
    return 'formStateSync' in win &&
           win.formStateSync !== null &&
           win.formStateSync !== undefined
}

export function hasWizardStateManager(win: Window): win is WizardWindow {
    return 'wizardStateManager' in win &&
           win.wizardStateManager !== null &&
           win.wizardStateManager !== undefined
}

// Usage:
if (hasFormStateSync(window)) {
    window.formStateSync.syncFormToState(form) // Type-safe!
}
```

---

### Solution 2: Fix Race Conditions

Add proper async/await with timeout safety:

```typescript
// In wizard-navigation.ts

async navigateToStep(stepNum: number, route: string): Promise<unknown> {
    console.log('[WizardNavigation] Navigating to step', stepNum, 'route:', route)

    // Step 1: Save form state with proper waiting
    const form = document.querySelector('form')
    if (form && hasFormStateSync(window)) {
        try {
            // Immediate sync
            window.formStateSync.syncFormToState(form, true)

            // Wait for DOM updates (checkboxes might have async handlers)
            await new Promise(resolve => setTimeout(resolve, 50))

            // Verify state was saved
            const savedState = stateManager.load()
            const checkboxFields = ['css', 'js', 'agents', 'editors'] as const

            checkboxFields.forEach(key => {
                const checkboxes = form.querySelectorAll<HTMLInputElement>(
                    `input[name="${key}"][type="checkbox"]`
                )

                // If field doesn't exist in form but exists in state, preserve it
                if (checkboxes.length === 0 && savedState[key] && Array.isArray(savedState[key])) {
                    if (savedState[key].length > 0) {
                        console.log(`[WizardNavigation] Preserving ${key} array:`, savedState[key])
                    }
                }
            })
        } catch (error) {
            console.error('[WizardNavigation] Error syncing form state:', error)
            // Continue anyway - don't block navigation
        }
    }

    // Step 2: Update state
    const state = stateManager.load()
    const updated: WizardState = {
        ...state,
        currentStep: stepNum
    }

    // Mark previous steps as completed
    if (stepNum > (state.currentStep || 1)) {
        updated.completedSteps = [
            ...new Set([...(state.completedSteps || []), state.currentStep || 1])
        ]
    }

    stateManager.save(updated)

    // Step 3: Navigate
    const params = this.stateToURLParams(updated)
    const url = `/api/setup/step/${route}?${params.toString()}`

    console.log('[WizardNavigation] Navigation URL:', url)

    return HTMXUtils.htmxAjax('GET', url, {
        target: '#wizard-content',
        swap: 'innerHTML'
    }).catch(error => {
        console.error('[WizardNavigation] Navigation error:', error)
        throw error
    })
}
```

---

### Solution 3: Improve State Preservation

Ensure checkbox arrays are always preserved:

```typescript
// In form-state-sync.ts

collectFormData(form: HTMLFormElement | null): Partial<WizardState> {
    if (!this.isValidForm(form)) {
        return {}
    }

    // CRITICAL: Always start with existing state
    const existingState = stateManager.load()
    const data: Partial<WizardState> = { ...existingState }

    // Collect checkbox arrays from DOM (only if field exists in form)
    CHECKBOX_FIELDS.forEach(key => {
        const checkboxes = form.querySelectorAll<HTMLInputElement>(
            `input[name="${key}"][type="checkbox"]`
        )

        if (checkboxes.length > 0) {
            // Field exists in form - collect from DOM
            const checkedValues = getCheckboxValues(form, key)
            data[key] = checkedValues
            console.log(`[FormStateSync] Collected ${key}:`, checkedValues)
        } else {
            // Field doesn't exist in form - preserve from existing state
            if (existingState[key] && Array.isArray(existingState[key])) {
                data[key] = [...existingState[key]] as string[]
                console.log(`[FormStateSync] Preserved ${key} from state:`, data[key])
            }
        }
    })

    // Collect other form fields...
    // ...

    return data
}
```

---

### Solution 4: Add Comprehensive Error Handling

Wrap all critical operations in try-catch:

```typescript
// In wizard-init.ts

const beforeRequestHandler = function(event: Event): void {
    try {
        const htmxEvent = event as CustomEvent
        const form = htmxEvent.detail?.elt as HTMLFormElement | undefined

        if (!form || form.tagName !== 'FORM') {
            return
        }

        console.log('[WizardInit] HTMX request starting, saving form state')

        // Save form state
        try {
            if (hasFormStateSync(window)) {
                const existingState = window.wizardStateManager?.load() || {}
                window.formStateSync.syncFormToState(form, true)

                // Verify state preservation
                const savedState = window.wizardStateManager?.load() || {}
                // ... verification logic ...
            }
        } catch (syncError) {
            console.error('[WizardInit] Error syncing form state:', syncError)
            // Continue - don't block submission
        }

        // Determine next step
        try {
            const formAction = form.getAttribute('hx-post') || ''
            const state = window.wizardStateManager?.load() || {}
            const nextStep = determineNextStepFromForm(formAction, state.setupType || 'simple')

            if (nextStep && window.wizardStateManager) {
                window.wizardStateManager.update({ currentStep: nextStep.num })
            }
        } catch (stepError) {
            console.error('[WizardInit] Error determining next step:', stepError)
            // Continue - don't block submission
        }

    } catch (error) {
        console.error('[WizardInit] Error in beforeRequestHandler:', error)
        // CRITICAL: Don't prevent default - let HTMX handle the request
    }
}
```

---

## 🎯 Debugging Checklist

When encountering step 2→3 transition errors, check:

### 1. Browser Console
- [ ] Check for `[WizardNavigation]` errors
- [ ] Check for `[FormStateSync]` errors
- [ ] Check for `[WizardInit]` errors
- [ ] Check for `[WizardStateManager]` errors
- [ ] Look for `TypeError` or `ReferenceError`

### 2. State Verification
```javascript
// In browser console
const state = window.wizardStateManager?.load()
console.log('Current state:', state)
console.log('Current step:', state?.currentStep)
console.log('CSS selections:', state?.css)
console.log('JS selections:', state?.js)
```

### 3. Form Verification
```javascript
// In browser console
const form = document.querySelector('form')
console.log('Form action:', form?.getAttribute('hx-post'))
console.log('Form valid:', form?.checkValidity())
console.log('Form elements:', Array.from(form?.elements || []))
```

### 4. Dependencies Check
```javascript
// In browser console
console.log('formStateSync:', typeof window.formStateSync)
console.log('wizardStateManager:', typeof window.wizardStateManager)
console.log('wizardNavigation:', typeof window.wizardNavigation)
console.log('StepConfig:', typeof window.StepConfig)
console.log('HTMXUtils:', typeof window.HTMXUtils)
```

### 5. Network Tab
- [ ] Check POST request to `/api/setup/step/presets`
- [ ] Verify request payload includes all form data
- [ ] Check response status (should be 200)
- [ ] Check response body for errors

---

## 📝 Recommended Fixes Priority

1. **HIGH**: Fix checkbox array preservation (Solution 3)
2. **HIGH**: Add type guards (Solution 1)
3. **MEDIUM**: Fix race conditions (Solution 2)
4. **MEDIUM**: Improve error handling (Solution 4)
5. **LOW**: Code cleanup and documentation

---

## 🔗 Related Files

- `web/assets/js/core/wizard-navigation.ts` - Navigation logic
- `web/assets/js/core/form-state-sync.ts` - Form state synchronization
- `web/assets/js/core/wizard-state-manager.ts` - State management
- `web/assets/js/core/wizard-init.ts` - Initialization and HTMX handlers
- `web/assets/js/core/step-config.ts` - Step definitions

---

## 📚 TypeScript Best Practices Applied

1. **Type Guards**: Use type guards instead of type assertions
2. **Null Checks**: Always check for null/undefined before accessing
3. **Async/Await**: Use proper async/await with error handling
4. **Error Boundaries**: Wrap critical operations in try-catch
5. **Type Safety**: Define proper interfaces for window extensions

---

*This analysis is based on TypeScript best practices and common pitfalls in multi-step wizard implementations.*
