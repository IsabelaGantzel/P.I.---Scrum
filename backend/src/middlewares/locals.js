module.exports = (req, res, next) => {
  // @ts-ignore
  req.locals = {};
  next();
};
