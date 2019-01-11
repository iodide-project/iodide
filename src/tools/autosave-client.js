import Dexie from "dexie";

const db = new Dexie("autosaveDB");
db.version(1).stores({
  autosave: ""
});

export default db;
