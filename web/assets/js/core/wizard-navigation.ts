/**
 * Wizard Navigation Manager - Improved Version
 * Handles navigation between wizard steps with state preservation
 *
 * @class WizardNavigation
 */
(function() {
    'use strict'

    // Ensure dependencies are available
    if (!window.wizardStateManager) {
        console.error('[WizardNavigation] WizardStateManager not available')
        return
    }

    if (!window.HTMXUtils) {
        console.error('[WizardNavigation] HTMXUtils not available')
        return
    }

    const stateManager = window.wizardStateManager
    const HTMXUtils = window.HTMXUtils

    /**
     * Wizard Navigation Class - Improved Version
     * CRITICAL: This class maintains the single source of truth for step navigation
     */
    class WizardNavigation {
        stepDefinitions: {
            simple: StepDefinition[]
            extended: StepDefinition[]
        }

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
         * Get current step from state or detect from form
         * CRITICAL: This is the single source of truth for current step
         * CRITICAL: Route mapping is setup-type aware
         * @returns {StepDefinition | null} Current step info
         */
        getCurrentStep(): StepDefinition | null {
            const state = stateManager.load()
            const setupType = (state.setupType || 'simple') as 'simple' | 'extended'
            const steps = this.getSteps(setupType)

            // First try: use state.currentStep
            if (state.currentStep) {
                const step = steps.find(s => s.num === state.currentStep)
                if (step) {
                    console.log('[WizardNavigation.getCurrentStep] Using state.currentStep:', state.currentStep)
                    return step
                }
            }

            // Fallback: detect from form action
            // CRITICAL: Route mapping must be setup-type aware
            const form = document.querySelector('form')
            if (form) {
                const formAction = form.getAttribute('hx-post') || ''
                console.log('[WizardNavigation.getCurrentStep] Detecting from form action:', formAction, 'setupType:', setupType)

                // Setup-type aware route mapping
                let routeMap: Record<string, number> = {}
                if (setupType === 'simple') {
                    // Simple flow: Project(1) → Editors(2) → Review(3)
                    routeMap = {
                        '/api/setup/step/project': 1,
                        '/api/setup/step/editors': 2,
                        '/api/setup/generate': 3
                    }
                } else {
                    // Extended flow: Project(1) → Presets(2) → Frontend(3) → Agents(4) → Editors(5) → Advanced(6) → Review(7)
                    routeMap = {
                        '/api/setup/step/project': 1,
                        '/api/setup/step/presets': 2,
                        '/api/setup/step/frontend': 3,
                        '/api/setup/step/agents': 4,
                        '/api/setup/step/editors': 5,
                        '/api/setup/step/advanced': 6,
                        '/api/setup/generate': 7
                    }
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

        /**
         * Get next step based on current step
         * @param {string} setupType - Setup type
         * @param {number} currentStepNum - Current step number
         * @returns {StepDefinition | null} Next step info or null if at last step
         */
        getNextStep(setupType?: 'simple' | 'extended', currentStepNum?: number): StepDefinition | null {
            const current = currentStepNum ? this.getSteps(setupType || 'simple').find(s => s.num === currentStepNum) : this.getCurrentStep()
            if (!current) return null

            const state = stateManager.load()
            const steps = this.getSteps((setupType || state.setupType || 'simple') as 'simple' | 'extended')
            const currentIndex = steps.findIndex(s => s.num === current.num)

            if (currentIndex < steps.length - 1) {
                return steps[currentIndex + 1]
            }
            return null
        }

        /**
         * Get previous step based on current step
         * @param {string} setupType - Setup type
         * @param {number} currentStepNum - Current step number
         * @returns {StepDefinition | null} Previous step info or null if at first step
         */
        getPreviousStep(setupType?: 'simple' | 'extended', currentStepNum?: number): StepDefinition | null {
            const current = currentStepNum ? this.getSteps(setupType || 'simple').find(s => s.num === currentStepNum) : this.getCurrentStep()
            if (!current) return null

            const state = stateManager.load()
            const steps = this.getSteps((setupType || state.setupType || 'simple') as 'simple' | 'extended')
            const currentIndex = steps.findIndex(s => s.num === current.num)

            if (currentIndex > 0) {
                return steps[currentIndex - 1]
            }
            return null
        }

        /**
         * Get steps for current setup type
         * @param {string} setupType - Setup type ('simple' or 'extended')
         * @returns {StepDefinition[]} Step definitions
         */
        getSteps(setupType: 'simple' | 'extended'): StepDefinition[] {
            return this.stepDefinitions[setupType] || this.stepDefinitions.simple
        }

        /**
         * Navigate to specific step
         * @param {number} stepNum - Step number
         * @param {string} route - Route name
         * @param {string} setupType - Setup type (optional, read from state if not provided)
         * @returns {Promise<unknown>} HTMX navigation promise
         */
        async navigateToStep(stepNum: number, route: string, setupType?: 'simple' | 'extended'): Promise<unknown> {
            console.log('[WizardNavigation] Navigating to step', stepNum, 'route:', route)

            // CRITICAL: Save current form state before navigating
            // This ensures all selections are preserved when navigating between steps
            // Use immediate sync to avoid race conditions with async event handlers
            const form = document.querySelector('form')
            if (form && window.formStateSync) {
                console.log('[WizardNavigation] Syncing form state before navigation (immediate)')

                // CRITICAL: Wait a tiny bit to ensure any pending async syncs complete
                // This prevents race conditions where a checkbox deselect triggers async sync
                // but navigation happens before that sync completes
                await new Promise(resolve => setTimeout(resolve, 20))

                window.formStateSync.syncFormToState(form, true) // Immediate sync

                // Verify state was saved
                const savedState = stateManager.load()
                console.log('[WizardNavigation] State saved before navigation:', {
                    css: savedState.css,
                    js: savedState.js,
                    agents: savedState.agents,
                    editors: savedState.editors
                })
            } else {
                console.warn('[WizardNavigation] Could not sync form state - form or formStateSync not available')
            }

            // Update state
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
            return HTMXUtils.htmxAjax('GET', url, {
                target: '#wizard-content',
                swap: 'innerHTML'
            }).catch(error => {
                console.error('[WizardNavigation] Navigation error:', error)
                throw error
            })
        }

        /**
         * Navigate back
         * CRITICAL: Always uses getPreviousStep() to ensure correct navigation
         * @returns {Promise<unknown>} Navigation promise
         */
        async navigateBack(): Promise<unknown> {
            const prevStep = this.getPreviousStep()

            if (prevStep) {
                console.log('[WizardNavigation] Navigating back to step', prevStep.num, 'route:', prevStep.route)
                return this.navigateToStep(prevStep.num, prevStep.route)
            } else {
                console.warn('[WizardNavigation] Already at first step, cannot go back')
                return Promise.resolve(undefined)
            }
        }

        /**
         * Navigate forward
         * CRITICAL: Always uses getNextStep() to ensure correct navigation
         * @returns {Promise<unknown>} Navigation promise
         */
        async navigateForward(): Promise<unknown> {
            const nextStep = this.getNextStep()

            if (nextStep) {
                console.log('[WizardNavigation] Navigating forward to step', nextStep.num, 'route:', nextStep.route)
                return this.navigateToStep(nextStep.num, nextStep.route)
            } else {
                console.warn('[WizardNavigation] Already at last step, cannot go forward')
                return Promise.resolve(undefined)
            }
        }

        /**
         * Convert state to URL parameters
         * @param {WizardState} state - State object
         * @returns {URLSearchParams} URL parameters
         */
        stateToURLParams(state: WizardState): URLSearchParams {
            const params = new URLSearchParams()

            Object.entries(state).forEach(([key, value]) => {
                // Skip metadata fields
                if (['lastUpdated', 'version', 'currentStep', 'completedSteps'].includes(key)) {
                    return
                }

                if (Array.isArray(value)) {
                    // Array fields - append each value
                    // CRITICAL: If array is empty, don't add parameter (server will use empty array from parseArrayValue)
                    // This is correct behavior - empty arrays mean "nothing selected"
                    value.forEach(v => {
                        if (v !== null && v !== undefined && v !== '') {
                            params.append(key, String(v))
                        }
                    })
                } else if (value !== null && value !== undefined && value !== '') {
                    // Single values
                    params.append(key, String(value))
                }
            })

            return params
        }

        /**
         * Get current step info
         * @returns {StepDefinition} Current step information
         */
        getCurrentStepInfo(): StepDefinition {
            const state = stateManager.load()
            const steps = this.getSteps((state.setupType || 'simple') as 'simple' | 'extended')
            return steps.find(s => s.num === state.currentStep) || steps[0]
        }

        /**
         * Get progress percentage
         * @returns {number} Progress percentage (0-100)
         */
        getProgressPercentage(): number {
            const state = stateManager.load()
            const steps = this.getSteps((state.setupType || 'simple') as 'simple' | 'extended')
            return Math.round((state.currentStep || 1) / steps.length * 100)
        }
    }

    // Create singleton instance
    window.WizardNavigation = WizardNavigation
    window.wizardNavigation = new WizardNavigation()

    // Export global navigation functions for backward compatibility
    window.navigateToStep = function(stepNum: number, route: string, setupType?: string): Promise<unknown> {
        // setupType parameter is kept for backward compatibility but not used
        // (it's read from state instead)
        if (window.wizardNavigation) {
            return window.wizardNavigation.navigateToStep(stepNum, route)
        }
        console.error('[navigateToStep] wizardNavigation not available')
        return Promise.reject(new Error('wizardNavigation not available'))
    }

    window.goBack = function(): Promise<unknown> {
        if (window.wizardNavigation) {
            return window.wizardNavigation.navigateBack()
        }
        console.error('[goBack] wizardNavigation not available')
        // Fallback to old implementation if available
        if (typeof window.determineBackRoute === 'function' && window.wizardStateManager && window.HTMXUtils) {
            const state = window.wizardStateManager.load()
            const setupType = (state.setupType || 'simple') as 'simple' | 'extended'
            const backRoute = (window.determineBackRoute as (type: string) => string)(setupType)
            if (backRoute) {
                const params = new URLSearchParams()
                Object.entries(state).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        value.forEach(v => params.append(key, String(v)))
                    } else if (value !== null && value !== undefined && value !== '') {
                        params.append(key, String(value))
                    }
                })
                return window.HTMXUtils.htmxAjax('GET', `${backRoute}?${params.toString()}`, {
                    target: '#wizard-content',
                    swap: 'innerHTML'
                })
            }
        }
        return Promise.reject(new Error('Navigation not available'))
    }

    console.log('[WizardNavigation] Initialized')
})()
