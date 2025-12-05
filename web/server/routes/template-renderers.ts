#!/usr/bin/env bun
/**
 * Template rendering functions for wizard steps
 * Handles rendering of different wizard steps with proper context
 */

import { wrapStepWithProgress, SETUP_TYPES, type RenderTemplateFunction, type SetupType } from './helpers'
import { createHiddenFields } from './data-processor'
import { normalizeEditorsArray } from './utils'
import { getAvailableEditors } from '../../../scripts/lib/prompts.js'
import { getPreset } from '../../../scripts/lib/presets-loader.js'
import { getToolkitRootCached } from '../../../scripts/lib/paths.js'
import { loadModuleMetadata, loadAgentMetadata, groupByCategory, scanMarkdownFiles, getCouchCMSItemsFromToolkit } from './metadata-loader'
import { DEFAULT_PROJECT_NAME, DEFAULT_PROJECT_DESCRIPTION, DEFAULT_SETUP_TYPE, DEFAULT_CONTEXT_DIR } from './data-processor'
import { FRONTEND_MODULES, POPULAR_EDITOR_IDS, DEFAULT_SELECTED_EDITOR, createFrontendOptions } from './option-builders'
import { join } from 'path'
import { debug } from '../../../scripts/lib/logger.js'
import type { FormData, ReviewStepData, PresetData, FrontendOptions } from '../types'

/**
 * Render editors step for simple setup flow
 * @param renderTemplate - Template render function
 * @param formData - Parsed form data
 * @returns HTML content
 */
export async function renderSimpleEditorsStep(
    renderTemplate: RenderTemplateFunction,
    formData: Partial<FormData>
): Promise<string> {
    const editors = getAvailableEditors()
    const popularEditors = editors
        .filter(e => POPULAR_EDITOR_IDS.includes(e.id as typeof POPULAR_EDITOR_IDS[number]))
        .map(e => ({ ...e, selected: e.id === DEFAULT_SELECTED_EDITOR }))
    const otherEditors = editors
        .filter(e => !POPULAR_EDITOR_IDS.includes(e.id as typeof POPULAR_EDITOR_IDS[number]))
        .map(e => ({ ...e, selected: false }))

    // Update selected state from form data
    const selectedEditors = formData.editors || []
    const popularWithSelection = popularEditors.map(e => ({
        ...e,
        selected: selectedEditors.includes(e.id)
    }))
    const otherWithSelection = otherEditors.map(e => ({
        ...e,
        selected: selectedEditors.includes(e.id)
    }))

    return await wrapStepWithProgress(
        renderTemplate,
        2, // Step 2 for Simple (Project → Editors)
        'steps/editors.html',
        {
            setupType: SETUP_TYPES.SIMPLE,
            ...formData,
            editors: selectedEditors,
            popularEditors: popularWithSelection,
            otherEditors: otherWithSelection,
            hiddenFields: createHiddenFields(formData)
        }
    )
}

/**
 * Render presets step (Extended flow only)
 * @param renderTemplate - Template render function
 * @param formData - Parsed form data
 * @returns HTML content
 */
export async function renderPresetsStep(
    renderTemplate: RenderTemplateFunction,
    formData: Partial<FormData>
): Promise<string> {
    // Presets step is only for Extended flow
    if (formData.setupType === SETUP_TYPES.SIMPLE) {
        throw new Error('Presets step is not available for Simple setup')
    }

    const stepNumber = 2 // Step 2 for Extended flow
    debug('[renderPresetsStep] Rendering presets step:', {
        stepNumber,
        setupType: formData.setupType,
        projectName: formData.projectName
    })
    try {
        const html = await wrapStepWithProgress(
            renderTemplate,
            stepNumber,
            'steps/presets.html',
            {
                setupType: formData.setupType,
                ...formData,
                hiddenFields: createHiddenFields(formData)
            }
        )
        debug('[renderPresetsStep] Successfully rendered presets step')
        return html
    } catch (error) {
        console.error('[renderPresetsStep] Error rendering presets step:', error)
        throw error
    }
}

/**
 * Render frontend step for extended setup flow
 * @param renderTemplate - Template render function
 * @param formData - Parsed form data
 * @returns HTML content
 */
export async function renderExtendedFrontendStep(
    renderTemplate: RenderTemplateFunction,
    formData: Partial<FormData>
): Promise<string> {
    try {
        debug('[renderExtendedFrontendStep] Starting render', {
            hasCss: !!formData.css,
            hasJs: !!formData.js,
            cssLength: Array.isArray(formData.css) ? formData.css.length : 0,
            jsLength: Array.isArray(formData.js) ? formData.js.length : 0,
            formDataKeys: Object.keys(formData)
        })

        // Use defaults if not provided - ensure arrays are always arrays
        const css: string[] = formData.css && Array.isArray(formData.css) && formData.css.length > 0
            ? formData.css.filter(c => c && c !== '') // Filter out empty values
            : [FRONTEND_MODULES.CSS[0]]
        const js: string[] = formData.js && Array.isArray(formData.js) && formData.js.length > 0
            ? formData.js.filter(j => j && j !== '') // Filter out empty values
            : [FRONTEND_MODULES.JS[0]]

        debug('[renderExtendedFrontendStep] Frontend arrays:', { css, js })

        // Ensure FRONTEND_MODULES constants are available
        if (!FRONTEND_MODULES || !FRONTEND_MODULES.CSS || !FRONTEND_MODULES.JS) {
            throw new Error('FRONTEND_MODULES constants not available')
        }

        const frontendOptions = createFrontendOptions(css, js)
        debug('[renderExtendedFrontendStep] Frontend options created:', {
            cssOptions: frontendOptions.css.length,
            jsOptions: frontendOptions.js.length
        })

        const hiddenFields = createHiddenFields({
            ...formData,
            css,
            js
        })
        debug('[renderExtendedFrontendStep] Hidden fields created:', hiddenFields.length)

        // Ensure frontendOptions has the correct structure
        if (!frontendOptions || !frontendOptions.css || !frontendOptions.js) {
            throw new Error('frontendOptions is missing required css or js properties')
        }

        const templateContext = {
            setupType: SETUP_TYPES.EXTENDED,
            ...formData,
            css, // Also pass css/js directly for template fallback
            js,
            frontend: { css, js },
            frontendOptions,
            hiddenFields
        }
        debug('[renderExtendedFrontendStep] Template context prepared:', {
            hasFrontendOptions: !!templateContext.frontendOptions,
            frontendOptionsCssLength: templateContext.frontendOptions?.css?.length || 0,
            frontendOptionsJsLength: templateContext.frontendOptions?.js?.length || 0,
            hasHiddenFields: Array.isArray(templateContext.hiddenFields),
            setupType: templateContext.setupType,
            cssArray: templateContext.css,
            jsArray: templateContext.js
        })

        try {
            debug('[renderExtendedFrontendStep] Calling wrapStepWithProgress')
            const html = await wrapStepWithProgress(
                renderTemplate,
                3, // Step 3 for Extended flow (Project → Presets → Frontend)
                'steps/frontend.html',
                templateContext
            )
            debug('[renderExtendedFrontendStep] Template rendered successfully, length:', html.length)
            return html
        } catch (templateError) {
            console.error('[renderExtendedFrontendStep] Template rendering error:', templateError)
            const templateErrorStack = templateError instanceof Error ? templateError.stack : 'No stack trace'
            console.error('[renderExtendedFrontendStep] Template error stack:', templateErrorStack)
            throw new Error(`Template rendering failed: ${templateError instanceof Error ? templateError.message : 'Unknown error'}`)
        }
    } catch (error) {
        console.error('[renderExtendedFrontendStep] Error:', error)
        const errorStack = error instanceof Error ? error.stack : 'No stack trace'
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('[renderExtendedFrontendStep] Error stack:', errorStack)
        console.error('[renderExtendedFrontendStep] Form data at error:', {
            hasCss: !!formData.css,
            hasJs: !!formData.js,
            setupType: formData.setupType,
            projectName: formData.projectName
        })
        throw new Error(`Failed to render frontend step: ${errorMessage}`)
    }
}

/**
 * Get review step HTML using Nunjucks template
 * @param renderTemplate - Template render function
 * @param data - Review step data
 * @returns HTML content
 */
export async function getReviewStep(
    renderTemplate: RenderTemplateFunction,
    data: Partial<ReviewStepData>
): Promise<string> {
    // CRITICAL: Ensure all fields have default values to prevent missing data
    const {
        setupType = (data.setupType as SetupType) || DEFAULT_SETUP_TYPE,
        projectName = data.projectName || DEFAULT_PROJECT_NAME,
        projectDescription = data.projectDescription || DEFAULT_PROJECT_DESCRIPTION,
        frontend = { css: (data.css as string[]) || [], js: (data.js as string[]) || [] },
        editors = (data.editors as string[]) || [],
        framework = data.framework || false,
        contextDir = data.contextDir || DEFAULT_CONTEXT_DIR,
        preset = data.preset || '',
        presetData = data.presetData || null
    } = data

    // Ensure frontend object has arrays and remove duplicates
    const cssArray = Array.isArray(frontend.css) ? frontend.css : (Array.isArray(data.css) ? (data.css as string[]) : [])
    const jsArray = Array.isArray(frontend.js) ? frontend.js : (Array.isArray(data.js) ? (data.js as string[]) : [])

    // Remove duplicates from arrays
    const uniqueCss = [...new Set(cssArray)]
    const uniqueJs = [...new Set(jsArray)]

    const frontendData = {
        css: uniqueCss,
        js: uniqueJs
    }

    const editorsArray = normalizeEditorsArray(editors)
    debug('[Review Step] Complete data:', {
        setupType,
        projectName,
        projectDescription,
        frontend: frontendData,
        editors: editorsArray,
        framework,
        preset
    })
    debug('[Review Step] Editors array:', editorsArray)
    debug('[Review Step] Editors length:', editorsArray.length)
    debug('[Review Step] Preset:', preset)

    // Load preset data if preset key is provided but presetData is not
    let finalPresetData: PresetData | null = presetData
    if (preset && preset !== '' && !presetData) {
        finalPresetData = getPreset(preset) as PresetData | null
    }

    // For presets, use preset data if available, otherwise get from toolkit
    let couchcmsModules: string[]
    let couchcmsAgents: string[]
    let enrichedModules: Array<{ name: string } & import('../types').ModuleMetadata>
    let enrichedAgents: Array<{ name: string } & import('../types').AgentMetadata>

    // Get selected frontend frameworks to filter from agents
    const selectedFrontendFrameworks = [...uniqueCss, ...uniqueJs]

    if (preset && preset !== '' && finalPresetData && data.couchcmsModules && data.couchcmsAgents) {
        couchcmsModules = data.couchcmsModules
        // Filter out frontend frameworks that user selected - they're already shown in Frontend Frameworks section
        couchcmsAgents = data.couchcmsAgents.filter(agent => !selectedFrontendFrameworks.includes(agent))
    } else if (preset && preset !== '' && finalPresetData) {
        // Extract modules and agents from preset if not already provided
        const cssModules = finalPresetData.modules.filter(m => ['tailwindcss', 'daisyui'].includes(m))
        const jsModules = finalPresetData.modules.filter(m => ['alpinejs', 'typescript'].includes(m))
        couchcmsModules = finalPresetData.modules.filter(m => !['tailwindcss', 'daisyui', 'alpinejs', 'typescript'].includes(m))
        // Filter out frontend frameworks that user selected - they're already shown in Frontend Frameworks section
        couchcmsAgents = (finalPresetData.agents || []).filter(agent => !selectedFrontendFrameworks.includes(agent))
    } else {
        const items = getCouchCMSItemsFromToolkit(false, FRONTEND_MODULES)
        couchcmsModules = items.couchcmsModules

        // Filter out frontend frameworks that user selected - they're already shown in Frontend Frameworks section
        couchcmsAgents = items.couchcmsAgents.filter(agent => !selectedFrontendFrameworks.includes(agent))
    }

    // CRITICAL: For review step, show ALL core modules and agents, not just auto-included ones
    // This gives users full visibility into what's available in the toolkit
    const toolkitPath = getToolkitRootCached()

    // Scan ALL core modules and agents (no exclusions for display purposes)
    const coreModulesDir = join(toolkitPath, 'modules', 'core')
    const coreAgentsDir = join(toolkitPath, 'agents', 'core')

    // Get ALL core modules (no exclusions - scan everything in core directory)
    const allCoreModuleNames = scanMarkdownFiles(coreModulesDir, [])
    // Get ALL core agents (no exclusions, but filter frontend ones for display)
    const allCoreAgentNames = scanMarkdownFiles(coreAgentsDir, []).filter(agent => !selectedFrontendFrameworks.includes(agent))

    debug('[Review Step] Scanning core directories:', {
        coreModulesDir,
        coreAgentsDir,
        foundModules: allCoreModuleNames.length,
        foundAgents: allCoreAgentNames.length,
        moduleNames: allCoreModuleNames,
        agentNames: allCoreAgentNames
    })

    // Get enriched metadata for ALL core modules and agents
    enrichedModules = allCoreModuleNames.map(name => {
        const metadata = loadModuleMetadata(name, toolkitPath)
        return { name, ...metadata }
    }).filter(m => m.name) // Remove nulls

    enrichedAgents = allCoreAgentNames.map(name => {
        const metadata = loadAgentMetadata(name, toolkitPath)
        return { name, ...metadata }
    }).filter(a => a.name) // Remove nulls

    // Sort by name for consistent display
    enrichedModules.sort((a, b) => a.name.localeCompare(b.name))
    enrichedAgents.sort((a, b) => a.name.localeCompare(b.name))

    debug('[Review Step] Enriched data:', {
        modules: enrichedModules.length,
        agents: enrichedAgents.length,
        moduleNames: enrichedModules.map(m => m.name),
        agentNames: enrichedAgents.map(a => a.name)
    })

    // Group by category for better organization
    const modulesByCategory = groupByCategory(enrichedModules)
    const agentsByCategory = groupByCategory(enrichedAgents)

    debug('[Review Step] Grouped by category:', {
        modulesByCategory: modulesByCategory ? Object.keys(modulesByCategory).map(cat => `${cat}: ${modulesByCategory[cat].length}`) : 'null (no categories)',
        agentsByCategory: agentsByCategory ? Object.keys(agentsByCategory).map(cat => `${cat}: ${agentsByCategory[cat].length}`) : 'null (no categories)'
    })

    const finalStep = setupType === SETUP_TYPES.SIMPLE ? 3 : 7

    return await wrapStepWithProgress(
        renderTemplate,
        finalStep,
        'steps/review.html',
        {
            setupType,
            projectName,
            projectDescription,
            frontend: frontendData, // Use normalized frontend data
            editors: editorsArray,
            framework,
            contextDir,
            couchcmsModules,
            couchcmsAgents,
            enrichedModules,
            enrichedAgents,
            modulesByCategory,
            agentsByCategory,
            preset: preset || '',
            presetData: finalPresetData || null
        }
    )
}

