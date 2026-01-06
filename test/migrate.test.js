const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const DB_PATH = path.join(__dirname, '..', 'db.json');
const MIGRATE_CMD = 'node migrate.js';
const RESET_CMD = 'node reset.js';

describe('Migration and Seeding Functionality', () => {
    beforeEach(() => {
        execSync(RESET_CMD);
    });

    afterEach(() => {
        execSync(RESET_CMD);
    });

    it('should apply all migrations correctly', () => {
        execSync(`${MIGRATE_CMD} up`);
        const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        const expectedSchema = ['id', 'name', 'email', 'createdAt'];
        expect(db.schema.users.fields).toEqual(expectedSchema);
        expect(db.data.users).toEqual([]);
    });

    it('should seed data according to current schema and skip if already seeded', () => {
        execSync(`${MIGRATE_CMD} up`);
        const output1 = execSync(`${MIGRATE_CMD} seed`).toString();
        expect(output1.includes('Seeded') && output1.includes("table 'users'")).toBe(true);
        const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        db.data.users.forEach(row => {
            const rowFields = Object.keys(row).sort();
            expect(rowFields).toEqual(['createdAt', 'email', 'id', 'name'].sort());
        });
    });

    it('should rollback the last migration correctly', () => {
        execSync(`${MIGRATE_CMD} up`);
        const output = execSync(`${MIGRATE_CMD} down`).toString();
        expect(output.includes('Rolling back migration') && output.includes('003-add-createdAt')).toBe(true);
        const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        const expectedSchema = ['id', 'name', 'email'];
        expect(db.schema.users.fields).toEqual(expectedSchema);
    });
});
