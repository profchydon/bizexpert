export class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string) {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

interface InstallStoragesOptions {
  localStorage?: MemoryStorage;
  sessionStorage?: MemoryStorage;
}

export function installStorages({
  localStorage,
  sessionStorage,
}: InstallStoragesOptions) {
  const target = globalThis as unknown as {
    localStorage?: MemoryStorage;
    sessionStorage?: MemoryStorage;
  };

  target.localStorage = localStorage;
  target.sessionStorage = sessionStorage;
}
