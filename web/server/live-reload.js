#!/usr/bin/env bun
/**
 * Live Reload WebSocket Server
 * Broadcasts reload signals to connected browsers when files change
 */

import { createBunWebSocket } from 'hono/bun'

/**
 * Live Reload Manager
 * Manages WebSocket connections and broadcasts reload signals
 */
export class LiveReloadManager {
    constructor() {
        this.clients = new Set()
    }

    /**
     * Add a WebSocket client
     * @param {WebSocket} ws - WebSocket connection
     */
    addClient(ws) {
        this.clients.add(ws)
        console.log(`🔌 Live reload client connected (${this.clients.size} total)`)
    }

    /**
     * Remove a WebSocket client
     * @param {WebSocket} ws - WebSocket connection
     */
    removeClient(ws) {
        if (this.clients.has(ws)) {
            this.clients.delete(ws)
            console.log(`🔌 Live reload client disconnected (${this.clients.size} total)`)
        }
    }

    /**
     * Broadcast reload signal to all connected clients
     * @param {string} type - Type of change ('css', 'js', 'html', 'full')
     */
    broadcastReload(type = 'full') {
        if (this.clients.size === 0) {
            return
        }

        const message = JSON.stringify({
            type: 'reload',
            changeType: type,
            timestamp: Date.now()
        })

        let disconnected = 0
        for (const client of this.clients) {
            try {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message)
                } else {
                    this.clients.delete(client)
                    disconnected++
                }
            } catch (error) {
                console.error('Error sending reload signal:', error)
                this.clients.delete(client)
                disconnected++
            }
        }

        if (disconnected > 0) {
            console.log(`🔌 Cleaned up ${disconnected} disconnected clients`)
        }

        console.log(`🔄 Reload signal sent to ${this.clients.size} client(s) [${type}]`)
    }

    /**
     * Get number of connected clients
     * @returns {number}
     */
    getClientCount() {
        return this.clients.size
    }
}

// Singleton instance
export const liveReloadManager = new LiveReloadManager()

// Create Bun WebSocket helper
const { upgradeWebSocket, websocket } = createBunWebSocket()

/**
 * Create WebSocket upgrade handler for live reload
 * @returns {Function} Hono route handler
 */
export function createLiveReloadHandler() {
    return upgradeWebSocket((c) => {
        let wsReference = null

        return {
            onOpen(_event, ws) {
                wsReference = ws
                liveReloadManager.addClient(ws)
            },
            onMessage(event, ws) {
                // Handle client messages if needed
                try {
                    const data = JSON.parse(event.data.toString())
                    if (data.type === 'ping') {
                        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }))
                    }
                } catch (error) {
                    // Ignore invalid messages
                }
            },
            onClose(_event) {
                if (wsReference) {
                    liveReloadManager.removeClient(wsReference)
                    wsReference = null
                }
            },
            onError(_event, ws, error) {
                console.error('WebSocket error:', error)
                if (wsReference) {
                    liveReloadManager.removeClient(wsReference)
                    wsReference = null
                }
            }
        }
    })
}

// Export websocket handler for server configuration
export { websocket }
