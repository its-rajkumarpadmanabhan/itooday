import { JournalEntry, TaskItem } from '../../features/calendar/models/entry_model';

const DB_NAME = 'calendo_sqlite_db';
const DB_VERSION = 1;
const ENTRIES_STORE = 'entries';
const TASKS_STORE = 'tasks';
const SETTINGS_STORE = 'settings';

class CalendoDatabase {
  private db: IDBDatabase | null = null;
  private isInitialized = false;

  public async init(): Promise<void> {
    if (this.isInitialized && this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // ENTRIES TABLE
        if (!db.objectStoreNames.contains(ENTRIES_STORE)) {
          const entriesStore = db.createObjectStore(ENTRIES_STORE, { keyPath: 'id' });
          entriesStore.createIndex('idx_entries_date_key', 'date_key', { unique: true });
          entriesStore.createIndex('idx_entries_year_month', ['year', 'month'], { unique: false });
        }

        // TASKS TABLE
        if (!db.objectStoreNames.contains(TASKS_STORE)) {
          const tasksStore = db.createObjectStore(TASKS_STORE, { keyPath: 'id' });
          tasksStore.createIndex('idx_tasks_entry_id', 'entry_id', { unique: false });
        }

        // SETTINGS TABLE
        if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
          db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.isInitialized = true;
        resolve();
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  // Get all entries with their tasks joined
  public async getAllEntries(): Promise<JournalEntry[]> {
    await this.init();
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([ENTRIES_STORE, TASKS_STORE], 'readonly');
      const entriesStore = tx.objectStore(ENTRIES_STORE);
      const tasksStore = tx.objectStore(TASKS_STORE);

      const entriesReq = entriesStore.getAll();
      const tasksReq = tasksStore.getAll();

      tx.oncomplete = () => {
        const rawEntries: JournalEntry[] = entriesReq.result || [];
        const rawTasks: TaskItem[] = tasksReq.result || [];

        // Group tasks by entry_id
        const tasksByEntry = new Map<string, TaskItem[]>();
        for (const task of rawTasks) {
          if (!tasksByEntry.has(task.entry_id)) {
            tasksByEntry.set(task.entry_id, []);
          }
          tasksByEntry.get(task.entry_id)!.push(task);
        }

        // Attach tasks
        const combined = rawEntries.map((e) => ({
          ...e,
          tasks: (tasksByEntry.get(e.id) || []).sort((a, b) => a.sort_order - b.sort_order),
        }));

        resolve(combined);
      };

      tx.onerror = () => reject(tx.error);
    });
  }

  // Get entry by date_key ('YYYY-MM-DD')
  public async getEntryByDate(dateKey: string): Promise<JournalEntry | null> {
    await this.init();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([ENTRIES_STORE, TASKS_STORE], 'readonly');
      const entriesStore = tx.objectStore(ENTRIES_STORE);
      const index = entriesStore.index('idx_entries_date_key');
      const req = index.get(dateKey);

      req.onsuccess = () => {
        const entry: JournalEntry | undefined = req.result;
        if (!entry) {
          resolve(null);
          return;
        }

        const tasksStore = tx.objectStore(TASKS_STORE);
        const taskIndex = tasksStore.index('idx_tasks_entry_id');
        const tasksReq = taskIndex.getAll(entry.id);

        tasksReq.onsuccess = () => {
          const tasks: TaskItem[] = tasksReq.result || [];
          entry.tasks = tasks.sort((a, b) => a.sort_order - b.sort_order);
          resolve(entry);
        };
      };

      req.onerror = () => reject(req.error);
    });
  }

  // Save or update an entry and its cascade tasks
  public async saveEntry(entry: JournalEntry): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([ENTRIES_STORE, TASKS_STORE], 'readwrite');
      const entriesStore = tx.objectStore(ENTRIES_STORE);
      const tasksStore = tx.objectStore(TASKS_STORE);

      // Clone entry without nested tasks array for storage in entriesStore
      const { tasks, ...entryToSave } = entry;
      entryToSave.updated_at = new Date().toISOString();
      if (!entryToSave.created_at) {
        entryToSave.created_at = new Date().toISOString();
      }

      // Check if an entry with the same date_key already exists
      const dateIndex = entriesStore.index('idx_entries_date_key');
      const getExistingDateReq = dateIndex.get(entryToSave.date_key);

      getExistingDateReq.onsuccess = () => {
        const existing = getExistingDateReq.result;
        if (existing && existing.id !== entryToSave.id) {
          // Delete older entry under previous ID to prevent ConstraintError on unique index
          entriesStore.delete(existing.id);
        }

        entriesStore.put(entryToSave);

        // Clear existing tasks for this entry_id
        const taskIndex = tasksStore.index('idx_tasks_entry_id');
        const getExistingTasks = taskIndex.getAllKeys(entry.id);

        getExistingTasks.onsuccess = () => {
          const keys = getExistingTasks.result;
          for (const key of keys) {
            tasksStore.delete(key);
          }

          // Insert new tasks
          if (tasks && tasks.length > 0) {
            tasks.forEach((t, idx) => {
              tasksStore.put({
                id: t.id || `${entry.id}_task_${Date.now()}_${idx}`,
                entry_id: entry.id,
                content: t.content,
                is_completed: t.is_completed ? 1 : 0,
                sort_order: t.sort_order ?? idx,
              });
            });
          }
        };
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => {
        console.error('IndexedDB saveEntry failed:', tx.error);
        reject(tx.error);
      };
    });
  }

  // Delete an entry and cascade delete tasks
  public async deleteEntry(entryId: string): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([ENTRIES_STORE, TASKS_STORE], 'readwrite');
      const entriesStore = tx.objectStore(ENTRIES_STORE);
      const tasksStore = tx.objectStore(TASKS_STORE);

      entriesStore.delete(entryId);

      const taskIndex = tasksStore.index('idx_tasks_entry_id');
      const getExistingTasks = taskIndex.getAllKeys(entryId);

      getExistingTasks.onsuccess = () => {
        const keys = getExistingTasks.result;
        for (const key of keys) {
          tasksStore.delete(key);
        }
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Export full database as JSON/SQL schema backup
  public async exportDatabase(): Promise<{
    version: number;
    exported_at: string;
    entries: JournalEntry[];
  }> {
    const entries = await this.getAllEntries();
    return {
      version: DB_VERSION,
      exported_at: new Date().toISOString(),
      entries,
    };
  }

  // Import entries into database
  public async importDatabase(entries: JournalEntry[]): Promise<void> {
    for (const entry of entries) {
      await this.saveEntry(entry);
    }
  }

  // Clear all data
  public async clearAll(): Promise<void> {
    await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction([ENTRIES_STORE, TASKS_STORE], 'readwrite');
      tx.objectStore(ENTRIES_STORE).clear();
      tx.objectStore(TASKS_STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export const appDatabase = new CalendoDatabase();
