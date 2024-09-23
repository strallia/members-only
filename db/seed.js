require("dotenv").config();
const { Client } = require('pg');

const { DATABASE_URL } = process.env;

const SQL = `
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first TEXT,
    last TEXT,
    email TEXT,
    passhash TEXT,
    is_member BOOLEAN,
    is_admin BOOLEAN
  );

  CREATE TABLE IF NOT EXISTS messages (
    message_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    author_id INTEGER REFERENCES users(user_id),
    title TEXT,
    time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    text TEXT
  );  
`;

const seedDB = async () => { 
  console.log("seeding database...");
  try {
    const client = new Client({ connectionString: DATABASE_URL });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("seeding complete");
  } catch (err) {
    console.error("error seeding database", err);
  } 
}
seedDB();