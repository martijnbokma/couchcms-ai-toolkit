/**
 * Shared constants for wizard functionality
 * Centralized constants to prevent duplication
 */
(function() {
    'use strict'

    window.WIZARD_CONFIG = {
        STORAGE_KEY: 'couchcms-wizard-state',
        DEFAULT_PROJECT_NAME: 'my-project',
        DEFAULT_PROJECT_DESCRIPTION: 'A CouchCMS web application',
        DEFAULT_SETUP_TYPE: 'simple',
        DEBOUNCE_DELAY: 300,
        SYNC_DELAY: 10,
        INITIAL_RESTORE_DELAY: 100
    }

    window.WIZARD_CONSTANTS = {
        INVALID_VALUES: ['', 'undefined', 'null'],
        FRAMEWORK_OPTIONS: ['doctrine', 'directives', 'playbooks', 'enhancements'],
        WIZARD_CONTENT_ID: 'wizard-content',
        CHECKBOX_FIELDS: ['css', 'js', 'editors', 'agents'],
        CHECKBOX_CHECK_INTERVAL_MS: 50,
        SYNC_DELAY_MS: 50,
        WAIT_FOR_CHECKBOXES_TIMEOUT_MS: 3000,
        RADIO_SAVE_DELAY_MS: 10,
        GENERATE_FORM_ID: 'generate-form',
        WIZARD_STATE_INPUT_ID: 'wizard-state-input',
        SETUP_TYPES: {
            SIMPLE: 'simple',
            EXTENDED: 'extended'
        },
        FIELD_NAMES: {
            PROJECT_NAME: 'projectName',
            PROJECT_DESCRIPTION: 'projectDescription',
            SETUP_TYPE: 'setupType',
            PRESET: 'preset',
            FRAMEWORK: 'framework',
            CONTEXT_DIR: 'contextDir'
        }
    }
})()

