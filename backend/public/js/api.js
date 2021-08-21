const api = (() => {
  let token = null;
  function getAuthorization() {
    return this._token ? { Authorization: this._token } : {};
  }
  function post(url, { body, headers = {}, ...opts }) {
    return fetch(url, {
      ...opts,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthorization(),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : body,
    }).then((res) => res.json());
  }
  function get(url, opts = {}) {
    return fetch(url, opts).then((res) => res.json());
  }
  function setToken(token) {
    token = `Bearer ${token}`;
  }

  return {
    clearToken() {
      token = null;
    },
    async login({ userName, password }) {
      if (token) throw new Error("You are already authenticated!");
      const res = await post("/api/auth/login", {
        body: { userName, password },
      });
      setToken(res.token);
      return res;
    },
    async projects() {
      if (!token) throw new Error("Token missing");
      return await get("/api/projects");
    },
    async project(projectId) {
      if (!token) throw new Error("Token missing");
      return await get(`/api/projects/${projectId}`);
    },
    async newProject({ projectName, managerId, clientId, devIds }) {
      if (!token) throw new Error("Token missing");
      return await post(`/api/projects/`, {
        body: { projectName, managerId, clientId, devIds },
      });
    },
  };
})();
