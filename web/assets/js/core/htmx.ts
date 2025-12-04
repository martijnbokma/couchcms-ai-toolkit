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
    function isWizardContentTarget(event: Event): boolean {
        const htmxEvent = event as CustomEvent
        const detailTargetId = (htmxEvent.detail && htmxEvent.detail.target && (htmxEvent.detail.target as HTMLElement).id)
        const eventTargetId = (event.target && (event.target as HTMLElement).id)
        return detailTargetId === WIZARD_CONTENT_ID || eventTargetId === WIZARD_CONTENT_ID
    }

    /**
     * Check if event is for wizard content swap
     * @param {Event} event - HTMX event
     * @returns {boolean} True if event targets wizard content
     */
    function isWizardContentSwap(event: Event): boolean {
        const htmxEvent = event as CustomEvent
        const detailTargetId = (htmxEvent.detail && htmxEvent.detail.target && (htmxEvent.detail.target as HTMLElement).id)
        const eventTargetId = (event.target && (event.target as HTMLElement).id)
        const targetId = detailTargetId || eventTargetId
        return targetId === WIZARD_CONTENT_ID
    }

    /**
     * Check if HTMX is available
     * @returns {boolean} True if HTMX is loaded
     */
    function isHtmxAvailable(): boolean {
        return typeof window.htmx !== 'undefined'
    }

    /**
     * Execute HTMX AJAX request with error handling
     * @param {string} method - HTTP method
     * @param {string} url - URL to request
     * @param {Record<string, unknown>} options - HTMX options
     * @returns {Promise<unknown>} HTMX request promise
     */
    function htmxAjax(method: string, url: string, options: Record<string, unknown> = {}): Promise<unknown> {
        if (!isHtmxAvailable()) {
            return Promise.reject(new Error('HTMX is not available'))
        }

        return new Promise((resolve, reject) => {
            try {
                if (window.htmx && typeof window.htmx.ajax === 'function') {
                    window.htmx.ajax(method, url, {
                        ...options,
                        swap: (options.swap as string) || 'innerHTML',
                        headers: {
                            ...(options.headers as Record<string, string>),
                            'HX-Request': 'true'
                        }
                    } as never)
                    resolve(undefined)
                } else {
                    reject(new Error('HTMX ajax method not available'))
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * Setup HTMX error handlers with better error messages
     */
    function setupHtmxErrorHandlers(): void {
        document.body.addEventListener('htmx:responseError', function(event: Event) {
            const htmxEvent = event as CustomEvent
            console.error('[HTMX] Response Error:', htmxEvent.detail)
            const xhr = htmxEvent.detail?.xhr as XMLHttpRequest | undefined
            const status = xhr?.status || 'unknown'
            const statusText = xhr?.statusText || 'unknown error'
            const pathInfo = htmxEvent.detail?.pathInfo as { requestPath?: string } | undefined
            const path = pathInfo?.requestPath || 'unknown path'

            console.error('[HTMX] Error details:', {
                status,
                statusText,
                path,
                detail: htmxEvent.detail
            })

            // Show more helpful error message
            const errorMsg = status === 500
                ? 'Server error occurred. Please check the console for details.'
                : `Error ${status}: ${statusText}. Path: ${path}`

            alert(`An error occurred while submitting the form.\n\n${errorMsg}\n\nPlease check the browser console for more details.`)
        })

        document.body.addEventListener('htmx:sendError', function(event: Event) {
            const htmxEvent = event as CustomEvent
            console.error('[HTMX] Send Error:', htmxEvent.detail)
            const error = htmxEvent.detail?.error as Error | undefined || htmxEvent.detail
            const pathInfo = htmxEvent.detail?.pathInfo as { requestPath?: string } | undefined
            const path = pathInfo?.requestPath || 'unknown path'
            const form = htmxEvent.detail?.elt as HTMLFormElement | undefined

            console.error('[HTMX] Send error details:', {
                error,
                path,
                formAction: form?.getAttribute('hx-post'),
                formId: form?.id,
                errorMessage: error instanceof Error ? error.message : undefined,
                errorStack: error instanceof Error ? error.stack : undefined,
                detail: htmxEvent.detail
            })

            // Check if it's a network error or something else
            const errorMsg = error instanceof Error ? error.message : 'Unknown error'

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
        document.body.addEventListener('htmx:beforeRequest', function(event: Event) {
            const htmxEvent = event as CustomEvent
            const form = htmxEvent.detail?.elt as HTMLFormElement | undefined
            const pathInfo = htmxEvent.detail?.pathInfo as { requestPath?: string } | undefined
            const path = pathInfo?.requestPath
            const verb = htmxEvent.detail?.verb as string | undefined || 'GET'
            const target = htmxEvent.detail?.target as HTMLElement | undefined

            console.log('[HTMX] Before request:', {
                path,
                verb,
                target: target?.id || target,
                formAction: form?.getAttribute('hx-post'),
                formId: form?.id,
                formMethod: form?.method,
                formEnctype: form?.enctype,
                detail: htmxEvent.detail
            })

            // Check if request is being blocked
            if (htmxEvent.detail?.shouldSwap === false) {
                console.warn('[HTMX] Request swap is disabled!')
            }
        })

        // Log afterRequest to see response
        document.body.addEventListener('htmx:afterRequest', function(event: Event) {
            const htmxEvent = event as CustomEvent
            const xhr = htmxEvent.detail?.xhr as XMLHttpRequest | undefined
            const pathInfo = htmxEvent.detail?.pathInfo as { requestPath?: string } | undefined
            const path = pathInfo?.requestPath
            const form = htmxEvent.detail?.elt as HTMLFormElement | undefined

            console.log('[HTMX] After request:', {
                path,
                status: xhr?.status,
                statusText: xhr?.statusText,
                success: xhr ? (xhr.status >= 200 && xhr.status < 300) : false,
                formAction: form?.getAttribute('hx-post'),
                responseText: xhr?.responseText?.substring(0, 200) // First 200 chars
            })
        })

        // Log when request is actually sent
        document.body.addEventListener('htmx:send', function(event: Event) {
            const htmxEvent = event as CustomEvent
            const pathInfo = htmxEvent.detail?.pathInfo as { requestPath?: string } | undefined
            const path = pathInfo?.requestPath
            const form = htmxEvent.detail?.elt as HTMLFormElement | undefined
            console.log('[HTMX] Sending request:', {
                path,
                formAction: form?.getAttribute('hx-post'),
                method: htmxEvent.detail?.verb as string | undefined
            })
        })

        // Log when request is cancelled
        document.body.addEventListener('htmx:sendError', function(event: Event) {
            const htmxEvent = event as CustomEvent
            const pathInfo = htmxEvent.detail?.pathInfo as { requestPath?: string } | undefined
            const path = pathInfo?.requestPath
            const form = htmxEvent.detail?.elt as HTMLFormElement | undefined
            console.error('[HTMX] Request send error - request was NOT sent:', {
                path,
                formAction: form?.getAttribute('hx-post'),
                error: htmxEvent.detail?.error,
                detail: htmxEvent.detail
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
})()
