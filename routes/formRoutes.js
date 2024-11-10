const { Router } = require("express");
const formRouter = Router();
const formController = require('../controllers/formController');

// GET routes
formRouter.get("/signup", formController.getSignupPage);
formRouter.get("/login", formController.getLoginPage);
formRouter.get("/upgrade", formController.getUpgradePage);

// POST routes
formRouter.post("/signup", formController.validateSignupForm, formController.createUser);
formRouter.post("/login", formController.loginUser);
formRouter.post("/upgrade", formController.verifyRoleUpgradePassword, formController.upgradeRole);


module.exports = formRouter;