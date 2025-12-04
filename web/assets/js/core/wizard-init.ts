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
    interface HtmxListener {
        event: string
        handler: (e: Event) => void
    }
    const htmxListeners: HtmxListener[] = []

    /**
     * Initialize wizard on page load
     */
    function initializeWizard(): void {
        console.log('[WizardInit] Initializing wizard')

        // Get setup type from URL
        const urlParams = new URLSearchParams(window.location.search)
        const setupType = (urlParams.get('type') || urlParams.get('setupType') || 'simple') as 'simple' | 'extended'

        // Initialize state with setup type and current step
        const currentState = stateManager.load()
        const initialState: Partial<WizardState> = {
            setupType,
            currentStep: currentState.currentStep || 1  // Default to step 1 if not set
        }
        stateManager.update(initialState)

        console.log('[WizardInit] Initialized with setupType:', setupType, 'currentStep:', initialState.currentStep)

        // Setup form listeners for initial form
        const form = document.querySelector<HTMLFormElement>('form')
        if (form) {
            // Detect and update current step from initial form
            const formAction = form.getAttribute('hx-post') || ''
            const routeToStepMap: Record<string, number> = setupType === 'simple' ? {
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

            // CRITICAL: Restore state BEFORE setting up listeners
            // This prevents listeners from triggering on programmatic changes
            formSync.restoreStateToForm(form)

            // Setup listeners AFTER restore is complete
            // Use setTimeout to ensure restore flag is cleared
            setTimeout(() => {
                formSync.setupFormListeners(form)
            }, 150)
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
     * @returns {StepDefinition | null} Next step info or null
     */
    function determineNextStepFromForm(formAction: string, setupType: string): StepDefinition | null {
        if (!window.wizardNavigation) return null

        const steps = window.wizardNavigation.getSteps(setupType as 'simple' | 'extended')

        // Setup-type aware route mapping
        let routeToStepMap: Record<string, number> = {}
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
        let currentStepNum: number | null = null
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
    function setupHtmxListeners(): void {
        // After HTMX swaps content, restore form state and update current step
        const afterSettleHandler = function(event: Event): void {
            const htmxEvent = event as CustomEvent
            const target = htmxEvent.detail?.target as HTMLElement | undefined
            if (target && target.id === 'wizard-content') {
                console.log('[WizardInit] HTMX content swapped, restoring form state')

                // Cleanup old form listeners
                const oldForm = document.querySelector<HTMLFormElement>('form')
                if (oldForm) {
                    formSync.cleanupFormListeners(oldForm)
                }

                // Wait for DOM to be ready
                requestAnimationFrame(() => {
                    const form = document.querySelector<HTMLFormElement>('form')
                    if (form && window.wizardNavigation) {
                        // Update current step based on form action
                        const formAction = form.getAttribute('hx-post') || ''
                        const state = stateManager.load()
                        const setupType = (state.setupType || 'simple') as 'simple' | 'extended'

                        // Setup-type aware route mapping
                        let routeToStepMap: Record<string, number> = {}
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

                        // CRITICAL: Restore state BEFORE setting up listeners
                        // This prevents listeners from triggering on programmatic changes
                        formSync.restoreStateToForm(form)

                        // Setup listeners AFTER restore is complete
                        // Use setTimeout to ensure restore flag is cleared
                        setTimeout(() => {
                            formSync.setupFormListeners(form)
                        }, 150)
                    }
                })
            }
        }

        // Before HTMX POST requests, save current form state and determine next step
        const beforeRequestHandler = function(event: Event): void {
            try {
                const htmxEvent = event as CustomEvent
                const form = htmxEvent.detail?.elt as HTMLFormElement | undefined
                if (form && form.tagName === 'FORM') {
                    console.log('[WizardInit] HTMX request starting, saving form state')
                    console.log('[WizardInit] Form action:', form.getAttribute('hx-post'))
                    console.log('[WizardInit] Form method:', form.method || 'POST')
                    console.log('[WizardInit] Form target:', form.getAttribute('hx-target'))
                    const pathInfo = htmxEvent.detail?.pathInfo as { requestPath?: string } | undefined
                    const target = htmxEvent.detail?.target as HTMLElement | undefined
                    console.log('[WizardInit] HTMX detail:', {
                        verb: htmxEvent.detail?.verb,
                        path: pathInfo?.requestPath,
                        target: target?.id,
                        shouldSwap: htmxEvent.detail?.shouldSwap
                    })

                    // CRITICAL: Check if request is being blocked
                    if (htmxEvent.detail?.shouldSwap === false) {
                        console.warn('[WizardInit] WARNING: Request swap is disabled!')
                    }

                    // Save form state (don't let errors block submission)
                    // Use immediate sync to ensure state is saved before HTMX request
                    try {
                        formSync.syncFormToState(form, true) // Immediate sync
                    } catch (error) {
                        console.error('[WizardInit] Error syncing form state:', error)
                        // Continue anyway - don't block submission
                    }

                    // Determine and update next step (don't let errors block submission)
                    try {
                        const formAction = form.getAttribute('hx-post') || ''
                        const state = stateManager.load()
                        const nextStep = determineNextStepFromForm(formAction, state.setupType || 'simple')

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
        const validationErrorHandler = function(event: Event): void {
            const htmxEvent = event as CustomEvent
            const form = htmxEvent.detail?.elt as HTMLFormElement | undefined
            if (form && form.tagName === 'FORM') {
                console.error('[WizardInit] Form validation error:', {
                    formAction: form.getAttribute('hx-post'),
                    formId: form.id,
                    invalidFields: Array.from(form.elements).filter(el => !(el as HTMLInputElement).validity.valid)
                })
            }
        }

        // Handle HTMX request errors (not configRequest - that's not an error event)
        const responseErrorHandler = function(event: Event): void {
            const htmxEvent = event as CustomEvent
            console.error('[WizardInit] HTMX response error:', htmxEvent.detail)
        }

        const sendErrorHandler = function(event: Event): void {
            const htmxEvent = event as CustomEvent
            console.error('[WizardInit] HTMX send error:', htmxEvent.detail)
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
    function cleanupHtmxListeners(): void {
        htmxListeners.forEach(({ event, handler }) => {
            document.body.removeEventListener(event, handler)
        })
        htmxListeners.length = 0
    }

    /**
     * Validate form before submission
     * Returns true if form is valid, false otherwise
     */
    function validateForm(form: HTMLFormElement | null): boolean {
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
    function initializeStepButtons(): void {
        const stepButtons = document.querySelectorAll<HTMLElement>('[data-step][data-route]')
        stepButtons.forEach(button => {
            const stepNum = parseInt(button.getAttribute('data-step') || '0')
            const route = button.getAttribute('data-route') || ''
            const closestEl = button.closest<HTMLElement>('[data-setup-type]')
            const closestType = closestEl ? closestEl.getAttribute('data-setup-type') : null
            const queryEl = document.querySelector<HTMLElement>('[data-setup-type]')
            const queryType = queryEl ? queryEl.getAttribute('data-setup-type') : null
            const setupType = (closestType || queryType || 'extended') as string

            // Remove existing listeners by cloning
            const newButton = button.cloneNode(true) as HTMLElement
            if (button.parentNode) {
                button.parentNode.replaceChild(newButton, button)
            }

            // Add new listener
            newButton.addEventListener('click', function(e: Event) {
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
    window.selectAllEditors = function(): void {
        document.querySelectorAll<HTMLInputElement>('input[name="editors"]').forEach(cb => cb.checked = true)
        const form = document.querySelector<HTMLFormElement>('form')
        if (form && window.formStateSync) {
            window.formStateSync.syncFormToState(form)
        }
    }

    window.deselectAllEditors = function(): void {
        document.querySelectorAll<HTMLInputElement>('input[name="editors"]').forEach(cb => cb.checked = false)
        const form = document.querySelector<HTMLFormElement>('form')
        if (form && window.formStateSync) {
            window.formStateSync.syncFormToState(form)
        }
    }

    window.toggleInfo = function(infoId: string, button?: HTMLElement): void {
        const infoBox = document.getElementById(infoId)
        if (infoBox) {
            const isHidden = infoBox.classList.contains('hidden')
            infoBox.classList.toggle('hidden')

            // Update aria-expanded attribute if button is provided
            if (button) {
                button.setAttribute('aria-expanded', String(!isHidden))
            }
        }
    }

    window.updateFrameworkVisibility = function(): void {
        const checkbox = document.querySelector<HTMLInputElement>('input[name="framework"]')
        const options = document.getElementById('framework-options')
        if (checkbox && options) {
            const isChecked = checkbox.checked
            options.classList.toggle('hidden', !isChecked)

            // Uncheck all framework component checkboxes if framework is disabled
            if (!isChecked) {
                const componentCheckboxes = options.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
                componentCheckboxes.forEach(cb => {
                    cb.checked = false
                })
            }
        }
    }

    window.handleAdvancedSubmit = function(event: Event): boolean {
        // Add any validation logic here if needed
        return true
    }

    // Edit step navigation handler for Review page
    window.editStep = function(button: HTMLElement): void {
        const stepNum = button.getAttribute('data-edit-step')
        const route = button.getAttribute('data-edit-route')

        if (!stepNum || !route) {
            console.error('[WizardInit.editStep] Missing step number or route', { stepNum, route })
            return
        }

        if (window.wizardNavigation) {
            window.wizardNavigation.navigateToStep(parseInt(stepNum), route)
        } else {
            console.error('[WizardInit.editStep] wizardNavigation not available')
        }
    }

    console.log('[WizardInit] Script loaded')
})()
