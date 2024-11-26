const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { Users } = require("../db/orm-practice");
const pool = require("../db/pool");

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  },
  async (username, password, done) => {
    try {
      // Authentication logic
      const user = await Users.getUser(username);
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
  done(null, user.user_id);
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

module.exports = passport;