#!/usr/bin/env bun
/**
 * Tests for file utilities
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs'
import { join } from 'path'
import {
    ensureDir,
    readFileSafe,
    writeFileSafe,
    hasChanged,
    resolvePath
} from '../../scripts/lib/file-utils.js'
import { FileSystemError } from '../../scripts/lib/errors.js'

const TEST_DIR = join(process.cwd(), 'tests', 'tmp')

describe('File Utilities', () => {
    beforeEach(() => {
        // Clean up and recreate test directory
        if (existsSync(TEST_DIR)) {
            rmSync(TEST_DIR, { recursive: true, force: true })
        }
        // Ensure test directory exists for tests that need it
        mkdirSync(TEST_DIR, { recursive: true })
    })

    afterEach(() => {
        // Clean up test directory
        if (existsSync(TEST_DIR)) {
            rmSync(TEST_DIR, { recursive: true, force: true })
        }
    })

    describe('ensureDir', () => {
        test('should create directory if it does not exist', () => {
            const dirPath = join(TEST_DIR, 'new-dir')
            ensureDir(dirPath)
            expect(existsSync(dirPath)).toBe(true)
        })

        test('should not throw if directory already exists', () => {
            const dirPath = join(TEST_DIR, 'existing-dir')
            mkdirSync(dirPath, { recursive: true })
            expect(() => ensureDir(dirPath)).not.toThrow()
        })

        test('should create nested directories', () => {
            const dirPath = join(TEST_DIR, 'nested', 'deep', 'dir')
            ensureDir(dirPath)
            expect(existsSync(dirPath)).toBe(true)
        })
    })

    describe('readFileSafe', () => {
        test('should read file content', () => {
            const filePath = join(TEST_DIR, 'test.txt')
            mkdirSync(TEST_DIR, { recursive: true })
            writeFileSync(filePath, 'test content')

            const content = readFileSafe(filePath)
            expect(content).toBe('test content')
        })

        test('should throw FileSystemError for missing file', () => {
            const filePath = join(TEST_DIR, 'missing.txt')
            expect(() => readFileSafe(filePath)).toThrow(FileSystemError)
        })
    })

    describe('writeFileSafe', () => {
        test('should write file content', () => {
            const filePath = join(TEST_DIR, 'output.txt')
            writeFileSafe(filePath, 'test content')

            expect(existsSync(filePath)).toBe(true)
            const content = readFileSafe(filePath)
            expect(content).toBe('test content')
        })

        test('should create parent directories', () => {
            const filePath = join(TEST_DIR, 'nested', 'output.txt')
            writeFileSafe(filePath, 'test content')

            expect(existsSync(filePath)).toBe(true)
        })
    })

    describe('hasChanged', () => {
        test('should return true for non-existent file', () => {
            const filePath = join(TEST_DIR, 'missing.txt')
            expect(hasChanged(filePath, 'new content')).toBe(true)
        })

        test('should return false for identical content', () => {
            const filePath = join(TEST_DIR, 'test.txt')
            mkdirSync(TEST_DIR, { recursive: true })
            writeFileSync(filePath, 'same content')

            expect(hasChanged(filePath, 'same content')).toBe(false)
        })

        test('should return true for different content', () => {
            const filePath = join(TEST_DIR, 'test.txt')
            mkdirSync(TEST_DIR, { recursive: true })
            writeFileSync(filePath, 'old content')

            expect(hasChanged(filePath, 'new content')).toBe(true)
        })
    })

    describe('resolvePath', () => {
        test('should resolve relative paths', () => {
            const projectDir = '/project'
            const result = resolvePath('./subdir', projectDir)
            expect(result).toBe('/project/subdir')
        })

        test('should keep absolute paths unchanged', () => {
            const projectDir = '/project'
            const result = resolvePath('/absolute/path', projectDir)
            expect(result).toBe('/absolute/path')
        })

        test('should expand ~ to home directory', () => {
            const projectDir = '/project'
            const home = process.env.HOME
            const result = resolvePath('~/subdir', projectDir)
            expect(result).toBe(`${home}/subdir`)
        })

        test('should return project dir for empty path', () => {
            const projectDir = '/project'
            const result = resolvePath('', projectDir)
            expect(result).toBe(projectDir)
        })
    })
})
