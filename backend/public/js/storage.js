const storage = (() => {
  function Store(key) {
    return {
      set(value) {
        if (typeof value === "string") {
          localStorage.setItem(key, value);
        }
      },
      get() {
        return localStorage.getItem(key);
      },
      clear() {
        localStorage.removeItem(key);
      },
    };
  }

  const prefix = "app-scrum-";
  const keys = ["token"].map((key) => [key, Store(prefix + key)]);
  const _storage = Object.fromEntries(keys);

  function clearAll() {
    for (const key in _storage) {
      storage[key].clear();
    }
  }

  return { ..._storage, clearAll };
})();
