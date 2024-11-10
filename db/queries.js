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

const postNewMessage = async (userID, title, text) => {
  await pool.query(
    "INSERT INTO messages (user_id, title, text) VALUES ($1, $2, $3)", 
    [userID, title, text]
  );
}

const getAllMessages = async () => {
  const { rows } = await pool.query(`
    SELECT first, last, title, time, text
    FROM messages
    JOIN users ON messages.user_id = users.user_id
  `);
  return rows;
}

module.exports = {
  getUser,
  createUser,
  getRolePassword,
  upgradeRole,
  postNewMessage,
  getAllMessages
}