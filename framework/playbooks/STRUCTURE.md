# Playbook Structure Overview

Complete overview of the modular playbook system.

---

## Directory Structure

```
framework/playbooks/
├── README.md                    # Main playbook overview
├── STRUCTURE.md                 # This file
│
├── request.md                   # Feature/refactoring playbook (main)
├── refresh.md                   # Bug fix playbook (main)
├── retro.md                     # Retrospective playbook (main)
│
├── phases/                      # Request playbook phases
│   ├── README.md
│   ├── orchestration.md         # Phase -1
│   ├── reconnaissance.md        # Phase 0
│   ├── planning.md              # Phase 1
│   ├── execution.md             # Phase 2
│   ├── verification.md          # Phase 3
│   ├── audit.md                 # Phase 4
│   └── report.md                # Phase 5
│
├── refresh-phases/              # Refresh playbook phases
│   ├── README.md
│   ├── baseline.md              # Phase 0
│   ├── isolate.md               # Phase 1
│   ├── analyze.md               # Phase 2
│   ├── remediate.md             # Phase 3
│   ├── verify.md                # Phase 4
│   ├── audit.md                 # Phase 5
│   └── report.md                # Phase 6
│
└── retro-phases/                # Retro playbook phases
    ├── README.md
    ├── context.md               # Phase 0
    ├── success.md               # Phase 1
    ├── failure.md               # Phase 2
    ├── impact.md                # Phase 3
    ├── integration.md           # Phase 4
    ├── propagation.md           # Phase 5
    └── verdict.md               # Phase 6
```

---

## Playbook Comparison

| Aspect | request.md | refresh.md | retro.md |
|--------|-----------|-----------|----------|
| **Purpose** | Feature development | Bug fixing | Learning capture |
| **Phases** | 7 (-1 to 5) | 7 (0 to 6) | 7 (0 to 6) |
| **Duration** | 45-85 min | 20-40 min | 25-50 min |
| **Complexity** | High | Medium | Low |
| **Agent Use** | Multi-agent | Single/few | Reflective |
| **Output** | Working feature | Fixed bug | Updated doctrine |

---

## Phase Patterns

### Common Phase Types

**Context/Baseline (Phase 0):**
- Establish current state
- Gather evidence
- Document starting point

**Analysis (Phase 0-2):**
- Investigate domain
- Identify patterns
- Assess impact

**Planning (Phase 1):**
- Propose strategies
- Resolve dependencies
- Create unified plan

**Execution (Phase 2-3):**
- Implement changes
- Follow protocols
- Verify work

**Verification (Phase 3-5):**
- Test functionality
- Check integration
- Hunt regressions

**Audit (Phase 4-5):**
- Fresh evidence check
- System consistency
- Standards compliance

**Report (Phase 5-6):**
- Document outcomes
- Provide evidence
- Final verdict

---

## Design Principles

### Modularity
- Each phase is self-contained
- Phases can be updated independently
- Clear dependencies between phases

### Simplicity
- Each file focuses on one phase
- Clear, scannable structure
- Minimal cognitive load

### AI Optimization
- Structured for AI parsing
- Clear instructions per phase
- Consistent formatting

### Maintainability
- Easy to update individual phases
- Add new phases without breaking existing
- Clear documentation

### Efficiency
- Load only relevant phases
- Quick navigation
- Focused context

---

## Usage Patterns

### Sequential Execution
Most common pattern - follow phases in order:
```
Phase 0 → Phase 1 → Phase 2 → ... → Final Phase
```

### Selective Execution
For simple tasks, skip unnecessary phases:
```
Phase 0 → Phase 2 → Phase 5 (skip planning/verification)
```

### Iterative Execution
For complex tasks, iterate on phases:
```
Phase 2 → Phase 3 → (issues found) → Phase 2 → Phase 3
```

### Parallel Execution
For multi-agent work, some phases can run in parallel:
```
Phase 2: Agent A + Agent B (parallel)
Phase 3: Integration checkpoint
```

---

## File Naming Conventions

**Main Playbooks:**
- `{purpose}.md` (e.g., `request.md`, `refresh.md`, `retro.md`)
- Lowercase, descriptive names
- Located in `framework/playbooks/`

**Phase Directories:**
- `{playbook}-phases/` (e.g., `phases/`, `refresh-phases/`, `retro-phases/`)
- Plural form for directory name
- Contains README.md + phase files

**Phase Files:**
- `{phase-name}.md` (e.g., `orchestration.md`, `baseline.md`, `context.md`)
- Lowercase, single-word or hyphenated
- Descriptive of phase purpose

**README Files:**
- `README.md` in each directory
- Provides overview and navigation
- Lists all phases with descriptions

---

## Integration Points

**With Operational Doctrine:**
- Playbooks implement doctrine principles
- Doctrine references playbooks
- Mutual reinforcement

**With Smart Operations:**
- Slash commands can trigger playbooks
- Intent detection can select playbook
- Pre-flight checks integrated in execution

**With Agents:**
- Playbooks coordinate agent collaboration
- Agents referenced in phases
- Agent-specific guidance in phases

**With Standards:**
- Playbooks enforce standards
- Standards updated via retro playbook
- Mutual evolution

---

## Maintenance Guidelines

### Adding New Phases

1. Create phase file in appropriate directory
2. Follow naming conventions
3. Update phase directory README
4. Update main playbook file
5. Test with sample scenario

### Updating Existing Phases

1. Edit phase file directly
2. Maintain consistent structure
3. Update examples if needed
4. Test changes
5. Document in CHANGELOG

### Adding New Playbooks

1. Create main playbook file
2. Create phase directory
3. Create phase files
4. Create phase README
5. Update main README
6. Update this STRUCTURE.md

### Deprecating Phases

1. Mark as deprecated in README
2. Provide migration path
3. Keep file for backward compatibility
4. Remove after grace period

---

## Best Practices

**For Playbook Authors:**
- Keep phases focused and concise
- Use consistent formatting
- Provide clear examples
- Document edge cases

**For Playbook Users:**
- Read main playbook first
- Follow phases sequentially
- Adapt to context as needed
- Document deviations

**For Maintainers:**
- Keep structure consistent
- Update all related files
- Test changes thoroughly
- Document breaking changes

---

## Future Enhancements

**Potential Additions:**
- Template playbook for custom workflows
- Phase composition system
- Playbook metrics and analytics
- Interactive playbook selector

**Under Consideration:**
- Conditional phase execution
- Phase dependencies graph
- Automated phase validation
- Playbook versioning system

---

**Last Updated:** 2025-01-28
**Version:** 1.0.0
**Status:** ✅ Production Ready
