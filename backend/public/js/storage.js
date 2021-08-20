const storage = (() => {
  function Store(key) {
    return {
      set(value) {
        localStorage.setItem(key, value);
      },
      get() {
        return localStorage.getItem(key);
      },
    };
  }

  const prefix = "app-scrum-";
  const keys = ["token"].map((key) => [key, Store(prefix + key)]);

  return Object.fromEntries(keys);
})();
