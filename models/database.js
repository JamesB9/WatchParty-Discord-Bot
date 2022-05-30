const Database = require('better-sqlite3');
const fs = require('fs')
const db = new Database('./models/database.db', { verbose: console.log })
initialiseDDL("./models/listDDL.sql", db);

function initialiseDDL(path, db) {
    try {
        const data_definition = fs.readFileSync(path, 'utf-8');
        db.exec(data_definition);
    } catch (ex) {
        throw ex;
    }
}

module.exports = {db};