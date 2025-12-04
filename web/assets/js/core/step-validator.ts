/**
 * Unified Step Validator (DRY)
 * Centralized validation logic for all wizard steps
 * Used by: All step forms, real-time validation
 *
 * @module StepValidator
 */

/**
 * Validation rule interface
 */
export interface ValidationRule {
    field: string
    type: 'required' | 'pattern' | 'minLength' | 'maxLength' | 'custom'
    value?: string | number
    message: string
    validator?: (value: unknown) => boolean
}

/**
 * Validation result interface
 */
export interface ValidationResult {
    valid: boolean
    errors: Record<string, string>
    firstError?: string
}

/**
 * Field validation rules
 */
const FIELD_RULES: Record<string, ValidationRule[]> = {
    projectName: [
        {
            field: 'projectName',
            type: 'required',
            message: 'Project name is required'
        },
        {
            field: 'projectName',
            type: 'pattern',
            value: '^[a-z0-9-]+$',
            message: 'Project name can only contain lowercase letters, numbers, and hyphens.'
        },
        {
            field: 'projectName',
            type: 'minLength',
            value: 3,
            message: 'Project name must be at least 3 characters long.'
        },
        {
            field: 'projectName',
            type: 'maxLength',
            value: 100,
            message: 'Project name must be 100 characters or less.'
        }
    ],
    projectDescription: [
        {
            field: 'projectDescription',
            type: 'maxLength',
            value: 500,
            message: 'Project description must be 500 characters or less.'
        }
    ]
}

/**
 * Step Validator Class
 */
export class StepValidator {
    /**
     * Validate a single field
     * @param fieldName - Field name
     * @param value - Field value
     * @returns Validation result
     */
    static validateField(fieldName: string, value: unknown): ValidationResult {
        const rules = FIELD_RULES[fieldName] || []
        const errors: Record<string, string> = {}

        for (const rule of rules) {
            if (!this.checkRule(rule, value)) {
                errors[fieldName] = rule.message
                break // Stop at first error
            }
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors,
            firstError: errors[fieldName]
        }
    }

    /**
     * Check if a rule passes
     * @param rule - Validation rule
     * @param value - Value to validate
     * @returns True if rule passes
     */
    private static checkRule(rule: ValidationRule, value: unknown): boolean {
        const stringValue = String(value || '').trim()

        switch (rule.type) {
            case 'required':
                return stringValue.length > 0

            case 'pattern':
                if (!rule.value) return true
                const pattern = new RegExp(rule.value as string)
                return pattern.test(stringValue)

            case 'minLength':
                if (!rule.value) return true
                return stringValue.length >= (rule.value as number)

            case 'maxLength':
                if (!rule.value) return true
                return stringValue.length <= (rule.value as number)

            case 'custom':
                if (!rule.validator) return true
                return rule.validator(value)

            default:
                return true
        }
    }

    /**
     * Validate multiple fields
     * @param fields - Record of field names to values
     * @returns Validation result
     */
    static validateFields(fields: Record<string, unknown>): ValidationResult {
        const errors: Record<string, string> = {}

        for (const [fieldName, value] of Object.entries(fields)) {
            const result = this.validateField(fieldName, value)
            if (!result.valid) {
                Object.assign(errors, result.errors)
            }
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors,
            firstError: Object.values(errors)[0]
        }
    }

    /**
     * Validate project name (convenience method)
     * @param value - Project name value
     * @returns Validation result
     */
    static validateProjectName(value: string): ValidationResult {
        return this.validateField('projectName', value)
    }

    /**
     * Validate project description (convenience method)
     * @param value - Project description value
     * @returns Validation result
     */
    static validateProjectDescription(value: string): ValidationResult {
        return this.validateField('projectDescription', value)
    }

    /**
     * Show validation error in UI
     * @param fieldId - Field ID
     * @param message - Error message
     */
    static showError(fieldId: string, message: string): void {
        const errorElement = document.getElementById(`${fieldId}-error`)
        const inputElement = document.getElementById(fieldId) as HTMLInputElement | HTMLTextAreaElement | null

        if (errorElement) {
            errorElement.textContent = message
            errorElement.classList.remove('hidden')
        }

        if (inputElement) {
            inputElement.classList.add('input-error')
            inputElement.setAttribute('aria-invalid', 'true')
        }
    }

    /**
     * Clear validation error in UI
     * @param fieldId - Field ID
     */
    static clearError(fieldId: string): void {
        const errorElement = document.getElementById(`${fieldId}-error`)
        const inputElement = document.getElementById(fieldId) as HTMLInputElement | HTMLTextAreaElement | null

        if (errorElement) {
            errorElement.textContent = ''
            errorElement.classList.add('hidden')
        }

        if (inputElement) {
            inputElement.classList.remove('input-error')
            inputElement.setAttribute('aria-invalid', 'false')
        }
    }

    /**
     * Validate and update UI in real-time
     * @param fieldId - Field ID
     * @param value - Field value
     * @returns Validation result
     */
    static validateAndUpdateUI(fieldId: string, value: string): ValidationResult {
        const fieldName = fieldId.replace(/([A-Z])/g, '-$1').toLowerCase()
        const result = this.validateField(fieldName, value)

        if (result.valid) {
            this.clearError(fieldId)
        } else {
            this.showError(fieldId, result.firstError || 'Invalid value')
        }

        return result
    }

    /**
     * Update character counter
     * @param fieldId - Field ID
     * @param currentLength - Current length
     * @param maxLength - Maximum length
     */
    static updateCounter(fieldId: string, currentLength: number, maxLength: number): void {
        const countElement = document.getElementById(`${fieldId}-count`)
        if (countElement) {
            countElement.textContent = String(currentLength)
        }

        const counterElement = document.getElementById(`${fieldId}-counter`)
        if (counterElement) {
            const percentage = (currentLength / maxLength) * 100
            if (percentage > 90) {
                counterElement.classList.add('text-warning')
            } else if (percentage > 100) {
                counterElement.classList.add('text-error')
            } else {
                counterElement.classList.remove('text-warning', 'text-error')
            }
        }
    }
}

/**
 * Global validation functions for inline use
 */

/**
 * Validate project name (for inline use in templates)
 * @param input - Input element
 */
function validateProjectName(input: HTMLInputElement): boolean {
    const value = input.value.trim()
    const result = StepValidator.validateProjectName(value)

    if (value === '') {
        StepValidator.clearError('projectName')
        return true // Let HTML5 required handle empty
    }

    if (result.valid) {
        StepValidator.clearError('projectName')
    } else {
        StepValidator.showError('projectName', result.firstError || 'Invalid project name')
    }

    return result.valid
}

/**
 * Update description counter (for inline use in templates)
 * @param textarea - Textarea element
 */
function updateDescriptionCounter(textarea: HTMLTextAreaElement): void {
    const count = textarea.value.length
    const maxLength = parseInt(textarea.getAttribute('maxlength') || '500')
    StepValidator.updateCounter('projectDescription', count, maxLength)
}

// Export for global use
if (typeof window !== 'undefined') {
    ;(window as { StepValidator?: typeof StepValidator }).StepValidator = StepValidator
    ;(window as { validateProjectName?: typeof validateProjectName }).validateProjectName = validateProjectName
    ;(window as { updateDescriptionCounter?: typeof updateDescriptionCounter }).updateDescriptionCounter = updateDescriptionCounter
}

