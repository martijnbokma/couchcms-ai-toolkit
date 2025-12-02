# Prompts Map Optimization & Expansion Plan

**Based on:** Anthropic Claude Skills System, Claude Code best practices, and Anthropic Cookbook patterns

---

## 🎯 Executive Summary

This plan outlines how to expand and optimize the `prompts/` directory to:
1. **Improve discoverability** through progressive disclosure patterns
2. **Enhance reusability** with modular, composable prompts
3. **Add evaluation frameworks** for prompt quality assurance
4. **Support advanced workflows** like multi-agent collaboration
5. **Enable framework-specific extensions** without cluttering base prompts

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
│   │   ├── couchcms-errors.md
│   │   └── alpinejs-errors.md
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
│   └── deployment.md           # Deployment checklist
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
└── templates/                   # NEW: Prompt templates
    ├── README.md               # Template usage guide
    ├── specialist-template.md  # Template for creating specialists
    ├── workflow-template.md    # Template for workflows
    ├── validator-template.md   # Template for validators
    └── agent-template.md       # Template for agent prompts
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

### High Priority

1. **`prompts/best-practices/prompt-engineering.md`**
   - How to write effective prompts
   - Claude-specific best practices
   - Common anti-patterns
   - Token optimization tips

2. **`prompts/debugging/workflow.md`**
   - Systematic debugging process
   - Step-by-step methodology
   - Decision trees
   - Escalation paths

3. **`prompts/workflows/feature-development.md`**
   - Complete feature dev lifecycle
   - Phase-by-phase guidance
   - Quality gates
   - Integration points

4. **`prompts/evaluation/quality-metrics.md`**
   - How to measure prompt effectiveness
   - Success criteria
   - Metrics to track
   - Improvement strategies

5. **`prompts/collaboration/handoff-protocol.md`**
   - Agent-to-agent communication
   - Context preservation
   - State management
   - Error handling

### Medium Priority

6. **`prompts/refactoring/patterns/extract-component.md`**
   - Component extraction workflow
   - Dependency analysis
   - Interface design
   - Testing strategy

7. **`prompts/debugging/patterns/javascript-errors.md`**
   - Common JS error patterns
   - Quick diagnosis
   - Fix strategies
   - Prevention tips

8. **`prompts/workflows/code-review.md`**
   - Review checklist
   - Quality gates
   - Feedback patterns
   - Approval criteria

9. **`prompts/templates/specialist-template.md`**
   - Standard specialist structure
   - Required sections
   - Best practices
   - Examples

10. **`prompts/evaluation/test-cases.md`**
    - Creating test cases for prompts
    - Edge cases
    - Regression scenarios
    - Performance benchmarks

---

## 🔧 Optimization Strategies

### 1. Token Efficiency

**Current:** Full prompts loaded even when only part is needed
**Optimization:**
- Use README.md as navigation hubs
- Split large prompts into focused sub-prompts
- Use progressive disclosure (load on demand)
- Implement prompt versioning (short vs. detailed)

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
   - Prompts can reference agents
   - Agents can load prompts dynamically
   - Create agent-specific prompt variants

2. **Modules** (`modules/*.md`)
   - Module-specific prompts in `debugging/framework/[module]/`
   - Module patterns in `refactoring/patterns/[module]/`

3. **Rules** (`rules/*.mdc`)
   - Auto-load prompts based on file patterns
   - Extend to workflow detection
   - Add prompt-specific rules

4. **Commands** (`commands/*.md`)
   - Commands can load workflow prompts
   - Create command-specific prompt sets

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

### Phase 1: Foundation (Week 1-2)
- [ ] Create README.md navigation hubs for each category
- [ ] Implement progressive disclosure pattern
- [ ] Add `workflows/` category with 3 core workflows
- [ ] Create `templates/` category with specialist template

### Phase 2: Expansion (Week 3-4)
- [ ] Add `collaboration/` category
- [ ] Create `evaluation/` framework
- [ ] Add `refactoring/patterns/` subdirectory
- [ ] Create `debugging/patterns/` subdirectory

### Phase 3: Optimization (Week 5-6)
- [ ] Implement token-efficient loading
- [ ] Add prompt versioning system
- [ ] Create evaluation test suite
- [ ] Document best practices

### Phase 4: Integration (Week 7-8)
- [ ] Integrate with agents system
- [ ] Connect to module system
- [ ] Enhance rules auto-loading
- [ ] Update documentation

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

### Qualitative
- Improved discoverability
- Better reusability
- Clearer workflows
- Enhanced collaboration

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

## 📚 References

- [Anthropic Skills System](https://github.com/anthropics/skills)
- [Claude Code Documentation](https://github.com/anthropics/claude-code)
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook)
- [Prompt Engineering Best Practices](https://docs.anthropic.com/claude/docs/prompt-engineering)

---

**Next Steps:**
1. Review and approve this plan
2. Prioritize features
3. Create implementation tickets
4. Begin Phase 1 implementation
