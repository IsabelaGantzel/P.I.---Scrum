const jwtManager = require("../services/jwtManager");

const BEARER = "Bearer ";
async function authorize(req, res, next) {
  const bearerToken = req.headers["Authorization"];
  if (bearerToken && bearerToken.startsWith(BEARER)) {
    try {
      const token = bearerToken.slice(BEARER.length);
      req.data.token = await jwtManager.readToken(token);
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        res.status(401).json({ error: "Authorization token expired" });
      } else {
        next(err);
      }
    }
  } else {
    res.status(401).json({ error: "Missing authorization token" });
  }
}

module.exports = authorize;
