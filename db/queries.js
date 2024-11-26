const pool = require('./pool');

const getRolePassword = async (role) => {
  const {rows} = await pool.query(
    "SELECT password FROM role_passwords WHERE role = $1",
    [role]
  );
  return rows[0].password;
}

const postNewMessage = async (userID, title, text) => {
  await pool.query(
    "INSERT INTO messages (user_id, title, text) VALUES ($1, $2, $3)", 
    [userID, title, text]
  );
}

const deleteMessage = async (messageID) => {
  await pool.query(
    "DELETE FROM messages WHERE message_id = $1",
    [messageID]
  )
}

module.exports = {
  getRolePassword,
  postNewMessage,
  deleteMessage
}