/**
 * Wizard Navigation Manager - Improved Version
 * Handles navigation between wizard steps with state preservation
 * Uses centralized step-config.ts for step definitions (DRY)
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

    // Get step configuration from centralized step-config.ts (DRY)
    // Will be available after build bundles step-config.ts before this file
    const getStepConfig = (): {
        simple: StepDefinition[]
        extended: StepDefinition[]
        presets: StepDefinition[]
    } => {
        if (typeof window !== 'undefined' && (window as { StepConfig?: unknown }).StepConfig) {
            return (window as { StepConfig: { simple: StepDefinition[]; extended: StepDefinition[]; presets: StepDefinition[] } }).StepConfig
        }
        // Fallback definitions (should not be needed after build, but kept for safety)
        console.warn('[WizardNavigation] StepConfig not found, using fallback definitions')
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
            ],
            presets: [
                { num: 1, route: 'project', label: 'Project' },
                { num: 2, route: 'presets', label: 'Select Preset' },
                { num: 3, route: 'review', label: 'Review' }
            ]
        }
    }

    const STEP_CONFIG = getStepConfig()

    /**
     * Wizard Navigation Class - Improved Version
     * CRITICAL: This class maintains the single source of truth for step navigation
     * Uses centralized step-config.ts (DRY principle)
     */
    class WizardNavigation {
        stepDefinitions: {
            simple: StepDefinition[]
            extended: StepDefinition[]
            presets: StepDefinition[]
        }

        constructor() {
            // Use centralized step configuration (DRY)
            this.stepDefinitions = {
                simple: STEP_CONFIG.simple,
                extended: STEP_CONFIG.extended,
                presets: STEP_CONFIG.presets
            }
        }

        /**
         * Get current step from state or detect from form
         * CRITICAL: This is the single source of truth for current step
         * CRITICAL: Route mapping is setup-type aware
         * Uses centralized step-config (DRY)
         * @returns {StepDefinition | null} Current step info
         */
        getCurrentStep(): StepDefinition | null {
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
            // CRITICAL: Route mapping must be setup-type aware
            const form = document.querySelector('form')
            if (form) {
                const formAction = form.getAttribute('hx-post') || ''
                console.log('[WizardNavigation.getCurrentStep] Detecting from form action:', formAction, 'setupType:', setupType)

                // Setup-type aware route mapping (uses centralized step config)
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
         * @param {string} setupType - Setup type ('simple', 'extended', or 'presets')
         * @returns {StepDefinition[]} Step definitions
         */
        getSteps(setupType: 'simple' | 'extended' | 'presets'): StepDefinition[] {
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
            const form = document.querySelector('form')
            if (form && window.formStateSync && typeof window.formStateSync.syncFormToState === 'function') {
                try {
                    console.log('[WizardNavigation] Syncing form state before navigation')

                    // Step 1: Immediate sync
                    const currentState = stateManager.load()
                    window.formStateSync.syncFormToState(form, true)

                    // Step 2: Wait for DOM updates (checkboxes might have async handlers)
                    await new Promise<void>(resolve => {
                        setTimeout(() => {
                            // Double-check: sync again after delay to catch any async updates
                            window.formStateSync.syncFormToState(form, true)
                            resolve()
                        }, 50)
                    })

                    // Step 3: Verify state was saved correctly
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
                            } else if (currentState[key] && Array.isArray(currentState[key]) && currentState[key].length > 0) {
                                // Lost during sync - restore it
                                console.warn(`[WizardNavigation] WARNING: ${key} array was lost! Restoring from current state.`)
                                stateManager.update({ [key]: currentState[key] })
                            }
                        }
                    })

                    console.log('[WizardNavigation] State verified before navigation:', {
                        css: savedState.css,
                        js: savedState.js,
                        agents: savedState.agents,
                        editors: savedState.editors,
                        projectName: savedState.projectName,
                        preset: savedState.preset
                    })
                } catch (error) {
                    console.error('[WizardNavigation] Error syncing form state:', error)
                    // Continue anyway - don't block navigation
                }
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

        // Fallback: Use determineBackRoute if available (legacy compatibility)
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
        console.error('[goBack] wizardNavigation not available')
        return Promise.reject(new Error('Navigation not available'))
    }

    // Backward compatibility: Export determineBackRoute function (used by legacy code)
    window.determineBackRoute = function(setupType: string): string {
        const form = document.querySelector('form')
        const formAction = (form && form.getAttribute('hx-post')) || ''
        const currentUrl = window.location.pathname + window.location.search
        const isReviewStep = formAction.includes('/setup/generate') ||
            currentUrl.includes('/step/review') ||
            document.querySelector('form[hx-post*="/setup/generate"]')

        const SETUP_TYPES = { SIMPLE: 'simple', EXTENDED: 'extended' }
        const routeMap: Record<string, string> = {
            // Review step: go back to previous step
            review: setupType === SETUP_TYPES.SIMPLE ? '/api/setup/step/editors' : '/api/setup/step/advanced',
            // Advanced step (6): go back to Editors (5)
            advanced: setupType === SETUP_TYPES.SIMPLE ? '/api/setup/step/project' : '/api/setup/step/editors',
            // Editors step (5): go back to Agents (4) for extended, Project (1) for simple
            editors: setupType === SETUP_TYPES.SIMPLE ? '/api/setup/step/project' : '/api/setup/step/agents',
            // Agents step (4): go back to Frontend (3) for extended
            agents: '/api/setup/step/frontend',
            // Frontend step (3): go back to Presets (2)
            frontend: '/api/setup/step/presets',
            // Presets step (2): go back to Project (1)
            presets: '/api/setup/step/project',
            // Legacy/complexity step
            complexity: '/api/setup/step/project',
            // Default fallback
            default: '/api/setup/step/project'
        }

        if (isReviewStep) return routeMap.review
        if (formAction.includes('/step/advanced')) return routeMap.advanced
        if (formAction.includes('/step/editors')) return routeMap.editors
        if (formAction.includes('/step/agents')) return routeMap.agents
        if (formAction.includes('/step/frontend')) return routeMap.frontend
        if (formAction.includes('/step/presets')) return routeMap.presets
        if (formAction.includes('/step/complexity')) return routeMap.complexity
        return routeMap.default
    }

    console.log('[WizardNavigation] Initialized')
})()
