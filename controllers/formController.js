const { Users, Messages, RolePasswords } = require("../db/orm-practice");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const passport = require("../configs/passport");

const getSignupPage = (req, res) => { 
  res.render("forms/signup");
};

const validateSignupForm = [
  [
    body("first")
      .notEmpty().withMessage("First name cannot be empty")
      .isLength({ max: 20 }).withMessage("First name cannot be more than 20 characters"),
    body("last")
      .notEmpty().withMessage("Last name cannot be empty")
      .isLength({ max: 20 }).withMessage("Last name cannot be more than 20 characters"),
    body("email")
      .notEmpty().withMessage("Email cannot be empty")
      .isEmail().withMessage("Please enter valid email address (e.g. first@last.com)"),
    body("password")
      .notEmpty().withMessage("Password cannot be empty")
      .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
      .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
      .matches(/\d/).withMessage("Password must contain at least one number")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("confirm_password")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match")
  ], 
  (req, res, next) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("forms/signup", { errors: errors.array(), ...req.body});
    };
    next();
  }
]

const createUser = (req, res, next) => { 
  // Create new user in database with hashed password
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) return next(err);
    const {first, last, email} = req.body;
    try {
      await Users.createUser(first, last, email, hashedPassword);
      next();
    } catch (err) {
      return next(err);
    }
  })
};

const getUpgradePage = (req, res) => {
  res.render("forms/upgradeRole");
}

const verifyRoleUpgradePassword = async (req, res, next) => {
  const { secretPass, role } = req.body;
  const databaseRolePass = await RolePasswords.getRolePassword(role);
  if (secretPass !== databaseRolePass) {
    return res.render("forms/upgradeRole", { errors: [{msg: "Incorrect password"}] });
  }
  next(); 
}

const upgradeRole = async (req, res) => {
  const { role } = req.body;
  const { user_id } = req.user;  
  await Users.upgradeRole( user_id, role);
  res.redirect("/");
};

const getLoginPage = (req, res) => {
  const { messages: errMessages } = req.session;
  if (errMessages) {
    req.session.messages = [];
    return res.render("forms/login", { errors: [{msg: errMessages[0]}] });
  }
  res.render("forms/login");
}

const loginUser = [
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/form/login",
    failureMessage: true,
  })
];

const validateNewMessageForm = [
  [
    body("title")
      .notEmpty().withMessage("Title cannot be empty")
      .isLength({ max: 30 }).withMessage("Title cannot be more than 30 characters"),
    body("text")
      .notEmpty().withMessage("Text cannot be empty")
      .isLength({ max: 200 }).withMessage("Text cannot be more than 200 characters")
  ], 
  (req, res, next) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('addMessageErrors', errors.array());
      return res.redirect("/");
    };
    next();
  }
]

const postNewMessage = async (req, res) => {
  const { title, text } = req.body;
  const { user_id } = req.user;  
  await Messages.postNewMessage(user_id, title, text);
  res.redirect("/");
}

const deleteMessage = async (req, res) => {
  const { messageID } = req.params;
  await Messages.deleteMessage(messageID);
  res.redirect("/");
}

const logoutUser = async (req, res) => {
  req.logout((err) =>  {
    if (err) { return next(err); }
    res.redirect("/");
  });
}

const checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/form/login");
  }
}

module.exports = {
  getSignupPage,
  validateSignupForm,
  createUser,
  getUpgradePage,
  verifyRoleUpgradePassword,
  upgradeRole,
  getLoginPage,
  loginUser,
  validateNewMessageForm,
  postNewMessage,
  deleteMessage,
  logoutUser,
  checkAuthentication
}