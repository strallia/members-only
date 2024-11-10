const db = require("../db/queries");

const getHomePage = async (req, res) => { 
  const messages = await db.getAllMessages();
  res.render("home", { messages });
 };

module.exports = {
  getHomePage,
}