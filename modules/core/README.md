# Core Modules - CouchCMS (Always Required)

These modules are **always available** and are part of the CouchCMS core system.

## What are Core Modules?

Core modules are **required** and are automatically loaded for every project. They contain essential CouchCMS functionality:

- **Foundation**: Core CouchCMS patterns, templates, and security
- **Content Management**: Content organization and structure
- **Navigation**: Search, pagination, and routing
- **User Features**: User management and comments
- **Forms**: DataBound Forms for CRUD operations

## Available Core Modules

### Foundation
- `couchcms-core` - Core CouchCMS patterns, templates, and security standards

### Content Management
- `folders` - Virtual folders for content organization
- `archives` - Archive views for time-based organization
- `relationships` - Page relationships (one-to-one, one-to-many, many-to-many)
- `repeatable-regions` - Repeatable content blocks and dynamic regions

### Navigation & Discovery
- `search` - Fulltext search with MySQL relevance ranking
- `pagination` - Pagination controls for pages, search results, and comments
- `custom-routes` - Custom URL routing and clean URL patterns

### User Features
- `users` - User management, access control, and authentication
- `comments` - Comment system with moderation and spam prevention

### Forms
- `databound-forms` - CouchCMS DataBound Forms for CRUD operations

## Usage

These modules are **automatically included** - you don't need to configure them in `standards.md`. They are always available for every CouchCMS project.

## Key Principle

**CouchCMS is the core system** - everything else builds on top of it. These modules provide the foundation that makes CouchCMS powerful and flexible.
