// Database module using IndexedDB for local storage
// This provides persistent storage without a server

class TractorServiceDatabase {
    constructor() {
        this.dbName = 'TractorServiceDB';
        this.storeName = 'services';
        this.version = 2; // Incremented version to support unique VIN index
        this.db = null;
    }

    // Initialize the database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('Database failed to open');
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database opened successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, {
                        keyPath: 'id',
                        autoIncrement: true
                    });

                    // Create indexes for better querying
                    // VIN is now unique to prevent duplicate tractors
                    objectStore.createIndex('tractorId', 'tractorId', { unique: true });
                    objectStore.createIndex('serviceDate', 'serviceDate', { unique: false });
                    objectStore.createIndex('serviceType', 'serviceType', { unique: false });
                    
                    console.log('Database setup complete with unique VIN index');
                } else {
                    // Handle schema upgrade for existing databases
                    const objectStore = event.target.transaction.objectStore(this.storeName);
                    try {
                        // Remove old index if it exists
                        objectStore.deleteIndex('tractorId');
                    } catch (e) {
                        // Index might not exist, that's okay
                    }
                    // Create new unique index
                    objectStore.createIndex('tractorId', 'tractorId', { unique: true });
                }
            };
        });
    }

    // Add a new service record
    async addService(serviceData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);

            const data = {
                ...serviceData,
                createdAt: new Date().toISOString(),
                id: undefined // Let autoIncrement handle the ID
            };

            const request = objectStore.add(data);

            request.onsuccess = () => {
                console.log('Service added successfully with ID:', request.result);
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Error adding service:', request.error);
                
                // Check if error is due to duplicate VIN
                if (request.error.name === 'ConstraintError') {
                    const error = new Error('This VIN already exists in the database');
                    error.name = 'VINError';
                    reject(error);
                } else {
                    reject(request.error);
                }
            };
        });
    }

    // Get all service records
    async getAllServices() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.getAll();

            request.onsuccess = () => {
                const records = request.result.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                resolve(records);
            };

            request.onerror = () => {
                console.error('Error retrieving services:', request.error);
                reject(request.error);
            };
        });
    }

    // Get services by tractor VIN
    async getServicesByTractorId(tractorId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const index = objectStore.index('tractorId');
            const request = index.getAll(tractorId);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Error retrieving services by tractor VIN:', request.error);
                reject(request.error);
            };
        });
    }

    // Get services by type
    async getServicesByType(serviceType) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const index = objectStore.index('serviceType');
            const request = index.getAll(serviceType);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Error retrieving services by type:', request.error);
                reject(request.error);
            };
        });
    }

    // Delete a service record
    async deleteService(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.delete(id);

            request.onsuccess = () => {
                console.log('Service deleted successfully');
                resolve();
            };

            request.onerror = () => {
                console.error('Error deleting service:', request.error);
                reject(request.error);
            };
        });
    }

    // Update a service record
    async updateService(id, updatedData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            
            // First get the existing record
            const getRequest = objectStore.get(id);

            getRequest.onsuccess = () => {
                const record = getRequest.result;
                if (!record) {
                    reject(new Error('Record not found'));
                    return;
                }

                const updated = {
                    ...record,
                    ...updatedData,
                    updatedAt: new Date().toISOString()
                };

                const putRequest = objectStore.put(updated);

                putRequest.onsuccess = () => {
                    console.log('Service updated successfully');
                    resolve(updated);
                };

                putRequest.onerror = () => {
                    reject(putRequest.error);
                };
            };

            getRequest.onerror = () => {
                reject(getRequest.error);
            };
        });
    }

    // Clear all records
    async clearAllServices() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.clear();

            request.onsuccess = () => {
                console.log('All services cleared');
                resolve();
            };

            request.onerror = () => {
                console.error('Error clearing services:', request.error);
                reject(request.error);
            };
        });
    }
}

// Create and export a single instance
const tractorDB = new TractorServiceDatabase();
