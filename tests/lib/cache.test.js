#!/usr/bin/env bun
/**
 * Tests for ModuleCache
 */

import { describe, test, expect, beforeEach } from 'bun:test'
import { ModuleCache } from '../../scripts/lib/cache.js'

describe('ModuleCache', () => {
    let cache

    beforeEach(() => {
        cache = new ModuleCache()
    })

    test('should store and retrieve values', () => {
        cache.set('key1', 'value1')
        expect(cache.get('key1')).toBe('value1')
    })

    test('should return undefined for missing keys', () => {
        expect(cache.get('nonexistent')).toBeUndefined()
    })

    test('should check if key exists', () => {
        cache.set('key1', 'value1')
        expect(cache.has('key1')).toBe(true)
        expect(cache.has('key2')).toBe(false)
    })

    test('should clear all values', () => {
        cache.set('key1', 'value1')
        cache.set('key2', 'value2')
        cache.clear()
        expect(cache.get('key1')).toBeUndefined()
        expect(cache.get('key2')).toBeUndefined()
        expect(cache.size()).toBe(0)
    })

    test('should track cache statistics', () => {
        cache.set('key1', 'value1')
        cache.get('key1') // hit
        cache.get('key2') // miss
        cache.get('key1') // hit
        
        const stats = cache.getStats()
        expect(stats.hits).toBe(2)
        expect(stats.misses).toBe(1)
        expect(stats.total).toBe(3)
    })

    test('should calculate hit rate correctly', () => {
        cache.set('key1', 'value1')
        cache.get('key1') // hit
        cache.get('key1') // hit
        cache.get('key2') // miss
        
        const stats = cache.getStats()
        expect(stats.hitRate).toBe('66.7%')
    })

    test('should return size of cache', () => {
        expect(cache.size()).toBe(0)
        cache.set('key1', 'value1')
        expect(cache.size()).toBe(1)
        cache.set('key2', 'value2')
        expect(cache.size()).toBe(2)
    })

    test('should handle overwriting values', () => {
        cache.set('key1', 'value1')
        cache.set('key1', 'value2')
        expect(cache.get('key1')).toBe('value2')
        expect(cache.size()).toBe(1)
    })
})
