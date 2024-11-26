const pool = require('./pool');

class Database {
  async query(sql = "", sanitizeInputs = []) {
    const {rows: data} = await pool.query(sql, sanitizeInputs);
    return data;
  }

  select(columns = "", tableName = "", whereValues = [], joinTable = "", joinOn = "" ) {
    // Generate JOIN clause
    let joinClause = `JOIN ${joinTable} ON ${joinOn}`;

    // Generate WHERE clause
    let whereClause = "WHERE ";
    whereValues.forEach((value, index) => {
      if (index === 0) whereClause += `${value} = $${index + 1}`
      else whereClause += `, ${value} =  $${index + 1}`;
    })

    return `SELECT ${columns} FROM ${tableName} ${joinClause} ${whereValues.length > 0 ? whereClause: ""}`
  }

  insertInto(tableName = "", columns = "", numOfValues = 0) {
    let valuesClause = "";
    for (let i = 1; i <= numOfValues; i++) {
      if (i === 1) valuesClause += `$${i}`;
      else valuesClause += `, $${i}`
    }
    return `INSERT INTO ${tableName} ${columns} VALUES (${valuesClause})`
  }

  update(tableName = "", setValues = [], whereValues = []) {
    let validationNumCount = 1;

     // Generate SET clause
     let setClause = "";
     setValues.forEach((value, index) => {
       if (index === 0) setClause += `${value} = $${validationNumCount}`
       else setClause += `, ${value} =  $${validationNumCount}`;
       validationNumCount++;
     })

    // Generate WHERE clause
    let whereClause = "";
    whereValues.forEach((value, index) => {
      if (index === 0) whereClause += `${value} = $${validationNumCount}`
      else whereClause += `, ${value} =  $${validationNumCount}`;
      validationNumCount++;
    })

    return `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`
  }

  deleteFrom(tableName = "", whereValues = []) {
    // Generate WHERE clause
    let whereClause = "WHERE ";
    whereValues.forEach((value, index) => {
      if (index === 0) whereClause += `${value} = $${index + 1}`
      else whereClause += `, ${value} =  $${index + 1}`;
    })

    return `DELETE FROM ${tableName} ${whereClause}`;
  }
}

class Users extends Database {
  async getUser(username) {
    const sql = super.select("*", "users", ['email']);
    const data = await super.query(sql, [username]);
    return data[0];
  }

  async createUser(first, last, email, hashedPassword) {
    const sql = super.insertInto("users", "(first, last, email, passhash)", arguments.length);
    await super.query(sql, [first, last, email, hashedPassword]);
  };

  async upgradeRole (userID, role) { 
    const sql = super.update("users", ['role'], ["user_id"]);
    await super.query(sql, [role, userID]);
  };
}


class Messages extends Database {
  async getAllMessages() {
    const sql = super.select("message_id, first, last, title, time, text", "messages", [], "users", "messages.user_id = users.user_id");
    const messages = await super.query(sql, []);
    
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

  async postNewMessage(userID, title, text) {
    const sql = super.insertInto("messages", "(user_id, title, text)", 3);
    await super.query(sql, [userID, title, text]);
  } 

  async deleteMessage(messageID) {
    const sql = super.deleteFrom("messages", ['message_id']);
    await super.query(sql, [messageID]);
  }
}


module.exports = {
  users: new Users(),
  messages: new Messages(),
}