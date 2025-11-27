#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Module Cache
 * 
 * Simple in-memory cache for parsed modules to improve performance
 */

/**
 * Simple in-memory cache for parsed modules
 */
export class ModuleCache {
    constructor() {
        this.cache = new Map()
        this.stats = {
            hits: 0,
            misses: 0
        }
    }

    /**
     * Get value from cache
     * @param {string} key - Cache key
     * @returns {*} - Cached value or undefined
     */
    get(key) {
        const value = this.cache.get(key)
        if (value !== undefined) {
            this.stats.hits++
        } else {
            this.stats.misses++
        }
        return value
    }

    /**
     * Set value in cache
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     */
    set(key, value) {
        this.cache.set(key, value)
    }

    /**
     * Check if key exists in cache
     * @param {string} key - Cache key
     * @returns {boolean} - True if key exists
     */
    has(key) {
        return this.cache.has(key)
    }

    /**
     * Clear all cached values
     */
    clear() {
        this.cache.clear()
        this.stats.hits = 0
        this.stats.misses = 0
    }

    /**
     * Get cache statistics
     * @returns {object} - Cache stats with hits, misses, and hit rate
     */
    getStats() {
        const total = this.stats.hits + this.stats.misses
        const hitRate = total > 0 ? (this.stats.hits / total * 100).toFixed(1) : 0
        return {
            hits: this.stats.hits,
            misses: this.stats.misses,
            total,
            hitRate: `${hitRate}%`
        }
    }

    /**
     * Get cache size
     * @returns {number} - Number of cached items
     */
    size() {
        return this.cache.size
    }
}
