# Prompts Map Optimization & Expansion Plan

**Based on:** Anthropic Claude Skills System, Claude Code best practices, Anthropic Cookbook patterns, and **CouchCMS-specific workflows**

**Focus:** Optimize prompts specifically for CouchCMS development workflows across all supported editors (Cursor, Claude Code, GitHub Copilot, Windsurf, Kiro, Zed, VS Code AI Toolkit, Tabnine, CodeWhisperer, Antigravity, Jules, Roo Code, Generic Agent)

---

## 🎯 Executive Summary

This plan outlines how to expand and optimize the `prompts/` directory to:
1. **Improve discoverability** through progressive disclosure patterns
2. **Enhance reusability** with modular, composable prompts
3. **Add evaluation frameworks** for prompt quality assurance
4. **Support advanced workflows** like multi-agent collaboration
5. **Enable framework-specific extensions** without cluttering base prompts
6. **Optimize for CouchCMS** - Templates, DataBound Forms, Views, Relationships, etc.
7. **Editor-agnostic patterns** - Work seamlessly across all 13 supported editors

---

## 📊 Current State Analysis

### Strengths ✅
- Clear categorization (best-practices, debugging, validators, refactoring)
- Standards-aware (references `standards.md`)
- Framework-agnostic base prompts
- Good validation framework exists

### Gaps 🔍
- No progressive disclosure (all content loaded at once)
- Limited evaluation/testing infrastructure
- Missing workflow orchestration prompts
- No multi-agent collaboration patterns
- Framework-specific prompts not well organized
- No prompt versioning or changelog system

---

## 🚀 Expansion Strategy

### 1. Progressive Disclosure Structure

**Inspired by:** Claude Skills System progressive disclosure patterns

#### New Structure:
```
prompts/
├── README.md                    # Navigation hub with quick links
├── best-practices/              # Coding best practices
│   ├── README.md               # Index + quick reference
│   ├── claude-code-best-practices.md
│   ├── javascript-best-practices.md
│   ├── typescript-best-practices.md
│   ├── performance-best-practices.md
│   ├── security-best-practices.md
│   ├── toolkit-optimization.md
│   └── prompt-engineering.md  # NEW: How to write effective prompts
│
├── debugging/                   # Debug and troubleshoot
│   ├── README.md               # Debugging workflow overview
│   ├── specialist.md           # General debugging specialist
│   ├── workflow.md              # NEW: Systematic debugging workflow
│   ├── patterns/               # NEW: Common error patterns
│   │   ├── javascript-errors.md
│   │   ├── typescript-errors.md
│   │   ├── couchcms-errors.md  # CouchCMS-specific: template parsing, editable regions, etc.
│   │   ├── alpinejs-errors.md  # Alpine.js + CouchCMS integration issues
│   │   ├── databound-forms-errors.md  # DataBound Forms debugging
│   │   └── template-inheritance-errors.md  # Template extends/block issues
│   ├── couchcms/               # NEW: CouchCMS-specific debugging
│   │   ├── template-debugging.md  # Template syntax, editable regions
│   │   ├── cms-tag-debugging.md   # <cms:tag> parsing issues
│   │   ├── form-debugging.md      # DataBound Forms issues
│   │   ├── view-debugging.md      # List View, Page View, Folder View
│   │   └── relationship-debugging.md  # Page relationships
│   └── framework/              # Framework-specific debugging
│       ├── README.md
│       └── [framework-name]/   # Progressive loading
│
├── validators/                  # Code validation
│   ├── README.md               # Validation workflow
│   ├── design.md
│   ├── links.md
│   ├── prompts.md
│   ├── responsive.md
│   ├── standards.md
│   └── evaluation/             # NEW: Prompt evaluation framework
│       ├── quality-scoring.md
│       ├── effectiveness-testing.md
│       └── a-b-testing.md
│
├── refactoring/                 # Refactoring guides
│   ├── README.md               # Refactoring decision tree
│   ├── router.md               # Intelligent routing
│   ├── design-preserving.md
│   ├── functionality-preserving.md
│   ├── toolkit.md
│   └── patterns/               # NEW: Refactoring patterns library
│       ├── extract-component.md
│       ├── consolidate-duplication.md
│       ├── improve-naming.md
│       └── optimize-performance.md
│
├── workflows/                   # NEW: Multi-step workflows
│   ├── README.md               # Workflow orchestration guide
│   ├── feature-development.md  # Complete feature dev workflow
│   ├── bug-fix-workflow.md     # Systematic bug fixing
│   ├── code-review.md          # Review workflow
│   ├── testing.md              # Testing workflow
│   ├── deployment.md           # Deployment checklist
│   └── couchcms/               # NEW: CouchCMS-specific workflows
│       ├── template-creation.md         # Create new CouchCMS template
│       ├── databound-form-workflow.md   # Create/edit DataBound Form
│       ├── view-setup.md                # Set up List/Page/Folder View
│       ├── relationship-setup.md        # Configure page relationships
│       ├── repeatable-region-setup.md    # Set up repeatable regions
│       ├── custom-route-setup.md        # Configure custom routes
│       ├── archive-setup.md             # Set up archive views
│       └── content-migration.md         # Migrate content between templates
│
├── collaboration/               # NEW: Multi-agent patterns
│   ├── README.md               # Collaboration patterns
│   ├── handoff-protocol.md     # Agent-to-agent handoff
│   ├── parallel-execution.md   # Running multiple agents
│   └── conflict-resolution.md  # Resolving agent conflicts
│
├── evaluation/                  # NEW: Prompt evaluation & testing
│   ├── README.md               # Evaluation framework overview
│   ├── quality-metrics.md      # How to measure prompt quality
│   ├── test-cases.md           # Creating test cases
│   ├── regression-testing.md   # Testing prompt changes
│   └── benchmarks.md           # Performance benchmarks
│
├── editors/                     # NEW: Editor-specific prompt patterns
│   ├── README.md               # Editor capabilities comparison
│   ├── cursor.md               # Cursor IDE specific patterns
│   ├── claude-code.md          # Claude Code CLI patterns
│   ├── copilot.md              # GitHub Copilot patterns
│   ├── windsurf.md             # Windsurf IDE patterns
│   ├── kiro.md                 # Amazon Kiro patterns
│   ├── vscode-ai.md            # VS Code AI Toolkit patterns
│   └── universal.md            # Patterns that work across all editors
│
└── templates/                   # NEW: Prompt templates
    ├── README.md               # Template usage guide
    ├── specialist-template.md  # Template for creating specialists
    ├── workflow-template.md    # Template for workflows
    ├── validator-template.md  # Template for validators
    ├── agent-template.md       # Template for agent prompts
    └── couchcms-template.md    # Template for CouchCMS-specific prompts
```

---

## 🎨 Key Improvements

### 1. Progressive Disclosure Pattern

**Problem:** All prompt content loads at once, wasting tokens
**Solution:** Use README.md files as navigation hubs that load only what's needed

**Example:**
```markdown
# Debugging Prompts

## Quick Start
- **General debugging**: `@prompts/debugging/specialist.md`
- **Systematic workflow**: `@prompts/debugging/workflow.md`

## Error Patterns
Load only the pattern you need:
- JavaScript errors: `@prompts/debugging/patterns/javascript-errors.md`
- TypeScript errors: `@prompts/debugging/patterns/typescript-errors.md`
- CouchCMS errors: `@prompts/debugging/patterns/couchcms-errors.md`
```

### 2. Workflow Orchestration

**New Category:** `workflows/` for multi-step processes

**Example:** `workflows/feature-development.md`
```markdown
# Feature Development Workflow

## Phase 1: Planning
1. Load: `@prompts/workflows/planning.md`
2. Analyze requirements
3. Create task breakdown

## Phase 2: Implementation
1. Load: `@prompts/refactoring/router.md` (if refactoring)
2. Load: `@prompts/best-practices/[relevant].md`
3. Implement feature

## Phase 3: Validation
1. Load: `@prompts/validators/standards.md`
2. Run validation checks
3. Fix issues

## Phase 4: Testing
1. Load: `@prompts/workflows/testing.md`
2. Write tests
3. Verify functionality
```

### 3. Evaluation Framework

**New Category:** `evaluation/` for prompt quality assurance

**Key Features:**
- Quality scoring system (already exists in `validators/prompts.md`, expand it)
- Effectiveness testing
- A/B testing framework
- Regression testing for prompt changes

### 4. Collaboration Patterns

**New Category:** `collaboration/` for multi-agent scenarios

**Use Cases:**
- Handoff between specialists
- Parallel agent execution
- Conflict resolution when agents disagree

### 5. Prompt Templates

**New Category:** `templates/` for consistent prompt creation

**Benefits:**
- Standardized structure
- Quality assurance built-in
- Faster prompt creation
- Consistent patterns across toolkit

---

## 📝 New Prompt Files to Create

### High Priority (CouchCMS-Focused)

1. **`prompts/workflows/couchcms/template-creation.md`** ⭐ **CRITICAL**
   - Complete CouchCMS template creation workflow
   - Template inheritance patterns (`<cms:extends>`, `<cms:block>`)
   - Editable regions setup (`<cms:editable>`)
   - Security best practices (HTML comments, self-closing tags)
   - Works across all editors (Cursor, Claude Code, Copilot, etc.)

2. **`prompts/workflows/couchcms/databound-form-workflow.md`** ⭐ **CRITICAL**
   - Create/edit DataBound Forms workflow
   - Form field configuration
   - Validation patterns
   - CRUD operations
   - Editor-agnostic patterns

3. **`prompts/debugging/couchcms/template-debugging.md`** ⭐ **CRITICAL**
   - CouchCMS template parsing errors
   - `<cms:tag>` syntax issues
   - Template inheritance problems
   - Editable region conflicts
   - Common CouchCMS error patterns

4. **`prompts/best-practices/couchcms-security.md`** ⭐ **CRITICAL**
   - HTML comment security (`<cms:` vs `[cms:`)
   - Self-closing tag patterns (`<cms:else />`)
   - Authentication patterns
   - CSRF protection
   - Input sanitization

5. **`prompts/refactoring/couchcms/template-refactoring.md`**
   - Refactor template inheritance
   - Extract reusable blocks
   - Consolidate editable regions
   - Optimize template structure

### High Priority (General)

6. **`prompts/best-practices/prompt-engineering.md`**
   - How to write effective prompts
   - Editor-specific best practices (Cursor, Claude Code, Copilot, etc.)
   - Common anti-patterns
   - Token optimization tips

7. **`prompts/debugging/workflow.md`**
   - Systematic debugging process
   - Step-by-step methodology
   - Decision trees
   - Escalation paths

8. **`prompts/workflows/feature-development.md`**
   - Complete feature dev lifecycle
   - Phase-by-phase guidance
   - Quality gates
   - Integration points
   - CouchCMS-specific phases (template setup, CMS configuration)

9. **`prompts/evaluation/quality-metrics.md`**
   - How to measure prompt effectiveness
   - Success criteria
   - Metrics to track
   - Improvement strategies

10. **`prompts/collaboration/handoff-protocol.md`**
    - Agent-to-agent communication
    - Context preservation
    - State management
    - Error handling

### Medium Priority (CouchCMS-Focused)

11. **`prompts/workflows/couchcms/view-setup.md`**
    - List View setup workflow
    - Page View configuration
    - Folder View setup
    - Archive View configuration
    - Editor-specific patterns

12. **`prompts/workflows/couchcms/relationship-setup.md`**
    - One-to-one relationships
    - One-to-many relationships
    - Many-to-many relationships
    - Related content queries

13. **`prompts/workflows/couchcms/repeatable-region-setup.md`**
    - Repeatable regions configuration
    - Dynamic content blocks
    - Portfolio patterns
    - Image gallery setup

14. **`prompts/debugging/couchcms/form-debugging.md`**
    - DataBound Forms errors
    - Form validation issues
    - Submission problems
    - Field configuration errors

15. **`prompts/refactoring/couchcms/editable-regions.md`**
    - Refactor editable regions
    - Consolidate duplicate fields
    - Optimize field types
    - Improve field organization

### Medium Priority (General)

16. **`prompts/refactoring/patterns/extract-component.md`**
    - Component extraction workflow
    - Dependency analysis
    - Interface design
    - Testing strategy

17. **`prompts/debugging/patterns/javascript-errors.md`**
    - Common JS error patterns
    - Quick diagnosis
    - Fix strategies
    - Prevention tips

18. **`prompts/workflows/code-review.md`**
    - Review checklist
    - Quality gates
    - Feedback patterns
    - Approval criteria
    - CouchCMS-specific checks

19. **`prompts/templates/specialist-template.md`**
    - Standard specialist structure
    - Required sections
    - Best practices
    - Examples
    - CouchCMS-specific sections

20. **`prompts/evaluation/test-cases.md`**
    - Creating test cases for prompts
    - Edge cases
    - Regression scenarios
    - Performance benchmarks
    - CouchCMS-specific test cases

---

## 🔧 Optimization Strategies

### 1. CouchCMS-First Optimization

**Principle:** All prompts prioritize CouchCMS workflows and patterns

**Strategies:**
- **CouchCMS patterns first**: Lead with CouchCMS-specific guidance
- **Editor-agnostic core**: Base prompts work across all 13 editors
- **Editor-specific extensions**: Add editor capabilities as extensions, not replacements
- **Template-aware**: Prompts understand CouchCMS template structure
- **CMS-aware**: Prompts understand CouchCMS data patterns (pages, folders, relationships)

**Example:**
```markdown
# Template Creation Workflow

## CouchCMS-Specific Steps (Universal)
1. Create template file (`*.php`)
2. Add `<cms:extends>` for layout inheritance
3. Define `<cms:block 'templates'>` for template config
4. Add `<cms:editable>` regions
5. Implement `<cms:block 'content'>` for page content

## Editor-Specific Enhancements
- **Cursor**: Auto-loads `refactor-html.mdc` when editing `.php` files
- **Claude Code**: Uses `couchcms-core` skill automatically
- **Copilot**: Reads CouchCMS patterns from instructions
```

### 2. Token Efficiency

**Current:** Full prompts loaded even when only part is needed
**Optimization:**
- Use README.md as navigation hubs
- Split large prompts into focused sub-prompts
- Use progressive disclosure (load on demand)
- Implement prompt versioning (short vs. detailed)
- **CouchCMS-specific**: Load only relevant CouchCMS patterns (templates vs. forms vs. views)

**Example:**
```markdown
# Refactoring Router (Quick Reference)

For full details, see:
- Detailed routing logic: `@prompts/refactoring/router-detailed.md`
- Examples: `@prompts/refactoring/router-examples.md`
- Troubleshooting: `@prompts/refactoring/router-troubleshooting.md`

## Quick Decision Tree
[Condensed version here]
```

### 2. Modular Composition

**Pattern:** Build complex prompts from simple building blocks

**Example:**
```markdown
# Feature Development Workflow

## Step 1: Planning
Load: `@prompts/workflows/planning.md`

## Step 2: Implementation
Load: `@prompts/workflows/implementation.md`
If refactoring: Also load `@prompts/refactoring/router.md`

## Step 3: Validation
Load: `@prompts/validators/standards.md`
Load: `@prompts/validators/design.md` (if UI changes)
```

### 3. Context-Aware Loading

**Pattern:** Load prompts based on file type or project context

**Implementation:**
- Auto-load prompts based on file patterns (already done in `.mdc` rules)
- Extend to workflow detection
- Add project-type-specific prompts

### 4. Versioning System

**Pattern:** Maintain prompt versions for compatibility

**Structure:**
```
prompts/
├── v1/              # Legacy prompts
├── v2/              # Current prompts
└── CHANGELOG.md     # Version history
```

---

## 📚 Integration Points

### With Existing Toolkit Components

1. **Agents** (`agents/*.md`)
   - Prompts can reference agents (`@couchcms`, `@databound-forms`, etc.)
   - Agents can load prompts dynamically
   - Create agent-specific prompt variants
   - **CouchCMS agents**: `@couchcms`, `@databound-forms`, `@views`, `@folders`, etc.

2. **Modules** (`modules/*.md`)
   - Module-specific prompts in `debugging/framework/[module]/`
   - Module patterns in `refactoring/patterns/[module]/`
   - **CouchCMS modules**: `couchcms-core`, `databound-forms`, `custom-routes`, etc.
   - Prompts reference module knowledge automatically

3. **Rules** (`rules/*.mdc`)
   - Auto-load prompts based on file patterns
   - Extend to workflow detection
   - Add prompt-specific rules
   - **CouchCMS rules**: Auto-load when editing `.php` or `snippets/**/*.html`

4. **Commands** (`commands/*.md`)
   - Commands can load workflow prompts
   - Create command-specific prompt sets
   - **CouchCMS commands**: `/create-template`, `/create-form`, `/create-view`

5. **Editors** (13 supported editors)
   - **Editor-specific prompts**: `prompts/editors/[editor].md`
   - **Universal patterns**: `prompts/editors/universal.md`
   - **Editor capabilities**: Each editor has unique features (Cursor MDC, Claude Code skills, etc.)
   - **Cross-editor compatibility**: Prompts work across all editors with editor-specific enhancements

---

## 🧪 Evaluation & Testing

### Quality Metrics

1. **Clarity Score** (0-100)
   - Ambiguity detection
   - Specificity measurement
   - Terminology consistency

2. **Completeness Score** (0-100)
   - Required sections present
   - Missing information detection
   - Example coverage

3. **Actionability Score** (0-100)
   - Executable steps
   - Verifiable outcomes
   - Dependency clarity

4. **Effectiveness Score** (0-100)
   - Success rate in practice
   - User satisfaction
   - Error reduction

### Testing Framework

**Create:** `prompts/evaluation/test-cases.md`

**Structure:**
```markdown
# Test Cases for Prompts

## Test Case Template
- **Prompt:** [name]
- **Input:** [scenario]
- **Expected Output:** [result]
- **Success Criteria:** [metrics]
- **Edge Cases:** [list]

## Regression Tests
- Test prompt changes don't break existing workflows
- Verify backward compatibility
- Check performance impact
```

---

## 🎯 Implementation Roadmap

### Phase 1: CouchCMS Foundation (Week 1-2) ⭐ **PRIORITY**
- [ ] Create CouchCMS-specific workflow prompts
  - [ ] `prompts/workflows/couchcms/template-creation.md`
  - [ ] `prompts/workflows/couchcms/databound-form-workflow.md`
  - [ ] `prompts/workflows/couchcms/view-setup.md`
- [ ] Create CouchCMS debugging prompts
  - [ ] `prompts/debugging/couchcms/template-debugging.md`
  - [ ] `prompts/debugging/couchcms/form-debugging.md`
- [ ] Create CouchCMS security best practices
  - [ ] `prompts/best-practices/couchcms-security.md`
- [ ] Create README.md navigation hubs for each category
- [ ] Implement progressive disclosure pattern

### Phase 2: Editor Integration (Week 3-4)
- [ ] Create `editors/` category with editor-specific patterns
  - [ ] `prompts/editors/cursor.md` - Cursor MDC patterns
  - [ ] `prompts/editors/claude-code.md` - Claude Code skills patterns
  - [ ] `prompts/editors/copilot.md` - GitHub Copilot patterns
  - [ ] `prompts/editors/universal.md` - Cross-editor patterns
- [ ] Document editor capabilities and differences
- [ ] Create editor-specific CouchCMS workflow variants
- [ ] Test prompts across all 13 supported editors

### Phase 3: Expansion (Week 5-6)
- [ ] Add `collaboration/` category
- [ ] Create `evaluation/` framework
- [ ] Add `refactoring/patterns/` subdirectory
- [ ] Create `debugging/patterns/` subdirectory
- [ ] Add CouchCMS refactoring patterns
  - [ ] `prompts/refactoring/couchcms/template-refactoring.md`
  - [ ] `prompts/refactoring/couchcms/editable-regions.md`
  - [ ] `prompts/refactoring/couchcms/repeatable-regions.md`

### Phase 4: Optimization (Week 7-8)
- [ ] Implement token-efficient loading
- [ ] Add prompt versioning system
- [ ] Create evaluation test suite
- [ ] Document best practices
- [ ] Optimize CouchCMS prompts for token efficiency

### Phase 5: Integration (Week 9-10)
- [ ] Integrate with agents system (`@couchcms`, `@databound-forms`, etc.)
- [ ] Connect to module system (CouchCMS modules)
- [ ] Enhance rules auto-loading (CouchCMS file patterns)
- [ ] Update documentation
- [ ] Create CouchCMS-specific prompt templates

---

## 📖 Documentation Updates

### Update `prompts/README.md`

Add sections:
- Progressive disclosure guide
- Workflow orchestration
- Evaluation framework
- Collaboration patterns
- Template usage

### Create `docs/PROMPTS-GUIDE.md`

Complete guide covering:
- Prompt structure best practices
- When to use which prompt
- How to create new prompts
- Evaluation and testing
- Integration with toolkit

---

## 🔍 Success Metrics

### Quantitative
- Token usage reduction (target: 30-40%)
- Prompt load time (target: <2s)
- Success rate improvement (target: +15%)
- User satisfaction score (target: >85%)
- **CouchCMS-specific:**
  - Template creation time reduction (target: -50%)
  - CouchCMS error resolution time (target: -40%)
  - DataBound Form setup time (target: -60%)

### Qualitative
- Improved discoverability
- Better reusability
- Clearer workflows
- Enhanced collaboration
- **CouchCMS-specific:**
  - Faster CouchCMS development workflows
  - Better CouchCMS pattern recognition
  - Reduced CouchCMS-specific errors
  - Improved editor compatibility for CouchCMS

---

## 🚨 Risks & Mitigations

### Risk 1: Over-complexity
**Mitigation:** Start simple, add complexity gradually. Use progressive disclosure.

### Risk 2: Breaking Changes
**Mitigation:** Implement versioning system. Maintain backward compatibility.

### Risk 3: Maintenance Burden
**Mitigation:** Automate testing. Use templates. Document clearly.

### Risk 4: Token Overhead
**Mitigation:** Use progressive loading. Split large prompts. Optimize content.

---

## 🎯 CouchCMS-Specific Priorities

### Core CouchCMS Workflows (Must-Have)

1. **Template Creation** - Most common task
   - Template structure (`<cms:extends>`, `<cms:block>`)
   - Editable regions (`<cms:editable>`)
   - Security patterns (HTML comments, self-closing tags)
   - Works across all editors

2. **DataBound Forms** - Complex but essential
   - Form creation workflow
   - Field configuration
   - CRUD operations
   - Validation patterns

3. **Views Setup** - Common requirement
   - List View, Page View, Folder View
   - Archive View configuration
   - Query patterns

4. **Debugging** - Critical for productivity
   - Template parsing errors
   - Form submission issues
   - CMS tag syntax errors
   - Template inheritance problems

### Editor-Specific Considerations

**All prompts must:**
- Work with Cursor (MDC rules)
- Work with Claude Code (Skills)
- Work with GitHub Copilot (Instructions)
- Work with Windsurf, Kiro, Zed, VS Code AI Toolkit, Tabnine, CodeWhisperer, Antigravity, Jules, Roo Code, Generic Agent
- Provide editor-specific enhancements where beneficial

**Editor capabilities:**

| Editor | Config Format | Key Features | CouchCMS Integration |
|--------|--------------|--------------|---------------------|
| **Cursor** | `.cursorrules`, `.cursor/rules/*.mdc` | MDC rules auto-load, context-aware | Auto-loads `refactor-html.mdc` for `.php` files |
| **Claude Code** | `CLAUDE.md`, `.claude/skills/*.md` | Skills system, hooks, permissions | `couchcms-core` skill auto-activates |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Instruction-based, inline suggestions | Reads CouchCMS patterns from instructions |
| **Windsurf** | `.windsurf/rules.md` | Rule-based, similar to Cursor | Similar MDC-like patterns |
| **Kiro** | `.kiro/steering/*.md` | Steering files, rule-based | CouchCMS patterns in steering files |
| **Zed** | `.rules` | Rule-based editor | Similar to Cursor patterns |
| **VS Code AI Toolkit** | `.vscode/ai-toolkit.md` | Extension-based | Similar to Cursor patterns |
| **Tabnine** | `.tabnine/settings.json` | JSON config | CouchCMS patterns in config |
| **CodeWhisperer** | `.codewhisperer/settings.json` | JSON config | CouchCMS patterns in config |
| **Antigravity** | `.antigravity/rules.md` | Rule-based | Similar to Cursor patterns |
| **Jules** | `.jules/rules.md` | Rule-based | Similar to Cursor patterns |
| **Roo Code** | `.roocode/rules.md` | Rule-based | Similar to Cursor patterns |
| **Generic Agent** | `AGENT.md` | Markdown instructions | Universal patterns |

**Editor-Agnostic Pattern:**
```markdown
# CouchCMS Template Creation (Universal)

## Core Steps (All Editors)
1. Create template file (`*.php`)
2. Add `<cms:extends>` for layout inheritance
3. Define `<cms:block 'templates'>` for template config
4. Add `<cms:editable>` regions
5. Implement `<cms:block 'content'>` for page content

## Editor-Specific Enhancements
- **Cursor**: Auto-loads `refactor-html.mdc` when editing `.php` files
- **Claude Code**: Uses `couchcms-core` skill automatically
- **Copilot**: Reads CouchCMS patterns from `.github/copilot-instructions.md`
- **Windsurf/Kiro**: Similar to Cursor, uses rule files
- **All editors**: Can reference `@prompts/workflows/couchcms/template-creation.md`
```

---

## 📚 References

- [Anthropic Skills System](https://github.com/anthropics/skills)
- [Claude Code Documentation](https://github.com/anthropics/claude-code)
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook)
- [Prompt Engineering Best Practices](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [CouchCMS Documentation](https://www.couchcms.com/docs/)
- [CouchCMS AI Toolkit Modules](../modules/)

---

## 🚀 Quick Start: CouchCMS Prompts

### For Template Creation
```
@prompts/workflows/couchcms/template-creation.md Create a blog post template
```

### For DataBound Forms
```
@prompts/workflows/couchcms/databound-form-workflow.md Create a contact form
```

### For Debugging
```
@prompts/debugging/couchcms/template-debugging.md Debug this template error
```

### For Refactoring
```
@prompts/refactoring/couchcms/template-refactoring.md Refactor this template
```

---

## 📋 Editor Integration Matrix

### How Prompts Work Across Editors

| Prompt Type | Cursor | Claude Code | Copilot | Windsurf | Kiro | Others |
|------------|--------|-------------|---------|----------|------|--------|
| **Workflow Prompts** | ✅ Via MDC rules | ✅ Via Skills | ✅ Via Instructions | ✅ Via Rules | ✅ Via Steering | ✅ Via Rules/Instructions |
| **Debugging Prompts** | ✅ Auto-load | ✅ Skill activation | ✅ Instruction reference | ✅ Rule reference | ✅ Steering reference | ✅ Rule reference |
| **Refactoring Prompts** | ✅ MDC auto-load | ✅ Skill reference | ✅ Instruction reference | ✅ Rule reference | ✅ Steering reference | ✅ Rule reference |
| **Best Practices** | ✅ MDC rules | ✅ Skills | ✅ Instructions | ✅ Rules | ✅ Steering | ✅ Rules/Instructions |

### CouchCMS-Specific Integration

**All CouchCMS prompts:**
- Work universally across all 13 editors
- Provide editor-specific enhancements where beneficial
- Reference toolkit agents (`@couchcms`, `@databound-forms`, etc.)
- Use toolkit modules (`couchcms-core`, `databound-forms`, etc.)
- Follow toolkit standards (`standards.md`)

**Example Integration:**
```markdown
# Template Creation Workflow

## Universal Steps (All Editors)
[Core CouchCMS workflow steps]

## Cursor-Specific
- Auto-loads `refactor-html.mdc` when editing `.php` files
- Uses MDC rules for context-aware assistance

## Claude Code-Specific
- Activates `couchcms-core` skill automatically
- Uses hooks for pre-flight checks

## Copilot-Specific
- Reads from `.github/copilot-instructions.md`
- Provides inline suggestions

## All Editors
- Can reference: `@prompts/workflows/couchcms/template-creation.md`
- Can use agents: `@couchcms help with template`
- Can reference modules: `modules/couchcms-core.md`
```

---

## 🎯 Toolkit Mission Alignment

**Toolkit Goal:** Make CouchCMS development faster and more efficient without unnecessary complications

**How Prompts Support This:**

1. **Faster Development**
   - Pre-built workflows for common tasks (template creation, forms, views)
   - Quick access to CouchCMS patterns
   - Reduced learning curve

2. **Fewer Errors**
   - CouchCMS-specific debugging prompts
   - Security best practices built-in
   - Template syntax validation

3. **Better Consistency**
   - Standardized workflows across team
   - Editor-agnostic patterns
   - Toolkit standards enforcement

4. **Editor Flexibility**
   - Works with user's preferred editor
   - No vendor lock-in
   - Consistent experience across editors

---

**Next Steps:**
1. ✅ Review and approve this plan
2. ⏭️ Prioritize CouchCMS workflows (Phase 1)
3. ⏭️ Create implementation tickets
4. ⏭️ Begin Phase 1 implementation (CouchCMS Foundation)
