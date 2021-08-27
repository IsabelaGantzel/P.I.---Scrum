const jwtManager = require("../services/jwtManager");

const BEARER = "Bearer ";
async function authorize(req, res, next) {
  const bearerToken = req.headers.authorization;
  if (bearerToken && bearerToken.startsWith(BEARER)) {
    try {
      const token = bearerToken.slice(BEARER.length);
      req.locals.token = await jwtManager.readToken(token);
      next();
    } catch (err) {
      switch (err.name) {
        case "TokenExpiredError":
          res.status(401).json({ error: "Expired authorization token" });
          break;
        case "JsonWebTokenError":
        case "NotBeforeError":
          res.status(401).json({ error: "Invalid authorization token" });
          break;
        default:
          next(err);
          break;
      }
    }
  } else {
    res.status(401).json({ error: "Missing authorization token" });
  }
}

module.exports = authorize;
