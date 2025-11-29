# Documentation User-Friendliness Audit Script

## Overview

The `audit-user-friendliness.js` script performs automated analysis of documentation to identify user-friendliness issues across three dimensions:

1. **Code Examples** - Validates syntax, completeness, and clarity
2. **Procedural Documentation** - Checks for numbered lists and action verbs
3. **Path Notation** - Analyzes consistency of file path references

## Usage

### Run the Audit

```bash
# From the toolkit root directory
node .kiro/specs/documentation-audit/audit-user-friendliness.js

# Or from the spec directory
cd .kiro/specs/documentation-audit
node audit-user-friendliness.js
```

### Output Files

The script generates three detailed findings files:

1. **findings-4.1-code-examples.md** - Code block issues
2. **findings-4.2-procedural-docs.md** - Procedural documentation issues
3. **findings-4.3-path-notation.md** - Path notation inconsistencies

### Summary Report

See **TASK-4-SUMMARY.md** for:
- Executive summary of all findings
- Impact assessment
- Prioritized recommendations
- Files requiring most attention

## What It Checks

### Code Examples (Task 4.1)

✅ **Language Specifiers**
- Detects code blocks without language tags
- Affects syntax highlighting in rendered docs

✅ **Shell Command Validity**
- Checks for complex multi-command lines
- Identifies incomplete commands (ending with `\`)
- Flags destructive commands without error handling

✅ **Example Completeness**
- Detects placeholder text (`[your-...]`, `{your-...}`, `...`)
- Identifies truncated examples
- Checks for explanatory comments in complex examples

### Procedural Documentation (Task 4.2)

✅ **Multi-Step Processes**
- Identifies procedures with 2+ steps
- Verifies use of numbered lists
- Checks for clear action verbs (Install, Run, Create, etc.)

### Path Notation (Task 4.3)

✅ **Consistency Analysis**
- Extracts all file path references
- Categorizes by notation type:
  - `relative-implicit`: `scripts/sync.js`
  - `relative-explicit`: `./scripts/sync.js`
  - `absolute`: `/scripts/sync.js`
  - `home`: `~/scripts/sync.js`
- Identifies paths referenced with multiple notations
- Recommends predominant notation for standardization

## Severity Levels

- **Critical**: Prevents functionality (none found)
- **High**: Major usability issues (none found)
- **Medium**: Noticeable quality issues (144 found)
- **Low**: Minor improvements (189 found)

## Integration Opportunities

### CI/CD Integration

Add to GitHub Actions workflow:

```yaml
- name: Audit Documentation
  run: node .kiro/specs/documentation-audit/audit-user-friendliness.js
  
- name: Check for Critical Issues
  run: |
    if grep -q "Critical:" .kiro/specs/documentation-audit/findings-*.md; then
      echo "Critical documentation issues found!"
      exit 1
    fi
```

### Pre-Commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Run documentation audit on changed .md files
if git diff --cached --name-only | grep -q '\.md$'; then
  node .kiro/specs/documentation-audit/audit-user-friendliness.js
  echo "Documentation audit complete. Review findings before committing."
fi
```

### Regular Monitoring

Schedule weekly audits to track improvements:

```bash
# Add to crontab
0 9 * * 1 cd /path/to/toolkit && node .kiro/specs/documentation-audit/audit-user-friendliness.js
```

## Customization

### Adjust Severity Thresholds

Edit the script to change what's flagged:

```javascript
// Line ~150: Adjust placeholder detection
const placeholders = [
    /\[your-.*?\]/gi,  // Remove to ignore [your-...] patterns
    /\{your-.*?\}/gi,
    // Add custom patterns
];

// Line ~200: Adjust action verb list
const actionVerbs = [
    'install', 'run', 'create',
    // Add your preferred verbs
];
```

### Add Custom Checks

Extend the script with new validation functions:

```javascript
// Add after existing validators
function checkCustomPattern(content, filePath) {
    // Your custom validation logic
    const issues = [];
    // ... detect issues
    return issues;
}

// Add to processFile() function
const customIssues = checkCustomPattern(content, relativePath);
findings.custom.push(...customIssues);
```

## Performance

- **Scan time**: ~2-3 seconds for 35 documentation files
- **Memory usage**: ~50MB
- **Output size**: ~70KB total (3 findings files)

## Limitations

The script cannot detect:
- Subjective quality (clarity, helpfulness)
- Pedagogical effectiveness
- Missing documentation (only incorrect documentation)
- False positives (requires manual review)

## Maintenance

### Update Path Patterns

If documentation structure changes, update path extraction regex:

```javascript
// Line ~280: Path patterns
const pathPatterns = [
    /`([\.\/~]?[\w\-\/\.]+\.(md|js|json|yaml|sh|ts|php|html|css))`/g,
    // Add new file extensions or patterns
];
```

### Update Excluded Directories

To skip certain directories:

```javascript
// Line ~450: scanDirectory function
if (entry.isDirectory() && !entry.name.startsWith('.')) {
    // Add exclusions
    if (entry.name === 'node_modules' || entry.name === 'dist') return;
    scanDirectory(fullPath);
}
```

## Troubleshooting

### "Module not found" errors

Ensure you're running from the correct directory:

```bash
# Must run from toolkit root or spec directory
cd couchcms-ai-toolkit
node .kiro/specs/documentation-audit/audit-user-friendliness.js
```

### No findings generated

Check that documentation files exist:

```bash
ls -la docs/*.md
ls -la README.md
```

### Script hangs

Increase Node.js memory if processing very large files:

```bash
node --max-old-space-size=4096 .kiro/specs/documentation-audit/audit-user-friendliness.js
```

## Future Enhancements

Potential improvements:
1. **Auto-fix mode** - Automatically add language specifiers
2. **Interactive mode** - Review and fix issues one by one
3. **Diff mode** - Only check changed files
4. **JSON output** - Machine-readable format for tooling
5. **Configurable rules** - External config file for customization
6. **Link validation** - Check internal and external links
7. **Image validation** - Verify image references exist

## Related Documentation

- **TASK-4-SUMMARY.md** - Complete audit results and recommendations
- **tasks.md** - Implementation plan and task tracking
- **requirements.md** - User-friendliness requirements (3.2, 3.3, 3.4, 4.2)
- **design.md** - Audit tool design and architecture

## Support

For issues or questions:
1. Check TASK-4-SUMMARY.md for common issues
2. Review the script comments for implementation details
3. Open an issue in the toolkit repository
