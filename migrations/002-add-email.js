module.exports = {
  up: async (db) => {
    db.schema.users.fields.push("email");
    db.data.users.forEach(user => {
      user.email = null;
    });
  },

  down: async (db) => {
    db.schema.users.fields = db.schema.users.fields.filter(f => f !== "email");
    db.data.users.forEach(user => {
      delete user.email;
    });
  }
};