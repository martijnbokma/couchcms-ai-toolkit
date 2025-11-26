# Proposed AI Agents

Based on analysis of the CouchCMS documentation, here are additional agents that could be added to the toolkit.

## High Priority Agents

### 1. **search** - Search Implementation Agent
**Purpose**: Fulltext search implementation with MySQL

**Use for:**
- Search form creation
- Search result display
- Relevance ranking
- Search pagination
- Search result highlighting
- Multi-template search

**Documentation**: `concepts/search.mdx`

**Key Features**:
- MySQL fulltext search patterns
- Search form generation
- Result excerpt generation
- Search term highlighting
- Search pagination
- Masterpage filtering

---

### 2. **relationships** - Page Relationships Agent
**Purpose**: Managing relationships between templates (one-to-one, one-to-many, many-to-many)

**Use for:**
- Relationship definition
- Related pages queries
- Bidirectional relationships
- Relationship filtering
- Complex relationship patterns

**Documentation**: `concepts/relationships.mdx`

**Key Features**:
- Relation editable regions
- Many-to-many relationships
- One-to-many relationships
- One-to-one relationships
- Querying related pages
- Relationship filtering

---

### 3. **pagination** - Pagination Agent
**Purpose**: Implementing pagination for pages, search results, and comments

**Use for:**
- Page navigation
- Record counting
- Next/previous links
- Page number display
- Pagination variables

**Documentation**: `concepts/pagination.mdx`

**Key Features**:
- Pagination variables (`k_total_records`, `k_count`, etc.)
- Navigation controls
- Page numbering
- Record range display
- Multiple pagination patterns

---

### 4. **views** - Views Agent
**Purpose**: Understanding and implementing different view types (List, Page, Folder, Archive)

**Use for:**
- List view implementation
- Page view implementation
- Folder view implementation
- Archive view implementation
- View-specific variables
- URL pattern handling

**Documentation**: `concepts/views.mdx`

**Key Features**:
- View detection
- View-specific variables
- URL pattern matching
- View switching
- Conditional view logic

---

### 5. **comments** - Comments System Agent
**Purpose**: Implementing comment systems with moderation

**Use for:**
- Comment forms
- Comment display
- Comment moderation
- CAPTCHA integration
- Comment pagination
- Spam prevention

**Documentation**: `concepts/comments.mdx`

**Key Features**:
- Commentable templates
- Comment forms
- Comment listing
- Moderation workflow
- CAPTCHA integration
- Comment intervals

---

## Medium Priority Agents

### 6. **photo-gallery** - Photo Gallery Agent
**Purpose**: Creating and managing photo galleries with batch upload

**Use for:**
- Gallery template setup
- Batch image upload
- Thumbnail generation
- EXIF data extraction
- Gallery display
- Album organization

**Documentation**: `concepts/photo-gallery.mdx`

**Key Features**:
- Image editable regions
- Thumbnail associations
- Batch upload workflow
- EXIF data handling
- Gallery pagination
- Folder-based albums

---

### 7. **rss-feeds** - RSS Feed Agent
**Purpose**: Generating RSS feeds for content syndication

**Use for:**
- RSS feed generation
- XML structure
- Feed templates
- Content syndication
- Feed validation

**Documentation**: `concepts/rss-feeds.mdx`

**Key Features**:
- RSS XML structure
- Feed channel setup
- Item generation
- Date formatting
- Feed validation

---

### 8. **users** - User Management Agent
**Purpose**: User accounts, access control, and permissions

**Use for:**
- User account creation
- Access level management
- Permission checks
- User authentication
- User groups
- Access control patterns

**Documentation**: `concepts/users.mdx`

**Key Features**:
- Super Admin patterns
- Administrator patterns
- Registered users
- Access level checks
- Permission validation
- User authentication

---

### 9. **folders** - Folder Organization Agent
**Purpose**: Organizing pages with folders and hierarchies

**Use for:**
- Folder creation
- Folder navigation
- Hierarchical structures
- Folder-based filtering
- Folder breadcrumbs

**Documentation**: `concepts/folders.mdx`

**Key Features**:
- Folder editable regions
- Folder hierarchies
- Folder filtering
- Folder navigation
- Subfolder handling

---

### 10. **repeatable-regions** - Repeatable Regions Agent
**Purpose**: Creating repeating content blocks

**Use for:**
- Repeatable region setup
- Dynamic content blocks
- Repeater patterns
- Nested repeaters
- Repeater display

**Documentation**: `concepts/repeatable-regions.mdx`

**Key Features**:
- Repeater editable regions
- Repeater iteration
- Nested repeaters
- Repeater variables
- Repeater display patterns

---

## Lower Priority Agents

### 11. **archives** - Archive Views Agent
**Purpose**: Creating archive views by date

**Use for:**
- Archive URL patterns
- Date-based filtering
- Archive navigation
- Calendar integration
- Time-based queries

**Documentation**: `concepts/archives.mdx`

---

### 12. **nested-pages** - Nested Pages Agent
**Purpose**: Creating hierarchical page structures

**Use for:**
- Parent-child relationships
- Nested navigation
- Hierarchical URLs
- Nested page queries

**Documentation**: `concepts/nested-pages.mdx`

---

### 13. **paypal** - PayPal Integration Agent
**Purpose**: PayPal payment integration

**Use for:**
- Payment forms
- PayPal button integration
- Payment processing
- Transaction handling

**Documentation**: `concepts/paypal.mdx`

---

### 14. **google-maps** - Google Maps Agent
**Purpose**: Google Maps integration

**Use for:**
- Map display
- Location markers
- Map configuration
- Location data

**Documentation**: `concepts/google-maps.mdx`

---

### 15. **on-page-editing** - On-Page Editing Agent
**Purpose**: Frontend editing capabilities

**Use for:**
- Inline editing
- Frontend editing setup
- Edit mode detection
- Content editing workflows

**Documentation**: `tutorials/on-page-editing/`

---

### 16. **admin-panel-theming** - Admin Panel Theming Agent
**Purpose**: Customizing the admin panel interface

**Use for:**
- Admin panel customization
- Custom list screens
- Custom form screens
- Sidebar grouping
- Admin branding

**Documentation**: `tutorials/admin-panel-theming/`

---

### 17. **rss-feeds** - RSS Feed Agent (duplicate check)
**Already listed above**

---

### 18. **pretty-urls** - Pretty URLs Agent
**Purpose**: SEO-friendly URL configuration

**Use for:**
- URL rewriting
- .htaccess configuration
- Pretty URL patterns
- URL structure

**Documentation**: `concepts/pretty-urls.mdx`

**Note**: This might overlap with `custom-routes` agent. Consider merging or clarifying distinction.

---

## Recommended Implementation Order

### Phase 1 (High Impact)
1. **search** - Very common requirement
2. **pagination** - Used with many features
3. **relationships** - Complex but powerful
4. **views** - Fundamental concept

### Phase 2 (Common Features)
5. **comments** - Common feature
6. **photo-gallery** - Popular feature
7. **users** - Important for access control

### Phase 3 (Specialized)
8. **folders** - Organization
9. **repeatable-regions** - Advanced content
10. **rss-feeds** - Content syndication

### Phase 4 (Niche)
11. **archives** - Date-based views
12. **nested-pages** - Hierarchies
13. **paypal** - Payment integration
14. **google-maps** - Map integration
15. **on-page-editing** - Frontend editing
16. **admin-panel-theming** - Admin customization

---

## Agent Template Structure

Each new agent should follow the template structure in:
- `templates/agent-template.md`

Key sections:
- Agent capabilities
- Expertise areas
- Common solutions
- Best practices
- Quick fixes
- Success indicators
- Warning signs

---

## Integration Notes

- All agents should reference the `couchcms-core` module
- Agents should not duplicate functionality from existing agents
- Consider agent dependencies (e.g., `pagination` used by `search`)
- Some agents might be better as modules rather than agents

---

## Questions to Consider

1. Should `pretty-urls` be merged with `custom-routes`?
2. Should `pagination` be a module instead of an agent?
3. Should `views` be part of the core `couchcms` agent?
4. How to handle overlapping functionality (e.g., `users` vs authentication in `couchcms`)?

---

**Last Updated**: 2025-01-XX
**Based on**: CouchCMS Documentation analysis
