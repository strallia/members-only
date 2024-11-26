const pool = require('./pool');

class Database {
  select(columns = "", tableName = "", whereValues = [] ) {
    // Generate WHERE clause
    let whereClause = "";
    whereValues.forEach((value, index) => {
      if (index === 0) whereClause += `${value} = $${index + 1}`
      else whereClause += `, ${value} =  $${index + 1}`;
    })

    return `SELECT ${columns} FROM ${tableName} WHERE ${whereClause}`
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
}

class Users extends Database {
  async query(sql = "", sanitizeInputs = []) {
    const {rows} = await pool.query(sql, sanitizeInputs);
    return rows[0];
  }

  async getUser(username) {
    const sql = super.select("*", "users", ['email']);
    const res = await this.query(sql, [username]);
    return res;
  }

  async createUser(first, last, email, hashedPassword) {
    const sql = super.insertInto("users", "(first, last, email, passhash)", arguments.length);
    await this.query(sql, [first, last, email, hashedPassword]);
  };

  async upgradeRole (userID, role) { 
    const sql = super.update("users", ['role'], ["user_id"]);
    await this.query(sql, [role, userID]);
  };
}

module.exports = {
  users: new Users()
}