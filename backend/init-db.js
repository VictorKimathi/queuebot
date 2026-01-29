const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'queue_system.db');
const schemaPath = path.join(__dirname, 'database.sql');

console.log(`Initializing database at ${dbPath}...`);

// Read the schema file
try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Open (or create) the database
    const db = new Database(dbPath);
    
    // Execute the schema
    db.exec(schema);
    
    console.log('Database initialized successfully.');
    db.close();
} catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
}
