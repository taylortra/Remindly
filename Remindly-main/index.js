const express = require("express");
const app = express();
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const multer  = require('multer')
const session = require("express-session");
const upload = multer({ dest: 'uploads/' })
//testing from armaan
app.use(express.static(path.join(__dirname, "public")));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.urlencoded({ extended: false }));

app.use(ejsLayouts);

app.set("view engine", "ejs");
const reminderController = require("./controller/reminder_controller");
const authController = require("./controller/auth_controller");
const passport = require("./middleware/passport");
const checkAuth = require("./middleware/checkAuth");
app.use(
  session({
    //secret makes cooking stored in browser
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
// allows passport to create sessions
app.use(passport.session());
// Routes start here
app.get("/reminders", reminderController.list);
app.get("/reminder/new", checkAuth.ensureAuthenticated, reminderController.new);
app.get("/reminder/:id", checkAuth.ensureAuthenticated, reminderController.listOne);
app.get("/reminder/:id/edit", checkAuth.ensureAuthenticated, reminderController.edit);

app.post("/reminder", upload.single('cover'), reminderController.create);
// ⭐ Implement these two routes below!
app.post("/reminder/update/:id", reminderController.update);
app.post("/reminder/delete/:id", reminderController.delete);
app.post("/reminder/", upload.single('cover'), reminderController.create);


// 👌 Ignore for now
app.post("/auth/login", passport.authenticate("local", {
    successRedirect: "/reminders",
    failureRedirect: "/auth/login",
  })
);
app.get("/auth/register", authController.register);
app.get("/auth/login", authController.login);
app.post("/auth/register", authController.registerSubmit);

app.post("/revoke-session/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  req.sessionStore.destroy(sessionId, (err) => {
    if (err) {
      console.log(err);
    } else {
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
    }
  });
});

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/reminders");
  }
);
app.listen(3001, function () {
  console.log(
    "Server running. Visit: http://localhost:3001/reminders in your browser 🚀"
  );
});
