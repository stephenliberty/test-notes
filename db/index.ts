import sqlite3 from 'sqlite3'
import {existsSync, writeFileSync} from 'fs';
import { open, Database } from 'sqlite'

if(!existsSync('db.sqlite')) {
  writeFileSync('db.sqlite', new Buffer(""));
}

sqlite3.verbose()


const openDatabasePromise = open({
  filename: 'db.sqlite',
  driver: sqlite3.Database
}).then(async (db:Database) => {
  //Normally this would be a migration, but we're just using
  //the sqlite database for simplicity

  await db.run(`
    CREATE TABLE IF NOT EXISTS 'note'(
        id string PRIMARY KEY,
        name string,
        note string,
        created_on datetime,
        updated_on datetime
    )
  `)
  return db;
})

export default async function GetConnection (): Promise<Database> {
  return openDatabasePromise;
}