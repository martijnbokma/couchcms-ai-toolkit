# Duplicate Process Descriptions - Resolution Strategy

## Overview

Audit found 22 duplicate processes across 32 files. This creates maintenance burden and risk of processes diverging over time.

## Most Common Duplicates

### 1. "Run sync script" (6 files)
**Appears in:**
- EDITOR-QUICK-REFERENCE.md
- EDITOR-SUPPORT.md (4 times)

**Strategy**: Create a reusable reference section

### 2. "Edit standards.md" (3 files)
**Appears in:**
- EDITOR-SUPPORT.md (3 times)

**Strategy**: Consolidate into single section with cross-references

### 3. "Restart Claude Code" (3 files)
**Appears in:**
- EDITOR-SUPPORT.md (3 times)

**Strategy**: Create troubleshooting reference

## Resolution Approaches

### Approach 1: Cross-Reference (Recommended)
**When to use**: Process is detailed and appears in multiple contexts

**Example**:
```markdown
<!-- In EDITOR-SUPPORT.md -->
## Syncing Configuration

To sync your configuration:
1. Edit `standards.md`
2. Run `bun ai-toolkit-shared/scripts/sync.js`
3. Restart your editor

📖 See [Commands Reference](COMMANDS.md#sync) for details.

<!-- In other files -->
After making changes, sync your configuration. See [Syncing Configuration](EDITOR-SUPPORT.md#syncing-configuration).
```

### Approach 2: Consolidate
**When to use**: Process appears multiple times in same file

**Example**:
```markdown
<!-- Instead of repeating 3 times -->
## Common Steps

### Editing Configuration
1. Open `standards.md`
2. Make your changes
3. Save the file

### Syncing Changes
1. Run `bun ai-toolkit-shared/scripts/sync.js`
2. Verify generated files

<!-- Then reference -->
After setup, follow [Common Steps](#common-steps) to configure.
```

### Approach 3: Include Snippets
**When to use**: Very short, frequently repeated steps

**Example**:
```markdown
<!-- Create a "Quick Reference" section -->
## Quick Reference

**Sync**: `bun ai-toolkit-shared/scripts/sync.js`  
**Validate**: `bun ai-toolkit-shared/scripts/validate.js`  
**Restart Claude**: Cmd+Shift+P → "Reload Window"

<!-- Then reference -->
After changes, run **Sync** (see [Quick Reference](#quick-reference)).
```

## Implementation Plan

### Phase 1: Identify Patterns

Group duplicates by:
1. **Exact duplicates** - Same steps, same wording
2. **Semantic duplicates** - Same process, different wording
3. **Partial duplicates** - Overlapping steps

### Phase 2: Create Reference Sections

For most common processes:
1. Create canonical version in appropriate file
2. Add clear heading/anchor
3. Document all variations

### Phase 3: Update References

Replace duplicates with:
1. Cross-references to canonical version
2. Brief inline version + link to details
3. Consolidated sections within same file

### Phase 4: Validate

Ensure:
1. All links work
2. Context is preserved
3. User flow is not disrupted

## Specific Resolutions

### 1. Sync Process (6 occurrences)

**Canonical location**: COMMANDS.md#sync

**Action**:
- Keep detailed version in COMMANDS.md
- Replace other occurrences with: "Run sync (see [Commands Reference](COMMANDS.md#sync))"
- Or inline: "`bun ai-toolkit-shared/scripts/sync.js` ([details](COMMANDS.md#sync))"

### 2. Edit Standards.md (3 occurrences in EDITOR-SUPPORT.md)

**Action**:
- Create "Common Configuration Steps" section at top of EDITOR-SUPPORT.md
- Reference this section from each editor-specific section
- Reduces from 3 full descriptions to 1 + 2 references

### 3. Restart Claude Code (3 occurrences in EDITOR-SUPPORT.md)

**Action**:
- Add to "Troubleshooting" section
- Reference from each occurrence
- Or create "Quick Reference" box at top

### 4. Path Variables (2 occurrences)

**Canonical location**: PROJECT-RULES.md or CUSTOM-COMMANDS.md

**Action**:
- Choose one as canonical
- Cross-reference from the other

### 5. Verification Steps (2 occurrences)

**Action**:
- Create "Verification" section in appropriate guide
- Reference from both locations

## Benefits

### Maintenance
- ✅ Single source of truth for each process
- ✅ Updates only needed in one place
- ✅ Reduces risk of inconsistency

### User Experience
- ✅ Clear references to detailed information
- ✅ Consistent process descriptions
- ✅ Easier to find canonical information

### Documentation Quality
- ✅ Reduces redundancy
- ✅ Improves navigation
- ✅ Makes updates easier

## Risks & Mitigation

### Risk: Broken Links
**Mitigation**: Validate all links after changes

### Risk: Lost Context
**Mitigation**: Keep brief inline version + link to details

### Risk: User Confusion
**Mitigation**: Ensure references are clear and easy to follow

## Success Criteria

- [ ] All duplicate processes identified
- [ ] Canonical versions created
- [ ] Cross-references added
- [ ] Links validated
- [ ] User flow preserved
- [ ] Maintenance burden reduced

## Timeline

- **Phase 1**: 1 hour (identification)
- **Phase 2**: 2 hours (create canonical versions)
- **Phase 3**: 3 hours (update references)
- **Phase 4**: 1 hour (validation)

**Total**: ~7 hours

## Priority

**Medium** - Improves maintainability but doesn't affect functionality

## Notes

- Focus on most common duplicates first (sync, edit, restart)
- Some duplication is acceptable if it improves user flow
- Balance between DRY principle and user convenience
- Consider creating a "Common Tasks" reference page

