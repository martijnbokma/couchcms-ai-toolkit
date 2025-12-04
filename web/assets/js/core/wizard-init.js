/**
 * Wizard Initialization - Improved Version
 * Sets up HTMX event listeners and form synchronization with proper cleanup
 */
(function() {
    'use strict'

    // Prevent multiple executions
    if (window.__WIZARD_INIT_V2_INITIALIZED__) {
        console.log('[WizardInit] Already initialized, skipping re-execution')
        return
    }
    window.__WIZARD_INIT_V2_INITIALIZED__ = true

    // Ensure dependencies are available
    if (!window.wizardStateManager || !window.formStateSync) {
        console.error('[WizardInit] Required dependencies not available')
        return
    }

    const stateManager = window.wizardStateManager
    const formSync = window.formStateSync

    // Track HTMX listeners for cleanup
    const htmxListeners = []

    /**
     * Initialize wizard on page load
     */
    function initializeWizard() {
        console.log('[WizardInit] Initializing wizard')

        // Get setup type from URL
        const urlParams = new URLSearchParams(window.location.search)
        const setupType = urlParams.get('type') || urlParams.get('setupType') || 'simple'

        // Initialize state with setup type and current step
        const currentState = stateManager.load()
        const initialState = {
            setupType,
            currentStep: currentState.currentStep || 1  // Default to step 1 if not set
        }
        stateManager.update(initialState)

        console.log('[WizardInit] Initialized with setupType:', setupType, 'currentStep:', initialState.currentStep)

        // Setup form listeners for initial form
        const form = document.querySelector('form')
        if (form) {
            // Detect and update current step from initial form
            const formAction = form.getAttribute('hx-post') || ''
            const routeToStepMap = setupType === 'simple' ? {
                '/api/setup/step/project': 1,
                '/api/setup/step/editors': 2,
                '/api/setup/generate': 3
            } : {
                '/api/setup/step/project': 1,
                '/api/setup/step/presets': 2,
                '/api/setup/step/frontend': 3,
                '/api/setup/step/agents': 4,
                '/api/setup/step/editors': 5,
                '/api/setup/step/advanced': 6,
                '/api/setup/generate': 7
            }

            for (const [action, stepNum] of Object.entries(routeToStepMap)) {
                if (formAction.includes(action)) {
                    stateManager.update({ currentStep: stepNum })
                    console.log('[WizardInit] Detected initial step', stepNum, 'from form action:', action)
                    break
                }
            }

            formSync.setupFormListeners(form)
            // Restore state to form - use setTimeout to ensure DOM is ready
            setTimeout(() => {
                formSync.restoreStateToForm(form)
            }, 100)
        }

        // Setup HTMX event listeners
        setupHtmxListeners()

        console.log('[WizardInit] Wizard initialized')
    }

    /**
     * Determine next step from current step and form action
     * CRITICAL: This ensures we always navigate to the correct next step
     * CRITICAL: Route mapping is setup-type aware
     * @param {string} formAction - Form hx-post action
     * @param {string} setupType - Setup type
     * @returns {Object|null} Next step info or null
     */
    function determineNextStepFromForm(formAction, setupType) {
        if (!window.wizardNavigation) return null

        const steps = window.wizardNavigation.getSteps(setupType)

        // Setup-type aware route mapping
        let routeToStepMap = {}
        if (setupType === 'simple') {
            // Simple flow: Project(1) → Editors(2) → Review(3)
            routeToStepMap = {
                '/api/setup/step/project': 1,
                '/api/setup/step/editors': 2,
                '/api/setup/generate': 3
            }
        } else {
            // Extended flow: Project(1) → Presets(2) → Frontend(3) → Agents(4) → Editors(5) → Advanced(6) → Review(7)
            routeToStepMap = {
                '/api/setup/step/project': 1,
                '/api/setup/step/presets': 2,
                '/api/setup/step/frontend': 3,
                '/api/setup/step/agents': 4,
                '/api/setup/step/editors': 5,
                '/api/setup/step/advanced': 6,
                '/api/setup/generate': 7
            }
        }

        // Find current step from form action
        let currentStepNum = null
        for (const [action, stepNum] of Object.entries(routeToStepMap)) {
            if (formAction.includes(action)) {
                currentStepNum = stepNum
                break
            }
        }

        if (currentStepNum === null) {
            console.warn('[WizardInit.determineNextStepFromForm] Could not determine current step from:', formAction)
            return null
        }

        // Find next step
        const currentIndex = steps.findIndex(s => s.num === currentStepNum)
        if (currentIndex < steps.length - 1) {
            const nextStep = steps[currentIndex + 1]
            console.log('[WizardInit.determineNextStepFromForm] Current step:', currentStepNum, 'Next step:', nextStep.num, nextStep.route)
            return nextStep
        }

        console.log('[WizardInit.determineNextStepFromForm] Already at last step')
        return null
    }

    /**
     * Setup HTMX event listeners with cleanup tracking
     */
    function setupHtmxListeners() {
        // After HTMX swaps content, restore form state and update current step
        const afterSettleHandler = function(event) {
            if (event.detail && event.detail.target && event.detail.target.id === 'wizard-content') {
                console.log('[WizardInit] HTMX content swapped, restoring form state')

                // Cleanup old form listeners
                const oldForm = document.querySelector('form')
                if (oldForm) {
                    formSync.cleanupFormListeners(oldForm)
                }

                // Wait for DOM to be ready
                requestAnimationFrame(() => {
                    const form = document.querySelector('form')
                    if (form && window.wizardNavigation) {
                        // Update current step based on form action
                        const formAction = form.getAttribute('hx-post') || ''
                        const state = stateManager.load()
                        const setupType = state.setupType || 'simple'

                        // Setup-type aware route mapping
                        let routeToStepMap = {}
                        if (setupType === 'simple') {
                            // Simple flow: Project(1) → Editors(2) → Review(3)
                            routeToStepMap = {
                                '/api/setup/step/project': 1,
                                '/api/setup/step/editors': 2,
                                '/api/setup/generate': 3
                            }
                        } else {
                            // Extended flow: Project(1) → Presets(2) → Frontend(3) → Agents(4) → Editors(5) → Advanced(6) → Review(7)
                            routeToStepMap = {
                                '/api/setup/step/project': 1,
                                '/api/setup/step/presets': 2,
                                '/api/setup/step/frontend': 3,
                                '/api/setup/step/agents': 4,
                                '/api/setup/step/editors': 5,
                                '/api/setup/step/advanced': 6,
                                '/api/setup/generate': 7
                            }
                        }

                        for (const [action, stepNum] of Object.entries(routeToStepMap)) {
                            if (formAction.includes(action)) {
                                // Update state with current step
                                stateManager.update({ currentStep: stepNum })
                                console.log('[WizardInit] Updated current step to', stepNum, 'based on form action:', action, 'setupType:', setupType)
                                break
                            }
                        }

                        // Setup listeners for new form
                        formSync.setupFormListeners(form)
                        // Restore state to form - use setTimeout to ensure DOM is ready
                        setTimeout(() => {
                            formSync.restoreStateToForm(form)
                        }, 50)
                    }
                })
            }
        }

        // Before HTMX POST requests, save current form state and determine next step
        const beforeRequestHandler = function(event) {
            try {
                const form = event.detail?.elt
                if (form && form.tagName === 'FORM') {
                    console.log('[WizardInit] HTMX request starting, saving form state')
                    console.log('[WizardInit] Form action:', form.getAttribute('hx-post'))
                    console.log('[WizardInit] Form method:', form.method || 'POST')
                    console.log('[WizardInit] Form target:', form.getAttribute('hx-target'))
                    console.log('[WizardInit] HTMX detail:', {
                        verb: event.detail?.verb,
                        path: event.detail?.pathInfo?.requestPath,
                        target: event.detail?.target?.id,
                        shouldSwap: event.detail?.shouldSwap
                    })

                    // CRITICAL: Check if request is being blocked
                    if (event.detail?.shouldSwap === false) {
                        console.warn('[WizardInit] WARNING: Request swap is disabled!')
                    }

                    // Save form state (don't let errors block submission)
                    try {
                        formSync.syncFormToState(form)
                    } catch (error) {
                        console.error('[WizardInit] Error syncing form state:', error)
                        // Continue anyway - don't block submission
                    }

                    // Determine and update next step (don't let errors block submission)
                    try {
                        const formAction = form.getAttribute('hx-post') || ''
                        const state = stateManager.load()
                        const nextStep = determineNextStepFromForm(formAction, state.setupType)

                        if (nextStep) {
                            console.log('[WizardInit] Determined next step:', nextStep.num, nextStep.route)
                            // Update state with next step (will be confirmed after response)
                            stateManager.update({ currentStep: nextStep.num })
                        }
                    } catch (error) {
                        console.error('[WizardInit] Error determining next step:', error)
                        // Continue anyway - don't block submission
                    }
                }
            } catch (error) {
                console.error('[WizardInit] Error in beforeRequestHandler:', error)
                // CRITICAL: Don't prevent default - let HTMX handle the request
                // Don't throw - let the request proceed
            }
        }

        // Handle form validation errors
        const validationErrorHandler = function(event) {
            const form = event.detail?.elt
            if (form && form.tagName === 'FORM') {
                console.error('[WizardInit] Form validation error:', {
                    formAction: form.getAttribute('hx-post'),
                    formId: form.id,
                    invalidFields: Array.from(form.elements).filter(el => !el.validity.valid)
                })
            }
        }

        // Handle HTMX request errors (not configRequest - that's not an error event)
        const responseErrorHandler = function(event) {
            console.error('[WizardInit] HTMX response error:', event.detail)
        }

        const sendErrorHandler = function(event) {
            console.error('[WizardInit] HTMX send error:', event.detail)
        }

        // Add listeners
        document.body.addEventListener('htmx:afterSettle', afterSettleHandler)
        document.body.addEventListener('htmx:beforeRequest', beforeRequestHandler)
        document.body.addEventListener('htmx:validation:failed', validationErrorHandler)
        document.body.addEventListener('htmx:responseError', responseErrorHandler)
        document.body.addEventListener('htmx:sendError', sendErrorHandler)

        // Track for cleanup
        htmxListeners.push(
            { event: 'htmx:afterSettle', handler: afterSettleHandler },
            { event: 'htmx:beforeRequest', handler: beforeRequestHandler },
            { event: 'htmx:validation:failed', handler: validationErrorHandler },
            { event: 'htmx:responseError', handler: responseErrorHandler },
            { event: 'htmx:sendError', handler: sendErrorHandler }
        )
    }

    /**
     * Cleanup HTMX listeners
     */
    function cleanupHtmxListeners() {
        htmxListeners.forEach(({ event, handler }) => {
            document.body.removeEventListener(event, handler)
        })
        htmxListeners.length = 0
    }

    /**
     * Validate form before submission
     * Returns true if form is valid, false otherwise
     */
    function validateForm(form) {
        if (!form || form.tagName !== 'FORM') return true

        // Check HTML5 validation
        if (!form.checkValidity()) {
            console.warn('[WizardInit] Form validation failed')
            form.reportValidity()
            return false
        }

        return true
    }

    /**
     * Initialize step button handlers
     */
    function initializeStepButtons() {
        const stepButtons = document.querySelectorAll('[data-step][data-route]')
        stepButtons.forEach(button => {
            const stepNum = parseInt(button.getAttribute('data-step'))
            const route = button.getAttribute('data-route')
            const closestEl = button.closest('[data-setup-type]')
            const closestType = closestEl ? closestEl.getAttribute('data-setup-type') : null
            const queryEl = document.querySelector('[data-setup-type]')
            const queryType = queryEl ? queryEl.getAttribute('data-setup-type') : null
            const setupType = closestType || queryType || 'extended'

            // Remove existing listeners by cloning
            const newButton = button.cloneNode(true)
            button.parentNode.replaceChild(newButton, button)

            // Add new listener
            newButton.addEventListener('click', function(e) {
                e.preventDefault()
                e.stopPropagation()
                if (typeof window.navigateToStep === 'function') {
                    window.navigateToStep(stepNum, route, setupType)
                }
            })
        })
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWizard)
    } else {
        initializeWizard()
    }

    // Re-bind step buttons after HTMX swaps
    document.body.addEventListener('htmx:afterSwap', initializeStepButtons)

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        cleanupHtmxListeners()
        formSync.cleanupAll()
    })

    // Helper functions for backward compatibility
    window.selectAllEditors = function() {
        document.querySelectorAll('input[name="editors"]').forEach(cb => cb.checked = true)
        const form = document.querySelector('form')
        if (form && window.formStateSync) {
            window.formStateSync.syncFormToState(form)
        }
    }

    window.deselectAllEditors = function() {
        document.querySelectorAll('input[name="editors"]').forEach(cb => cb.checked = false)
        const form = document.querySelector('form')
        if (form && window.formStateSync) {
            window.formStateSync.syncFormToState(form)
        }
    }

    window.toggleInfo = function(infoId) {
        const infoBox = document.getElementById(infoId)
        if (infoBox) infoBox.classList.toggle('hidden')
    }

    window.updateFrameworkVisibility = function() {
        const checkbox = document.querySelector('input[name="framework"]')
        const options = document.getElementById('framework-options')
        if (checkbox && options) {
            options.classList.toggle('hidden', !checkbox.checked)
        }
    }

    window.handleAdvancedSubmit = function() {
        return true
    }

    console.log('[WizardInit] Script loaded')
})()
