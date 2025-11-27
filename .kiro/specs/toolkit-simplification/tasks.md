# Implementation Plan

- [x] 1. Create new library structure and utilities
  - Create `scripts/lib/` directory for modular components
  - Set up test infrastructure with fast-check dependency
  - Create shared utility functions for common operations
  - _Requirements: 3.1, 3.4, 3.5_

- [x] 2. Implement configuration consolidation
  - [x] 2.1 Create config.yaml schema and structure
    - Design consolidated config.yaml format
    - Merge settings from defaults.yaml, smart-defaults.yaml, preflight-checks.yaml
    - Document all configuration options
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 2.2 Implement config-loader.js module
    - Create loadConfig() function to read and merge configurations
    - Implement validateConfig() function for validation
    - Support both standards.md and config.yaml formats
    - Add backward compatibility for old format
    - _Requirements: 1.1, 1.4, 1.5, 11.4_

  - [ ]* 2.3 Write unit tests for config loader
    - Test loading from standards.md
    - Test loading from config.yaml
    - Test config merging logic
    - Test validation rules
    - _Requirements: 1.1, 1.2, 1.4_

- [x] 3. Implement module loading system
  - [x] 3.1 Create module-loader.js with caching
    - Implement loadModules() function
    - Implement loadAgents() function
    - Implement loadFramework() function
    - Add ModuleCache class for performance
    - _Requirements: 3.1, 3.4, 5.2, 11.2, 11.3_

  - [ ]* 3.2 Write unit tests for module loader
    - Test loading single module
    - Test loading multiple modules
    - Test handling missing modules
    - Test module conflict detection
    - Test cache effectiveness
    - _Requirements: 11.2, 11.3_

- [x] 4. Implement template engine
  - [x] 4.1 Create template-engine.js module
    - Implement prepareTemplateData() function
    - Implement renderTemplates() function for multiple editors
    - Add support for parallel template rendering
    - Implement unified template rendering logic
    - _Requirements: 3.1, 3.4, 9.2, 9.3, 9.4_

  - [ ]* 4.2 Write unit tests for template engine
    - Test template data preparation
    - Test rendering for each editor
    - Test handling missing variables
    - Test Handlebars helpers
    - _Requirements: 9.2, 9.3_

- [x] 5. Implement file writer with optimization
  - [x] 5.1 Create file-writer.js module
    - Implement writeConfigs() function
    - Implement hasChanged() function to skip unchanged files
    - Add directory creation logic
    - Add error handling for write failures
    - _Requirements: 3.1, 3.4, 5.4, 12.1_

  - [ ]* 5.2 Write unit tests for file writer
    - Test writing single file
    - Test writing multiple files
    - Test skipping unchanged files
    - Test directory creation
    - Test error handling
    - _Requirements: 5.4_

- [x] 6. Refactor sync.js to use new modules
  - [x] 6.1 Rewrite sync.js as orchestrator
    - Import and use config-loader
    - Import and use module-loader
    - Import and use template-engine
    - Import and use file-writer
    - Add performance timing
    - Reduce to < 200 lines
    - _Requirements: 3.1, 3.2, 3.3, 5.1, 11.1_

  - [ ]* 6.2 Write integration tests for sync workflow
    - Test complete sync process
    - Test with various configurations
    - Test error handling
    - Verify performance improvement
    - _Requirements: 5.1, 11.1_

- [x] 7. Update editor support
  - [x] 7.1 Remove Tabnine and CodeWhisperer support
    - Remove tabnine.template.md
    - Remove codewhisperer.template.md
    - Remove Tabnine-specific logic from sync.js
    - Remove CodeWhisperer-specific logic from sync.js
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 7.2 Update template mapping for supported editors
    - Update EDITOR_TEMPLATES constant
    - Verify Cursor template works
    - Verify Claude Code template works
    - Verify Windsurf template works
    - Verify Kiro template works
    - Verify GitHub Copilot template works
    - _Requirements: 2.1, 2.4, 9.1_

- [x] 8. Simplify smart-defaults.yaml
  - [x] 8.1 Remove unused sections
    - Remove action_contexts section
    - Remove intent_patterns section
    - Remove communication_modes section
    - Remove suggestion_triggers section
    - Remove context_cache_schema section
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 8.1, 8.2, 8.3, 8.4_

  - [x] 8.2 Keep essential sections
    - Preserve file_contexts section
    - Preserve paths section (if not in config.yaml)
    - Preserve template_aliases section
    - Verify file context auto-loading still works
    - _Requirements: 4.5, 8.5_

- [x] 9. Refactor init.js
  - [x] 9.1 Create helper modules for init
    - Create prompts.js for user input functions
    - Create config-generator.js for config file generation
    - Create sync-runner.js for running sync from init
    - _Requirements: 3.1, 3.4, 3.5, 6.5_

  - [x] 9.2 Rewrite init.js using helpers
    - Import and use helper modules
    - Simplify question flow (max 5 questions in simple mode)
    - Reduce to < 300 lines
    - Improve error messages
    - _Requirements: 3.2, 3.3, 6.1, 6.2, 6.3, 6.4_

  - [ ]* 9.3 Write integration tests for init workflow
    - Test simple mode setup
    - Test custom mode setup
    - Test overwrite confirmation
    - Test sync execution
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Create migration tooling
  - [x] 11.1 Create migrate.js script
    - Detect old configuration files
    - Parse and merge old configs
    - Generate new config.yaml
    - Backup old configuration files
    - Validate new configuration
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 11.2 Write integration tests for migration
    - Test migration from old format
    - Test backup creation
    - Test validation of migrated config
    - Test rollback on failure
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [x] 12. Update documentation
  - [x] 12.1 Update README.md
    - Remove references to Tabnine and CodeWhisperer
    - Update configuration section for new structure
    - Update command examples
    - Add migration guide link
    - _Requirements: 2.5, 10.2_

  - [x] 12.2 Update GETTING-STARTED.md
    - Update setup instructions for new config format
    - Update init.js wizard screenshots/examples
    - Simplify configuration examples
    - _Requirements: 10.3_

  - [x] 12.3 Create or update CONFIG-FILES.md
    - Document new config.yaml structure
    - Document all configuration options
    - Provide examples for common scenarios
    - Explain migration from old format
    - _Requirements: 1.3, 10.1_

  - [x] 12.4 Update TROUBLESHOOTING.md
    - Add migration troubleshooting section
    - Add common configuration errors
    - Add performance troubleshooting
    - _Requirements: 10.4_

  - [x] 12.5 Create MIGRATION.md guide
    - Step-by-step upgrade instructions
    - Explain breaking changes
    - Provide migration script usage
    - Include rollback instructions
    - _Requirements: 7.1, 10.5_

  - [x] 12.6 Update CHANGELOG.md
    - Document all breaking changes
    - Document removed features
    - Document performance improvements
    - Document new features
    - _Requirements: 8.5_

- [x] 13. Performance optimization
  - [x] 13.1 Implement module caching
    - Add ModuleCache class to cache.js
    - Integrate caching in module-loader.js
    - Measure cache hit rate
    - _Requirements: 5.2_

  - [x] 13.2 Implement selective file writing
    - Add hasChanged() function to file-writer.js
    - Skip writing unchanged files
    - Log skipped files for transparency
    - _Requirements: 5.4_

  - [x] 13.3 Implement parallel template rendering
    - Use Promise.all() for parallel rendering
    - Measure performance improvement
    - Ensure error handling works correctly
    - _Requirements: 5.1_

  - [ ]* 13.4 Write performance tests
    - Measure sync time before and after
    - Verify 50% improvement target
    - Test with various project sizes
    - Profile bottlenecks
    - _Requirements: 5.1_

- [x] 14. Improve error handling
  - [x] 14.1 Add detailed error messages
    - Improve config validation errors
    - Add suggestions for common mistakes
    - Show context for template errors
    - Provide actionable error messages
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 14.2 Add error recovery
    - Handle partial sync failures gracefully
    - Continue processing after non-critical errors
    - Report all errors at end of sync
    - _Requirements: 12.5_

- [x] 15. Backward compatibility
  - [x] 15.1 Support old config format during transition
    - Detect old vs new config format
    - Load old format with deprecation warning
    - Suggest migration to new format
    - _Requirements: 1.5, 11.5_

  - [x] 15.2 Ensure output compatibility
    - Verify generated configs are identical for supported editors
    - Test with existing projects
    - Validate no breaking changes in output
    - _Requirements: 11.1_

- [x] 16. Final testing and validation
  - [x] 16.1 Run complete test suite
    - Run all unit tests
    - Run all integration tests
    - Run performance tests
    - Verify all tests pass
    - _Requirements: All_

  - [x] 16.2 Test with real projects
    - Test with small project
    - Test with medium project
    - Test with large project
    - Verify sync works correctly
    - Verify performance improvements
    - _Requirements: 5.1, 11.1_

  - [x] 16.3 Validate migration path
    - Test migration script with real configs
    - Verify backward compatibility
    - Test rollback procedure
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 17. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
