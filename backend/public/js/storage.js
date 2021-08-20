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

  return Object.fromEntries(keys);
})();
