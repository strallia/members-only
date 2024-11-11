const { Router } = require("express");
const formRouter = Router();
const formController = require('../controllers/formController');

// GET routes
formRouter.get("/signup", formController.getSignupPage);
formRouter.get("/login", formController.getLoginPage);
formRouter.get("/upgrade", formController.getUpgradePage);
formRouter.get("/new-message", formController.getNewMessagePage);

// POST routes
formRouter.post("/signup", formController.validateSignupForm, formController.createUser, formController.loginUser);
formRouter.post("/login", formController.loginUser);
formRouter.post("/upgrade", formController.verifyRoleUpgradePassword, formController.upgradeRole);
formRouter.post("/new-message", formController.validateNewMessageForm, formController.postNewMessage);
formRouter.post("/logout", formController.logoutUser);

// DELETE routes
formRouter.delete("/message/:messageID", formController.deleteMessage);

module.exports = formRouter;