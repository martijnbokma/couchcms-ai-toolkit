# Functional Testing Checklist - Wizard Flow

**Date**: 2025-01-27
**Purpose**: End-to-end functional testing of the refactored wizard

---

## 🎯 Test Scenarios

### 1. Simple Setup Flow

#### Test 1.1: Project Step
- [ ] Load wizard with `?type=simple`
- [ ] Enter project name
- [ ] Enter project description
- [ ] Verify state is saved to sessionStorage
- [ ] Navigate to next step
- [ ] Navigate back
- [ ] Verify form fields are restored correctly

#### Test 1.2: Editors Step
- [ ] Select multiple editors
- [ ] Verify selections are saved
- [ ] Navigate to next step
- [ ] Navigate back
- [ ] Verify checkbox selections are restored
- [ ] Test "Select All" functionality
- [ ] Test "Deselect All" functionality

#### Test 1.3: Review Step
- [ ] Verify all selections are displayed
- [ ] Test "Edit" buttons for each section
- [ ] Verify navigation back to previous steps works
- [ ] Test form submission
- [ ] Verify wizard state is included in submission

---

### 2. Extended Setup Flow

#### Test 2.1: Project Step
- [ ] Load wizard with `?type=extended`
- [ ] Enter project information
- [ ] Navigate to presets step

#### Test 2.2: Presets Step
- [ ] Select a preset
- [ ] Verify selection is saved
- [ ] Navigate to next step
- [ ] Navigate back
- [ ] Verify preset selection is restored
- [ ] Test "Skip" option

#### Test 2.3: Frontend Step
- [ ] Select CSS frameworks (TailwindCSS, daisyUI)
- [ ] Verify dependency warning appears for daisyUI
- [ ] Test auto-select dependency
- [ ] Select JavaScript frameworks
- [ ] Navigate to next step
- [ ] Navigate back
- [ ] Verify all selections are restored

#### Test 2.4: Agents Step
- [ ] Select multiple agents
- [ ] Navigate to next step
- [ ] Navigate back
- [ ] Verify selections are restored

#### Test 2.5: Editors Step
- [ ] Select editors
- [ ] Navigate to next step
- [ ] Navigate back
- [ ] Verify selections are restored

#### Test 2.6: Advanced Step
- [ ] Toggle framework options checkbox
- [ ] Verify framework options visibility
- [ ] Select framework options
- [ ] Navigate to next step
- [ ] Navigate back
- [ ] Verify all selections are restored

#### Test 2.7: Review Step
- [ ] Verify all selections from all steps are displayed
- [ ] Test edit navigation for each section
- [ ] Test back button
- [ ] Test form submission

---

### 3. State Persistence Tests

#### Test 3.1: Page Refresh
- [ ] Complete several steps
- [ ] Refresh the page
- [ ] Verify state is restored from sessionStorage
- [ ] Verify form fields are populated correctly

#### Test 3.2: Browser Back Button
- [ ] Navigate through multiple steps
- [ ] Use browser back button
- [ ] Verify state is preserved
- [ ] Verify form fields are restored

#### Test 3.3: Direct Navigation
- [ ] Complete wizard once
- [ ] Navigate directly to a step via URL
- [ ] Verify state is loaded and form fields are populated

---

### 4. Edge Cases

#### Test 4.1: Empty State
- [ ] Start wizard with no saved state
- [ ] Verify default values are used
- [ ] Verify no errors occur

#### Test 4.2: Invalid State
- [ ] Manually corrupt sessionStorage
- [ ] Load wizard
- [ ] Verify error handling works
- [ ] Verify wizard can still function

#### Test 4.3: Rapid Navigation
- [ ] Quickly navigate between steps
- [ ] Verify state is saved correctly
- [ ] Verify no race conditions occur

#### Test 4.4: Form Validation
- [ ] Test required fields
- [ ] Test invalid inputs
- [ ] Verify validation messages appear
- [ ] Verify form cannot be submitted with invalid data

---

### 5. Browser Compatibility

#### Test 5.1: Chrome/Edge
- [ ] Run all test scenarios
- [ ] Verify console has no errors
- [ ] Verify all functionality works

#### Test 5.2: Firefox
- [ ] Run all test scenarios
- [ ] Verify console has no errors
- [ ] Verify all functionality works

#### Test 5.3: Safari
- [ ] Run all test scenarios
- [ ] Verify console has no errors
- [ ] Verify all functionality works

---

### 6. Performance Tests

#### Test 6.1: Bundle Size
- [ ] Verify wizard.js bundle size is reasonable
- [ ] Check for any large dependencies

#### Test 6.2: Load Time
- [ ] Measure initial page load time
- [ ] Measure step navigation time
- [ ] Verify acceptable performance

#### Test 6.3: Memory Usage
- [ ] Monitor memory usage during wizard flow
- [ ] Verify no memory leaks
- [ ] Verify sessionStorage is cleaned up properly

---

## 📋 Test Execution Log

### Test Run 1
- **Date**:
- **Tester**:
- **Browser**:
- **Results**:

### Test Run 2
- **Date**:
- **Tester**:
- **Browser**:
- **Results**:

---

## 🐛 Known Issues

(Log any issues found during testing)

---

## ✅ Test Completion Status

- [ ] Simple Setup Flow - Complete
- [ ] Extended Setup Flow - Complete
- [ ] State Persistence - Complete
- [ ] Edge Cases - Complete
- [ ] Browser Compatibility - Complete
- [ ] Performance Tests - Complete

---

**Status**: ⏳ **Ready for Testing**
