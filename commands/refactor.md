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
3. **Loads appropriate agents** from toolkit configuration (built into toolkit)
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
- `--confirm` - Force confirmation even for LOW/MEDIUM risk
- `--auto` - Skip confirmation and proceed automatically (use with caution)

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

**Workflow Overview:**
```
Phase 1: File Analysis & Baseline Establishment (Automatic)
  ↓
Phase 2: Agent & Specialist Selection (Automatic)
  ↓
Phase 2.5: Risk Analysis & Impact Assessment (Automatic)
  ↓
Phase 3: Pre-Flight Checks (Automatic)
  ↓
Phase 3.5: User Confirmation (Conditional) ⚠️
  ├─ CRITICAL/HIGH risk → Requires confirmation
  └─ LOW/MEDIUM risk → Automatic proceed
  ↓
Phase 4: Refactoring Execution
  ↓
Phase 5: Verification (Automatic)
```

### Phase 1: File Analysis & Baseline Establishment (Automatic)

**Objective:** Detect file type, technology stack, and establish baseline for rollback.

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

3. **Match Against Toolkit Configuration**
   - Find matching file context pattern (from built-in configuration)
   - Extract agents, modules, checks, suggestions
   - Identify auto-loading rules (`.mdc` files)

4. **Determine Refactoring Type**
   - Single file refactoring
   - Multi-file refactoring (if multiple files tagged)
   - Toolkit component refactoring (if toolkit path)

5. **Establish Baseline (Read-Only)**
   - Create snapshot of current file state
   - Document current file structure and dependencies
   - Capture dependency graph (imports, requires, references)
   - Record current test coverage (if test files exist)
   - Store baseline for rollback capability

**Output:** Detection report with selected agents/modules and baseline snapshot

### Phase 2: Agent & Specialist Selection (Automatic)

**Objective:** Load appropriate refactoring resources.

1. **Select Auto-Loading Rules**
   - Match file pattern to `.mdc` rules
   - Load: `refactor-html.mdc`, `refactor-typescript.mdc`, etc.

2. **Select Agents**
   - From toolkit configuration (file_contexts built into toolkit)
   - Load agent documentation from `agents/` directory
   - Activate relevant agents for patterns

3. **Select Modules**
   - From toolkit configuration (file_contexts built into toolkit)
   - Load module documentation from `modules/` directory
   - Apply module patterns and best practices

4. **Select Specialists** (if needed)
   - Toolkit files → `prompts/refactoring/toolkit.md`
   - Design preservation → `prompts/refactoring/design-preserving.md`
   - Functionality preservation → `prompts/refactoring/functionality-preserving.md`

**Output:** List of loaded agents, modules, and rules

### Phase 2.5: Risk Analysis & Impact Assessment (Automatic)

**Objective:** Comprehensive risk assessment before execution to prevent breaking changes.

1. **Dependency Analysis**
   - Find all files that import/require the target file
   - Identify files that reference the target file's exports
   - Check for cross-file dependencies (CSS, templates, components)
   - Map configuration dependencies (YAML, JSON, environment files)
   - Identify test files that reference the target file

2. **Breaking Change Detection**
   - Detect API signature changes (function parameters, return types)
   - Identify exported function/class/interface changes
   - Check for interface/type definition changes
   - Flag potential runtime errors from signature mismatches
   - Identify database schema impacts (if applicable)

3. **Impact Assessment**
   - List all affected files (dependents and dependencies)
   - Estimate scope of changes needed across codebase
   - Identify test files that need updates
   - Check for configuration file impacts
   - Assess template/component usage across project

4. **Risk Categorization**
   - **CRITICAL**: Breaking changes affecting multiple files or core functionality
   - **HIGH**: Changes requiring coordinated updates across multiple components
   - **MEDIUM**: Isolated changes with moderate impact on related files
   - **LOW**: Internal refactoring only, no external dependencies

5. **Rollback Strategy**
   - Document current state (baseline from Phase 1)
   - Create backup plan (file backups, git commits)
   - Identify rollback checkpoints
   - Define verification criteria for successful refactoring
   - Plan for dependency updates if breaking changes detected

**Output:** Risk assessment report with impact analysis, affected files, and rollback strategy

### Phase 3: Pre-Flight Checks (Automatic)

**Objective:** Run security and quality checks before refactoring.

1. **Run Pre-Flight Checks**
   - From built-in toolkit checks (preflight checks built into toolkit)
   - CouchCMS critical checks (HTML comments, self-closing tags)
   - TypeScript checks (`any` type, console.log)
   - Security checks (XSS, eval, SQL injection)

2. **Report Issues**
   - **CRITICAL** → Block refactoring, show error
   - **WARNING** → Show warning, proceed with caution
   - **INFO** → Show info, proceed automatically

**Output:** Pre-flight check results

### Phase 3.5: User Confirmation (Conditional)

**Objective:** Get explicit approval before execution for high-risk refactoring.

**Confirmation Required When:**
- Risk Level is **CRITICAL** or **HIGH**
- Breaking changes detected
- Multiple files affected (>3 files)
- Core functionality impacted

**Automatic Proceed When:**
- Risk Level is **LOW** or **MEDIUM**
- No breaking changes detected
- Single file refactoring only
- No external dependencies affected

1. **Present Risk Assessment Summary** (if confirmation needed)
   - Show impact analysis results from Phase 2.5
   - List all affected files and dependencies
   - Highlight breaking changes (if any)
   - Display risk categorization (CRITICAL/HIGH/MEDIUM/LOW)
   - Show rollback strategy

2. **Present Execution Plan** (if confirmation needed)
   - Show selected agents, modules, and rules
   - Display proposed refactoring changes
   - Show estimated scope of changes
   - Present execution order (for multi-file refactoring)
   - Display pre-flight check results

3. **Request Explicit Confirmation** (only if risk is CRITICAL/HIGH)
   - Present clear execution plan summary
   - Request explicit approval before proceeding
   - Allow plan modification if needed
   - Provide options for different approaches

4. **Handle User Response** (only if confirmation requested)
   - **A/Yes** → Proceed with execution as planned
   - **B/Different** → Use different resource/approach (user specifies)
   - **C/Modify** → Adjust execution plan (user specifies changes)
   - **D/Info** → Provide more detailed information
   - **Cancel** → Abort refactoring

**Output:** Confirmed execution plan or automatic proceed (for LOW/MEDIUM risk)

**Note:**
- **LOW/MEDIUM risk**: Proceeds automatically to Phase 4 without confirmation
- **CRITICAL/HIGH risk**: Requires explicit user confirmation before proceeding
- User can force confirmation with `--confirm` flag
- User can skip confirmation with `--auto` flag (use with caution)

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

**Risk Analysis:**
- Dependencies: None (masterpage, no imports)
- Breaking Changes: None (internal refactoring only)
- Risk Level: LOW
- Affected Files: None

**User Confirmation:**
- Plan presented: Fix security issues, optimize structure
- User confirms: "Yes"

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

**Risk Analysis:**
- Dependencies: Check for files importing `episode-manager.ts`
- Breaking Changes: Type changes may affect importers
- Risk Level: MEDIUM (if exported types change)
- Affected Files: Files importing from `episode-manager.ts`

**User Confirmation:**
- Risk Level: MEDIUM → Automatic proceed (no confirmation needed)
- Plan: Replace `any` types, add return types
- Impact: 3 files import this module (will be updated automatically)

**Execution:**
- Apply TypeScript refactoring patterns
- Replace `any` with proper types
- Add explicit return types
- Follow TypeScript best practices
- Update dependent files if needed

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
🔍 File Analysis & Baseline

File: @films.php
Type: CouchCMS Template
Path: Root (masterpage)

Technology Detected:
- CouchCMS tags: <cms:template>, <cms:pages>
- Alpine.js: None detected
- TypeScript: None detected

Baseline Established:
- Current file state: Snapshot created
- Dependencies: None detected
- Test coverage: No test files found

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

⚠️ Risk Analysis & Impact Assessment

Dependencies:
- Files importing this file: None
- Files referencing this file: None

Breaking Changes:
- None detected (internal refactoring only)

Risk Level: LOW
Affected Files: None

Rollback Strategy:
- Baseline snapshot: Created
- Backup location: .backup/films.php.bak
- Git commit: Recommended before proceeding

🔒 Pre-Flight Checks

✅ Security checks: PASSED
✅ Quality checks: PASSED
⚠️  Warnings: 1 (HTML comment security issue on line 23)

⚠️ User Confirmation Required

Execution Plan:
- Fix HTML comment security (line 23)
- Optimize template structure
- Add authentication check
- Improve page query

Risk Level: LOW
Affected Files: None

Please confirm:
A/Yes - Proceed with refactoring
B/Different - Use different approach
C/Modify - Adjust execution plan
D/Info - More information

[User confirms: "Yes"]

🔧 Refactoring Applied

✅ Fixed: HTML comment security (line 23)
✅ Improved: Template structure
✅ Added: Authentication check
✅ Optimized: Page query

📋 Verification

✅ Pre-flight checks: PASSED
✅ Standards compliance: VERIFIED
✅ No regressions detected
✅ Baseline comparison: No unexpected changes
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

### --confirm
Force confirmation even for LOW/MEDIUM risk refactoring:

```
/refactor @assets/ts/user-manager.ts --confirm
```

### --auto
Skip confirmation and proceed automatically (use with caution):

```
/refactor @films.php --auto
```

**Warning:** `--auto` bypasses confirmation even for CRITICAL/HIGH risk. Only use when you're certain about the changes.

## Integration

### With Toolkit Configuration

Uses built-in toolkit configuration for automatic context loading:
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

### With Refactor Router

For best practices, the system uses the **Refactor Router** pattern (`prompts/refactoring/router.md`):
- Analyzes files before routing
- Requires explicit confirmation before execution
- Routes to specialized agents based on file type
- Coordinates multi-file refactoring
- Provides comprehensive risk analysis

**Note:** The router pattern is automatically applied when using `/refactor` command. The router ensures proper risk analysis and user confirmation before proceeding.

## Best Practices

1. **Always tag files** - Use `@file` syntax for automatic detection
2. **Review risk analysis** - Risk assessment is always shown (Phase 2.5)
3. **Automatic for low risk** - LOW/MEDIUM risk refactoring proceeds automatically
4. **Confirm for high risk** - CRITICAL/HIGH risk requires explicit confirmation
5. **Trust auto-detection** - System selects best agents automatically
6. **Review changes** - Always review refactored code before committing
7. **Use --strict for CI** - Enable strict mode in automated checks
8. **Use --confirm when unsure** - Force confirmation if you want to review plan
9. **Use --auto with caution** - Only skip confirmation when certain about changes
10. **Check docs when needed** - Use `--check-docs` for module/agent sync

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

## Safety & Risk Management

### Risk Analysis (Phase 2.5)

Before any refactoring execution, the system performs comprehensive risk analysis:

- **Dependency Mapping**: Identifies all files that depend on the target file
- **Breaking Change Detection**: Flags potential API signature changes
- **Impact Assessment**: Estimates scope of changes across codebase
- **Risk Categorization**: Classifies risk as CRITICAL/HIGH/MEDIUM/LOW
- **Rollback Strategy**: Documents baseline and backup plan

### User Confirmation (Phase 3.5)

**Conditional confirmation** based on risk level:

**Confirmation Required (CRITICAL/HIGH risk):**
- Risk assessment summary is presented
- Execution plan is displayed
- User must explicitly confirm before proceeding
- Options to modify plan or use different approach

**Automatic Proceed (LOW/MEDIUM risk):**
- Risk assessment is displayed for information
- Execution proceeds automatically
- No confirmation needed for low-risk refactoring

**This prevents:**
- Unintended breaking changes (via risk analysis)
- Accidental refactoring of critical files (high risk requires confirmation)
- Changes without understanding impact (risk assessment always shown)
- Loss of work without rollback plan (baseline always created)

**Override Options:**
- `--confirm`: Force confirmation even for LOW/MEDIUM risk
- `--auto`: Skip confirmation even for CRITICAL/HIGH risk (use with caution)

### Baseline & Rollback

- **Baseline Establishment**: Phase 1 creates read-only snapshot
- **Backup Creation**: System recommends backups for critical files
- **Rollback Points**: Identified checkpoints for reverting changes
- **Verification**: Phase 5 compares against baseline

## See Also

- [Refactor File](./refactor-file.md) - Basic file refactoring
- [Refactor Modules](./refactor-modules.md) - Module refactoring workflow
- [Refactor Agents](./refactor-agents.md) - Agent refactoring workflow (includes comprehensive risk analysis)
- [Refactor Toolkit](./refactor-toolkit.md) - Toolkit component refactoring
- [Refactor Router](../prompts/refactoring/router.md) - Detailed routing logic with confirmation workflow
