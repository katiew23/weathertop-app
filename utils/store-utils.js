import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import * as fs from "fs";

export function initStore(dataType) {
  const store = {
    file: `./models/${dataType}.json`,
    [dataType]: [],
  };
  const db = new Low(new JSONFile(store.file));
  if (!fs.existsSync(store.file)) {
    fs.writeFileSync(store.file, JSON.stringify(store));
  }
  return db;
}
//You tell it the name ("reports", "stations", "users").
//It builds the filename (models/reports.json, etc.) and makes sure the file exists (creating an empty one if it doesn’t).
// //It hands you back a db object that already knows which file to read from or write to whenever you call db.read() or db.write().
