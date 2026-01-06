module.exports = {
  up: async (db) => {
    db.schema.users.fields.push("createdAt");
    db.data.users.forEach(user => {
      user.createdAt = null;
    });
  },

  down: async (db) => {
    db.schema.users.fields = db.schema.users.fields.filter(f => f !== "createdAt");
    db.data.users.forEach(user => {
      delete user.createdAt;
    });
  }
};