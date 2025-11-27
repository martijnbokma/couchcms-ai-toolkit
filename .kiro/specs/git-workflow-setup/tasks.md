# Implementation Plan

- [x] 1. Set up project structure and configuration
  - Create `scripts/git-flow/` directory for workflow modules
  - Add gitflow configuration to `defaults.yaml`
  - Set up test directory structure with `fast-check` dependency
  - _Requirements: 1.1, 1.2, 6.1_

- [x] 2. Implement core Git wrapper utilities
  - [x] 2.1 Create `scripts/git-flow/git-wrapper.js` with Git command wrappers
    - Implement functions for branch operations (create, delete, checkout, merge)
    - Implement functions for querying branch info (parent, age, commits)
    - Implement tag creation and listing functions
    - Add error handling with ToolkitError
    - _Requirements: 1.1, 1.2, 2.1, 3.1, 4.1_

  - [ ]* 2.2 Write property test for branch parent detection
    - **Property 3: Feature branches follow naming convention and parent**
    - **Validates: Requirements 2.1**

  - [ ]* 2.3 Write property test for branch naming validation
    - **Property 3, 7, 11: Branch naming conventions**
    - **Validates: Requirements 2.1, 3.1, 4.1**

- [x] 3. Implement branch validation module
  - [x] 3.1 Create `scripts/git-flow/validation.js` with validation logic
    - Implement branch name pattern validation (feature/release/hotfix)
    - Implement branch age calculation
    - Implement stale branch detection
    - Implement uncommitted changes detection
    - _Requirements: 2.1, 2.5, 3.1, 4.1, 8.3_

  - [ ]* 3.2 Write property test for stale branch detection
    - **Property 6: Stale branch detection**
    - **Validates: Requirements 2.5**

  - [ ]* 3.3 Write unit tests for validation functions
    - Test branch name pattern matching
    - Test invalid branch name rejection
    - Test branch age calculation edge cases
    - _Requirements: 2.1, 2.5, 3.1, 4.1_

- [x] 4. Implement feature branch workflow
  - [x] 4.1 Create `scripts/git-flow/feature.js` with feature operations
    - Implement `startFeature(name, options)` - create from develop
    - Implement `finishFeature(name, options)` - create PR to develop
    - Implement `listFeatures()` - show all feature branches
    - Implement `deleteFeature(name)` - cleanup merged branches
    - _Requirements: 2.1, 2.2, 2.3, 8.1_

  - [ ]* 4.2 Write property test for feature branch creation
    - **Property 3: Feature branches follow naming convention and parent**
    - **Validates: Requirements 2.1**

  - [ ]* 4.3 Write property test for feature PR targeting
    - **Property 4: Feature finish creates PR to develop**
    - **Validates: Requirements 2.2**

  - [ ]* 4.4 Write property test for feature branch cleanup
    - **Property 5: Merged feature branches are deleted**
    - **Validates: Requirements 2.3**

- [x] 5. Implement release branch workflow
  - [x] 5.1 Create `scripts/git-flow/release.js` with release operations
    - Implement `startRelease(version, options)` - create from develop
    - Implement `finishRelease(version, options)` - merge to main and develop
    - Implement version tag creation
    - Implement release branch cleanup
    - _Requirements: 3.1, 3.3, 3.4, 3.5_

  - [ ]* 5.2 Write property test for release branch creation
    - **Property 7: Release branches follow naming convention and parent**
    - **Validates: Requirements 3.1**

  - [ ]* 5.3 Write property test for release dual merge
    - **Property 8: Release finish merges to both main and develop**
    - **Validates: Requirements 3.3**

  - [ ]* 5.4 Write property test for release tag creation
    - **Property 9: Release merges create version tags**
    - **Validates: Requirements 3.4**

  - [ ]* 5.5 Write property test for release branch cleanup
    - **Property 10: Merged release branches are deleted**
    - **Validates: Requirements 3.5**

- [x] 6. Implement hotfix branch workflow
  - [x] 6.1 Create `scripts/git-flow/hotfix.js` with hotfix operations
    - Implement `startHotfix(name, options)` - create from main
    - Implement `finishHotfix(name, options)` - merge to main, develop, and release if exists
    - Implement patch version tag creation
    - Implement hotfix branch cleanup
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 6.2 Write property test for hotfix branch creation
    - **Property 11: Hotfix branches follow naming convention and parent**
    - **Validates: Requirements 4.1**

  - [ ]* 6.3 Write property test for hotfix dual merge
    - **Property 12: Hotfix finish merges to main and develop**
    - **Validates: Requirements 4.2**

  - [ ]* 6.4 Write property test for hotfix patch tag
    - **Property 13: Hotfix merges create patch version tags**
    - **Validates: Requirements 4.3**

  - [ ]* 6.5 Write property test for hotfix branch cleanup
    - **Property 14: Merged hotfix branches are deleted**
    - **Validates: Requirements 4.4**

  - [ ]* 6.6 Write property test for hotfix to release merge
    - **Property 15: Hotfix merges to release branch when present**
    - **Validates: Requirements 4.5**

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement GitHub integration
  - [ ] 8.1 Create `scripts/git-flow/github.js` with GitHub API wrappers
    - Implement PR creation using GitHub CLI (`gh`)
    - Implement PR template loading and application
    - Implement branch protection status checking
    - Add error handling for GitHub API failures
    - _Requirements: 5.1, 5.2, 5.3, 6.2, 7.1, 7.2_

  - [ ]* 8.2 Write property test for PR template application
    - **Property 17: PR templates are applied**
    - **Validates: Requirements 6.2**

  - [ ]* 8.3 Write unit tests for GitHub integration
    - Test PR creation with various parameters
    - Test template variable substitution
    - Test error handling for API failures
    - _Requirements: 6.2, 7.1, 7.2_

- [x] 9. Implement main CLI entry point
  - [x] 9.1 Create `scripts/git-flow.js` main CLI script
    - Parse command-line arguments (type, action, options)
    - Route to appropriate workflow module (feature/release/hotfix)
    - Implement help and usage information
    - Add global error handling
    - _Requirements: 6.1, 6.2_

  - [ ]* 9.2 Write integration tests for CLI workflows
    - Test complete feature workflow (start → finish → cleanup)
    - Test complete release workflow (start → finish → tag → cleanup)
    - Test complete hotfix workflow (start → finish → multi-merge → cleanup)
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4_

- [ ] 10. Implement branch listing and reporting
  - [ ] 10.1 Add branch listing functionality to workflow modules
    - Implement list command with branch metadata (name, age, last commit)
    - Implement stale branch highlighting
    - Implement changelog generation between releases
    - Format output for readability
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 10.2 Write property test for branch listing completeness
    - **Property 19: Branch listing completeness**
    - **Validates: Requirements 8.1**

  - [ ]* 10.3 Write property test for commit date inclusion
    - **Property 20: Branch listing includes commit dates**
    - **Validates: Requirements 8.2**

  - [ ]* 10.4 Write property test for changelog generation
    - **Property 21: Changelog generation between releases**
    - **Validates: Requirements 8.4, 8.5**

- [x] 11. Create GitHub Actions workflows
  - [x] 11.1 Create `.github/workflows/pr-checks.yml`
    - Configure workflow to trigger on pull requests
    - Add linting step (if applicable to toolkit)
    - Add test execution step
    - Add status reporting to PR
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 11.2 Create `.github/workflows/release.yml`
    - Configure workflow to trigger on main branch merges
    - Add GitHub release creation
    - Add changelog generation
    - Add tag verification
    - _Requirements: 3.4, 8.4, 8.5_

- [x] 12. Create PR template and documentation
  - [x] 12.1 Create `.github/PULL_REQUEST_TEMPLATE.md`
    - Add description section
    - Add testing checklist
    - Add breaking changes section
    - Add related issues section
    - _Requirements: 6.2_

  - [x] 12.2 Create `docs/GIT-WORKFLOW.md` main documentation
    - Add overview of Gitflow model
    - Add visual diagrams (Mermaid)
    - Add quick start guide
    - Add command reference
    - Link to detailed workflow docs
    - _Requirements: 6.3, 6.4_

  - [x] 12.3 Create detailed workflow documentation
    - Create `docs/git-workflow/getting-started.md`
    - Create `docs/git-workflow/feature-workflow.md` with examples
    - Create `docs/git-workflow/release-workflow.md` with examples
    - Create `docs/git-workflow/hotfix-workflow.md` with examples
    - Create `docs/git-workflow/troubleshooting.md` with conflict resolution
    - _Requirements: 6.3, 6.4, 6.5_

- [x] 13. Configure branch protection
  - [x] 13.1 Create branch protection configuration guide
    - Document required protection rules for main and develop
    - Create `.github/branch-protection.json` configuration template
    - Add instructions for applying via GitHub UI or API
    - Document admin bypass settings
    - _Requirements: 1.5, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 13.2 Write property test for protected branch enforcement
    - **Property 2: Protected branches reject direct commits**
    - **Validates: Requirements 1.5**

  - [ ]* 13.3 Write property test for force push prevention
    - **Property 16: Force push prevention on protected branches**
    - **Validates: Requirements 5.4**

- [x] 14. Add workflow to package.json scripts
  - [x] 14.1 Update package.json with git-flow commands
    - Add `"git-flow": "bun scripts/git-flow.js"` script
    - Update README with new commands
    - Add to toolkit documentation
    - _Requirements: 6.1_

- [x] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
