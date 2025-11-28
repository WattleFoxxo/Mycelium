
export class SimpleDB {
    constructor(
        dbName,
        version,
        stores,
    ) {
        this.dbName = dbName;
        this.version = version;
        this.stores = stores;
        this.db = null;
    }

    async open() {
        if (this.db) return this.db;

        this.db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                for (const [storeName, config] of Object.entries(this.stores)) {
                    if (!db.objectStoreNames.contains(storeName)) {
                        const store = db.createObjectStore(storeName, {
                            keyPath: config.keyPath,
                            autoIncrement: config.autoIncrement ?? false,
                        });

                        if (Array.isArray(config.indexes)) {
                            for (const index of config.indexes) {
                                store.createIndex(index.name, index.keyPath, {
                                    unique: index.unique ?? false
                                });
                            }
                        }
                    }
                }
            }

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        return this.db;
    }

    async transaction(store, mode) {
        const db = await this.open();
        return db.transaction(store, mode).objectStore(store);
    }

    async get(store, key) {
        const objectStore = await this.transaction(store, "readonly");

        return new Promise((resolve, reject) => {
            const request = objectStore.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAll(store) {
        const objectStore = await this.transaction(store, "readonly");

        return new Promise((resolve, reject) => {
            const request = objectStore.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getByIndex(store, index, value) {
        const objectStore = await this.transaction(store, "readonly");
        const indexObject = objectStore.index(index);

        return new Promise((resolve, reject) => {
            const results = [];
            const request = indexObject.openCursor(IDBKeyRange.only(value));

            request.onsuccess = (event) => {
                const cursor = event.target.result;

                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };

            request.onerror = () => reject(request.error);
        });
    }

    async has(store, key) {
         const objectStore = await this.transaction(store, "readonly");

        return new Promise((resolve, reject) => {
            const request = objectStore.get(key);

            request.onsuccess = () => resolve(request.result !== undefined);
            request.onerror = () => reject(request.error);
        });
    }

    async add(store, data) {
        const objectStore = await this.transaction(store, "readwrite");

        return new Promise((resolve, reject) => {
            const request = objectStore.add(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async put(store, data) {
        const objectStore = await this.transaction(store, "readwrite");

        return new Promise((resolve, reject) => {
            const request = objectStore.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(store, id) {
        const objectStore = await this.transaction(store, "readwrite");

        return new Promise((resolve, reject) => {
            const request = objectStore.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clear(store) {
        const objectStore = await this.transaction(store, "readwrite");

        return new Promise((resolve, reject) => {
            const request = objectStore.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}
