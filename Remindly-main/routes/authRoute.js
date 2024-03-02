const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");

const app = express.Router();
// forwardAuthenticated checks if user is already logged in
app.get("/auth/login", forwardAuthenticated, (req, res) => res.render("login"));

app.post(
  "/auth/login",
  // passport handles the request and response 
  // passport.authenticate("local",...), checks if the username and password is in the local database
  // if "local" was "facebook" it would ask facebook to verify the credentials
  // it later calls the login function, login looks for the ".serializeUser" function
  passport.authenticate("local", {
    // if user credentials exist in DB, sends user to /dashboard
    // takes us to indexRoute.js, which calls /dashboard
    successRedirect: "/dashboard",
    // if user creadentials dont exist in DB, user gets sent back to login page
    failureRedirect: "/auth/login",
  })
);

app.get('/auth/github',
passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
passport.authenticate('github', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});

// destroys session when logging out & redirect to login
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

module.exports = app;
