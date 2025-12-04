/**
 * State Indicator - Shows when state is saved
 * Displays a success notification when wizard state is updated
 * Auto-hides after 2 seconds
 */
(function() {
    'use strict'

    // Prevent multiple executions
    if (window.__STATE_INDICATOR_INITIALIZED__) {
        console.log('[StateIndicator] Already initialized, skipping re-execution')
        return
    }
    window.__STATE_INDICATOR_INITIALIZED__ = true

    // Ensure dependencies are available
    if (!window.wizardStateManager) {
        console.error('[StateIndicator] wizardStateManager not available')
        return
    }

    const INDICATOR_ID = 'state-indicator'
    const AUTO_HIDE_DELAY = 2000 // 2 seconds

    /**
     * Get the indicator element
     * @returns {HTMLElement | null} Indicator element
     */
    function getIndicator(): HTMLElement | null {
        return document.getElementById(INDICATOR_ID)
    }

    /**
     * Show the indicator with fade-in animation
     * @param {HTMLElement} indicator - Indicator element
     */
    function showIndicator(indicator: HTMLElement): void {
        indicator.classList.remove('opacity-0', 'pointer-events-none')
        indicator.classList.add('opacity-100')
    }

    /**
     * Hide the indicator with fade-out animation
     * @param {HTMLElement} indicator - Indicator element
     */
    function hideIndicator(indicator: HTMLElement): void {
        indicator.classList.remove('opacity-100')
        indicator.classList.add('opacity-0', 'pointer-events-none')
    }

    /**
     * Initialize state indicator
     */
    function initializeStateIndicator(): void {
        const indicator = getIndicator()
        if (!indicator) {
            console.log('[StateIndicator] Indicator element not found')
            return
        }

        let hideTimeout: ReturnType<typeof setTimeout> | null = null

        /**
         * Show indicator and schedule auto-hide
         */
        function show(): void {
            showIndicator(indicator)

            // Clear existing timeout if any
            if (hideTimeout) {
                clearTimeout(hideTimeout)
            }

            // Auto-hide after delay
            hideTimeout = setTimeout(() => {
                hideIndicator(indicator)
                hideTimeout = null
            }, AUTO_HIDE_DELAY)
        }

        // Subscribe to state changes
        const unsubscribe = window.wizardStateManager.subscribe(() => {
            show()
        })

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout)
            }
            unsubscribe()
        })

        console.log('[StateIndicator] Initialized')
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeStateIndicator)
    } else {
        initializeStateIndicator()
    }
})()
