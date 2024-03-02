let database = require("../database");
const access_key = 'qz6IjWtEoTGZwEzdyiApKRJMBTWnpA2YrDdxrEsqkEI'

let remindersController = {
  list: (req, res) => {
    if (!req.user) {
      res.redirect('auth/login');
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
      });
      if (req.user.role === "admin") {
        res.render("reminder/admin", { sessions: sessionArray });
      } else {
        res.render("reminder/index", { reminders: req.user.reminders });
      }
    }
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: req.user.reminders });
    }
  },

  create: async (req, res) => { // added async here
    console.log(req.body);
    let reminder = {
        id: req.user.reminders.length + 1,
        title: req.body.title,
        description: req.body.description,
        completed: false,
        cover: req.file ? '/uploads/' + req.file.filename : undefined
    };
    if (req.body.randomCover != undefined) {
        const response = await fetch('https://source.unsplash.com/random') // using await here
        reminder.cover = response.url;
    }
    req.user.reminders.push(reminder);
    res.redirect("/reminders");
},
  // testing

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    let reminderToUpdate = req.params.id;
    let updatedReminder = req.user.reminders.find(function (reminder) {
        return reminder.id == reminderToUpdate;
    });
    if (updatedReminder) {
        updatedReminder.title = req.body.title;
        updatedReminder.description = req.body.description;
        updatedReminder.completed = req.body.completed;
    }
    res.redirect("/reminders");
},

  delete: (req, res) => {
    let reminderToDelete = req.params.id;
    let deletedReminder = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToDelete;
    });
    if (deletedReminder) {
      req.user.reminders.splice(req.user.reminders.indexOf(deletedReminder), 1);
    }
    res.redirect("/reminders");
  },
};
module.exports = remindersController;
