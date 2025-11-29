# Playbooks

Structured workflows for different development scenarios.

---

## Available Playbooks

### 🎯 request.md - Feature Request / Refactoring
**Use for:** New features, refactoring, significant changes

**Workflow:** Orchestrate → Reconnaissance → Plan → Execute → Verify → Audit → Report

**Modular Phases:** See `phases/` directory for detailed phase documentation

**Duration:** 45-85 minutes typical

---

### 🔧 refresh.md - Bug Fix / Root Cause Analysis
**Use for:** Debugging persistent issues, root cause analysis

**Workflow:** Baseline → Isolate → Analyze → Remediate → Verify → Audit → Report

**Modular Phases:** See `refresh-phases/` directory for detailed phase documentation

**Duration:** 50-90 minutes typical

---

### 📊 retro.md - Retrospective / Doctrine Evolution
**Use for:** Session reflection, continuous improvement

**Workflow:** Context → Success → Failure → Impact → Integration → Propagation → Verdict

**Modular Phases:** See `retro-phases/` directory for detailed phase documentation

**Duration:** 25-50 minutes for typical retrospective

---

## Quick Selection Guide

**Choose request.md when:**
- Building new features
- Refactoring existing code
- Making significant changes
- Need multi-agent collaboration

**Choose refresh.md when:**
- Fixing bugs
- Debugging issues
- Root cause analysis needed
- Quick fixes required

**Choose retro.md when:**
- Session complete
- Want to capture learnings
- Update standards/doctrine
- Improve processes

---

## Modular Phase System

All three playbooks use modular phase systems for better maintainability:

### Request Phases (Feature Development)
```
phases/
├── orchestration.md       # Phase -1: Select agents
├── reconnaissance.md      # Phase 0: Domain analysis
├── planning.md            # Phase 1: Strategy integration
├── execution.md           # Phase 2: Implementation
├── verification.md        # Phase 3: Testing
├── audit.md               # Phase 4: Fresh audit
└── report.md              # Phase 5: Final report
```

### Refresh Phases (Bug Fixing)
```
refresh-phases/
├── baseline.md            # Phase 0: System baseline
├── isolate.md             # Phase 1: Reproducible test
├── analyze.md             # Phase 2: Root cause analysis
├── remediate.md           # Phase 3: Implement fix
├── verify.md              # Phase 4: Verification
├── audit.md               # Phase 5: Fresh audit
└── report.md              # Phase 6: After-action report
```

### Retro Phases (Retrospectives)
```
retro-phases/
├── context.md             # Phase 0: Session metadata
├── success.md             # Phase 1: Success analysis
├── failure.md             # Phase 2: Failure analysis
├── impact.md              # Phase 3: Impact assessment
├── integration.md         # Phase 4: Doctrine updates
├── propagation.md         # Phase 5: Sync configs
└── verdict.md             # Phase 6: Final assessment
```

**Benefits:**
- ✅ Simple and focused
- ✅ Easy to update
- ✅ AI-optimized structure
- ✅ Reusable components
- ✅ Clear progression

---

## Integration

**Playbooks integrate with:**
- Operational Doctrine: `framework/doctrine/operational-doctrine.md`
- Smart Operations: `framework/enhancements/smart-operations.md`
- Available Agents: `AGENTS.md` (23 specialized agents)
- Project Standards: `docs/standards.md`

---

## Usage Tips

**For Simple Tasks:**
- Use simplified workflow
- Skip unnecessary phases
- Focus on essentials

**For Complex Tasks:**
- Follow all phases
- Add extra checkpoints
- Document thoroughly

**For Critical Tasks:**
- Never skip verification
- Add extra testing
- Document all decisions

---

**Ready to start? Choose your playbook above.**
