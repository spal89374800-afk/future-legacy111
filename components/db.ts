
import { SavedRecording } from '../types.ts';

const DB_NAME = 'FutureLegacyDB';
const STORE_NAME = 'recordings';

// In-memory fallback if IndexedDB is disabled, blocked, or unavailable
let memoryRecordings: SavedRecording[] = [];

export const initDB = async (): Promise<boolean> => {
  try {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') return false;
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e: any) => {
          try {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
          } catch {}
        };
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
        request.onblocked = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  } catch {
    return false;
  }
};

export const addRecording = async (rec: Omit<SavedRecording, 'id'>): Promise<number> => {
  try {
    if (typeof indexedDB === 'undefined') {
      const id = Date.now();
      memoryRecordings.push({ ...rec, id });
      return id;
    }
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, 1);
        request.onsuccess = (e: any) => {
          try {
            const db = e.target.result;
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const addReq = store.add(rec);
            addReq.onsuccess = () => resolve(addReq.result as number);
            addReq.onerror = () => {
              const id = Date.now();
              memoryRecordings.push({ ...rec, id });
              resolve(id);
            };
          } catch {
            const id = Date.now();
            memoryRecordings.push({ ...rec, id });
            resolve(id);
          }
        };
        request.onerror = () => {
          const id = Date.now();
          memoryRecordings.push({ ...rec, id });
          resolve(id);
        };
      } catch {
        const id = Date.now();
        memoryRecordings.push({ ...rec, id });
        resolve(id);
      }
    });
  } catch {
    const id = Date.now();
    memoryRecordings.push({ ...rec, id });
    return id;
  }
};

export const getAllRecordings = async (userId: string): Promise<SavedRecording[]> => {
  try {
    if (typeof indexedDB === 'undefined') {
      return memoryRecordings.filter((r) => r.userId === userId);
    }
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, 1);
        request.onsuccess = (e: any) => {
          try {
            const db = e.target.result;
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const getAllReq = store.getAll();
            getAllReq.onsuccess = () => {
              const items = getAllReq.result || [];
              resolve(items.filter((r: SavedRecording) => r.userId === userId));
            };
            getAllReq.onerror = () => {
              resolve(memoryRecordings.filter((r) => r.userId === userId));
            };
          } catch {
            resolve(memoryRecordings.filter((r) => r.userId === userId));
          }
        };
        request.onerror = () => {
          resolve(memoryRecordings.filter((r) => r.userId === userId));
        };
      } catch {
        resolve(memoryRecordings.filter((r) => r.userId === userId));
      }
    });
  } catch {
    return memoryRecordings.filter((r) => r.userId === userId);
  }
};

export const deleteRecording = async (id: number): Promise<void> => {
  try {
    memoryRecordings = memoryRecordings.filter((r) => r.id !== id);
    if (typeof indexedDB === 'undefined') return;
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, 1);
        request.onsuccess = (e: any) => {
          try {
            const db = e.target.result;
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            store.delete(id).onsuccess = () => resolve();
          } catch {
            resolve();
          }
        };
        request.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  } catch {
    // ignore
  }
};

