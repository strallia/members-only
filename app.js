require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("./configs/passport");
const methodOverride = require("method-override");

/**
 * Import routers
 */
const homeRouter = require('./routes/homeRoutes');
const formRouter = require('./routes/formRoutes');

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

/**
 * Configure passport authentication
 */
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.session());

app.use((req, res, next) => {
  // Store user details in locals for easy access in view templates
  res.locals.currentUser = req.user;
  next();
});

/**
 * Register routers
 */
app.use("/", homeRouter);
app.use("/form", formRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});


