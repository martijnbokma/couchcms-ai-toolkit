# Wizard Redesign Plan - Enhanced User Experience & State Management

## Executive Summary

This document outlines a comprehensive redesign plan for the CouchCMS AI Toolkit setup wizard, focusing on simplifying the user experience, improving state management reliability, and ensuring all selections are preserved throughout navigation.

## Current State Analysis

### Architecture Overview

**Current Flow:**
- **Simple Setup**: Project (1) → Editors (2) → Review (3)
- **Extended Setup**: Project (1) → Presets (2) → Frontend (3) → Agents (4) → Editors (5) → Advanced (6) → Review (7)

**State Management:**
- Uses `sessionStorage` via `WizardState` module
- State synced from hidden form fields and visible inputs
- Complex restoration logic with polling and timeouts
- Multiple sync points: form submission, HTMX swaps, input changes

**Navigation:**
- HTMX-based content swapping
- Progress indicator with clickable steps
- Back button with route determination logic

### Identified Issues

#### 1. **State Management Complexity**
- **Problem**: Multiple sync points create race conditions
  - Form submission handlers
  - HTMX event listeners (afterSwap, afterSettle)
  - Input change listeners (debounced)
  - Checkbox change listeners (immediate)
  - Hidden field syncing

- **Impact**: State can be overwritten or lost during navigation
- **Evidence**: Complex `_syncCheckboxField` logic with subset detection

#### 2. **Restoration Reliability**
- **Problem**: Polling-based checkbox restoration with timeouts
  - `waitForCheckboxes` polls every 50ms for up to 3 seconds
  - Multiple restoration attempts
  - State can be overwritten by hidden field sync

- **Impact**: Selections may not restore correctly, especially on slower devices
- **Evidence**: `form-sync.js` has complex waiting logic and fallbacks

#### 3. **Navigation Complexity**
- **Problem**: Route determination logic is error-prone
  - `determineBackRoute` uses form action detection
  - Multiple conditional checks
  - Simple vs Extended flow branching

- **Impact**: Users may navigate to wrong steps or lose state
- **Evidence**: `navigation.js` has complex route mapping logic

#### 4. **User Experience Gaps**
- **Problem**: No clear feedback on state persistence
  - Users can't see what's saved
  - No validation feedback
  - No way to reset or clear selections
  - Progress indicator doesn't show completion status clearly

- **Impact**: User uncertainty and frustration

#### 5. **Performance Concerns**
- **Problem**: Multiple event listeners and polling
  - Event delegation on `document.body`
  - Debounced input saving
  - Immediate checkbox saving
  - Polling for checkbox availability

- **Impact**: Potential performance issues on slower devices

#### 6. **Code Maintainability**
- **Problem**: Logic spread across multiple files
  - `wizard/navigation.js`
  - `wizard/form-restore.js`
  - `wizard/form-sync.js`
  - `wizard/init.js`
  - `core/state.js`

- **Impact**: Difficult to debug and maintain

---

## Redesign Goals

### Primary Objectives

1. **Simplified State Management**
   - Single source of truth (SSOT)
   - Predictable state updates
   - No race conditions
   - Clear state lifecycle

2. **Reliable State Persistence**
   - All selections preserved during navigation
   - Works consistently across devices
   - No polling or timeouts
   - Immediate visual feedback

3. **Improved User Experience**
   - Clear progress indication
   - Visual state feedback
   - Intuitive navigation
   - Error prevention and recovery

4. **Better Performance**
   - Reduced event listeners
   - No polling
   - Efficient state updates
   - Optimized rendering

5. **Enhanced Maintainability**
   - Clear separation of concerns
   - Well-documented code
   - Easy to test
   - Simple debugging

---

## Proposed Architecture

### 1. Unified State Management System

#### Core Principles

**Single Source of Truth (SSOT)**
- All state stored in `sessionStorage` via `WizardState`
- State structure is well-defined and validated
- No duplicate state sources

**State Lifecycle**
```
User Input → Immediate State Update → sessionStorage → Form Restoration
```

**State Structure**
```javascript
{
  // Setup configuration
  setupType: 'simple' | 'extended',

  // Project information
  projectName: string,
  projectDescription: string,

  // Step selections
  preset: string,
  css: string[],
  js: string[],
  agents: string[],
  editors: string[],

  // Advanced options
  framework: boolean,
  framework_doctrine: boolean,
  framework_directives: boolean,
  framework_playbooks: boolean,
  framework_enhancements: boolean,
  contextDir: string,

  // Navigation state
  currentStep: number,
  completedSteps: number[],

  // Metadata
  lastUpdated: timestamp,
  version: string
}
```

#### Implementation Strategy

**1. Centralized State Manager**

```javascript
class WizardStateManager {
  constructor() {
    this.storageKey = 'couchcms-wizard-state'
    this.stateVersion = '2.0'
    this.listeners = new Set()
  }

  // Load state with validation
  load() {
    try {
      const stored = sessionStorage.getItem(this.storageKey)
      if (!stored) return this.getInitialState()

      const state = JSON.parse(stored)

      // Validate state structure
      if (!this.validateState(state)) {
        console.warn('Invalid state structure, resetting')
        return this.getInitialState()
      }

      // Migrate old state if needed
      if (state.version !== this.stateVersion) {
        return this.migrateState(state)
      }

      return state
    } catch (error) {
      console.error('Error loading state:', error)
      return this.getInitialState()
    }
  }

  // Save state with validation
  save(state) {
    try {
      const validated = this.validateAndNormalize(state)
      validated.lastUpdated = Date.now()
      validated.version = this.stateVersion

      sessionStorage.setItem(this.storageKey, JSON.stringify(validated))
      this.notifyListeners(validated)

      return validated
    } catch (error) {
      console.error('Error saving state:', error)
      throw error
    }
  }

  // Update specific fields
  update(updates) {
    const current = this.load()
    const updated = { ...current, ...updates }
    return this.save(updated)
  }

  // Subscribe to state changes
  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  // Notify listeners of state changes
  notifyListeners(state) {
    this.listeners.forEach(callback => {
      try {
        callback(state)
      } catch (error) {
        console.error('Error in state listener:', error)
      }
    })
  }

  // Validate state structure
  validateState(state) {
    const required = ['setupType', 'currentStep']
    return required.every(key => key in state)
  }

  // Normalize state values
  validateAndNormalize(state) {
    const normalized = { ...state }

    // Normalize arrays
    ['css', 'js', 'agents', 'editors'].forEach(key => {
      if (normalized[key] && !Array.isArray(normalized[key])) {
        normalized[key] = []
      } else if (normalized[key]) {
        normalized[key] = [...new Set(normalized[key])]
      }
    })

    // Normalize strings
    ['projectName', 'projectDescription', 'preset'].forEach(key => {
      if (normalized[key] && typeof normalized[key] !== 'string') {
        normalized[key] = String(normalized[key]).trim()
      }
    })

    return normalized
  }

  // Get initial state
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

  // Clear state
  clear() {
    sessionStorage.removeItem(this.storageKey)
    this.notifyListeners(this.getInitialState())
  }
}
```

**2. Form State Synchronization**

```javascript
class FormStateSync {
  constructor(stateManager) {
    this.stateManager = stateManager
    this.debounceTimers = new Map()
    this.debounceDelay = 300
  }

  // Sync form to state (one-way: form → state)
  syncFormToState(form) {
    const formData = this.collectFormData(form)
    this.stateManager.update(formData)
  }

  // Restore state to form (one-way: state → form)
  restoreStateToForm(form) {
    const state = this.stateManager.load()
    this.applyStateToForm(form, state)
  }

  // Collect form data
  collectFormData(form) {
    const formData = new FormData(form)
    const data = {}

    // Text inputs
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('framework_')) {
        data[key] = value === 'true'
      } else if (['css', 'js', 'agents', 'editors'].includes(key)) {
        // Checkboxes - collect all values
        if (!data[key]) data[key] = []
        if (value) data[key].push(value)
      } else {
        data[key] = value
      }
    }

    return data
  }

  // Apply state to form
  applyStateToForm(form, state) {
    // Text inputs
    Object.entries(state).forEach(([key, value]) => {
      if (['css', 'js', 'agents', 'editors'].includes(key)) {
        // Checkboxes
        const checkboxes = form.querySelectorAll(`input[name="${key}"][type="checkbox"]`)
        checkboxes.forEach(checkbox => {
          checkbox.checked = Array.isArray(value) && value.includes(checkbox.value)
        })
      } else if (key === 'preset' || key.startsWith('framework_')) {
        // Radio buttons and framework checkboxes
        const input = form.querySelector(`input[name="${key}"][value="${value}"]`)
        if (input) input.checked = true
      } else {
        // Text inputs
        const input = form.querySelector(`input[name="${key}"], textarea[name="${key}"]`)
        if (input && input.type !== 'hidden') {
          input.value = value || ''
        }
      }
    })
  }

  // Setup form listeners
  setupFormListeners(form) {
    // Debounced input handler
    form.addEventListener('input', (e) => {
      if (e.target.type === 'checkbox' || e.target.type === 'radio') {
        // Immediate save for checkboxes/radios
        this.syncFormToState(form)
      } else {
        // Debounced save for text inputs
        this.debouncedSync(form)
      }
    }, { capture: true })

    // Change handler for checkboxes/radios
    form.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox' || e.target.type === 'radio') {
        this.syncFormToState(form)
      }
    }, { capture: true })
  }

  // Debounced sync
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
```

### 2. Simplified Navigation System

#### Navigation Manager

```javascript
class WizardNavigation {
  constructor(stateManager) {
    this.stateManager = stateManager
    this.stepDefinitions = this.getStepDefinitions()
  }

  // Get step definitions
  getStepDefinitions() {
    return {
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

  // Navigate to step
  async navigateToStep(stepNum, route) {
    // Save current form state
    const form = document.querySelector('form')
    if (form && window.formStateSync) {
      window.formStateSync.syncFormToState(form)
    }

    // Update state
    const state = this.stateManager.load()
    const updated = {
      ...state,
      currentStep: stepNum
    }

    // Mark previous steps as completed
    if (stepNum > state.currentStep) {
      updated.completedSteps = [
        ...new Set([...state.completedSteps, state.currentStep])
      ]
    }

    this.stateManager.save(updated)

    // Navigate via HTMX
    const params = this.stateToURLParams(updated)
    const url = `/api/setup/step/${route}?${params.toString()}`

    return HTMXUtils.htmxAjax('GET', url, {
      target: '#wizard-content',
      swap: 'innerHTML'
    })
  }

  // Navigate back
  async navigateBack() {
    const state = this.stateManager.load()
    const steps = this.getStepsForSetupType(state.setupType)
    const currentIndex = steps.findIndex(s => s.num === state.currentStep)

    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1]
      return this.navigateToStep(prevStep.num, prevStep.route)
    }
  }

  // Navigate forward
  async navigateForward() {
    const state = this.stateManager.load()
    const steps = this.getStepsForSetupType(state.setupType)
    const currentIndex = steps.findIndex(s => s.num === state.currentStep)

    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1]
      return this.navigateToStep(nextStep.num, nextStep.route)
    }
  }

  // Get steps for setup type
  getStepsForSetupType(setupType) {
    return this.stepDefinitions[setupType] || this.stepDefinitions.simple
  }

  // Convert state to URL params
  stateToURLParams(state) {
    const params = new URLSearchParams()
    Object.entries(state).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v))
      } else if (value !== null && value !== undefined && value !== '') {
        params.append(key, value)
      }
    })
    return params
  }
}
```

### 3. Enhanced User Experience

#### Visual State Feedback

**1. State Indicator Component**

```html
<!-- State indicator showing saved selections -->
<div class="state-indicator" id="state-indicator" aria-live="polite">
  <div class="state-summary">
    <span class="state-icon">✓</span>
    <span class="state-text">All selections saved</span>
  </div>
</div>
```

**2. Progress Enhancement**

- Show completion percentage
- Highlight current step clearly
- Show which steps have selections
- Disable future steps until prerequisites are met

**3. Form Validation**

- Real-time validation feedback
- Clear error messages
- Prevent navigation if required fields are empty
- Visual indicators for required vs optional fields

#### User Controls

**1. Reset Wizard**
```javascript
function resetWizard() {
  if (confirm('Are you sure you want to reset? All selections will be lost.')) {
    window.wizardStateManager.clear()
    window.location.href = '/setup/welcome'
  }
}
```

**2. Export/Import State**
```javascript
function exportState() {
  const state = window.wizardStateManager.load()
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'wizard-state.json'
  a.click()
}

function importState(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const state = JSON.parse(e.target.result)
      window.wizardStateManager.save(state)
      window.location.reload()
    } catch (error) {
      alert('Invalid state file')
    }
  }
  reader.readAsText(file)
}
```

### 4. Performance Optimizations

#### Event Listener Optimization

**Before:**
- Multiple event listeners on `document.body`
- Event delegation for all inputs
- Polling for checkbox availability

**After:**
- Single event listener per form
- Direct form element listeners
- No polling - use HTMX `afterSettle` event

#### State Update Optimization

**Before:**
- Multiple sync points
- Complex subset detection
- Hidden field syncing

**After:**
- Single sync point per user action
- Simple state updates
- No hidden field syncing needed

#### Rendering Optimization

**Before:**
- Full form restoration on every swap
- Multiple restoration attempts

**After:**
- Single restoration after HTMX swap
- Use `requestAnimationFrame` for smooth updates

---

## Implementation Plan

### Phase 1: Core State Management (Week 1)

**Tasks:**
1. ✅ Create `WizardStateManager` class
2. ✅ Implement state validation and normalization
3. ✅ Add state migration support
4. ✅ Create unit tests for state management

**Deliverables:**
- `web/assets/js/core/wizard-state-manager.js`
- `web/assets/js/core/wizard-state-manager.test.js`
- Documentation

### Phase 2: Form Synchronization (Week 1-2)

**Tasks:**
1. ✅ Create `FormStateSync` class
2. ✅ Implement form-to-state syncing
3. ✅ Implement state-to-form restoration
4. ✅ Remove old sync logic

**Deliverables:**
- `web/assets/js/core/form-state-sync.js`
- Updated form templates
- Integration tests

### Phase 3: Navigation System (Week 2)

**Tasks:**
1. ✅ Create `WizardNavigation` class
2. ✅ Simplify route determination
3. ✅ Update progress indicator
4. ✅ Remove old navigation logic

**Deliverables:**
- `web/assets/js/core/wizard-navigation.js`
- Updated navigation templates
- Navigation tests

### Phase 4: User Experience Enhancements (Week 2-3)

**Tasks:**
1. ✅ Add state indicator component
2. ✅ Enhance progress indicator
3. ✅ Add form validation
4. ✅ Add reset/export/import functionality

**Deliverables:**
- `web/templates/partials/state-indicator.html`
- Updated progress indicator
- Validation components
- User control components

### Phase 5: Testing & Refinement (Week 3)

**Tasks:**
1. ✅ End-to-end testing
2. ✅ Cross-browser testing
3. ✅ Performance testing
4. ✅ User acceptance testing
5. ✅ Bug fixes and refinements

**Deliverables:**
- Test reports
- Performance metrics
- Bug fixes
- Documentation updates

### Phase 6: Migration & Cleanup (Week 3-4)

**Tasks:**
1. ✅ Migrate existing wizard to new system
2. ✅ Remove old code
3. ✅ Update documentation
4. ✅ Deploy and monitor

**Deliverables:**
- Migrated wizard
- Cleaned codebase
- Updated documentation
- Deployment guide

---

## Migration Strategy

### Backward Compatibility

**State Migration:**
- Detect old state format
- Migrate to new format automatically
- Preserve all user selections

**URL Compatibility:**
- Support old URL parameters
- Redirect to new format
- Maintain bookmark compatibility

### Gradual Rollout

**Option 1: Feature Flag**
- Add feature flag for new wizard
- Test with subset of users
- Gradually enable for all users

**Option 2: A/B Testing**
- Show new wizard to 50% of users
- Compare metrics
- Roll out based on results

**Option 3: Direct Migration**
- Migrate all at once
- Monitor closely
- Quick rollback if needed

---

## Success Metrics

### User Experience Metrics

- **Completion Rate**: % of users completing wizard
- **Time to Complete**: Average time per setup type
- **Error Rate**: % of users encountering errors
- **Navigation Efficiency**: Average steps taken vs required steps
- **User Satisfaction**: Survey scores

### Technical Metrics

- **State Persistence**: % of selections preserved during navigation
- **Performance**: Page load time, interaction latency
- **Error Rate**: JavaScript errors, state corruption
- **Browser Compatibility**: Support across target browsers

### Code Quality Metrics

- **Code Complexity**: Cyclomatic complexity reduction
- **Test Coverage**: % of code covered by tests
- **Maintainability**: Code review feedback
- **Documentation**: Completeness of documentation

---

## Risk Assessment

### Technical Risks

**Risk 1: State Migration Issues**
- **Probability**: Medium
- **Impact**: High
- **Mitigation**: Comprehensive testing, migration scripts, fallback to old system

**Risk 2: Browser Compatibility**
- **Probability**: Low
- **Impact**: Medium
- **Mitigation**: Polyfills, feature detection, progressive enhancement

**Risk 3: Performance Regression**
- **Probability**: Low
- **Impact**: Medium
- **Mitigation**: Performance testing, optimization, monitoring

### User Experience Risks

**Risk 1: User Confusion**
- **Probability**: Low
- **Impact**: Medium
- **Mitigation**: Clear UI, help text, user testing

**Risk 2: Data Loss**
- **Probability**: Low
- **Impact**: High
- **Mitigation**: Multiple save points, validation, error recovery

---

## Conclusion

This redesign plan addresses all identified issues while maintaining backward compatibility and improving the overall user experience. The phased approach allows for incremental improvements and testing, reducing risk while delivering value.

**Key Benefits:**
- ✅ Simplified state management
- ✅ Reliable state persistence
- ✅ Improved user experience
- ✅ Better performance
- ✅ Enhanced maintainability

**Next Steps:**
1. Review and approve plan
2. Set up development environment
3. Begin Phase 1 implementation
4. Schedule regular review meetings

---

*Document Version: 1.0*
*Last Updated: 2025-12-01*
*Author: AI Development Team*
