---
name: MySQL Agent
version: '1.0'
type: daily
description: Database operations, optimization, and CouchCMS-specific queries
tags:
    - mysql
    - database
    - couchcms
    - performance
---

# MySQL Agent

**Quick Daily Tool**: Database Operations & Optimization
**Use For**: Query optimization, database maintenance, performance tuning
**Time**: 2-5 minutes

## Your Capabilities

1. **Optimize** database queries and performance
2. **Maintain** CouchCMS database health
3. **Debug** slow queries and connection issues
4. **Backup** and restore database operations

## Quick MySQL Commands

```bash
# Connect to database
mysql -u username -p database_name

# Check database status
mysqladmin status

# Backup database
mysqldump -u username -p database_name > backup.sql

# Restore database
mysql -u username -p database_name < backup.sql
```

## CouchCMS Database Structure

### Core Tables

```sql
-- Check CouchCMS tables
SHOW TABLES LIKE 'couch_%';

-- Analyze table structure
DESCRIBE couch_pages;
DESCRIBE couch_data;
DESCRIBE couch_users;

-- Check table sizes
SELECT
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)',
    table_rows
FROM information_schema.tables
WHERE table_schema = DATABASE()
ORDER BY (data_length + index_length) DESC;
```

### Common CouchCMS Queries

#### Get Published Pages by Template

```sql
SELECT
    p.id,
    p.title,
    p.publish_date,
    p.content_owner
FROM couch_pages p
WHERE p.template = 'projects.php'
    AND p.is_published = 1
ORDER BY p.publish_date DESC
LIMIT 10;
```

#### Get Page with Custom Fields

```sql
SELECT
    p.id,
    p.title,
    p.publish_date,
    d1.field_value as description,
    d2.field_value as thumbnail
FROM couch_pages p
LEFT JOIN couch_data d1 ON p.id = d1.page_id AND d1.field_name = 'description'
LEFT JOIN couch_data d2 ON p.id = d2.page_id AND d2.field_name = 'thumbnail'
WHERE p.template = 'projects.php'
    AND p.is_published = 1
ORDER BY p.publish_date DESC;
```

#### Get User's Content

```sql
SELECT
    p.id,
    p.title,
    p.template,
    p.publish_date,
    p.is_published
FROM couch_pages p
WHERE p.content_owner = ?
ORDER BY p.publish_date DESC;
```

## Performance Optimization

### Query Analysis

```sql
-- Analyze query performance
EXPLAIN SELECT * FROM couch_pages
WHERE template = 'projects.php'
AND is_published = 1
ORDER BY publish_date DESC
LIMIT 10;

-- Add indexes for better performance
CREATE INDEX idx_pages_template ON couch_pages (template, is_published, publish_date);
CREATE INDEX idx_pages_owner ON couch_pages (content_owner, is_published);
```

### Performance Monitoring

```sql
-- Check slow queries
SELECT
    query_time,
    lock_time,
    rows_sent,
    rows_examined,
    sql_text
FROM mysql.slow_log
WHERE start_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
ORDER BY query_time DESC
LIMIT 10;

-- Check current connections
SHOW PROCESSLIST;

-- Check database status
SHOW STATUS LIKE 'Connections';
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Slow_queries';
```

## Maintenance Tasks

### Data Cleanup

```sql
-- Clean up old draft content
DELETE FROM couch_pages
WHERE is_published = 0
AND created_date < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Optimize tables
OPTIMIZE TABLE couch_pages;
OPTIMIZE TABLE couch_data;

-- Analyze tables for better performance
ANALYZE TABLE couch_pages;
ANALYZE TABLE couch_data;
```

### Health Check

```sql
-- Check table sizes
SELECT
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = DATABASE()
ORDER BY (data_length + index_length) DESC;
```

## Quick Fixes

### "Database connection failed"

```bash
# Check MySQL service
sudo systemctl status mysql

# Restart MySQL if needed
sudo systemctl restart mysql

# Check connection
mysql -u username -p -e "SELECT 1"
```

### "Slow query performance"

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Analyze specific query
EXPLAIN SELECT * FROM couch_pages WHERE template = 'projects.php';

-- Add missing indexes
CREATE INDEX idx_template_published ON couch_pages (template, is_published);
```

### "Table locked"

```sql
-- Check for locked tables
SHOW OPEN TABLES WHERE In_use > 0;

-- Kill problematic processes
SHOW PROCESSLIST;
KILL [process_id];

-- Check for long-running transactions
SELECT * FROM information_schema.innodb_trx;
```

## Success Indicators

### Healthy Database

- ✅ Fast query execution (< 100ms)
- ✅ Proper indexing
- ✅ Regular backups
- ✅ Optimized table structure
- ✅ Clean error logs

### Warning Signs

- ⚠️ Slow queries (> 1 second)
- ⚠️ High connection count
- ⚠️ Disk space issues
- ⚠️ Locked tables
- ⚠️ Missing indexes
