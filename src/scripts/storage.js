
export class SimpleDB {
    constructor(
        storeName,
        version = 1,
        dbName = "app_data"
    ) {
        this.storeName = storeName;
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    async _open() {
        if (this.db) return this.db;

        this.db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = () => {
                const db = request.result;

                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            }

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        return this.db;
    }

    async _transaction(mode, callback) {
        const db = await this._open();

        return new Promise((resolve, reject) => {
            const transition = db.transaction(this.storeName, mode);
            const store = transition.objectStore(this.storeName);
            const result = callback(store);

            transition.oncomplete = () => resolve(result);
            transition.onerror = () => reject(transition.error);
        });
    }

    async get(key) {
        return this._transaction("readonly", store => {
            return new Promise((resolve, reject) => {
                const request = store.get(key);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        });
    }

    async set(key, value) {
        return this._transaction("readwrite", store => store.put(value, key));
    }

    async delete(key) {
        return this._transaction("readwrite", store => store.delete(key));
    }

    async list() {
        return this._transaction("readonly", store => {
            return new Promise((resolve, reject) => {
                const request = store.getAll();

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        });
    }

    async clear() {
        return this._transaction("readwrite", store => store.clear());
    }

    async has(key) {
        return this._transaction("readonly", store => {
            return new Promise((resolve, reject) => {
                const request = store.get(key);

                request.onsuccess = () => resolve(request.result !== undefined);
                request.onerror = () => reject(request.error);
            });
        });
    }
}
