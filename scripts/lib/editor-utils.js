/**
 * Editor configuration utilities
 * Provides consistent handling of editor selection across init and sync
 */

/**
 * Get all available editor IDs
 * @returns {Array<string>} - List of all available editor IDs
 */
export function getAllEditorIds() {
    return [
        'cursor',
        'windsurf',
        'zed',
        'copilot',
        'claude',
        'codewhisperer',
        'kiro',
        'antigravity',
        'jules',
        'roocode',
        'vscode-ai',
        'tabnine',
        'agent',
    ]
}

/**
 * Normalize editor configuration to object format
 * Converts array format to object format for consistent handling
 * @param {Array<string>|Object|null|undefined} editorsConfig - Editor configuration (array or object)
 * @returns {Object} - Normalized editor config object with all editors set to true/false
 */
export function normalizeEditorConfig(editorsConfig) {
    const allEditors = getAllEditorIds()
    const normalized = {}

    // Initialize all editors to false
    allEditors.forEach(editorId => {
        normalized[editorId] = false
    })

    if (!editorsConfig) {
        return normalized
    }

    if (Array.isArray(editorsConfig)) {
        // Array format: ['cursor', 'claude']
        editorsConfig.forEach(editorId => {
            if (allEditors.includes(editorId)) {
                normalized[editorId] = true
            }
        })
    } else if (typeof editorsConfig === 'object') {
        // Object format: { cursor: true, claude: true }
        Object.entries(editorsConfig).forEach(([editorId, enabled]) => {
            if (allEditors.includes(editorId) && enabled === true) {
                normalized[editorId] = true
            }
        })
    }

    return normalized
}

/**
 * Get selected editor IDs from configuration
 * @param {Array<string>|Object|null|undefined} editorsConfig - Editor configuration
 * @returns {Array<string>} - List of selected editor IDs
 */
export function getSelectedEditorIds(editorsConfig) {
    const normalized = normalizeEditorConfig(editorsConfig)
    return Object.entries(normalized)
        .filter(([_, enabled]) => enabled === true)
        .map(([editorId]) => editorId)
}

/**
 * Check if a specific editor is selected
 * @param {Array<string>|Object|null|undefined} editorsConfig - Editor configuration
 * @param {string} editorId - Editor ID to check
 * @returns {boolean} - True if editor is selected
 */
export function isEditorSelected(editorsConfig, editorId) {
    const normalized = normalizeEditorConfig(editorsConfig)
    return normalized[editorId] === true
}

/**
 * Convert editor array to YAML format for standards.md
 * @param {Array<string>} selectedEditors - Array of selected editor IDs
 * @returns {string} - YAML string for editors section
 */
export function editorsArrayToYaml(selectedEditors) {
    const normalized = normalizeEditorConfig(selectedEditors)
    return Object.entries(normalized)
        .map(([key, value]) => `    ${key}: ${value}`)
        .join('\n')
}

/**
 * Validate editor configuration
 * Ensures all editor IDs are valid
 * @param {Array<string>|Object|null|undefined} editorsConfig - Editor configuration
 * @returns {{valid: boolean, errors: Array<string>}} - Validation result
 */
export function validateEditorConfig(editorsConfig) {
    const allEditors = getAllEditorIds()
    const errors = []

    if (!editorsConfig) {
        return { valid: true, errors: [] }
    }

    if (Array.isArray(editorsConfig)) {
        editorsConfig.forEach(editorId => {
            if (!allEditors.includes(editorId)) {
                errors.push(`Unknown editor ID: ${editorId}`)
            }
        })
    } else if (typeof editorsConfig === 'object') {
        Object.keys(editorsConfig).forEach(editorId => {
            if (!allEditors.includes(editorId)) {
                errors.push(`Unknown editor ID: ${editorId}`)
            }
        })
    } else {
        errors.push('Editor configuration must be an array or object')
    }

    return {
        valid: errors.length === 0,
        errors,
    }
}
