#!/usr/bin/env node
const fs = require("fs").promises;
const path = require("path");

const DB_PATH = path.join(__dirname, "db.json");
const HISTORY_FILE = path.join(__dirname, "migrations_history.json");
const SEED_FILE = path.join(__dirname, "seeds", "seed-data.json");

const initialDb = {
  schema: {},
  data: {}
};

const initialHistory = [];

const initialSeedData = {
  users: [
    {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      createdAt: "2025-01-01T10:00:00.000Z",
      age: 30,
      phone: "555-1234"
    },
    {
      id: 2,
      name: "Bob",
      email: "bob@example.com",
      createdAt: "2025-01-02T12:00:00.000Z",
      age: 25,
      phone: "555-5678"
    }
  ]
};

(async function () {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(initialDb, null, 2));
    await fs.writeFile(HISTORY_FILE, JSON.stringify(initialHistory, null, 2));
    await fs.writeFile(SEED_FILE, JSON.stringify(initialSeedData, null, 2));
    console.log("Reset complete: db.json, migrations_history.json, and seed-data.json restored to initial states.");
  } catch (err) {
    console.error("Error during reset:", err);
  }
})();