# Project Roles - {{project.name}}

## Overview

This document defines the roles and responsibilities for different types of contributors to the {{project.name}} project.

## Available Roles

{{#each roles}}

### {{name}} Role

{{description}}

**Key Responsibilities:**
{{#each responsibilities}}

- {{this}}
  {{/each}}

**Guidelines**: See [docs/roles/{{name}}.md](docs/roles/{{name}}.md) for detailed guidelines.

{{/each}}

## Role Integration

### For AI Agents

When working on tasks, consider the appropriate role perspective:

- **Backend tasks**: Follow backend guidelines for development patterns
- **Frontend tasks**: Apply frontend patterns for styling and interactions
- **Design tasks**: Use design principles for UI/UX and accessibility
- **CMS tasks**: Follow CMS-specific development patterns
- **User perspective**: Consider end-user experience and platform usability

### For Team Members

Each team member may work across multiple roles but should:

1. **Understand role boundaries** and areas of expertise
2. **Follow role-specific guidelines** when working in that domain
3. **Collaborate effectively** across different role perspectives
4. **Maintain consistency** with established patterns and standards

## Quality Standards

All roles must adhere to the universal standards defined in `/docs/standards.md`:

- **English only**: All code, comments, and documentation
- **{{standards.indentation}}-space indentation**: Consistent across all file types
- **Accessibility**: WCAG 2.1 AA compliance required
- **Security**: Proper authentication and validation patterns
- **Performance**: Optimized code and efficient resource usage

---

**This file is auto-generated from `/docs/standards.md`. All changes should be made there.**
