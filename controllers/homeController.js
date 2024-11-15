const db = require("../db/queries");

const getHomePage = async (req, res) => { 
  const messages = await db.getAllMessages();
  const addMessageErrors = req.flash("addMessageErrors");
  res.render("home", { messages, addMessageErrors });
 };

module.exports = {
  getHomePage,
}