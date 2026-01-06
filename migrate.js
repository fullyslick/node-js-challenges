#!/usr/bin/envnode
const fs = require("fs").promises;
const path = require("path");

const MIGRATIONS_DIR = path.join(__dirname, "migrations");
const HISTORY_FILE = path.join(__dirname, "migrations_history.json");
const DB_PATH = path.join(__dirname, "db.json");

async function getMigrationHistory() {
  try {
    const content = await fs.readFile(HISTORY_FILE, "utf8");
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
}

async function updateMigrationHistory(history) {
  await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
}

async function loadMigrations() {
  const files = await fs.readdir(MIGRATIONS_DIR);
  // relies on filename ordering (001-, 002-, 003-)
  return files
    .filter((file) => file.endsWith(".js"))
    .sort()
    .map((file) => ({
      version: file.split("-")[0],
      name: file,
      migration: require(path.join(MIGRATIONS_DIR, file)),
    }));
}

/* Implement the logic of migrate up */
async function migrateUp() {
  // Solution -----------------------------------------------------------------------
  const migrations = await loadMigrations();
  const history = await getMigrationHistory();
  const appliedVersions = new Set(history.map(h => h.version));

  const pending = migrations.filter(m => !appliedVersions.has(m.version));

  if (pending.length === 0) {
    console.log("No pending migrations.");
    return;
  }

  const dbContent = await fs.readFile(DB_PATH, "utf8");
  const db = JSON.parse(dbContent);

  for (const m of pending) {
    const migrationName = m.name.replace(".js", "");
    console.log(`Applying migration: ${migrationName}`);

    await m.migration.up(db);

    history.push({
      version: m.version,
      name: m.name,
      appliedAt: new Date().toISOString()
    });

    console.log(`Migration ${migrationName} applied.`);
  }

  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  await updateMigrationHistory(history);

  console.log("All migrations has been applied.");
  // EO: Solution -----------------------------------------------------------------------
}

/* Implement the logic of migrate down */
async function migrateDown() {
  // Solution -----------------------------------------------------------------------
  const history = await getMigrationHistory();

  if (history.length === 0) {
    console.log("No migrations to rollback.");
    return;
  }

  const lastMigration = history[history.length - 1];
  const migrationName = lastMigration.name.replace(".js", "");

  console.log(`Rolling back migration: ${migrationName}.`);

  const migration = require(path.join(MIGRATIONS_DIR, lastMigration.name));

  const dbContent = await fs.readFile(DB_PATH, "utf8");
  const db = JSON.parse(dbContent);

  await migration.down(db);

  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));

  history.pop();
  await updateMigrationHistory(history);

  console.log(`Rolled back migration ${migrationName}.`);
  // EO: Solution -----------------------------------------------------------------------
}

async function seedData() {
  console.log("Seeding data...");
  const seedFilePath = path.join(__dirname, "seeds", "seed-data.json");

  try {
    const fileContent = await fs.readFile(seedFilePath, "utf8");
    const seedObj = JSON.parse(fileContent);
    const dbContent = await fs.readFile(DB_PATH, "utf8");
    const db = JSON.parse(dbContent);

    for (const [table, rows] of Object.entries(seedObj)) {
      // Solution -----------------------------------------------------------------------
      if (!db.schema[table]) {
        console.log(`Table '${table}' does not exist in schema. Skipping.`);
        continue;
      }

      if (db.data[table] && db.data[table].length > 0) {
        console.log(`Table '${table}' already contains data. Skipping.`);
        continue;
      }

      const schemaFields = db.schema[table].fields;

      const filteredRows = rows.map(row => {
        const filteredRow = {};
        for (const field of schemaFields) {
          if (row.hasOwnProperty(field)) {
            filteredRow[field] = row[field];
          }
        }
        return filteredRow;
      });

      db.data[table] = filteredRows;
      console.log(`Seeded ${filteredRows.length} rows into table '${table}'.`);
      // EO: Solution -----------------------------------------------------------------------
    }

    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error("Error seeding data:", err);
  }
}

(async function () {
const [command] = process.argv.slice(2);

switch (command) {
  case 'up':
      await migrateUp();
      break;
 case 'down':
     await migrateDown();
     break;
 case 'seed':
     await seedData();
     break;
 default:
     console.log(`Usage:
node migrate.js up   # Apply pending migrations
node migrate.js down # Rollback Last migration
node migrate.js seed # Seed the database (filtered by current schema)`);
}
})();

