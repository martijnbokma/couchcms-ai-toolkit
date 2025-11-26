# Refactor

Intelligent refactoring command that automatically detects file types, loads appropriate agents/specialists, and executes refactoring with best practices.

## When to Use

Use this command when you want to:
- Refactor any file with automatic agent/specialist detection
- Let the system determine the best refactoring approach
- Apply best practices automatically
- Refactor without specifying which agents to use

## Automatic Detection

This command automatically:
1. **Detects file type** from file extension and path
2. **Identifies technology stack** from file contents
3. **Loads appropriate agents** from `smart-defaults.yaml`
4. **Selects refactoring rules** from auto-loading `.mdc` files
5. **Applies best practices** from standards and modules

## Usage

```
/refactor @file.php
/refactor @assets/ts/user-manager.ts
/refactor @snippets/components/modal.html
/refactor @modules/typescript.md
/refactor @agents/alpinejs.md
```

### Options

- `@file` - File to refactor (required)
- `--strict` - Fail on warnings (not just errors)
- `--check-docs` - Compare against documentation/modules
- `--quick` - Minimal output, maximum efficiency

## Detection & Routing

### File Type Detection

**PHP Templates:**
- `*.php` → CouchCMS agent + `refactor-html.mdc`
- Detects: `<cms:...>` tags, CouchCMS patterns
- Loads: `couchcms` agent, `couchcms-core` module

**TypeScript Files:**
- `assets/ts/**/*.ts` → TypeScript agent + `refactor-typescript.mdc`
- Detects: TypeScript patterns, type definitions
- Loads: `typescript` agent, `typescript` module

**JavaScript Files:**
- `*.js` → TypeScript agent (for conversion) or toolkit refactoring
- Detects: Toolkit scripts vs project code
- Loads: `typescript` agent or `toolkit.md` specialist

**HTML Templates:**
- `snippets/components/*.html` → CouchCMS + Alpine.js agents
- `snippets/views/**/*.html` → CouchCMS agent
- `snippets/forms/*.html` → DataBound Forms agent
- Detects: CouchCMS tags, Alpine.js directives
- Loads: Appropriate agents + `refactor-html.mdc`

**CSS Files:**
- `assets/css/**/*.css` → TailwindCSS agent + `refactor-css.mdc`
- Detects: Custom CSS, TailwindCSS patterns
- Loads: `tailwindcss` agent, `tailwindcss` + `daisyui` modules

**Toolkit Files:**
- `modules/*.md` → Module refactoring (`/refactor-modules`)
- `agents/*.md` → Agent refactoring (`/refactor-agents`)
- `scripts/*.js` → Toolkit refactoring (`toolkit.md`)
- `prompts/**/*.md` → Toolkit refactoring (`toolkit.md`)
- `rules/*.mdc` → Toolkit refactoring (`toolkit.md`)

### Technology Stack Detection

**From File Contents:**
- `<cms:...>` tags → CouchCMS patterns
- `x-data`, `x-on:click` → Alpine.js patterns
- `export interface`, `type` → TypeScript patterns
- `bg-primary`, `btn` → TailwindCSS/daisyUI patterns
- `{{paths.xxx}}` → Toolkit configuration
- `require_once('couch/cms.php')` → CouchCMS template

**Multi-Technology Detection:**
- Template with Alpine.js → CouchCMS + Alpine.js agents
- Template with inline CSS → CouchCMS + TailwindCSS agents
- TypeScript with CouchCMS → TypeScript + CouchCMS agents

## Step-by-Step Process

### Phase 1: File Analysis (Automatic)

**Objective:** Detect file type and technology stack.

1. **Read Tagged File**
   - Read complete file contents
   - Extract file path and extension
   - Identify file location (snippets/, assets/, modules/, etc.)

2. **Detect Technology Stack**
   - Scan for CouchCMS tags (`<cms:...>`)
   - Scan for Alpine.js directives (`x-...`)
   - Scan for TypeScript patterns (`interface`, `type`, `export`)
   - Scan for TailwindCSS/daisyUI classes
   - Scan for toolkit patterns (`{{paths.xxx}}`)

3. **Match Against smart-defaults.yaml**
   - Find matching file context pattern
   - Extract agents, modules, checks, suggestions
   - Identify auto-loading rules (`.mdc` files)

4. **Determine Refactoring Type**
   - Single file refactoring
   - Multi-file refactoring (if multiple files tagged)
   - Toolkit component refactoring (if toolkit path)

**Output:** Detection report with selected agents/modules

### Phase 2: Agent & Specialist Selection (Automatic)

**Objective:** Load appropriate refactoring resources.

1. **Select Auto-Loading Rules**
   - Match file pattern to `.mdc` rules
   - Load: `refactor-html.mdc`, `refactor-typescript.mdc`, etc.

2. **Select Agents**
   - From `smart-defaults.yaml` file_contexts
   - Load agent documentation from `agents/` directory
   - Activate relevant agents for patterns

3. **Select Modules**
   - From `smart-defaults.yaml` file_contexts
   - Load module documentation from `modules/` directory
   - Apply module patterns and best practices

4. **Select Specialists** (if needed)
   - Toolkit files → `prompts/refactoring/toolkit.md`
   - Design preservation → `prompts/refactoring/design-preserving.md`
   - Functionality preservation → `prompts/refactoring/functionality-preserving.md`

**Output:** List of loaded agents, modules, and rules

### Phase 3: Pre-Flight Checks (Automatic)

**Objective:** Run security and quality checks before refactoring.

1. **Run Pre-Flight Checks**
   - From `preflight-checks.yaml`
   - CouchCMS critical checks (HTML comments, self-closing tags)
   - TypeScript checks (`any` type, console.log)
   - Security checks (XSS, eval, SQL injection)

2. **Report Issues**
   - **CRITICAL** → Block refactoring, show error
   - **WARNING** → Show warning, proceed with caution
   - **INFO** → Show info, proceed automatically

**Output:** Pre-flight check results

### Phase 4: Refactoring Execution

**Objective:** Apply refactoring using loaded agents and rules.

1. **Apply Auto-Loading Rules**
   - Follow patterns from `.mdc` rules
   - Apply CouchCMS, TypeScript, CSS refactoring patterns

2. **Apply Agent Patterns**
   - Use patterns from loaded agents
   - Follow best practices from agent documentation
   - Ensure consistency with agent guidelines

3. **Apply Module Patterns**
   - Use patterns from loaded modules
   - Follow module best practices
   - Ensure alignment with module standards

4. **Execute Refactoring**
   - Apply changes incrementally
   - Preserve functionality
   - Improve code quality
   - Follow project standards

**Output:** Refactored code with explanations

### Phase 5: Verification (Automatic)

**Objective:** Verify refactoring quality.

1. **Re-run Pre-Flight Checks**
   - Verify no new issues introduced
   - Check all critical issues resolved

2. **Validate Against Standards**
   - Check `standards.md` compliance
   - Verify agent/module alignment
   - Ensure best practices followed

3. **Check for Regressions**
   - Verify file structure intact
   - Check syntax is valid
   - Ensure no breaking changes (unless intended)

**Output:** Verification report

## Detection Examples

### Example 1: CouchCMS Template

**Input:**
```
/refactor @films.php
```

**Detection:**
- File: `films.php` → PHP template
- Path: Root → CouchCMS masterpage
- Content: `<cms:template>`, `<cms:pages>` → CouchCMS patterns

**Auto-Load:**
- Agent: `couchcms`
- Module: `couchcms-core`
- Rule: `refactor-html.mdc`
- Checks: `html-comment-security`, `template-structure`

**Execution:**
- Apply CouchCMS refactoring patterns
- Fix HTML comment security issues
- Optimize template structure
- Follow CouchCMS best practices

### Example 2: TypeScript File

**Input:**
```
/refactor @assets/ts/episode-manager.ts
```

**Detection:**
- File: `assets/ts/episode-manager.ts` → TypeScript
- Path: `assets/ts/` → TypeScript directory
- Content: `export interface`, `type` → TypeScript patterns

**Auto-Load:**
- Agent: `typescript`
- Module: `typescript`
- Rule: `refactor-typescript.mdc`
- Checks: `type-safety`, `no-any`

**Execution:**
- Apply TypeScript refactoring patterns
- Replace `any` with proper types
- Add explicit return types
- Follow TypeScript best practices

### Example 3: Component with Alpine.js

**Input:**
```
/refactor @snippets/components/modal.html
```

**Detection:**
- File: `snippets/components/modal.html` → Component
- Path: `snippets/components/` → Component directory
- Content: `<cms:show>`, `x-data`, `x-on:click` → CouchCMS + Alpine.js

**Auto-Load:**
- Agents: `couchcms`, `alpinejs`
- Modules: `couchcms-core`, `alpinejs`
- Rule: `refactor-html.mdc`
- Checks: `alpine-integration`, `component-structure`

**Execution:**
- Apply CouchCMS template patterns
- Fix Alpine.js syntax (full syntax required)
- Optimize component structure
- Follow both CouchCMS and Alpine.js best practices

### Example 4: Toolkit Module

**Input:**
```
/refactor @modules/typescript.md
```

**Detection:**
- File: `modules/typescript.md` → Toolkit module
- Path: `modules/` → Toolkit directory
- Content: Module frontmatter, patterns → Module structure

**Auto-Load:**
- Specialist: `prompts/refactoring/toolkit.md`
- Command: `/refactor-modules` workflow
- Checks: Module validation rules

**Execution:**
- Run module refactoring workflow
- Validate frontmatter and structure
- Sync with agents if needed
- Apply module best practices

### Example 5: Toolkit Agent

**Input:**
```
/refactor @agents/alpinejs.md
```

**Detection:**
- File: `agents/alpinejs.md` → Toolkit agent
- Path: `agents/` → Toolkit directory
- Content: Agent frontmatter, patterns → Agent structure

**Auto-Load:**
- Specialist: `prompts/refactoring/toolkit.md`
- Command: `/refactor-agents` workflow
- Checks: Agent validation rules

**Execution:**
- Run agent refactoring workflow
- Validate frontmatter and structure
- Sync with modules if needed
- Apply agent best practices

## File Type Routing Matrix

| File Pattern | Agents | Modules | Rules | Specialist |
|--------------|--------|---------|-------|------------|
| `*.php` | `couchcms` | `couchcms-core` | `refactor-html.mdc` | - |
| `assets/ts/**/*.ts` | `typescript` | `typescript` | `refactor-typescript.mdc` | - |
| `snippets/components/*.html` | `couchcms`, `alpinejs` | `couchcms-core`, `alpinejs` | `refactor-html.mdc` | - |
| `snippets/forms/*.html` | `databound-forms`, `couchcms` | `databound-forms`, `couchcms-core` | `refactor-forms.mdc` | - |
| `assets/css/**/*.css` | `tailwindcss` | `tailwindcss`, `daisyui` | `refactor-css.mdc` | - |
| `modules/*.md` | - | - | - | `/refactor-modules` |
| `agents/*.md` | - | - | - | `/refactor-agents` |
| `scripts/*.js` | - | - | - | `toolkit.md` |
| `prompts/**/*.md` | - | - | - | `toolkit.md` |
| `rules/*.mdc` | - | - | - | `toolkit.md` |

## Multi-File Refactoring

When multiple files are tagged:

```
/refactor @snippets/components/modal.html @assets/css/modal.css
```

**Detection:**
- Multiple files detected
- Mixed types: HTML template + CSS
- Technology: CouchCMS + TailwindCSS

**Auto-Load:**
- Agents: `couchcms`, `tailwindcss`
- Modules: `couchcms-core`, `tailwindcss`, `daisyui`
- Rules: `refactor-html.mdc`, `refactor-css.mdc`

**Execution Order:**
1. CSS refactoring (extract, optimize)
2. Template refactoring (update references)
3. Integration check (ensure compatibility)

## Output Format

```
🔍 File Analysis

File: @films.php
Type: CouchCMS Template
Path: Root (masterpage)

Technology Detected:
- CouchCMS tags: <cms:template>, <cms:pages>
- Alpine.js: None detected
- TypeScript: None detected

📦 Auto-Loaded Resources

Agents:
- couchcms (CouchCMS template patterns)

Modules:
- couchcms-core (Core CouchCMS patterns)

Rules:
- refactor-html.mdc (Auto-loading rule)

Checks:
- html-comment-security
- template-structure

🔧 Refactoring Applied

✅ Fixed: HTML comment security (line 23)
✅ Improved: Template structure
✅ Added: Authentication check
✅ Optimized: Page query

📋 Verification

✅ Pre-flight checks: PASSED
✅ Standards compliance: VERIFIED
✅ No regressions detected
```

## Options

### --strict
Fail on warnings, not just errors. Useful for CI/CD:

```
/refactor @films.php --strict
```

### --check-docs
Compare against documentation and modules:

```
/refactor @modules/typescript.md --check-docs
```

### --quick
Minimal output, maximum efficiency:

```
/refactor @films.php --quick
```

## Integration

### With Smart Defaults

Uses `smart-defaults.yaml` for automatic context loading:
- File patterns → Agents/Modules mapping
- Action contexts → Default configurations
- Intent patterns → Automatic detection

### With Auto-Loading Rules

Automatically loads `.mdc` rules based on file patterns:
- `refactor-html.mdc` for templates
- `refactor-typescript.mdc` for TypeScript
- `refactor-css.mdc` for CSS
- `refactor-forms.mdc` for forms

### With Refactor Commands

Routes to specialized commands when appropriate:
- `modules/*.md` → `/refactor-modules`
- `agents/*.md` → `/refactor-agents`
- Toolkit files → `toolkit.md` specialist

## Best Practices

1. **Always tag files** - Use `@file` syntax for automatic detection
2. **Trust auto-detection** - System selects best agents automatically
3. **Review changes** - Always review refactored code before committing
4. **Use --strict for CI** - Enable strict mode in automated checks
5. **Check docs when needed** - Use `--check-docs` for module/agent sync

## Examples

### Refactor CouchCMS Template

```
/refactor @films.php

"Automatically detect CouchCMS patterns and apply refactoring"
```

### Refactor TypeScript File

```
/refactor @assets/ts/user-manager.ts

"Automatically detect TypeScript patterns and apply refactoring"
```

### Refactor Component

```
/refactor @snippets/components/modal.html

"Automatically detect CouchCMS + Alpine.js and apply refactoring"
```

### Refactor Toolkit Module

```
/refactor @modules/typescript.md

"Automatically route to module refactoring workflow"
```

### Refactor Multiple Files

```
/refactor @snippets/components/modal.html @assets/css/modal.css

"Automatically detect multiple technologies and coordinate refactoring"
```

## See Also

- [Refactor File](./refactor-file.md) - Basic file refactoring
- [Refactor Modules](./refactor-modules.md) - Module refactoring workflow
- [Refactor Agents](./refactor-agents.md) - Agent refactoring workflow
- [Refactor Toolkit](./refactor-toolkit.md) - Toolkit component refactoring
- [Refactor Router](../prompts/refactoring/router.md) - Detailed routing logic
