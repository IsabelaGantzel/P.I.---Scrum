const api = {
  _token: null,
  _setToken(token) {
    api._token = `Bearer ${token}`;
  },
  clearToken(token) {
    api._token = null;
  },
  _getAuthorization() {
    return this._token ? { Authorization: this._token } : {};
  },
  _post(url, { body, headers = {}, ...opts }) {
    return fetch(url, {
      ...opts,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...api._getAuthorization(),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : body,
    }).then((res) => res.json());
  },
  _get(url, opts = {}) {
    return fetch(url, opts).then((res) => res.json());
  },

  async login({ userName, password }) {
    if (api._token) throw new Error("You are already authenticated!");
    const res = await api._post("/api/auth/login", {
      body: { userName, password },
    });
    api._setToken(res.token);
    return res;
  },
  async projects() {
    if (!api._token) throw new Error("Token missing");
    return await api._get("/api/projects");
  },
  async project(projectId) {
    if (!api._token) throw new Error("Token missing");
    return await api._get(`/api/projects/${projectId}`);
  },
  async newProject({ projectName, managerId, clientId, devIds }) {
    if (!api._token) throw new Error("Token missing");
    return await api._post(`/api/projects/`, {
      body: { projectName, managerId, clientId, devIds },
    });
  },
};
