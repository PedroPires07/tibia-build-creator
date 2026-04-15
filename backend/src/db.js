import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const databasePath = path.join(__dirname, '../data/database.db')

export async function initDb() {
  const dir = path.dirname(databasePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const db = await open({
    filename: databasePath,
    driver: sqlite3.Database
  })

  await db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      main_class TEXT,
      level INTEGER DEFAULT 1,
      avatar_url TEXT,
      bio TEXT,
      join_date TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      builds_count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS builds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      class TEXT NOT NULL,
      level INTEGER NOT NULL,
      description TEXT,
      equipment_json TEXT,
      stats_json TEXT,
      is_public INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      build_id INTEGER,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_url TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(build_id) REFERENCES builds(id) ON DELETE SET NULL
    );
  `)

  return db
}

export async function openDb() {
  return open({
    filename: databasePath,
    driver: sqlite3.Database
  })
}
