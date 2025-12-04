/**
 * Advanced step initialization
 * Initializes framework visibility on page load and after HTMX swaps
 */
(function() {
    'use strict'

    const FRAMEWORK_CHECKBOX_SELECTOR = 'input[name="framework"]'
    const WIZARD_CONTENT_ID = (window.WIZARD_CONSTANTS && window.WIZARD_CONSTANTS.WIZARD_CONTENT_ID) || 'wizard-content'
    const INIT_DELAY_MS = 50

    /**
     * Get framework checkbox element
     * @returns {HTMLInputElement|null} Framework checkbox or null
     */
    function getFrameworkCheckbox() {
        return document.querySelector(FRAMEWORK_CHECKBOX_SELECTOR)
    }

    /**
     * Bind change event listener to framework checkbox
     * @param {HTMLInputElement} checkbox - Framework checkbox element
     */
    function bindFrameworkChangeHandler(checkbox) {
        if (typeof window.updateFrameworkVisibility !== 'function') {
            console.warn('[Advanced] updateFrameworkVisibility not available')
            return
        }

        checkbox.addEventListener('change', window.updateFrameworkVisibility)
    }

    /**
     * Initialize framework visibility state
     */
    function updateFrameworkVisibilityState() {
        if (typeof window.updateFrameworkVisibility !== 'function') {
            return
        }

        window.updateFrameworkVisibility()
    }

    /**
     * Initialize advanced step
     */
    function initializeAdvancedStep() {
        updateFrameworkVisibilityState()

        const frameworkCheckbox = getFrameworkCheckbox()
        if (frameworkCheckbox) {
            bindFrameworkChangeHandler(frameworkCheckbox)
        }
    }

    /**
     * Check if event is for wizard content swap
     * @param {Event} event - HTMX event
     * @returns {boolean} True if event targets wizard content
     */
    function isWizardContentSwap(event) {
        if (window.HTMXUtils && typeof window.HTMXUtils.isWizardContentSwap === 'function') {
            return window.HTMXUtils.isWizardContentSwap(event)
        }

        const detailTargetId = (event.detail && event.detail.target && event.detail.target.id)
        const eventTargetId = (event.target && event.target.id)
        const targetId = detailTargetId || eventTargetId
        return targetId === WIZARD_CONTENT_ID
    }

    /**
     * Initialize after HTMX swap
     * @param {Event} event - HTMX afterSwap event
     */
    function handleHtmxSwap(event) {
        if (!isWizardContentSwap(event)) {
            return
        }

        setTimeout(initializeAdvancedStep, INIT_DELAY_MS)
    }

    /**
     * Setup HTMX swap listener
     */
    function setupHtmxListener() {
        if (typeof htmx === 'undefined') {
            return
        }

        document.body.addEventListener('htmx:afterSwap', handleHtmxSwap)
    }

    /**
     * Execute initialization when DOM is ready
     */
    function runInitialization() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeAdvancedStep)
        } else {
            initializeAdvancedStep()
        }

        setupHtmxListener()
    }

    runInitialization()
})(); // End advanced.js IIFE
