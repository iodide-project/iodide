import SyncClient from 'sync-client';
// SyncClient is a subclass of Dexie

const databaseName = 'autosaveDB'; // The name for the indexedDB database
const versions = [{
  version: 1,
  stores: {
    autosave: '',
  },
}];

const syncClient = new SyncClient(databaseName, versions);

export default syncClient;
