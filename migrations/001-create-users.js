module.exports = {
  up: async (db) => {
    db.schema.users = {
      fields: ["id", "name"]
    };
    db.data.users = [];
  },

  down: async (db) => {
    delete db.schema.users;
    delete db.data.users;
  }
};