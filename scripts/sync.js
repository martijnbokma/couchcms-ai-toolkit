#!/usr/bin/env bun
/**
 * CouchCMS AI Toolkit - Sync Script
 *
 * Generates editor configurations from project.md, toolkit modules,
 * agents, and project-specific context.
 *
 * Usage:
 *   bun ai-toolkit/scripts/sync.js
 *   bun ~/couchcms-ai-toolkit/scripts/sync.js
 */

import matter from "gray-matter";
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TOOLKIT_ROOT = resolve(__dirname, "..");

// Default configuration
const DEFAULTS = {
    indentation: 4,
    language: "english",
    lineLength: 120,
};

/**
 * Find project.md in current directory or parent directories
 */
function findProjectFile(startDir = process.cwd()) {
    let currentDir = startDir;
    const possibleNames = ["project.md", "PROJECT.md"];

    while (currentDir !== "/") {
        for (const name of possibleNames) {
            const projectPath = join(currentDir, name);
            if (existsSync(projectPath)) {
                return projectPath;
            }
        }
        currentDir = dirname(currentDir);
    }

    return null;
}

/**
 * Resolve toolkit path from project config
 */
function resolveToolkitPath(configPath) {
    if (!configPath) {
        return TOOLKIT_ROOT;
    }

    // Expand ~ to home directory
    if (configPath.startsWith("~")) {
        configPath = configPath.replace("~", process.env.HOME);
    }

    // Resolve relative paths from project directory
    if (!configPath.startsWith("/")) {
        configPath = resolve(process.cwd(), configPath);
    }

    return configPath;
}

/**
 * Load a module from the toolkit
 */
function loadModule(moduleName, toolkitPath) {
    const modulePath = join(toolkitPath, "modules", `${moduleName}.md`);

    if (!existsSync(modulePath)) {
        console.warn(`⚠️  Module not found: ${moduleName}`);
        return null;
    }

    const fileContent = readFileSync(modulePath, "utf8");
    const { data: meta, content } = matter(fileContent);

    return { meta, content, name: moduleName };
}

/**
 * Load an agent from the toolkit
 */
function loadAgent(agentName, toolkitPath) {
    // Check daily agents first, then specialists
    const paths = [
        join(toolkitPath, "agents", "daily", `${agentName}.md`),
        join(toolkitPath, "agents", "specialists", `${agentName}.md`),
    ];

    for (const agentPath of paths) {
        if (existsSync(agentPath)) {
            const fileContent = readFileSync(agentPath, "utf8");
            const { data: meta, content } = matter(fileContent);
            return { meta, content, name: agentName };
        }
    }

    console.warn(`⚠️  Agent not found: ${agentName}`);
    return null;
}

/**
 * Load project context from context directory
 */
function loadProjectContext(contextPath, projectDir) {
    if (!contextPath) {
        return null;
    }

    // Resolve relative paths from project directory
    const fullPath = contextPath.startsWith("/")
        ? contextPath
        : resolve(projectDir, contextPath);

    if (!existsSync(fullPath)) {
        console.warn(`⚠️  Context directory not found: ${fullPath}`);
        return null;
    }

    // Load context.md if it exists
    const contextFile = join(fullPath, "context.md");
    if (existsSync(contextFile)) {
        const fileContent = readFileSync(contextFile, "utf8");
        const { data: meta, content } = matter(fileContent);
        return { meta, content, path: fullPath };
    }

    // Otherwise, load all .md files in the directory
    const files = readdirSync(fullPath).filter((f) => f.endsWith(".md"));
    let combinedContent = "";

    for (const file of files) {
        const filePath = join(fullPath, file);
        const fileContent = readFileSync(filePath, "utf8");
        const { content } = matter(fileContent);
        combinedContent += `\n${content}\n`;
    }

    return { meta: {}, content: combinedContent, path: fullPath };
}

/**
 * Check for module conflicts
 */
function checkConflicts(modules) {
    const moduleNames = modules.map((m) => m.name);
    const errors = [];

    for (const mod of modules) {
        if (mod.meta.conflicts) {
            for (const conflict of mod.meta.conflicts) {
                if (moduleNames.includes(conflict)) {
                    errors.push(
                        `❌ Conflict: ${mod.name} cannot be used with ${conflict}`
                    );
                }
            }
        }

        if (mod.meta.requires) {
            for (const required of mod.meta.requires) {
                if (!moduleNames.includes(required)) {
                    errors.push(
                        `❌ Missing dependency: ${mod.name} requires ${required}`
                    );
                }
            }
        }
    }

    return errors;
}

/**
 * Generate the combined configuration content
 */
function generateContent(config, modules, agents, projectContext, projectRules) {
    const timestamp = new Date().toISOString();
    const moduleNames = modules.map((m) => m.name).join(", ");
    const agentNames = agents.map((a) => a.name).join(", ");

    let content = `# AI Coding Standards
# Project: ${config.name || "Unnamed Project"}
# Generated: ${timestamp}
# Modules: ${moduleNames}
${agentNames ? `# Agents: ${agentNames}` : ""}

## Project Overview

- **Name**: ${config.name || "Unnamed"}
- **Description**: ${config.description || "No description"}
- **Type**: CouchCMS Web Application

## Core Standards

- **Indentation**: ${config.overrides?.indentation || DEFAULTS.indentation} spaces
- **Language**: ${config.overrides?.language || DEFAULTS.language} only for all code and content
- **Line Length**: ${config.overrides?.lineLength || DEFAULTS.lineLength} characters

---

`;

    // Add each module's content
    for (const mod of modules) {
        content += `\n${mod.content}\n\n---\n`;
    }

    // Add agents content
    if (agents.length > 0) {
        content += `\n# AI Agents\n\n`;
        for (const agent of agents) {
            content += `\n${agent.content}\n\n---\n`;
        }
    }

    // Add project context
    if (projectContext && projectContext.content.trim()) {
        content += `\n# Project Context\n\n${projectContext.content}\n\n---\n`;
    }

    // Add project-specific rules from project.md
    if (projectRules && projectRules.trim()) {
        content += `\n# Project-Specific Rules\n\n${projectRules}\n`;
    }

    return content;
}

/**
 * Main sync function
 */
async function sync() {
    console.log("🔄 CouchCMS AI Toolkit - Sync\n");

    // Find project.md
    const projectPath = findProjectFile();

    if (!projectPath) {
        console.error(
            "❌ No project.md found in current directory or parent directories."
        );
        console.log("\nCreate a project.md file with:\n");
        console.log(`---
name: "my-project"
description: "Project description"
toolkit: "./ai-toolkit"
modules:
  - couchcms-core
  - tailwindcss
  - daisyui
  - alpinejs
agents:
  - couchcms-agent
context: ".project/ai"
---

# Project-Specific Rules

Add your project-specific instructions here...
`);
        process.exit(1);
    }

    console.log(`📄 Found: ${projectPath}`);
    const projectDir = dirname(projectPath);

    // Parse project.md
    const projectContent = readFileSync(projectPath, "utf8");
    const { data: config, content: projectRules } = matter(projectContent);

    console.log(`📦 Project: ${config.name || "Unnamed"}`);

    // Resolve toolkit path
    const toolkitPath = resolveToolkitPath(config.toolkit);
    console.log(`🛠️  Toolkit: ${toolkitPath}`);

    // Ensure couchcms-core is always included
    const moduleList = config.modules || ["couchcms-core"];
    if (!moduleList.includes("couchcms-core")) {
        moduleList.unshift("couchcms-core");
    }

    console.log(`📚 Modules: ${moduleList.join(", ")}`);

    // Load modules
    const modules = moduleList
        .map((name) => loadModule(name, toolkitPath))
        .filter(Boolean);

    // Load agents
    const agentList = config.agents || [];
    const agents = agentList
        .map((name) => loadAgent(name, toolkitPath))
        .filter(Boolean);

    if (agents.length > 0) {
        console.log(`🤖 Agents: ${agents.map((a) => a.name).join(", ")}`);
    }

    // Load project context
    const projectContext = loadProjectContext(config.context, projectDir);
    if (projectContext) {
        console.log(`📋 Context: ${projectContext.path}`);
    }

    // Check for conflicts
    const conflicts = checkConflicts(modules);
    if (conflicts.length > 0) {
        console.log("\n");
        conflicts.forEach((c) => console.log(c));
        process.exit(1);
    }

    // Generate content
    const content = generateContent(config, modules, agents, projectContext, projectRules);

    // Write editor configurations
    // .cursorrules
    writeFileSync(join(projectDir, ".cursorrules"), content);
    console.log("✅ Generated: .cursorrules");

    // CLAUDE.md
    writeFileSync(join(projectDir, "CLAUDE.md"), content);
    console.log("✅ Generated: CLAUDE.md");

    // .github/copilot-instructions.md
    const githubDir = join(projectDir, ".github");
    if (!existsSync(githubDir)) {
        mkdirSync(githubDir, { recursive: true });
    }
    writeFileSync(join(githubDir, "copilot-instructions.md"), content);
    console.log("✅ Generated: .github/copilot-instructions.md");

    // AGENT.md
    writeFileSync(
        join(projectDir, "AGENT.md"),
        `# Universal AI Agent Instructions

This project uses the CouchCMS AI Toolkit for consistent AI agent behavior.

## Configuration

All AI coding agents follow the rules generated from:
- \`project.md\` - Project-specific configuration
- Toolkit modules from: ${toolkitPath}
${projectContext ? `- Project context from: ${config.context}` : ""}

## Modules Active

${modules
    .map(
        (m) => `- **${m.meta.name || m.name}** (v${m.meta.version || "1.0"}): ${m.meta.description || "No description"}`
    )
    .join("\n")}

${agents.length > 0 ? `## Agents Active

${agents
    .map(
        (a) => `- **${a.meta.name || a.name}** (${a.meta.type || "daily"}): ${a.meta.description || "No description"}`
    )
    .join("\n")}
` : ""}

## Regenerate

\`\`\`bash
bun run ai:sync
# or
bun ${toolkitPath}/scripts/sync.js
\`\`\`

## Key Standards

- **Indentation**: ${config.overrides?.indentation || DEFAULTS.indentation} spaces
- **Language**: ${config.overrides?.language || DEFAULTS.language} only
- **Modules**: ${moduleList.join(", ")}

If any conflict exists between configurations, \`project.md\` always wins.
`
    );
    console.log("✅ Generated: AGENT.md");

    console.log(`\n✨ Sync complete! ${modules.length} modules, ${agents.length} agents loaded.\n`);
}

// Run
sync().catch(console.error);
