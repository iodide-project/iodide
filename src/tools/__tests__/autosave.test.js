/* eslint-disable no-unused-vars */
import { IDBFactory, IDBKeyRange, reset } from 'shelving-mock-indexeddb';

window.indexedDB = new IDBFactory();
window.IDBKeyRange = IDBKeyRange;

describe('it test the autosave', () => {
  beforeEach(() => {
    reset();
  });
  afterEach(() => reset());

  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.runAllTimers());

  it('getAutoSaveState', () => {
    const request = window.indexedDB.open('myDatabase', 1);

    request.addEventListener('upgradeneeded', () => {
      const store = request.result.createObjectStore('myStore');

      const index = store.createIndex('myNameIndex', 'name');
      const anotherIndex = store.createIndex('myLengthIndex', 'length');
    });

    request.addEventListener('success', () => {
      const putTransaction = request.result.transaction(['myStore'], 'readwrite');
      const putStore = putTransaction.objectStore('myStore');
      putStore.put({
        originalCopy: '',
        originalCopyRevision: '',
        originalSaved: 'time at saving',
      }, 'autosavekey')
      const getTransaction = request.result.transaction(['myStore'], 'readonly');
      const getStore = getTransaction.objectStore('myStore');
      getStore.get('autosavekey').addEventListener('success', (event) => {
        console.log('Found', event.target.result);
        expect(event.target.result).toEqual({
          originalCopy: '',
          originalCopyRevision: '',
          originalSaved: 'time at saving',
        })
      });
    });
  });
})
