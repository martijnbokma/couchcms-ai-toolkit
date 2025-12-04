/**
 * Live Reload Client
 * Connects to WebSocket server and refreshes browser when files change
 */

(function() {
    'use strict'

    // Only run in development (when not in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        initLiveReload()
    }

    function initLiveReload() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsUrl = `${protocol}//${window.location.host}/_live-reload`

        let ws = null
        let reconnectAttempts = 0
        const maxReconnectAttempts = 10
        const reconnectDelay = 1000

        function connect() {
            try {
                ws = new WebSocket(wsUrl)

                ws.onopen = function() {
                    console.log('🔄 Live reload connected')
                    reconnectAttempts = 0

                    // Send ping every 30 seconds to keep connection alive
                    const pingInterval = setInterval(() => {
                        if (ws && ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({ type: 'ping' }))
                        } else {
                            clearInterval(pingInterval)
                        }
                    }, 30000)
                }

                ws.onmessage = function(event) {
                    try {
                        const data = JSON.parse(event.data)

                        if (data.type === 'reload') {
                            handleReload(data.changeType)
                        } else if (data.type === 'pong') {
                            // Connection is alive
                        }
                    } catch (error) {
                        console.error('Error parsing reload message:', error)
                    }
                }

                ws.onerror = function(error) {
                    console.error('Live reload WebSocket error:', error)
                }

                ws.onclose = function() {
                    console.log('🔄 Live reload disconnected')

                    // Attempt to reconnect
                    if (reconnectAttempts < maxReconnectAttempts) {
                        reconnectAttempts++
                        const delay = reconnectDelay * reconnectAttempts
                        console.log(`🔄 Reconnecting in ${delay}ms... (attempt ${reconnectAttempts}/${maxReconnectAttempts})`)
                        setTimeout(connect, delay)
                    } else {
                        console.log('🔄 Max reconnection attempts reached. Live reload disabled.')
                    }
                }
            } catch (error) {
                console.error('Failed to connect to live reload server:', error)
            }
        }

        function handleReload(changeType) {
            console.log(`🔄 Reloading page (change type: ${changeType})...`)

            // For CSS changes, try to reload stylesheets without full page reload
            if (changeType === 'css') {
                const stylesheets = document.querySelectorAll('link[rel="stylesheet"]')
                let reloaded = 0

                stylesheets.forEach((link) => {
                    const href = link.href
                    const newLink = document.createElement('link')
                    newLink.rel = 'stylesheet'
                    newLink.href = href + (href.indexOf('?') >= 0 ? '&' : '?') + '_reload=' + Date.now()
                    newLink.onload = function() {
                        reloaded++
                        if (reloaded === stylesheets.length) {
                            link.parentNode.removeChild(link)
                            console.log('✅ CSS reloaded without page refresh')
                        }
                    }
                    link.parentNode.insertBefore(newLink, link.nextSibling)
                })

                // Fallback to full reload if CSS reload doesn't work
                setTimeout(() => {
                    if (reloaded < stylesheets.length) {
                        window.location.reload()
                    }
                }, 1000)
            } else {
                // For JS or HTML changes, do full page reload
                window.location.reload()
            }
        }

        // Start connection
        connect()

        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
            if (ws) {
                ws.close()
            }
        })
    }
})()
