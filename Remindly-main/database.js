const database = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jim123@gmail.com",
    password: "j",
    reminders: [],
    role: "user",
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
    reminders: [],
    role: "user",
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
    reminders: [],
    role: "user",
  },
  {
    id: 4,
    name: "Admin",
    email: "A@admin.com",
    password: "A",
    reminders: [],
    role: "admin",
  }
];

const userModel = {
  createUser: (gitInfo) => {
    database.push({
      id: gitInfo.id,
      name: gitInfo.displayName,
      reminders: [],
      role: "user",
    })
  },
  // give it email, checks DB above if email given matches email in database
  // you can change the code in the find one function to fit the database you are using
  findOne: (email) => {
    const user = database.find((user) => user.email === email);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with email: ${email}`);
  },
  findById: (id) => {
    const user = database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    // throw new Error(`Couldn't find user with id: ${id}`);
  },
};

module.exports = { database, userModel };
