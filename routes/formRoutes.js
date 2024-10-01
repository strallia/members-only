const { Router } = require("express");
const formRouter = Router();
const formController = require('../controllers/formController');

// GET routes
formRouter.get("/signup", formController.getSignupPage);

// POST routes
formRouter.post("/signup", formController.validateSignupForm, formController.createUser)


module.exports = formRouter;