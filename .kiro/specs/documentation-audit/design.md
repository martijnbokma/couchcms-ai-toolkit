# Design Document - Documentation Audit and Improvement

## Overview

This design outlines a systematic approach to auditing and improving the CouchCMS AI Toolkit documentation. The solution consists of three main components:

1. **Audit Tool** - Automated analysis to identify outdated references, inconsistencies, and broken links
2. **Improvement Report** - Structured findings with specific recommendations
3. **Documentation Updates** - Systematic corrections based on audit findings

The audit tool will parse all documentation files, extract references to files, commands, versions, and terminology, then validate these against the current codebase. The output will be a comprehensive report that guides manual documentation improvements.

## Architecture

### Component Structure

```
Documentation Audit System
├── Audit Engine
│   ├── File Parser (Markdown → AST)
│   ├── Reference Extractor (Commands, Paths, Versions)
│   ├── Validator (Against Current Codebase)
│   └── Consistency Checker (Cross-document)
├── Report Generator
│   ├── Findings Aggregator
│   ├── Priority Scorer
│   └── Markdown Formatter
└── Documentation Updater
    ├── Manual Review Process
    ├── Systematic Corrections
    └── Verification
```

### Data Flow

```
Documentation Files → Parser → Extractors → Validators → Findings → Report → Manual Updates
                                    ↓
                              Codebase Analysis
                              (package.json, scripts, templates)
```

## Components and Interfaces

### 1. File Parser

**Purpose:** Parse markdown files into structured data for analysis

**Interface:**
```javascript
interface MarkdownParser {
  parseFile(filePath: string): DocumentAST
  extractCodeBlocks(ast: DocumentAST): CodeBlock[]
  extractLinks(ast: DocumentAST): Link[]
  extractHeadings(ast: DocumentAST): Heading[]
}
```

**Implementation:** Use existing markdown parser library (e.g., `marked` or `remark`)

### 2. Reference Extractor

**Purpose:** Extract specific types of references from documentation

**Interface:**
```javascript
interface ReferenceExtractor {
  extractCommands(content: string): Command[]
  extractFilePaths(content: string): FilePath[]
  extractVersionNumbers(content: string): Version[]
  extractScriptReferences(content: string): ScriptRef[]
}
```

**Patterns to Match:**
- Commands: `` `bun ...` ``, `` `npm ...` ``, `` `git ...` ``
- File paths: `./path/to/file`, `/absolute/path`, `path/to/file`
- Versions: `v2.0.0`, `version 2.1.0`, `2.0+`
- Scripts: `bun run <script>`, `npm run <script>`

### 3. Validator

**Purpose:** Validate extracted references against current codebase

**Interface:**
```javascript
interface Validator {
  validateCommand(cmd: Command): ValidationResult
  validateFilePath(path: FilePath): ValidationResult
  validateVersion(version: Version): ValidationResult
  validateScript(script: ScriptRef): ValidationResult
}
```

**Validation Sources:**
- `package.json` - for scripts and version
- File system - for file paths
- Template files - for generated files
- Script files - for available commands

### 4. Consistency Checker

**Purpose:** Check consistency across multiple documents

**Interface:**
```javascript
interface ConsistencyChecker {
  checkTerminology(docs: Document[]): TerminologyIssue[]
  checkPathNotation(docs: Document[]): PathNotationIssue[]
  checkLinks(docs: Document[]): BrokenLink[]
  checkDuplicateProcesses(docs: Document[]): DuplicateProcess[]
}
```

### 5. Report Generator

**Purpose:** Generate structured report of findings

**Interface:**
```javascript
interface ReportGenerator {
  generateReport(findings: Finding[]): Report
  prioritizeFindings(findings: Finding[]): PrioritizedFinding[]
  formatAsMarkdown(report: Report): string
}
```

**Report Structure:**
```markdown
# Documentation Audit Report

## Executive Summary
- Total issues found: X
- Critical: Y
- High priority: Z
- Medium priority: A
- Low priority: B

## Critical Issues
[Issues that prevent users from using the toolkit]

## High Priority Issues
[Issues that cause confusion or incorrect behavior]

## Medium Priority Issues
[Inconsistencies and minor inaccuracies]

## Low Priority Issues
[Style and formatting improvements]

## Detailed Findings
[Organized by document and issue type]
```

## Data Models

### Finding

```javascript
interface Finding {
  type: 'outdated-reference' | 'broken-link' | 'inconsistent-terminology' | 
        'missing-file' | 'incorrect-command' | 'version-mismatch'
  severity: 'critical' | 'high' | 'medium' | 'low'
  document: string  // File path
  line: number
  column: number
  issue: string  // Description of the issue
  current: string  // What the documentation currently says
  expected: string  // What it should say
  context: string  // Surrounding text for context
}
```

### ValidationResult

```javascript
interface ValidationResult {
  valid: boolean
  message: string
  suggestion?: string
}
```

### Document

```javascript
interface Document {
  path: string
  content: string
  ast: DocumentAST
  metadata: {
    title: string
    lastModified: Date
    wordCount: number
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Command accuracy

*For any* command reference in documentation, if the command is a toolkit script, then it must exist in package.json scripts or as an executable file in the scripts directory
**Validates: Requirements 1.1, 1.5**

### Property 2: File path validity

*For any* file path reference in documentation, if the path is presented as existing in the toolkit, then the file must exist in the current codebase
**Validates: Requirements 1.2, 8.5**

### Property 3: Dependency completeness

*For any* documentation section describing installation or setup, all dependencies listed in package.json must be mentioned in the documentation
**Validates: Requirements 1.3**

### Property 4: Generated file accuracy

*For any* reference to generated files in documentation, the file must be in the list of files actually generated by the sync script
**Validates: Requirements 1.4, 5.1**

### Property 5: Version consistency

*For any* version number reference in documentation, the version must match the current version in package.json or be explicitly marked as referring to a different version
**Validates: Requirements 2.4, 5.5**

### Property 6: Code example validity

*For any* code block in documentation, if it contains shell commands or configuration syntax, it must be syntactically valid
**Validates: Requirements 3.2**

### Property 7: Path notation consistency

*For any* two file path references in documentation, if they refer to the same location, they must use identical notation (e.g., both `./path` or both `path`, not mixed)
**Validates: Requirements 3.4, 4.2**

### Property 8: Terminology consistency

*For any* concept referenced in multiple documents, the terminology used must be identical across all documents
**Validates: Requirements 4.1, 8.3**

### Property 9: Link validity

*For any* internal markdown link in documentation, the target file and anchor (if specified) must exist
**Validates: Requirements 4.4, 8.4**

### Property 10: Deprecated file detection

*For any* reference to deprecated files (CLAUDE.md, AGENT.md, config.yaml, defaults.yaml, smart-defaults.yaml, preflight-checks.yaml), the audit must flag it as outdated
**Validates: Requirements 8.1**

### Property 11: Feature currency

*For any* feature described in documentation, if the feature has been removed from the codebase, the audit must flag it as outdated
**Validates: Requirements 5.2, 8.2**

### Property 12: Configuration option validity

*For any* configuration option mentioned in documentation, the option must be supported by the current config loader
**Validates: Requirements 5.3**

### Property 13: Error message accuracy

*For any* error message quoted in troubleshooting documentation, the error message must match actual error messages in the codebase
**Validates: Requirements 6.1**

### Property 14: Troubleshooting completeness

*For any* troubleshooting section, it must include at least one code block with a solution command
**Validates: Requirements 6.2**

### Property 15: Comparison table presence

*For any* documentation section presenting multiple options, if the section contains more than two options, it should include a comparison table
**Validates: Requirements 9.2**

### Property 16: Code block syntax highlighting

*For any* code block in documentation, it must have a language specifier for syntax highlighting
**Validates: Requirements 10.3**

### Property 17: Visual indicator usage

*For any* procedural documentation section (containing numbered steps), it should include visual indicators (✅, ❌, ⚠️, 💡) to highlight important points
**Validates: Requirements 10.4**

### Property 18: Reference table presence

*For any* documentation file labeled as "reference" or "guide", it should include at least one summary table
**Validates: Requirements 10.5**

### Property 19: English language consistency

*For any* text content in documentation (excluding code syntax), the content must be written in English
**Validates: Requirements 11.1, 11.2, 11.3**

### Property 20: English code comments

*For any* code comment in documentation examples, the comment must be written in English
**Validates: Requirements 11.2**

### Property 21: English identifiers

*For any* variable name, function name, or identifier in code examples, it must use English words
**Validates: Requirements 11.4**

## Error Handling

### Parsing Errors

- **Invalid Markdown:** Log warning and skip file, continue with other files
- **Encoding Issues:** Attempt UTF-8 decoding, fall back to ASCII, log warning
- **Large Files:** Implement streaming parser for files >1MB

### Validation Errors

- **File System Access:** Catch and log permission errors, mark as "unable to validate"
- **Missing package.json:** Treat as critical error, halt validation
- **Malformed JSON:** Log error with specific line number, continue with other validations

### Report Generation Errors

- **Write Failures:** Retry once, then output to stdout if file write fails
- **Template Errors:** Fall back to plain text format if markdown formatting fails

## Testing Strategy

### Unit Tests

- Test markdown parsing with various markdown structures
- Test reference extraction with edge cases (escaped backticks, nested code blocks)
- Test validation logic with mock file system
- Test consistency checking with sample document sets
- Test report generation with various finding combinations

### Property-Based Tests

Property-based testing will use `fast-check` (already in devDependencies) to generate random inputs and verify properties hold across all cases.

**Configuration:**
- Minimum 100 iterations per property test
- Use shrinking to find minimal failing examples
- Tag each test with the property number from design doc

**Test Tagging Format:**
```javascript
// Feature: documentation-audit, Property 1: Command accuracy
test('all command references must exist in package.json or scripts/', () => {
  // property test implementation
})
```

### Integration Tests

- Test full audit pipeline with sample documentation directory
- Test report generation with real findings
- Test validation against actual codebase structure

### Manual Testing

- Review generated reports for readability
- Verify recommendations are actionable
- Test with actual toolkit documentation

## Implementation Notes

### Performance Considerations

- Cache file system checks to avoid repeated stat calls
- Parse each document once and reuse AST
- Use streaming for large files
- Parallelize independent validations

### Extensibility

- Plugin architecture for new validators
- Configurable severity levels
- Custom rules via configuration file
- Support for additional documentation formats (if needed)

### Limitations

- Cannot validate subjective qualities (clarity, helpfulness)
- Cannot verify if examples are pedagogically effective
- Cannot detect missing documentation (only incorrect documentation)
- Requires manual review of findings for false positives

## Deliverables

1. **Audit Script** - Executable tool that analyzes documentation
2. **Audit Report** - Markdown file with structured findings
3. **Updated Documentation** - Corrected documentation files
4. **Verification Report** - Confirmation that all issues are resolved
