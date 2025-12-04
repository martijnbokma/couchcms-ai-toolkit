/**
 * Review form submission handler
 * Ensures wizard state is included in form submission
 * This guarantees all selections are preserved even if hidden fields are incomplete
 */
(function() {
    'use strict'

    const GENERATE_FORM_ID = (window.WIZARD_CONSTANTS && window.WIZARD_CONSTANTS.GENERATE_FORM_ID) || 'generate-form'
    const WIZARD_STATE_INPUT_ID = (window.WIZARD_CONSTANTS && window.WIZARD_CONSTANTS.WIZARD_STATE_INPUT_ID) || 'wizard-state-input'
    const WIZARD_CONTENT_ID = (window.WIZARD_CONSTANTS && window.WIZARD_CONSTANTS.WIZARD_CONTENT_ID) || 'wizard-content'
    const INIT_DELAY_MS = 50

    // Track if event listeners are already setup to prevent duplicates
    let editButtonsSetup = false
    let backButtonSetup = false

    /**
     * Get generate form element
     * @returns {HTMLFormElement | null} Generate form or null
     */
    function getGenerateForm(): HTMLFormElement | null {
        return document.getElementById(GENERATE_FORM_ID) as HTMLFormElement | null
    }

    /**
     * Get wizard state input element
     * @returns {HTMLInputElement | null} State input or null
     */
    function getWizardStateInput(): HTMLInputElement | null {
        return document.getElementById(WIZARD_STATE_INPUT_ID) as HTMLInputElement | null
    }

    /**
     * Check if WizardState is available
     * @returns {boolean} True if WizardState is available
     */
    function isWizardStateAvailable(): boolean {
        return typeof window.WizardState !== 'undefined' &&
               typeof (window.WizardState as WizardStateLegacy).collectFormData === 'function' &&
               typeof (window.WizardState as WizardStateLegacy).update === 'function' &&
               typeof (window.WizardState as WizardStateLegacy).load === 'function'
    }

    /**
     * Serialize wizard state to JSON string
     * @param {WizardState} state - Wizard state object
     * @returns {string | null} JSON string or null on error
     */
    function serializeState(state: Partial<WizardState> | null | undefined): string | null {
        if (!state || Object.keys(state).length === 0) {
            return null
        }

        try {
            return JSON.stringify(state)
        } catch (error) {
            console.error('[Review] Error serializing wizard state:', error)
            return null
        }
    }

    /**
     * Save and inject wizard state into form before submission
     */
    function saveAndInjectState(): void {
        if (!isWizardStateAvailable()) {
            console.warn('[Review] WizardState not available')
            return
        }

        try {
            const wizardState = window.WizardState as WizardStateLegacy
            const currentFormData = wizardState.collectFormData()
            wizardState.update(currentFormData)

            const completeState = wizardState.load()
            const stateInput = getWizardStateInput()

            if (!stateInput) {
                console.warn('[Review] Wizard state input not found')
                return
            }

            const serializedState = serializeState(completeState)
            if (serializedState) {
                stateInput.value = serializedState
                console.log('[Review] Wizard state included in submission:', completeState)
            }
        } catch (error) {
            console.error('[Review] Error saving wizard state:', error)
        }
    }

    /**
     * Check if event is for wizard content swap
     * @param {Event} event - HTMX event
     * @returns {boolean} True if event targets wizard content
     */
    function isWizardContentSwap(event: Event): boolean {
        if (window.HTMXUtils && typeof window.HTMXUtils.isWizardContentSwap === 'function') {
            return window.HTMXUtils.isWizardContentSwap(event)
        }

        const htmxEvent = event as CustomEvent
        const detailTargetId = (htmxEvent.detail && htmxEvent.detail.target && (htmxEvent.detail.target as HTMLElement).id)
        const eventTargetId = (event.target && (event.target as HTMLElement).id)
        const targetId = detailTargetId || eventTargetId
        return targetId === WIZARD_CONTENT_ID
    }

    /**
     * Handle form submission (capture phase to run before HTMX)
     * @param {Event} event - Submit event
     */
    function handleFormSubmit(event: Event): void {
        const form = event.target as HTMLFormElement | null
        if (!form || form.id !== GENERATE_FORM_ID) {
            return
        }

        saveAndInjectState()
    }

    /**
     * Handle HTMX beforeRequest event
     * @param {Event} event - HTMX beforeRequest event
     */
    function handleHtmxBeforeRequest(event: Event): void {
        const htmxEvent = event as CustomEvent
        const form = htmxEvent.detail?.elt as HTMLFormElement | undefined
        if (!form || form.id !== GENERATE_FORM_ID) {
            return
        }

        saveAndInjectState()
    }

    /**
     * Handle HTMX afterSwap event
     * @param {Event} event - HTMX afterSwap event
     */
    function handleHtmxSwap(event: Event): void {
        if (!isWizardContentSwap(event)) {
            return
        }

        // Check if we're on the review step before initializing
        // Review step has the generate-form
        setTimeout(() => {
            const form = getGenerateForm()
            if (form) {
                // We're on the review step - initialize
                initializeReviewForm()
            } else {
                // Not on review step yet - don't initialize
                console.log('[Review] Not on review step, skipping initialization')
            }
        }, INIT_DELAY_MS)
    }

    /**
     * Setup form event listeners
     * @param {HTMLFormElement} form - Form element
     */
    function setupFormListeners(form: HTMLFormElement): void {
        // Use capture phase to run before HTMX processes the submit
        form.addEventListener('submit', handleFormSubmit, true)
        form.addEventListener('htmx:beforeRequest', handleHtmxBeforeRequest)
    }

    /**
     * Setup HTMX swap listener
     */
    function setupHtmxListener(): void {
        if (typeof window.htmx === 'undefined') {
            return
        }

        document.body.addEventListener('htmx:afterSwap', handleHtmxSwap)
    }

    /**
     * Handle edit button clicks using event delegation
     * @param {Event} event - Click event
     */
    function handleEditButtonClick(event: Event): void {
        // Use closest to find the button element (works even if SVG is clicked)
        const target = event.target as HTMLElement
        const button = target.closest<HTMLElement>('[data-edit-step]')

        if (!button) {
            return
        }

        const stepNum = parseInt(button.getAttribute('data-edit-step') || '0')
        const route = button.getAttribute('data-edit-route')

        if (!stepNum || isNaN(stepNum) || !route) {
            console.error('[Review] Invalid edit button data:', { stepNum, route, button })
            return
        }

        event.preventDefault()
        event.stopPropagation()

        console.log('[Review] Edit button clicked:', { stepNum, route, button })

        // Get setup type from state
        let setupType: string = 'simple'
        if (window.wizardStateManager) {
            try {
                const state = window.wizardStateManager.load()
                setupType = state.setupType || 'simple'
            } catch (error) {
                console.warn('[Review] Error loading state:', error)
            }
        } else if (window.WizardState) {
            try {
                const wizardState = window.WizardState as WizardStateLegacy
                const state = wizardState.load()
                setupType = (state as Partial<WizardState>).setupType || 'simple'
            } catch (error) {
                console.warn('[Review] Error loading state:', error)
            }
        }

        console.log('[Review] Navigating to edit step:', { stepNum, route, setupType })

        // Try multiple ways to navigate
        let navigationSuccess = false

        // Method 1: Use global navigateToStep function
        if (typeof window.navigateToStep === 'function') {
            console.log('[Review] Using window.navigateToStep')
            try {
                const result = window.navigateToStep(stepNum, route, setupType)
                // Handle both promise and non-promise returns
                if (result && typeof result.catch === 'function') {
                    (result as Promise<unknown>).catch((error: Error) => {
                        console.error('[Review] Error navigating to edit step:', error)
                    })
                }
                navigationSuccess = true
            } catch (error) {
                console.error('[Review] Error calling navigateToStep:', error)
            }
        }

        // Method 2: Try wizardNavigation directly
        if (!navigationSuccess && window.wizardNavigation && typeof window.wizardNavigation.navigateToStep === 'function') {
            console.log('[Review] Using wizardNavigation.navigateToStep directly')
            try {
                const result = window.wizardNavigation.navigateToStep(stepNum, route)
                if (result && typeof result.catch === 'function') {
                    (result as Promise<unknown>).catch((error: Error) => {
                        console.error('[Review] Error navigating to edit step:', error)
                    })
                }
                navigationSuccess = true
            } catch (error) {
                console.error('[Review] Error calling wizardNavigation.navigateToStep:', error)
            }
        }

        // Method 3: Fallback - manual HTMX navigation
        if (!navigationSuccess) {
            console.warn('[Review] No navigation function available, trying manual HTMX')
            console.error('[Review] Available functions:', Object.keys(window).filter(k =>
                k.includes('navigate') || k.includes('wizard') || k.includes('htmx')
            ))

            // Try to use HTMX directly
            if (typeof window.htmx !== 'undefined' && window.htmx && typeof window.htmx.ajax === 'function') {
                try {
                    const state = window.wizardStateManager?.load() || (window.WizardState as WizardStateLegacy)?.load() || {}
                    const params = new URLSearchParams()
                    Object.entries(state as Record<string, unknown>).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            value.forEach(v => params.append(key, String(v)))
                        } else if (value !== null && value !== undefined && value !== '') {
                            params.append(key, String(value))
                        }
                    })
                    const url = `/api/setup/step/${route}?${params.toString()}`
                    console.log('[Review] Manual HTMX navigation to:', url)
                    window.htmx.ajax('GET', url, {
                        target: '#wizard-content',
                        swap: 'innerHTML'
                    } as never)
                } catch (error) {
                    console.error('[Review] Error with manual HTMX navigation:', error)
                }
            }
        }
    }

    /**
     * Setup edit button listeners using event delegation AND direct binding
     */
    function setupEditButtons(): void {
        // Only setup event delegation once
        if (!editButtonsSetup) {
            // Use event delegation on document body for better reliability
            // This works even if buttons are added dynamically
            // Use capture phase to catch events early
            document.body.addEventListener('click', handleEditButtonClick, true)
            editButtonsSetup = true
            console.log('[Review] Event delegation setup for edit buttons')
        }

        // Also bind directly to existing buttons as fallback
        const editButtons = document.querySelectorAll<HTMLElement>('[data-edit-step][data-edit-route]')
        console.log('[Review] Found edit buttons:', editButtons.length)

        editButtons.forEach((btn, index) => {
            // Remove any existing listeners by cloning
            const newBtn = btn.cloneNode(true) as HTMLElement
            if (btn.parentNode) {
                btn.parentNode.replaceChild(newBtn, btn)
            }

            // Add direct click listener
            newBtn.addEventListener('click', function(event: Event) {
                console.log('[Review] Direct edit button click:', index + 1)
                handleEditButtonClick(event)
            })

            console.log(`[Review] Directly bound edit button ${index + 1}:`, {
                step: newBtn.getAttribute('data-edit-step'),
                route: newBtn.getAttribute('data-edit-route')
            })
        })
    }

    /**
     * Handle back button click
     * @param {Event} event - Click event
     */
    function handleBackButtonClick(event: Event): void {
        console.log('[Review] Back button clicked')

        event.preventDefault()
        event.stopPropagation()

        // Check if goBack is available
        if (typeof window.goBack === 'function') {
            console.log('[Review] Calling goBack function')
            try {
                const result = window.goBack()
                // Handle promise if returned
                if (result && typeof result.catch === 'function') {
                    (result as Promise<unknown>).catch((error: Error) => {
                        console.error('[Review] Error navigating back:', error)
                    })
                }
            } catch (error) {
                console.error('[Review] Error calling goBack:', error)
            }
        } else {
            console.error('[Review] goBack function not available. Available functions:',
                Object.keys(window).filter(k => k.includes('go') || k.includes('back') || k.includes('wizard')))

            // Fallback: try to navigate manually
            if (window.wizardNavigation && typeof window.wizardNavigation.navigateBack === 'function') {
                console.log('[Review] Using wizardNavigation.navigateBack directly')
                window.wizardNavigation.navigateBack().catch((error: Error) => {
                    console.error('[Review] Error navigating back:', error)
                })
            }
        }
    }

    /**
     * Setup back button listener using event delegation AND direct binding
     */
    function setupBackButton(): void {
        // Only setup event delegation once
        if (!backButtonSetup) {
            // Use event delegation for back button
            document.body.addEventListener('click', function(event: Event) {
                // Check if clicked element or parent is the back button
                const target = event.target as HTMLElement
                const backButton = target.closest<HTMLElement>('#review-back-button') ||
                              (target.id === 'review-back-button' ? target : null)

                if (backButton) {
                    console.log('[Review] Back button event detected via delegation:', backButton)
                    handleBackButtonClick(event)
                }
            }, true)
            backButtonSetup = true
            console.log('[Review] Event delegation setup for back button')
        }

        // Also bind directly as fallback (only if we're on review step)
        const form = getGenerateForm()
        if (form) {
            // We're on review step, so back button should exist
            const backButton = document.getElementById('review-back-button')
            if (backButton) {
                // Remove any existing listeners by cloning
                const newBtn = backButton.cloneNode(true) as HTMLElement
                if (backButton.parentNode) {
                    backButton.parentNode.replaceChild(newBtn, backButton)
                }

                // Add direct click listener
                newBtn.addEventListener('click', function(event: Event) {
                    console.log('[Review] Direct back button click')
                    handleBackButtonClick(event)
                })

                console.log('[Review] Directly bound back button')
            } else {
                // Only warn if we're on review step but button is missing
                // This might happen if DOM isn't fully ready yet - event delegation will handle it
                console.log('[Review] Back button not found yet (DOM may still be loading), event delegation will handle clicks')
            }
        }
        // If not on review step, button doesn't exist - that's normal
        // Event delegation will handle it when the button appears
    }

    /**
     * Initialize review form handlers
     */
    function initializeReviewForm(): void {
        const form = getGenerateForm()
        if (!form) {
            console.warn('[Review] Generate form not found')
        } else {
            setupFormListeners(form)
        }

        // Always setup buttons (they use event delegation)
        // These will work even if called multiple times due to the flags
        setupEditButtons()
        setupBackButton()

        // Verify buttons exist
        const editButtons = document.querySelectorAll<HTMLElement>('[data-edit-step][data-edit-route]')
        const backButton = document.getElementById('review-back-button')

        console.log('[Review] Review form initialized', {
            formFound: !!form,
            editButtonsFound: editButtons.length,
            backButtonFound: !!backButton,
            navigateToStepAvailable: typeof window.navigateToStep === 'function',
            goBackAvailable: typeof window.goBack === 'function',
            wizardNavigationAvailable: typeof window.wizardNavigation !== 'undefined'
        })
    }

    /**
     * Test if navigation functions are available
     */
    function testNavigationFunctions(): Record<string, boolean> {
        const tests = {
            navigateToStep: typeof window.navigateToStep === 'function',
            wizardNavigation: typeof window.wizardNavigation !== 'undefined',
            wizardStateManager: typeof window.wizardStateManager !== 'undefined',
            WizardState: typeof window.WizardState !== 'undefined'
        }
        console.log('[Review] Navigation functions availability:', tests)
        return tests
    }

    /**
     * Execute initialization when DOM is ready
     */
    function runInitialization(): void {
        // Test navigation functions first
        testNavigationFunctions()

        // Setup HTMX listener immediately (doesn't depend on DOM)
        setupHtmxListener()

        // Setup event delegation immediately (works for dynamically added content)
        // These use event delegation so they work even if called before DOM is ready
        setupEditButtons()
        setupBackButton()

        // Only initialize if we're already on the review step
        // Otherwise wait for HTMX swap event
        function doInitialize(): void {
            const form = getGenerateForm()
            if (form) {
                // We're on review step - initialize
                initializeReviewForm()

                // Also verify buttons are accessible after a short delay
                setTimeout(() => {
                    const editButtons = document.querySelectorAll<HTMLElement>('[data-edit-step][data-edit-route]')
                    const backButton = document.getElementById('review-back-button')

                    console.log('[Review] Button verification:', {
                        editButtons: editButtons.length,
                        backButton: !!backButton,
                        editButtonsList: Array.from(editButtons).map(btn => ({
                            step: btn.getAttribute('data-edit-step'),
                            route: btn.getAttribute('data-edit-route')
                        }))
                    })
                }, 200)
            } else {
                console.log('[Review] Not on review step yet, will initialize when review step loads')
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(doInitialize, 100)
            })
        } else {
            // Use setTimeout to ensure DOM is fully ready
            setTimeout(doInitialize, 100)
        }
    }

    // Run initialization immediately
    runInitialization()
})()
