/**
 * Wizard State Migration
 * Migrates old wizard state to new format
 * Ensures backward compatibility
 */
(function() {
    'use strict'

    if (!window.wizardStateManager) {
        console.error('[WizardMigration] WizardStateManager not available')
        return
    }

    const stateManager = window.wizardStateManager
    const OLD_STORAGE_KEY = 'couchcms-wizard-state'

    /**
     * Migrate old state format to new format
     * @returns {boolean} True if migration occurred
     */
    function migrateOldState() {
        try {
            const oldState = sessionStorage.getItem(OLD_STORAGE_KEY)
            if (!oldState) {
                console.log('[WizardMigration] No old state found')
                return false
            }

            const parsed = JSON.parse(oldState)
            console.log('[WizardMigration] Found old state, checking version...')

            // Check if already migrated
            if (parsed.version === '2.0') {
                console.log('[WizardMigration] State already migrated to version 2.0')
                return false
            }

            // Migrate using state manager's migration method
            console.log('[WizardMigration] Migrating state from version', parsed.version || '1.0')
            const migrated = stateManager.migrateState(parsed)
            console.log('[WizardMigration] Migration complete:', migrated)

            return true
        } catch (error) {
            console.error('[WizardMigration] Error migrating state:', error)
            // Don't throw - allow wizard to continue with initial state
            return false
        }
    }

    /**
     * Check and migrate state if needed
     */
    function checkAndMigrate() {
        try {
            const currentState = stateManager.load()

            // If state exists but is old version, migrate it
            if (currentState.version && currentState.version !== '2.0') {
                console.log('[WizardMigration] Detected old state version, migrating...')
                migrateOldState()
            } else {
                // Try to migrate from old storage format
                migrateOldState()
            }
        } catch (error) {
            console.error('[WizardMigration] Error checking migration:', error)
        }
    }

    // Run migration on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndMigrate)
    } else {
        checkAndMigrate()
    }

    console.log('[WizardMigration] Migration script loaded')
})()
