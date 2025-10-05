// In-memory fallback replacement for Redis client.
// Provides a minimal subset of the API used in the app: get, setEx, del.
// This avoids any external Redis dependency while preserving existing imports.

const store = new Map();

function setWithTTL(key, value, ttlSeconds) {
  // Clear any existing timeout for this key
  const existing = store.get(key);
  if (existing && existing.timeout) clearTimeout(existing.timeout);

  const timeout = setTimeout(() => {
    store.delete(key);
  }, ttlSeconds * 1000);

  store.set(key, { value, timeout });
}

const client = {
  // Mimic async Redis API
  async get(key) {
    const entry = store.get(key);
    return entry ? entry.value : null;
  },
  async setEx(key, ttlSeconds, value) {
    setWithTTL(key, value, ttlSeconds);
    return 'OK';
  },
  async del(key) {
    const existed = store.delete(key);
    return existed ? 1 : 0;
  }
};

module.exports = client;