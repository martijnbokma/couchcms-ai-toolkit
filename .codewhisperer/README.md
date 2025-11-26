# CodeWhisperer Configuration

## Important Note

**Amazon CodeWhisperer does NOT use a `.codewhisperer` folder for project configuration.**

CodeWhisperer integrates directly into supported IDEs (VS Code, JetBrains) and uses:
- IDE settings (via `settings.json` in VS Code workspace settings)
- AWS Management Console for user management and permissions

## This Folder

The `rules.md` file in this folder is **for reference only** and contains project-specific coding standards. It is **not automatically used** by CodeWhisperer.

## How to Use CodeWhisperer with This Project

1. **Install CodeWhisperer extension** in your IDE
2. **Configure via IDE settings** - CodeWhisperer settings are managed in your IDE's settings panel
3. **Reference `rules.md`** - Use the guidelines in `rules.md` as a manual reference for project standards

## VS Code Configuration

If using VS Code, you can add CodeWhisperer-specific settings to your workspace `settings.json`:

```json
{
  "aws.codeWhisperer.enableCodeSuggestions": true,
  "aws.codeWhisperer.enableSecurityScans": true
}
```

## More Information

- [AWS CodeWhisperer User Guide](https://docs.aws.amazon.com/codewhisperer/latest/userguide/)
- [CodeWhisperer IDE Integration](https://docs.aws.amazon.com/codewhisperer/latest/userguide/setup.html)
