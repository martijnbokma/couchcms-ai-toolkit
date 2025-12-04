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
     * @returns {HTMLInputElement | null} Framework checkbox or null
     */
    function getFrameworkCheckbox(): HTMLInputElement | null {
        return document.querySelector<HTMLInputElement>(FRAMEWORK_CHECKBOX_SELECTOR)
    }

    /**
     * Bind change event listener to framework checkbox
     * @param {HTMLInputElement} checkbox - Framework checkbox element
     */
    function bindFrameworkChangeHandler(checkbox: HTMLInputElement): void {
        if (typeof window.updateFrameworkVisibility !== 'function') {
            console.warn('[Advanced] updateFrameworkVisibility not available')
            return
        }

        checkbox.addEventListener('change', window.updateFrameworkVisibility)
    }

    /**
     * Initialize framework visibility state
     */
    function updateFrameworkVisibilityState(): void {
        if (typeof window.updateFrameworkVisibility !== 'function') {
            return
        }

        window.updateFrameworkVisibility()
    }

    /**
     * Initialize advanced step
     */
    function initializeAdvancedStep(): void {
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
     * Initialize after HTMX swap
     * @param {Event} event - HTMX afterSwap event
     */
    function handleHtmxSwap(event: Event): void {
        if (!isWizardContentSwap(event)) {
            return
        }

        setTimeout(initializeAdvancedStep, INIT_DELAY_MS)
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
     * Execute initialization when DOM is ready
     */
    function runInitialization(): void {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeAdvancedStep)
        } else {
            initializeAdvancedStep()
        }

        setupHtmxListener()
    }

    runInitialization()
})()
