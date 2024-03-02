module.exports = {
  ensureAuthenticated: function (req, res, next) {
    //checks if user has a session
    if (req.isAuthenticated()) {
      return next();
    } else {
      // if user is not authenticated(if they dont have a current session) then they get redirect to login page
      res.redirect("/auth/login");
    }
  },
  // checks if user is alrdy logged in
  forwardAuthenticated: function (req, res, next) {
    // if they are not logged in, then call next()
    if (!req.isAuthenticated()) {
      return next();
    }
    // take them to dashboard
    res.redirect("/dashboard");
  },
};
