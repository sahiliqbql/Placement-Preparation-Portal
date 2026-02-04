module.exports = function isLoggedIn(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/users/login");
  }
  next();
};
