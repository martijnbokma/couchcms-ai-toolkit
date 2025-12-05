#!/usr/bin/env bun
/**
 * Live Reload WebSocket Server
 * Broadcasts reload signals to connected browsers when files change
 */

import { createBunWebSocket } from 'hono/bun'
import type { ChangeType } from '../scripts/types'

/**
 * WebSocket message types for live reload communication
 */
interface ReloadMessage {
    type: 'reload'
    changeType: ChangeType
    timestamp: number
}

interface PingMessage {
    type: 'ping'
}

interface PongMessage {
    type: 'pong'
    timestamp: number
}

type ClientMessage = PingMessage
type ServerMessage = ReloadMessage | PongMessage

/**
 * Live Reload Manager
 * Manages WebSocket connections and broadcasts reload signals
 */
export class LiveReloadManager {
    private clients: Set<WebSocket>

    constructor() {
        this.clients = new Set<WebSocket>()
    }

    /**
     * Add a WebSocket client
     * @param ws - WebSocket connection
     */
    addClient(ws: WebSocket): void {
        this.clients.add(ws)
        console.log(`🔌 Live reload client connected (${this.clients.size} total)`)
    }

    /**
     * Remove a WebSocket client
     * @param ws - WebSocket connection
     */
    removeClient(ws: WebSocket): void {
        if (this.clients.has(ws)) {
            this.clients.delete(ws)
            console.log(`🔌 Live reload client disconnected (${this.clients.size} total)`)
        }
    }

    /**
     * Broadcast reload signal to all connected clients
     * @param type - Type of change ('css', 'js', 'html', 'full')
     */
    broadcastReload(type: ChangeType = 'full'): void {
        if (this.clients.size === 0) {
            return
        }

        const message: ReloadMessage = {
            type: 'reload',
            changeType: type,
            timestamp: Date.now()
        }

        const messageString = JSON.stringify(message)

        let disconnected = 0
        for (const client of this.clients) {
            try {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(messageString)
                } else {
                    this.clients.delete(client)
                    disconnected++
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error)
                console.error('Error sending reload signal:', errorMessage)
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
     * @returns Number of connected clients
     */
    getClientCount(): number {
        return this.clients.size
    }
}

// Singleton instance
export const liveReloadManager = new LiveReloadManager()

// Create Bun WebSocket helper
const { upgradeWebSocket, websocket } = createBunWebSocket()

/**
 * WebSocket handler callbacks type
 */
interface WebSocketHandlers {
    onOpen: (event: Event, ws: WebSocket) => void
    onMessage: (event: MessageEvent, ws: WebSocket) => void
    onClose: (event: CloseEvent) => void
    onError: (event: Event, ws: WebSocket, error: Error) => void
}

/**
 * Create WebSocket upgrade handler for live reload
 * @returns Hono route handler
 */
export function createLiveReloadHandler() {
    return upgradeWebSocket((_c) => {
        let wsReference: WebSocket | null = null

        const handlers: WebSocketHandlers = {
            onOpen(_event: Event, ws: WebSocket) {
                wsReference = ws
                liveReloadManager.addClient(ws)
            },
            onMessage(event: MessageEvent, ws: WebSocket) {
                // Handle client messages if needed
                try {
                    const data = JSON.parse(event.data.toString()) as ClientMessage
                    if (data.type === 'ping') {
                        const pongMessage: PongMessage = {
                            type: 'pong',
                            timestamp: Date.now()
                        }
                        ws.send(JSON.stringify(pongMessage))
                    }
                } catch (error) {
                    // Ignore invalid messages
                }
            },
            onClose(_event: CloseEvent) {
                if (wsReference) {
                    liveReloadManager.removeClient(wsReference)
                    wsReference = null
                }
            },
            onError(_event: Event, _ws: WebSocket, error: Error) {
                console.error('WebSocket error:', error)
                if (wsReference) {
                    liveReloadManager.removeClient(wsReference)
                    wsReference = null
                }
            }
        }

        return handlers
    })
}

// Export websocket handler for server configuration
export { websocket }
