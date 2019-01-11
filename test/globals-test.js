const Dexie = require("dexie");
Dexie.dependencies.indexedDB = require("fake-indexeddb");
Dexie.dependencies.IDBKeyRange = require("fake-indexeddb/lib/FDBKeyRange");
