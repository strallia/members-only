const pool = require('./pool');

const getUser = async (username) => {
  const {rows} = await pool.query(
    "SELECT * FROM users WHERE email = $1", [username]
  );
  return rows[0];
}

const createUser = async (first, last, email, hashedPassword) => { 
  await pool.query(
    "INSERT INTO users (first, last, email, passhash, role) VALUES ($1, $2, $3, $4, 'basic')", 
    [first, last, email, hashedPassword]
  );
};

const getRolePassword = async (role) => {
  const {rows} = await pool.query(
    "SELECT password FROM role_passwords WHERE role = $1",
    [role]
  );
  return rows[0].password;
}

const upgradeRole = async (userID, role) => { 
  await pool.query(
    "UPDATE users SET role = $1 WHERE user_id = $2", 
    [role, userID]
  );
};

module.exports = {
  getUser,
  createUser,
  getRolePassword,
  upgradeRole
}