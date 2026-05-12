import initSqlJs, { Database, SqlJsStatic } from "sql.js";
import { openDB, IDBPDatabase } from "idb";
import type { CompanyData, Coordinates, SavedCompany, DataSource } from "@/types";

const IDB_NAME = "firmacheck";
const IDB_STORE = "sqlite";
const IDB_KEY = "main";
const IDB_VERSION = 1;

let sqlPromise: Promise<SqlJsStatic> | null = null;
let dbPromise: Promise<Database> | null = null;
let idbPromise: Promise<IDBPDatabase> | null = null;

function getIdb(): Promise<IDBPDatabase> {
  if (!idbPromise) {
    idbPromise = openDB(IDB_NAME, IDB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      },
    });
  }
  return idbPromise;
}

async function loadSql(): Promise<SqlJsStatic> {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({
      locateFile: (file) => `/sql-wasm/${file}`,
    });
  }
  return sqlPromise;
}

async function loadDb(): Promise<Database> {
  const SQL = await loadSql();
  const idb = await getIdb();
  const stored = (await idb.get(IDB_STORE, IDB_KEY)) as Uint8Array | undefined;
  const db = stored ? new SQL.Database(stored) : new SQL.Database();

  db.run(`
    CREATE TABLE IF NOT EXISTS ares_cache (
      ico TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      fetched_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS geocoding_cache (
      address TEXT PRIMARY KEY,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      fetched_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS saved_companies (
      ico TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      legal_form TEXT NOT NULL,
      legal_form_code TEXT,
      established_date TEXT,
      dissolved_date TEXT,
      status TEXT NOT NULL,
      address TEXT NOT NULL,
      dic TEXT,
      lat REAL,
      lng REAL,
      last_verified_at INTEGER NOT NULL,
      last_source TEXT NOT NULL
    );
  `);

  return db;
}

function getDb(): Promise<Database> {
  if (!dbPromise) dbPromise = loadDb();
  return dbPromise;
}

async function persist(): Promise<void> {
  const db = await getDb();
  const idb = await getIdb();
  const bytes = db.export();
  await idb.put(IDB_STORE, bytes, IDB_KEY);
}

// --- ARES cache ----------------------------------------------------------

export async function getCachedAres(ico: string): Promise<CompanyData | null> {
  const db = await getDb();
  const res = db.exec("SELECT data FROM ares_cache WHERE ico = ?", [ico]);
  if (!res.length || !res[0].values.length) return null;
  try {
    return JSON.parse(res[0].values[0][0] as string) as CompanyData;
  } catch {
    return null;
  }
}

export async function setCachedAres(company: CompanyData): Promise<void> {
  const db = await getDb();
  db.run(
    "INSERT OR REPLACE INTO ares_cache (ico, data, fetched_at) VALUES (?, ?, ?)",
    [company.ico, JSON.stringify(company), Date.now()]
  );
  await persist();
}

// --- Geocoding cache -----------------------------------------------------

export async function getCachedGeocoding(address: string): Promise<Coordinates | null> {
  const db = await getDb();
  const res = db.exec("SELECT lat, lng FROM geocoding_cache WHERE address = ?", [address]);
  if (!res.length || !res[0].values.length) return null;
  const row = res[0].values[0];
  return { lat: row[0] as number, lng: row[1] as number };
}

export async function setCachedGeocoding(address: string, coords: Coordinates): Promise<void> {
  const db = await getDb();
  db.run(
    "INSERT OR REPLACE INTO geocoding_cache (address, lat, lng, fetched_at) VALUES (?, ?, ?, ?)",
    [address, coords.lat, coords.lng, Date.now()]
  );
  await persist();
}

// --- Saved companies -----------------------------------------------------

export async function saveCompany(
  company: CompanyData,
  coords: Coordinates | null,
  source: DataSource
): Promise<void> {
  const db = await getDb();
  db.run(
    `INSERT OR REPLACE INTO saved_companies
      (ico, name, legal_form, legal_form_code, established_date, dissolved_date,
       status, address, dic, lat, lng, last_verified_at, last_source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      company.ico,
      company.name,
      company.legalForm,
      company.legalFormCode,
      company.establishedDate,
      company.dissolvedDate,
      company.status,
      company.address,
      company.dic,
      coords?.lat ?? null,
      coords?.lng ?? null,
      Date.now(),
      source,
    ]
  );
  await persist();
}

export async function deleteSavedCompany(ico: string): Promise<void> {
  const db = await getDb();
  db.run("DELETE FROM saved_companies WHERE ico = ?", [ico]);
  await persist();
}

export async function listSavedCompanies(): Promise<SavedCompany[]> {
  const db = await getDb();
  const res = db.exec(
    `SELECT ico, name, legal_form, legal_form_code, established_date, dissolved_date,
            status, address, dic, lat, lng, last_verified_at, last_source
       FROM saved_companies
       ORDER BY last_verified_at DESC`
  );
  if (!res.length) return [];
  return res[0].values.map((row): SavedCompany => ({
    ico: row[0] as string,
    name: row[1] as string,
    legalForm: row[2] as string,
    legalFormCode: (row[3] as string) ?? "",
    establishedDate: (row[4] as string) ?? null,
    dissolvedDate: (row[5] as string) ?? null,
    status: row[6] as string,
    address: row[7] as string,
    dic: (row[8] as string) ?? null,
    lat: row[9] as number | null,
    lng: row[10] as number | null,
    lastVerifiedAt: row[11] as number,
    lastSource: row[12] as DataSource,
  }));
}

export async function isSaved(ico: string): Promise<boolean> {
  const db = await getDb();
  const res = db.exec("SELECT 1 FROM saved_companies WHERE ico = ? LIMIT 1", [ico]);
  return res.length > 0 && res[0].values.length > 0;
}
