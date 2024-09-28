// const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const getSignupPage = (req, res) => { 
  res.render("forms/signup");
};

const validateSignupForm = [
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
]

const createUser = [
  validateSignupForm, 
  (req, res) => { 
    // const { first, last, email, password, confirm_password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("forms/signup", { errors: errors.array(), ...req.body});
    };
    // db.createUser(first, last, email, password, confirm_password);
    res.redirect("/");
  }
];

module.exports = {
  getSignupPage,
  createUser
}