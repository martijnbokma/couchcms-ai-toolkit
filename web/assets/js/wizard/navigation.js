/**
 * Wizard navigation functions
 * Navigate between wizard steps with state preservation
 */
(function() {
    'use strict'

    // Ensure dependencies are available
    if (!window.WIZARD_CONFIG || !window.WIZARD_CONSTANTS || !window.WizardState || !window.HTMXUtils) {
        console.error('[Navigation] Required dependencies not loaded')
        return
    }

    const WIZARD_CONFIG = window.WIZARD_CONFIG
    const WIZARD_CONSTANTS = window.WIZARD_CONSTANTS
    const HTMXUtils = window.HTMXUtils
    const WizardState = window.WizardState

    const FIELD_NAMES = WIZARD_CONSTANTS.FIELD_NAMES
    const SETUP_TYPES = WIZARD_CONSTANTS.SETUP_TYPES
    const WIZARD_CONTENT_ID = WIZARD_CONSTANTS.WIZARD_CONTENT_ID

    /**
     * Navigate to a specific step in the wizard
     * Collects current form data to preserve state and saves to sessionStorage
     * CRITICAL: Always preserves existing state, even when navigating from steps without forms
     * @param {number} stepNum - Step number
     * @param {string} route - Route name
     * @param {string} setupType - Setup type ('simple' or 'extended')
     */
    function navigateToStep(stepNum, route, setupType) {
        console.log('[navigateToStep] Navigating to step', stepNum, 'route:', route, 'setupType:', setupType)

        // Prevent Simple setup from accessing presets step
        const effectiveSetupType = setupType || WizardState.load()[FIELD_NAMES.SETUP_TYPE] || WIZARD_CONFIG.DEFAULT_SETUP_TYPE
        if (effectiveSetupType === SETUP_TYPES.SIMPLE && route === 'presets') {
            console.warn('[navigateToStep] Simple setup cannot access presets, redirecting to editors')
            route = 'editors'
            stepNum = 2
        }

        // Save current form state before navigating
        const currentFormData = WizardState.collectFormData()
        WizardState.update(currentFormData)

        // Load updated state and override setupType if provided
        const stateToSend = WizardState.load()
        if (setupType) {
            stateToSend[FIELD_NAMES.SETUP_TYPE] = setupType
            WizardState.save(stateToSend)
        }

        // Navigate with state as URL parameters
        const params = WizardState.toURLParams(stateToSend)
        const url = `/api/setup/step/${route}?${params.toString()}`
        console.log('[navigateToStep] HTMX request URL:', url)
        console.log('[navigateToStep] State being sent:', stateToSend)

        HTMXUtils.htmxAjax('GET', url, {
            target: `#${WIZARD_CONTENT_ID}`,
            swap: 'innerHTML'
        }).catch(error => {
            console.error('[navigateToStep] HTMX navigation error:', error)
            alert(`Error navigating to step ${stepNum}. Please try again.`)
        })
    }

    /**
     * Determine back route based on current step and setup type
     * Extended flow: Project(1) → Presets(2) → Frontend(3) → Agents(4) → Editors(5) → Advanced(6) → Review(7)
     * Simple flow: Project(1) → Editors(2) → Review(3)
     * @param {string} setupType - Setup type ('simple' or 'extended')
     * @returns {string} Back route URL
     */
    function determineBackRoute(setupType) {
        const form = document.querySelector('form')
        const formAction = (form && form.getAttribute('hx-post')) || ''
        const currentUrl = window.location.pathname + window.location.search
        const isReviewStep = formAction.includes('/setup/generate') ||
            currentUrl.includes('/step/review') ||
            document.querySelector('form[hx-post*="/setup/generate"]')

        const routeMap = {
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

    /**
     * Universal back button handler
     * Uses HTMX to navigate back with form data preservation
     * This is the centralized implementation - step-specific goBack() functions should call this
     * @param {string} backRoute - Optional back route (auto-determined if not provided)
     */
    function goBack(backRoute = null) {
        // Save current form state before navigating back
        const currentFormData = WizardState.collectFormData()
        WizardState.update(currentFormData)

        // Determine route if not provided
        if (!backRoute) {
            const setupType = currentFormData.setupType || WIZARD_CONFIG.DEFAULT_SETUP_TYPE
            backRoute = determineBackRoute(setupType)
        }

        // Navigate back with state
        const params = WizardState.toURLParams(currentFormData)
        HTMXUtils.htmxAjax('GET', `${backRoute}?${params.toString()}`, {
            target: '#wizard-content',
            swap: 'innerHTML'
        }).catch(error => {
            console.error('[goBack] Error navigating back:', error)
            history.back()
        })
    }

    // Export navigation functions
    window.navigateToStep = navigateToStep
    window.goBack = goBack
    window.determineBackRoute = determineBackRoute
})();
