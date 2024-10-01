require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("./db/queries");

/**
 * Import routers
 */
const homeRouter = require('./routes/homeRoutes');
const formRouter = require('./routes/formRoutes');

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

/**
 * Instantiate passportJS
 */
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.session());
passport.use(new LocalStrategy(async (username, password, done) => { 
  try {
    // Authentication logic
    // Checks that user-entered password matches hashed passwored in database
    const user = await db.getUser(username);
    if (!user) return done(null, false, {message: "Incorrect username"});
    const passwordsMatch = await bcrypt.compare(password, user.passhash)
    if (!passwordsMatch) return done(null, false, {message: "Incorrect password"});
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const {rows} = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});
app.use((req, res, next) => {
  // Store user details in locals for easy access in view templates
  res.locals.currentUser = req.user;
  next();
})

/**
 * Register routers
 */
app.use("/", homeRouter);
app.use("/form", formRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});


