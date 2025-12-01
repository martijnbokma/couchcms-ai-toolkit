#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Module Cache
 *
 * Simple in-memory cache for parsed modules, templates, and agents to improve performance
 */

/**
 * Simple in-memory cache for parsed modules, templates, and agents
 */
export class ModuleCache {
    constructor() {
        this.cache = new Map()
        this.templateCache = new Map() // Cache for compiled Handlebars templates
        this.stats = {
            hits: 0,
            misses: 0,
            templateHits: 0,
            templateMisses: 0
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
     * Get compiled template from cache
     * @param {string} templatePath - Path to template file
     * @returns {Function|null} - Compiled template or null
     */
    getTemplate(templatePath) {
        const template = this.templateCache.get(templatePath)
        if (template !== undefined) {
            this.stats.templateHits++
            return template
        } else {
            this.stats.templateMisses++
            return null
        }
    }

    /**
     * Cache compiled template
     * @param {string} templatePath - Path to template file
     * @param {Function} compiledTemplate - Compiled Handlebars template
     */
    setTemplate(templatePath, compiledTemplate) {
        this.templateCache.set(templatePath, compiledTemplate)
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
        this.templateCache.clear()
        this.stats.hits = 0
        this.stats.misses = 0
        this.stats.templateHits = 0
        this.stats.templateMisses = 0
    }

    /**
     * Get cache statistics
     * @returns {object} - Cache stats with hits, misses, and hit rate
     */
    getStats() {
        const total = this.stats.hits + this.stats.misses
        const hitRate = total > 0 ? (this.stats.hits / total * 100).toFixed(1) : 0

        const templateTotal = this.stats.templateHits + this.stats.templateMisses
        const templateHitRate = templateTotal > 0 ? (this.stats.templateHits / templateTotal * 100).toFixed(1) : 0

        return {
            hits: this.stats.hits,
            misses: this.stats.misses,
            total,
            hitRate: `${hitRate}%`,
            templateHits: this.stats.templateHits,
            templateMisses: this.stats.templateMisses,
            templateTotal,
            templateHitRate: `${templateHitRate}%`
        }
    }

    /**
     * Get cache size
     * @returns {number} - Number of cached items
     */
    size() {
        return this.cache.size + this.templateCache.size
    }
}
