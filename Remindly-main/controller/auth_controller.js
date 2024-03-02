let database = require("../database");

let authController = {
  login: (req, res) => {
    res.render("auth/login");
  },

  register: (req, res) => {
    res.render("auth/register");
  },

  loginSubmit: (req, res) => {
    // implement later
  },

  registerSubmit: (req, res) => {
    // implement later
    let user = db.database.find((user) => user.email === req.body.email);
    if (user) {
      throw new Error(`${req.body.email} already registered`)
    } else {
      db.database.push({
        id: 10,
        name: "Basic Account",
        email: req.body.email,
        password: req.body.password,
        reminders: [],
        role: "user",
      })
    }
    res.render("auth/login")
  },
  adminview: (req, res) => {
    if (req.user.role === "admin") {
     const sessions = req.sessionStore.sessions;
     const sessionArray = Object.entries(sessions).map(
       ([sessionId, sessionData]) => {
         const sessionObject = JSON.parse(sessionData);
         return {
           sessionId,
           expires: sessionObject.cookie.expires,
           user: sessionObject.passport ? sessionObject.passport.user : null,
         };
       }
       );
       res.render("reminder/admin", {sessions: sessionArray});
    } else {
     res.render("auth/admin")
    }
  },
};

module.exports = authController;
