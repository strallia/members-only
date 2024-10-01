const pool = require('./pool');

const getUser = async (username) => {
  const {rows} = await pool.query(
    "SELECT * FROM users WHERE username = $1", [username]
  );
  return rows[0];
}

const createUser = async (first, last, email, hashedPassword) => { 
  await pool.query(
    "INSERT INTO users (first, last, email, passhash) VALUES ($1, $2, $3, $4)", 
    [first, last, email, hashedPassword]
  );
};

module.exports = {
  getUser,
  createUser,
}