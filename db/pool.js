const { Pool } = require("pg");
const { DATABASE_URL } = process.env;

const pool = new Pool({ connectionString: DATABASE_URL });

module.exports = pool;