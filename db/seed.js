require("dotenv").config();
const { Client } = require('pg');

const { DATABASE_URL, ADMIN_PASS, PREMIUM_PASS } = process.env;

const SQL = `
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first TEXT,
    last TEXT,
    email TEXT,
    passhash TEXT,
    is_premium BOOLEAN,
    is_admin BOOLEAN
  );

  INSERT INTO users (first, last, email, is_premium, is_admin)
  VALUES 
    ('Jane', 'Basic', 'jane@basic.com', false, false),
    ('John', 'Premium', 'john@premium.com', true, false),
    ('Jill', 'Admin', 'jill@admin.com', false, true);

  CREATE TABLE IF NOT EXISTS messages (
    message_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    author_id INTEGER REFERENCES users(user_id),
    title TEXT,
    time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    text TEXT
  );  

  INSERT INTO messages (author_id, title, time, text)
  VALUES 
    (1, 'Hello all!', NOW(), 'This is the first comment :)'),
    (2, 'FIRST!', NOW(), 'JK. Someone beat me to it :('),
    (3, 'Tis a Good Day', NOW(), 'Lorem ipsum and more random words.');
  
  CREATE TABLE IF NOT EXISTS role_passwords (
    role TEXT,
    password TEXT
  );  

  INSERT INTO role_passwords (role, password)
  VALUES 
    ('admin', '${ADMIN_PASS}'),
    ('premium', '${PREMIUM_PASS}');
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