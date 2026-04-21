const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

// Safe product search
function searchProductSafe(name) {
  const stmt = db.prepare("SELECT * FROM products WHERE name LIKE ?");
  const rows = stmt.all(`%${name}%`);
  return rows; // will be [] if no match
}

// Safe login
function loginSafe(username, password) {
  const stmt = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?");
  const row = stmt.get(username, password);
  return row; // will be undefined if no match
}

// These must ALL return undefined or [] when you run them
console.log('Test 1:', searchProductSafe("' OR 1=1--"));           // []
console.log('Test 2:', searchProductSafe("' UNION SELECT id,username,password,role FROM users--")); // []
console.log('Test 3:', loginSafe("admin'--", 'anything'));        // undefined
console.log('Test 4:', loginSafe("' OR '1'='1", "' OR '1'='1"));  // undefined
