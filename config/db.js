const Database = require('better-sqlite3')

const db = new Database('db.sqlite3')

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    username TEXT NOT NULL, 
    passwordHash TEXT NOT NULL)`
    )
db.exec(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT NOT NULL, 
    content TEXT NOT NULL, 
    createdAt TEXT DEFAULT (datetime('now', 'localtime')))
    `)

console.log('Users & posts tables was initialisated.')

module.exports = { db };