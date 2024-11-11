const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const pool = require("../db/pool");

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  },
  async (username, password, done) => {
    console.log("passport verifying login credentials using username and password:"), username, password; 
    try {
      // Authentication logic
      const user = await db.getUser(username);
      if (!user) { 
        return done(null, false, {message: "No account found with that username"});
      }
      const passwordsMatch = await bcrypt.compare(password, user.passhash)
      if (!passwordsMatch) {
        return done(null, false, {message: "Incorrect password"});
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  console.log("passport serializing user with user object:", user);
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  console.log("passport deserializing user");
  try {
    const {rows} = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;