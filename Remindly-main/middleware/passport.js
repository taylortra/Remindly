const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userController = require("../controller/userController");
const GitHubStrategy = require("passport-github2").Strategy;
const userModel = require("../database").userModel;

const GITHUB_CLIENT_ID = "2b28c31eb6c8fe98b73a";
const GITHUB_CLIENT_SECRET = "d3d67ae05172ecb7bb02a3992f1bb5b25fc08daa";

const githubLogin = new GitHubStrategy(
  {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/github/callback",
  },
  function (accessToken, refreshToken, profile, done) {
    let user = userController.getUserById(profile.id)
    if (user) {
      return done(null, user)
    } else {
      userModel.createUser(profile)
      let user = userController.getUserById(profile.id)
      return done(null, user)
    }
  }
);

const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  // function that takes the email and password
  // it talks to the DB and checks if email and passwd are in DB
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    // once found, user info gets stored in "user"
    if (user) {
      return done(null, user);
    } else {
      // if user isnt found, user is returned as false to say there isnt a user with those credentials
      done(null, false, {
        message: "Your password or email is incorrect, please try again",
      });
    }
  }
);
// "user" gets passed into serializedUser
// then it creates a session to store user ID
// also create req.user which stores the whole user object
// cerates a session id (long string)
passport.serializeUser(function (user, done) {
  // passes null and the current users id
  done(null, user.id);
});
// req.user = requested user credentials ex.{id: 1, name: "Jimmy Smith", email: "jim123@gmail.com", password: "jim123!",}
// every page refresh it checks the cookie in browser
passport.deserializeUser(function (id, done) {
  // checks database for same id 
  let user = userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});
module.exports = passport.use(localLogin).use(githubLogin);
