# Node.js: Database Migration Simulator

Implement a Node.js CLI tool that simulates a file-based database migration and seeding system. The tool will manage a single table (for example, a users table) that evolves over time through versioned migration scripts. Each migration script modifies the table's schema (for example, creating the table, adding new fields, etc.) and may update existing data accordingly.

## Requirements:
### Migration Management:
• Versioned Migrations: Create migration scripts (for example, 001-create-users.js, 002-add-email.js, 003-add-createdAt.js) that define up and down functions.
• History Tracking: Maintain a migrations_history.json file to track which migrations have been applied.
• Rollback: Provide a mechanism to rollback the last migration.
### Seeding:
• Seed Data: Use a JSON file (for example, seeds/seed-data.json) to provide sample data for the table.
• Schema Filtering: When seeding, include only the fields defined in the current schema of the table. Extra fields in the seed file must be ignored.
• Idempotency: If the table already contains data, seeding should not overwrite it; instead, inform the user that data is already present.
### CLI Commands:
• node migrate.js up — Apply all pending migrations.
• node migrate.js down — Rollback the last migration.
• node migrate.js seed — Seed the database.

### CLI Commands Explanation:
• node migrate.js up - Applies all pending migrations sequentially.
Example:
````sh
Applying migration: 001-create-users
Migration 001-create-users applied.
Applying migration: 002-add-email
Migration 002-add-email applied.
Applying migration: 003-add-createdAt
All migrations has been applied.
````
The database schema is updated to 'id", "name", "email", "createdAt"].
Below is an example of how db.json might look after these migrations:

````json
{
  "schema": {
    "users": {
      "fields": [
        "id",
        "name",
        "email",
        "createdAt"
      ]
    }
  },
  "data": {
    "users": []
  }
}
````

And migrations_history.json might look like:

````json
[
  {
    "version": "001",
    "name": "001-create-users.js",
    "appliedAt": "2025-02-07T12: 00: 00.000Z"
  },
  {
    "version": "002",
    "name": "002-add-email.js",
    "appliedAt": "2025-02-07T12:00:05.ee0Z"
  },
  {
    "version": "003",
    "name": "003-add-createdat.js",
    "appliedAt": "2025-02-07T12: 00:10.000Z"
  }
]
````

• node migrate.js down - Rolls back the last applied migration one at a time.

Example:
````shell
Rolling back migration: 003-add-createdAt.
Rolled back migration 003-add-createdAt.

````

The schema then reverts to ["id", "name", "email"], and migrations_history.json is updated to remove the last entry.

• node migrate.js seed - Seeds the database using data from seeds/seed-data.json, filtering only the fields defined in the current schema.
Example:
````shell
Seeding data...
Seeded 2 rows into table 'users'.
````

If the current schema is ["id", "name", "email"], extra fields are ignored. If users already contain data, no additional rows will be added.

Note:
• The migration scripts are partially coded. You need to implement migrate.js with functionality for migrating up, migrating down, and seeding.
• Only the files to be modified are migrate.js and the migration files in the migrations/ directory.
• A reset command (node reset.js) will be provided, It resets db.json, migrations_history.json, and seeds/seed-data.json to their initial states.


