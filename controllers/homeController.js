const { Messages } = require("../db/orm-practice");

const getHomePage = async (req, res) => { 
  const messages = await Messages.getAllMessages();
  const addMessageErrors = req.flash("addMessageErrors");
  res.render("home", { messages, addMessageErrors });
 };

module.exports = {
  getHomePage,
}