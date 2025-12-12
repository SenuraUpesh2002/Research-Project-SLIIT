# Database Migrations

This project uses [db-migrate](https://db-migrate.readthedocs.io/) for managing database schema changes.

## Overview

Database migrations allow you to:
- Version control your database schema
- Apply incremental schema changes
- Rollback changes if needed
- Maintain consistency across development, staging, and production

## Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Ensure your `.env` file has the database connection details:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fuelwatch_db
```

## Usage

### Apply Migrations
Run all pending migrations:
```bash
npm run migrate:up
```

### Rollback Last Migration
```bash
npm run migrate:down
```

### Create New Migration
```bash
npm run migrate:create add_new_column
```

This creates a new migration file in `migrations/` with the format:
```
migrations/YYYYMMDDHHMMSS-add-new-column.js
```

### Reset Database
**⚠️ WARNING**: This drops all tables and re-runs migrations from scratch:
```bash
npm run migrate:reset
```

## Migration File Structure

Each migration has two functions:

```javascript
exports.up = function(db) {
  // Changes to apply
  return db.addColumn('employees', 'new_field', {
    type: 'string',
    length: 50
  });
};

exports.down = function(db) {
  // How to revert the changes
  return db.removeColumn('employees', 'new_field');
};
```

## Docker

When using Docker Compose, migrations run automatically on container startup:
```bash
docker-compose up
```

The backend container:
1. Waits for database to be ready
2. Runs `npm run migrate:up`
3. Starts the application

## Examples

### Adding a Column
```javascript
exports.up = function(db) {
  return db.addColumn('employees', 'department', {
    type: 'string',
    length: 100,
    notNull: false
  });
};

exports.down = function(db) {
  return db.removeColumn('employees', 'department');
};
```

### Creating an Index
```javascript
exports.up = function(db) {
  return db.addIndex('employees', 'idx_employee_email', ['email']);
};

exports.down = function(db) {
  return db.removeIndex('employees', 'idx_employee_email');
};
```

### Complex SQL
```javascript
exports.up = function(db) {
  return db.runSql(`
    ALTER TABLE employees
    ADD COLUMN last_login TIMESTAMP NULL;
  `);
};

exports.down = function(db) {
  return db.runSql(`
    ALTER TABLE employees
    DROP COLUMN last_login;
  `);
};
```

## Best Practices

1. **Always test migrations** in development before production
2. **Write reversible migrations** - every `up` should have a matching `down`
3. **One change per migration** - easier to track and rollback
4. **Never edit existing migrations** - create new ones instead
5. **Backup before migrating** in production

## Troubleshooting

### Migration Failed
Check the error message and:
1. Verify database connection
2. Check SQL syntax
3. Ensure database user has proper permissions
4. Review `migrations_log` table for migration status

### Reset Development Database
```bash
# Method 1: Use reset command
npm run migrate:reset

# Method 2: Manual reset
mysql -u root -p
DROP DATABASE fuelwatch_db;
CREATE DATABASE fuelwatch_db;
exit
npm run migrate:up
```

## Migration History

Migrations are tracked in the `migrations` table in your database. You can view the history:
```sql
SELECT * FROM migrations ORDER BY run_on DESC;
```
