# CouchCMS Conditional Tags Checker – Template Validation

**Critical: Always follow `/docs/standards.md` before generating any code.**

## Role

You are a **CouchCMS template validation specialist** and **code quality auditor** with expertise in:

- CouchCMS template syntax and best practices
- Conditional tag validation and optimization
- Template parsing and error detection
- Code quality assurance and standards compliance
- Automated template validation workflows

---

## Objective

Systematically check all CouchCMS template files to ensure that:

1. `<cms:else>` and `<cms:else_if>` tags are properly self-closing
2. All `<cms:if>` tags have corresponding closing `</cms:if>` tags
3. All conditional tag pairs are properly balanced and nested
4. No orphaned closing tags exist without opening tags

Identify and fix any malformed conditional tags that could cause template parsing errors or unexpected behavior.

---

## Context

The Matters Student Hub project uses CouchCMS for content management with:

- Multiple template files across the project
- Complex conditional logic for content display
- Template inheritance and component systems
- English-only code requirements
- Strict validation standards for template syntax

---

## Steps

### 1. Discovery Phase

- **Automated File Scanning**: Use regex patterns to quickly identify files with conditional tags
- **Pattern Matching**: Search for `<cms:if`, `<cms:else`, `<cms:else_if` patterns across all files
- **Quick Inventory**: Create comprehensive list of all conditional statements with file paths and line numbers
- **Usage Mapping**: Identify common patterns and potential problem areas
- **Priority Files**: Focus on template files, includes, and components first
- **File-Specific Error Detection**: Identify exact files containing errors without embedding them individually
- **Error File Mapping**: Create detailed map of which files contain which types of errors

### 2. Analysis Phase

- **Automated Pattern Detection**: Use specific regex patterns to identify issues:
    - `<(cms:else|cms:else_if)(?!\s*\/>)` - Non-self-closing tags
    - `(<cms:if[^>]*>)(?!.*<\/cms:if>)` - Missing closing tags
    - `<\/cms:if>(?!.*<cms:if)` - Orphaned closing tags
- **Quick Validation**: Automated checking of tag pairing and nesting
- **Error Categorization**: Classify issues by type (syntax, pairing, nesting)
- **Priority Assessment**: Rank issues by severity and impact
- **Context Analysis**: Examine surrounding code for better error understanding
- **Document findings**: Create detailed report with exact locations and suggested fixes
- **File-Specific Error Mapping**: Create detailed map showing which files contain which specific errors
- **Error File Prioritization**: Rank files by error severity and impact
- **Batch Error Detection**: Identify all problematic files without individual embedding

### 3. Validation Phase

- **Automated Syntax Check**: Verify correct self-closing syntax: `<cms:else />` and `<cms:else_if />`
- **Attribute Validation**: Check for proper attribute handling in `<cms:else_if condition="" />`
- **Tag Pairing Verification**: Ensure all `<cms:if>` tags have matching `</cms:if>` closing tags
- **Nesting Validation**: Validate proper nesting and balance of conditional blocks
- **Orphan Detection**: Check for orphaned closing tags without corresponding opening tags
- **Content Validation**: Ensure no content between opening and closing tags
- **Template Compatibility**: Validate template parsing compatibility
- **Quick Fix Suggestions**: Provide specific correction recommendations for each issue

### 4. Correction Phase

- **Automated Fixes**: Apply systematic corrections using pattern replacement
- **Self-Closing Conversion**: Convert `<cms:else>` → `<cms:else />` and `<cms:else_if>` → `<cms:else_if />`
- **Missing Tag Addition**: Add missing closing `</cms:if>` tags where needed
- **Orphan Removal**: Remove orphaned closing tags without opening tags
- **Nesting Correction**: Fix improper nesting of conditional blocks
- **Batch Processing**: Process multiple files efficiently
- **Functionality Preservation**: Maintain original functionality and logic
- **Attribute Preservation**: Preserve all existing attributes and conditions
- **Systematic Updates**: Update affected files with proper error handling

### 5. Verification Phase

- **Automated Re-scan**: Use same patterns to verify all corrections
- **Template Testing**: Test template parsing in CouchCMS environment
- **Logic Validation**: Validate conditional logic still works correctly
- **Change Documentation**: Document all changes made with before/after examples
- **Final Report**: Generate comprehensive report with statistics and improvements
- **Quality Assurance**: Final check to ensure no new issues introduced

---

## Automated Detection Patterns

### Quick Search Patterns

Use these regex patterns for fast error detection:

```regex
# Non-self-closing else/else_if tags
<(cms:else|cms:else_if)(?!\s*\/>)

# Missing closing tags (opening if without closing)
<cms:if[^>]*>(?!.*<\/cms:if>)

# Orphaned closing tags (closing if without opening)
<\/cms:if>(?!.*<cms:if)

# Content between conditional tags
<(cms:else|cms:else_if)[^>]*>.*?<\/(cms:else|cms:else_if)>

# Improper nesting patterns
<cms:if[^>]*>.*?<cms:if[^>]*>.*?<\/cms:if>.*?<\/cms:if>
```

### Automated Detection Tools

1. **Grep/Regex Search**: Use command-line tools for quick pattern matching
2. **IDE Search**: Use IDE find/replace with regex for visual inspection
3. **Automated Scripts**: Create scripts to batch-process files
4. **Template Parsers**: Use CouchCMS template validation tools

### Error Priority Levels

- **Critical**: Missing closing tags, orphaned closing tags
- **High**: Non-self-closing else/else_if tags
- **Medium**: Improper nesting
- **Low**: Attribute formatting issues

### Quick Detection Commands

```bash
# Find non-self-closing else/else_if tags
grep -r "<cms:else[^>]*>" --include="*.php" --include="*.html" .

# Find missing closing tags
grep -r "<cms:if" --include="*.php" --include="*.html" . | grep -v "</cms:if>"

# Find orphaned closing tags
grep -r "</cms:if>" --include="*.php" --include="*.html" .

# Count conditional tags per file
grep -r "<cms:if\|<cms:else\|<cms:else_if" --include="*.php" --include="*.html" . | wc -l
```

### File-Specific Error Detection Commands

```bash
# Find files with non-self-closing else tags (with file names)
grep -l "<cms:else[^>]*>" --include="*.php" --include="*.html" .

# Find files with non-self-closing else_if tags (with file names)
grep -l "<cms:else_if[^>]*>" --include="*.php" --include="*.html" .

# Find files with potential missing closing tags
grep -l "<cms:if" --include="*.php" --include="*.html" . | xargs -I {} sh -c 'if [ $(grep -c "<cms:if" "{}") -ne $(grep -c "</cms:if>" "{}") ]; then echo "{}"; fi'

# Find files with orphaned closing tags
grep -l "</cms:if>" --include="*.php" --include="*.html" . | xargs -I {} sh -c 'if [ $(grep -c "<cms:if" "{}") -lt $(grep -c "</cms:if>" "{}") ]; then echo "{}"; fi'

# Get detailed error report per file
for file in $(find . -name "*.php" -o -name "*.html" | grep -v node_modules | grep -v vendor); do
    echo "=== $file ==="
    grep -n "<cms:if\|<cms:else\|<cms:else_if" "$file" 2>/dev/null || echo "No conditional tags found"
    echo ""
done
```

### Advanced File Analysis

```bash
# Create comprehensive error report
echo "# CouchCMS Conditional Tags Error Report" > conditional_errors_report.md
echo "Generated: $(date)" >> conditional_errors_report.md
echo "" >> conditional_errors_report.md

# Files with non-self-closing else tags
echo "## Files with Non-Self-Closing Else Tags" >> conditional_errors_report.md
grep -l "<cms:else[^>]*>" --include="*.php" --include="*.html" . >> conditional_errors_report.md
echo "" >> conditional_errors_report.md

# Files with non-self-closing else_if tags
echo "## Files with Non-Self-Closing Else_If Tags" >> conditional_errors_report.md
grep -l "<cms:else_if[^>]*>" --include="*.php" --include="*.html" . >> conditional_errors_report.md
echo "" >> conditional_errors_report.md

# Files with tag balance issues
echo "## Files with Tag Balance Issues" >> conditional_errors_report.md
for file in $(find . -name "*.php" -o -name "*.html" | grep -v node_modules | grep -v vendor); do
    if_count=$(grep -c "<cms:if" "$file" 2>/dev/null || echo "0")
    closing_count=$(grep -c "</cms:if>" "$file" 2>/dev/null || echo "0")
    if [ "$if_count" -ne "$closing_count" ]; then
        echo "$file: $if_count opening tags, $closing_count closing tags" >> conditional_errors_report.md
    fi
done
```

### IDE Search Patterns

**VS Code / Cursor:**

- Use `Ctrl+Shift+F` (Find in Files)
- Enable regex mode
- Use patterns above for quick detection

**PHPStorm:**

- Use `Ctrl+Shift+F` (Find in Path)
- Enable regex mode
- Use patterns above for quick detection

---

## Requirements

### Technical Requirements

- **File Scope**: Check all `.php` and `.html` files in the project
- **Tag Focus**: Target all conditional tags (`<cms:if>`, `<cms:else>`, `<cms:else_if>`)
- **Self-Closing Format**: Ensure `<cms:else>` and `<cms:else_if>` tags use proper self-closing syntax
- **Tag Pairing**: Verify all `<cms:if>` tags have corresponding `</cms:if>` closing tags
- **Balance Validation**: Check for orphaned closing tags and proper nesting
- **Attribute Preservation**: Maintain all existing attributes and conditions
- **Template Safety**: Use `<cms:ignore>` for any comments or documentation

### Quality Requirements

- **Accuracy**: 100% identification of malformed conditional tags and missing pairs
- **Completeness**: Check every file in the project scope
- **Consistency**: Apply uniform self-closing syntax across all files
- **Balance**: Ensure all conditional tags are properly paired and nested
- **Documentation**: Provide detailed report of all changes made
- **Validation**: Verify all corrections work in CouchCMS environment

### CouchCMS Standards

- **Self-Closing Syntax**: `<cms:else />` and `<cms:else_if condition="" />`
- **Tag Pairing**: All `<cms:if>` tags must have corresponding `</cms:if>` closing tags
- **Proper Nesting**: Conditional blocks must be properly nested and balanced
- **No Content**: Conditional tags must not contain any content
- **Proper Attributes**: Preserve all existing conditions and parameters
- **Template Compatibility**: Ensure all changes work with CouchCMS parser
- **English Only**: All code and comments must be in English

---

## Output

### Deliverables

1. **Comprehensive Report**: Complete inventory of all conditional tags found
2. **Issue Identification**: Detailed list of malformed tags and missing pairs with locations
3. **Balance Analysis**: Report on tag pairing and nesting issues
4. **Correction Summary**: All files modified with specific changes made
5. **Validation Results**: Confirmation that all tags are properly formatted and paired
6. **Quality Assurance**: Verification that template functionality is preserved

### Report Format

```
# CouchCMS Conditional Tags Validation Report

## Summary
- Total files scanned: [number]
- Conditional tags found: [number]
- Self-closing issues: [number]
- Missing closing tags: [number]
- Orphaned closing tags: [number]
- Nesting issues: [number]
- Files corrected: [number]

## Files with Issues
[Detailed list with file paths and line numbers]

## Balance Analysis
[Report on tag pairing and nesting issues]

## Corrections Made
[Specific changes for each file]

## Validation Results
[Confirmation of successful corrections]
```

### Enhanced File-Specific Report Format

```
# CouchCMS Conditional Tags Validation Report

## Summary
- Total files scanned: [number]
- Files with conditional tags: [number]
- Files with errors: [number]
- Critical errors: [number]
- High priority errors: [number]
- Medium priority errors: [number]
- Low priority errors: [number]

## Error File Mapping

### Critical Errors (Missing/Orphaned Tags)
- file1.php: Line 45 - Missing closing tag
- file2.html: Line 23 - Orphaned closing tag

### High Priority Errors (Non-Self-Closing Tags)
- file3.php: Line 12 - Non-self-closing else tag
- file4.html: Line 67 - Non-self-closing else_if tag

### Medium Priority Errors (Nesting Issues)
- file5.php: Lines 34-56 - Improper nesting
- file6.html: Lines 89-102 - Nested conditional issues

### Low Priority Errors (Formatting)
- file7.php: Line 78 - Attribute formatting
- file8.html: Line 45 - Spacing issues

## File-by-File Analysis

### file1.php
- Total conditional tags: 5
- Opening if tags: 3
- Closing if tags: 2
- Issues: Missing 1 closing tag
- Error locations: Line 45

### file2.html
- Total conditional tags: 8
- Opening if tags: 3
- Closing if tags: 4
- Issues: 1 orphaned closing tag
- Error locations: Line 23

## Batch Processing Results
- Files processed: [number]
- Files with no errors: [number]
- Files with errors: [number]
- Total errors fixed: [number]
- Files requiring manual review: [number]
```

---

## Quality Checklist

Before completing the validation, verify:

- [ ] **Complete Coverage**: All `.php` and `.html` files have been scanned
- [ ] **Accurate Detection**: All conditional tags (`<cms:if>`, `<cms:else>`, `<cms:else_if>`) identified
- [ ] **Proper Syntax**: All `<cms:else>` and `<cms:else_if>` tags use self-closing format
- [ ] **Tag Pairing**: All `<cms:if>` tags have corresponding `</cms:if>` closing tags
- [ ] **Balance Check**: No orphaned closing tags without opening tags
- [ ] **Nesting Validation**: All conditional blocks are properly nested
- [ ] **Attribute Preservation**: All existing attributes and conditions maintained
- [ ] **Template Safety**: No content between conditional tag opening and closing
- [ ] **CouchCMS Compatibility**: All changes work with CouchCMS parser
- [ ] **English Standards**: All code follows English-only requirements
- [ ] **Documentation**: Complete report of all changes made
- [ ] **Functionality**: Conditional logic still works as expected
- [ ] **Standards Compliance**: Follows `/docs/standards.md` requirements

---

## Validation Criteria

### Correct Self-Closing Syntax

**✅ Valid Examples:**

```html
<cms:else />
<cms:else_if condition="some_condition" />
<cms:else_if condition="another_condition" />
```

**❌ Invalid Examples:**

```html
<cms:else></cms:else>
<cms:else_if condition="some_condition"></cms:else_if>
<cms:else_if condition="some_condition">content</cms:else_if>
```

### Common Patterns to Check

1. **Simple else tags**: `<cms:else>` → `<cms:else />`
2. **Conditional else_if**: `<cms:else_if condition="">` → `<cms:else_if condition="" />`
3. **Missing closing tags**: `<cms:if condition="">` without `</cms:if>`
4. **Orphaned closing tags**: `</cms:if>` without opening `<cms:if>`
5. **Improper nesting**: Nested conditionals with incorrect tag order
6. **Nested conditionals**: Check within complex conditional blocks
7. **Template inheritance**: Check in extended templates and includes

---

## Success Metrics

- **100% Detection**: All conditional tags identified and checked
- **0% Errors**: No malformed conditional tags remaining
- **100% Compliance**: All tags follow self-closing syntax
- **100% Pairing**: All `<cms:if>` tags have corresponding closing tags
- **0% Orphans**: No orphaned closing tags without opening tags
- **100% Nesting**: All conditional blocks properly nested
- **0% Functionality Loss**: All conditional logic preserved
- **Complete Documentation**: Full report of all changes made

---

## Final Validation

Before completing, confirm:

- [ ] All files have been systematically scanned
- [ ] Every conditional tag has been validated
- [ ] All `<cms:if>` tags have corresponding closing tags
- [ ] No orphaned closing tags exist
- [ ] All conditional blocks are properly nested
- [ ] All corrections maintain original functionality
- [ ] Template parsing works correctly in CouchCMS
- [ ] Complete documentation provided
- [ ] Quality checklist completed
- [ ] Standards compliance verified

## Automated Fix Suggestions

### Common Fix Patterns

1. **Self-Closing Conversion**:

    ```html
    <!-- Before -->
    <cms:else></cms:else>
    <cms:else_if condition="test"></cms:else_if>

    <!-- After -->
    <cms:else />
    <cms:else_if condition="test" />
    ```

2. **Missing Closing Tag Addition**:

    ```html
    <!-- Before -->
    <cms:if condition="test">
        Content here

        <!-- After -->
        <cms:if condition="test"> Content here </cms:if></cms:if
    >
    ```

3. **Orphaned Tag Removal**:

    ```html
    <!-- Before -->
    Content here
    </cms:if>

    <!-- After -->
    Content here
    ```

### Batch Fix Commands

```bash
# Convert non-self-closing else tags
sed -i 's/<cms:else><\/cms:else>/<cms:else \/>/g' *.php *.html

# Convert non-self-closing else_if tags
sed -i 's/<cms:else_if\([^>]*\)><\/cms:else_if>/<cms:else_if\1 \/>/g' *.php *.html
```

### File-Specific Batch Processing

```bash
# Process only files with errors (avoid processing clean files)
echo "Processing files with conditional tag errors..."

# Get list of files with errors
ERROR_FILES=$(grep -l "<cms:else[^>]*>\|<cms:else_if[^>]*>" --include="*.php" --include="*.html" .)

# Process each file individually
for file in $ERROR_FILES; do
    echo "Processing: $file"

    # Backup original file
    cp "$file" "$file.backup"

    # Apply fixes
    sed -i 's/<cms:else><\/cms:else>/<cms:else \/>/g' "$file"
    sed -i 's/<cms:else_if\([^>]*\)><\/cms:else_if>/<cms:else_if\1 \/>/g' "$file"

    # Verify fixes
    if grep -q "<cms:else[^>]*>\|<cms:else_if[^>]*>" "$file"; then
        echo "  Warning: Some errors may remain in $file"
    else
        echo "  Success: All self-closing issues fixed in $file"
    fi
done

# Generate processing report
echo "Batch processing complete. Check individual files for remaining issues."
```

### Smart File Processing

```bash
# Only process files that actually have conditional tags
find . -name "*.php" -o -name "*.html" | grep -v node_modules | grep -v vendor | while read file; do
    if grep -q "<cms:if\|<cms:else\|<cms:else_if" "$file" 2>/dev/null; then
        echo "Found conditional tags in: $file"

        # Check for specific errors
        if grep -q "<cms:else[^>]*>\|<cms:else_if[^>]*>" "$file"; then
            echo "  - Has non-self-closing tags"
        fi

        # Check tag balance
        if_count=$(grep -c "<cms:if" "$file" 2>/dev/null || echo "0")
        closing_count=$(grep -c "</cms:if>" "$file" 2>/dev/null || echo "0")
        if [ "$if_count" -ne "$closing_count" ]; then
            echo "  - Tag balance issue: $if_count opening, $closing_count closing"
        fi
    fi
done
```

### Validation Checklist

- [ ] **Quick Scan**: Use grep commands to identify issues
- [ ] **Pattern Matching**: Use regex patterns for automated detection
- [ ] **Priority Fixing**: Fix critical issues first (missing/orphaned tags)
- [ ] **Syntax Fixing**: Convert non-self-closing tags
- [ ] **Nesting Check**: Verify proper nesting structure
- [ ] **Final Validation**: Re-scan to confirm all fixes

---

## Enhanced File Detection System

### Automated File Error Detection

The enhanced system now includes sophisticated file detection that identifies specific files with errors without requiring individual file embedding:

#### 1. File-Specific Error Mapping

```bash
# Create comprehensive error map
echo "Creating error file map..."

# Files with non-self-closing else tags
echo "Files with non-self-closing else tags:"
grep -l "<cms:else[^>]*>" --include="*.php" --include="*.html" . | sort

# Files with non-self-closing else_if tags
echo "Files with non-self-closing else_if tags:"
grep -l "<cms:else_if[^>]*>" --include="*.php" --include="*.html" . | sort

# Files with tag balance issues
echo "Files with tag balance issues:"
for file in $(find . -name "*.php" -o -name "*.html" | grep -v node_modules | grep -v vendor); do
    if_count=$(grep -c "<cms:if" "$file" 2>/dev/null || echo "0")
    closing_count=$(grep -c "</cms:if>" "$file" 2>/dev/null || echo "0")
    if [ "$if_count" -ne "$closing_count" ]; then
        echo "$file ($if_count opening, $closing_count closing)"
    fi
done
```

#### 2. Priority-Based File Processing

```bash
# Process files by error priority
echo "Processing files by priority..."

# Critical: Missing/Orphaned tags
echo "=== CRITICAL ERRORS ==="
for file in $(find . -name "*.php" -o -name "*.html" | grep -v node_modules | grep -v vendor); do
    if_count=$(grep -c "<cms:if" "$file" 2>/dev/null || echo "0")
    closing_count=$(grep -c "</cms:if>" "$file" 2>/dev/null || echo "0")
    if [ "$if_count" -ne "$closing_count" ]; then
        echo "CRITICAL: $file - Tag balance issue"
    fi
done

# High: Non-self-closing tags
echo "=== HIGH PRIORITY ERRORS ==="
grep -l "<cms:else[^>]*>\|<cms:else_if[^>]*>" --include="*.php" --include="*.html" . | while read file; do
    echo "HIGH: $file - Non-self-closing tags"
done
```

#### 3. Batch Error Report Generation

```bash
# Generate comprehensive error report
cat > conditional_errors_report.md << 'EOF'
# CouchCMS Conditional Tags Error Report

## File-Specific Error Detection

### Critical Errors (Missing/Orphaned Tags)
EOF

# Add critical errors to report
for file in $(find . -name "*.php" -o -name "*.html" | grep -v node_modules | grep -v vendor); do
    if_count=$(grep -c "<cms:if" "$file" 2>/dev/null || echo "0")
    closing_count=$(grep -c "</cms:if>" "$file" 2>/dev/null || echo "0")
    if [ "$if_count" -ne "$closing_count" ]; then
        echo "- $file: $if_count opening tags, $closing_count closing tags" >> conditional_errors_report.md
    fi
done

echo "" >> conditional_errors_report.md
echo "### High Priority Errors (Non-Self-Closing Tags)" >> conditional_errors_report.md

# Add high priority errors to report
grep -l "<cms:else[^>]*>\|<cms:else_if[^>]*>" --include="*.php" --include="*.html" . >> conditional_errors_report.md

echo "Error report generated: conditional_errors_report.md"
```

### Smart Processing Workflow

#### Phase 1: Quick File Identification

- **Targeted scanning**: Only scan files that contain conditional tags
- **Error categorization**: Classify files by error type and severity
- **Priority ranking**: Process most critical errors first

#### Phase 2: Batch Error Processing

- **Error-specific fixes**: Apply targeted corrections for each error type
- **File-by-file processing**: Handle each problematic file individually
- **Verification**: Confirm fixes were applied correctly

#### Phase 3: Quality Assurance

- **Re-scan verification**: Ensure all errors are resolved
- **Functionality testing**: Verify conditional logic still works
- **Documentation**: Generate comprehensive report of all changes

---

## Enhanced Workflow

### Phase 1: Quick File Identification

1. **Scan for files with conditional tags**: Identify all files containing `<cms:if>`, `<cms:else>`, or `<cms:else_if>` tags
2. **Create file inventory**: List all files with conditional tags and their locations
3. **Prioritize by error type**: Focus on files with the most critical errors first

### Phase 2: Error-Specific File Detection

1. **Non-self-closing tags**: Identify files with `<cms:else>` or `<cms:else_if>` that are not self-closing
2. **Missing closing tags**: Find files where `<cms:if>` tags don't have corresponding `</cms:if>` tags
3. **Orphaned closing tags**: Locate files with `</cms:if>` tags without opening `<cms:if>` tags
4. **Nesting issues**: Identify files with improper conditional tag nesting

### Phase 3: Batch Processing

1. **Process error files only**: Focus on files that actually contain errors
2. **Apply targeted fixes**: Use specific patterns for each type of error
3. **Verify corrections**: Check that fixes were applied correctly
4. **Generate detailed report**: Document all changes made

### Phase 4: Quality Assurance

1. **Re-scan all files**: Verify no errors remain
2. **Test template functionality**: Ensure conditional logic still works
3. **Document results**: Create comprehensive report of all changes

---

**Ask:** "Would you like me to start the systematic validation of all CouchCMS conditional tags in your project? I'll identify specific files with errors and process them efficiently without embedding them individually."
