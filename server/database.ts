import { Kysely, SqliteDialect } from 'kysely';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import initSqlJs from 'sql.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../data/database.sqlite');

interface MessageTable {
  id: number;
  username: string;
  content: string;
  timestamp: number;
  created_at: string;
}

interface UserTable {
  id: number;
  username: string;
  created_at: string;
}

interface DatabaseSchema {
  messages: MessageTable;
  users: UserTable;
}

let db: Kysely<DatabaseSchema> | null = null;

export async function initDatabase() {
  try {
    const SQL = await initSqlJs();
    
    let filebuffer: Buffer | null = null;
    try {
      filebuffer = await fs.readFile(dbPath);
    } catch (e) {
      console.log('Creating new database');
    }

    const database = filebuffer ? new SQL.Database(filebuffer) : new SQL.Database();
    
    // Simple in-memory storage wrapper
    const dialectDb = {
      prepare: (sql: string) => ({
        all: (...params: any[]) => {
          try {
            const stmt = database.prepare(sql);
            stmt.bind(params);
            const result: any[] = [];
            while (stmt.step()) {
              result.push(stmt.getAsObject());
            }
            stmt.free();
            return result;
          } catch (e) {
            console.error('Query error:', sql, e);
            return [];
          }
        },
        run: (...params: any[]) => {
          try {
            const stmt = database.prepare(sql);
            stmt.bind(params);
            stmt.step();
            stmt.free();
            database.run('PRAGMA foreign_keys=ON');
            return { changes: database.getRowsModified() };
          } catch (e) {
            console.error('Execute error:', sql, e);
            return { changes: 0 };
          }
        },
        get: (...params: any[]) => {
          try {
            const stmt = database.prepare(sql);
            stmt.bind(params);
            if (stmt.step()) {
              const result = stmt.getAsObject();
              stmt.free();
              return result;
            }
            stmt.free();
            return undefined;
          } catch (e) {
            console.error('Get error:', sql, e);
            return undefined;
          }
        }
      }),
      exec: (sql: string) => {
        try {
          return database.run(sql);
        } catch (e) {
          console.error('Exec error:', sql, e);
        }
      }
    };

    db = new Kysely<DatabaseSchema>({
      dialect: new SqliteDialect({ database: dialectDb as any }),
      log: ['query', 'error']
    });

    // Ensure tables exist
    try {
      dialectDb.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          content TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          created_at TEXT NOT NULL
        );
      `);
    } catch (e) {
      console.error('Failed to create tables:', e);
    }

    console.log('Database initialized at:', dbPath);
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export async function saveMessage(username: string, content: string, timestamp: number) {
  const database = getDatabase();
  await database
    .insertInto('messages')
    .values({ username, content, timestamp, created_at: new Date().toISOString() })
    .execute();

  const rows = await database
    .selectFrom('messages')
    .selectAll()
    .orderBy('id', 'desc')
    .limit(1)
    .execute();
  return rows[0];
}

export async function getAllMessages() {
  const database = getDatabase();
  const rows = await database
    .selectFrom('messages')
    .selectAll()
    .orderBy('timestamp')
    .execute();
  return rows;
}

export async function createUserIfNotExists(username: string) {
  const database = getDatabase();
  const existing = await database.selectFrom('users').selectAll().where('username', '=', username).execute();
  if (existing && existing.length > 0) return existing[0];
  await database.insertInto('users').values({ username, created_at: new Date().toISOString() }).execute();
  const rows = await database.selectFrom('users').selectAll().where('username', '=', username).execute();
  return rows[0];
}
