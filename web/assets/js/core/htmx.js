/**
 * HTMX utility functions
 * Shared HTMX event handling and helpers
 */
(function() {
    'use strict'

    const WIZARD_CONTENT_ID = (window.WIZARD_CONSTANTS && window.WIZARD_CONSTANTS.WIZARD_CONTENT_ID) || 'wizard-content'

    /**
     * Check if event target is wizard content
     * @param {Event} event - HTMX event
     * @returns {boolean} True if target is wizard content
     */
    function isWizardContentTarget(event) {
        const detailTargetId = (event.detail && event.detail.target && event.detail.target.id)
        const eventTargetId = (event.target && event.target.id)
        return detailTargetId === WIZARD_CONTENT_ID || eventTargetId === WIZARD_CONTENT_ID
    }

    /**
     * Check if event is for wizard content swap
     * @param {Event} event - HTMX event
     * @returns {boolean} True if event targets wizard content
     */
    function isWizardContentSwap(event) {
        const detailTargetId = (event.detail && event.detail.target && event.detail.target.id)
        const eventTargetId = (event.target && event.target.id)
        const targetId = detailTargetId || eventTargetId
        return targetId === WIZARD_CONTENT_ID
    }

    /**
     * Check if HTMX is available
     * @returns {boolean} True if HTMX is loaded
     */
    function isHtmxAvailable() {
        return typeof htmx !== 'undefined'
    }

    /**
     * Execute HTMX AJAX request with error handling
     * @param {string} method - HTTP method
     * @param {string} url - URL to request
     * @param {Object} options - HTMX options
     * @returns {Promise} HTMX request promise
     */
    function htmxAjax(method, url, options = {}) {
        if (!isHtmxAvailable()) {
            return Promise.reject(new Error('HTMX is not available'))
        }

        return new Promise((resolve, reject) => {
            try {
                htmx.ajax(method, url, {
                    ...options,
                    swap: options.swap || 'innerHTML',
                    headers: {
                        ...options.headers,
                        'HX-Request': 'true'
                    }
                })
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Setup HTMX error handlers with better error messages
     */
    function setupHtmxErrorHandlers() {
        document.body.addEventListener('htmx:responseError', function(event) {
            console.error('[HTMX] Response Error:', event.detail)
            const status = event.detail?.xhr?.status || 'unknown'
            const statusText = event.detail?.xhr?.statusText || 'unknown error'
            const path = event.detail?.pathInfo?.requestPath || 'unknown path'

            console.error('[HTMX] Error details:', {
                status,
                statusText,
                path,
                detail: event.detail
            })

            // Show more helpful error message
            const errorMsg = status === 500
                ? 'Server error occurred. Please check the console for details.'
                : `Error ${status}: ${statusText}. Path: ${path}`

            alert(`An error occurred while submitting the form.\n\n${errorMsg}\n\nPlease check the browser console for more details.`)
        })

        document.body.addEventListener('htmx:sendError', function(event) {
            console.error('[HTMX] Send Error:', event.detail)
            const error = event.detail?.error || event.detail
            const path = event.detail?.pathInfo?.requestPath || 'unknown path'
            const form = event.detail?.elt

            console.error('[HTMX] Send error details:', {
                error,
                path,
                formAction: form?.getAttribute('hx-post'),
                formId: form?.id,
                errorMessage: error?.message,
                errorStack: error?.stack,
                detail: event.detail
            })

            // Check if it's a network error or something else
            const errorMsg = error?.message || 'Unknown error'

            // More helpful error message
            let userMessage = `An error occurred while submitting the form.\n\n`
            userMessage += `Error: ${errorMsg}\n`
            userMessage += `Path: ${path}\n`
            if (form) {
                userMessage += `Form: ${form.getAttribute('hx-post') || form.action || 'unknown'}\n`
            }
            userMessage += `\nPlease check the browser console for more details.`

            alert(userMessage)
        })

        // Also log beforeRequest to see if request is being sent
        document.body.addEventListener('htmx:beforeRequest', function(event) {
            const form = event.detail?.elt
            const path = event.detail?.pathInfo?.requestPath
            const verb = event.detail?.verb || 'GET'
            const target = event.detail?.target?.id || event.detail?.target

            console.log('[HTMX] Before request:', {
                path,
                verb,
                target,
                formAction: form?.getAttribute('hx-post'),
                formId: form?.id,
                formMethod: form?.method,
                formEnctype: form?.enctype,
                detail: event.detail
            })

            // Check if request is being blocked
            if (event.detail?.shouldSwap === false) {
                console.warn('[HTMX] Request swap is disabled!')
            }
        })

        // Log afterRequest to see response
        document.body.addEventListener('htmx:afterRequest', function(event) {
            const xhr = event.detail?.xhr
            const path = event.detail?.pathInfo?.requestPath
            const form = event.detail?.elt

            console.log('[HTMX] After request:', {
                path,
                status: xhr?.status,
                statusText: xhr?.statusText,
                success: xhr?.status >= 200 && xhr?.status < 300,
                formAction: form?.getAttribute('hx-post'),
                responseText: xhr?.responseText?.substring(0, 200) // First 200 chars
            })
        })

        // Log when request is actually sent
        document.body.addEventListener('htmx:send', function(event) {
            const path = event.detail?.pathInfo?.requestPath
            const form = event.detail?.elt
            console.log('[HTMX] Sending request:', {
                path,
                formAction: form?.getAttribute('hx-post'),
                method: event.detail?.verb
            })
        })

        // Log when request is cancelled
        document.body.addEventListener('htmx:sendError', function(event) {
            const path = event.detail?.pathInfo?.requestPath
            const form = event.detail?.elt
            console.error('[HTMX] Request send error - request was NOT sent:', {
                path,
                formAction: form?.getAttribute('hx-post'),
                error: event.detail?.error,
                detail: event.detail
            })
        })
    }

    // Export HTMX utilities
    window.HTMXUtils = {
        isWizardContentTarget,
        isWizardContentSwap,
        isHtmxAvailable,
        htmxAjax,
        setupHtmxErrorHandlers
    }

    // Setup error handlers on load
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupHtmxErrorHandlers)
        } else {
            setupHtmxErrorHandlers()
        }
    }
})();
