const { Router } = require("express");
const formRouter = Router();
const formController = require('../controllers/formController');

// GET routes
formRouter.get("/signup", formController.getSignupPage);
formRouter.get("/upgrade", formController.getUpgradePage);

// POST routes
formRouter.post("/signup", formController.validateSignupForm, formController.createUser)


module.exports = formRouter;