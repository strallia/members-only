const { Router } = require("express");
const formRouter = Router();
const formController = require('../controllers/formController');

formRouter.get("/signup", formController.getSignupPage);

module.exports = formRouter;