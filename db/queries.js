const pool = require('./pool');

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
  const { rows: messages } = await pool.query(`
    SELECT message_id, first, last, title, time, text
    FROM messages
    JOIN users ON messages.user_id = users.user_id
  `);

  const messagesWithFormattedDates = messages.map((message) => {
    const isoDate = message.time;
    let monthNum = isoDate.getMonth();
    const day = isoDate.getDate();
    const year = isoDate.getFullYear();
    const hour24 = isoDate.getHours();
    const hour12 = hour24 > 12 ? hour24 - 12 : hour24;
    const minute = isoDate.getMinutes();
    const ampm = hour24 >= 12 ? "PM" : "AM";
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const month = months[monthNum];
    const dateString = `${month} ${day}, ${year} at ${hour12}:${minute}${ampm}`;
    return { ...message, time: dateString };
  });

  return messagesWithFormattedDates;
}

const deleteMessage = async (messageID) => {
  await pool.query(
    "DELETE FROM messages WHERE message_id = $1",
    [messageID]
  )
}

module.exports = {
  getRolePassword,
  upgradeRole,
  postNewMessage,
  getAllMessages,
  deleteMessage
}