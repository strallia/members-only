const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');

const getSignupPage = (req, res) => { 
  res.render("forms/signup");
};

const validateSignupForm = [
  [
    body("first")
      .notEmpty().withMessage("First name cannot be empty")
      .isLength({ max: 20 }).withMessage("First name cannot be more than 20 characters"),//
    body("last")
      .notEmpty().withMessage("Last name cannot be empty")
      .isLength({ max: 20 }).withMessage("Last name cannot be more than 20 characters"),//
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
      await db.createUser(first, last, email, hashedPassword);
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  })
};

const  getUpgradePage = (req, res) => {
  res.render("forms/upgradeRole");
}

const verifyRoleUpgradePassword = async (req, res, next) => {
  const { secretPass, role } = req.body;
  const databaseRolePass = await db.getRolePassword(role);
  if (secretPass !== databaseRolePass) return res.send("incorrect password");
  next(); 
}

const upgradeRole = (req, res) => {
  res.render("home");
};

module.exports = {
  getSignupPage,
  validateSignupForm,
  createUser,
  getUpgradePage,
  verifyRoleUpgradePassword,
  upgradeRole
}