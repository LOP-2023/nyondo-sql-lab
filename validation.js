const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

// --- Validation helpers ---
function validateName(name) {
  return (
    typeof name === 'string' &&
    name.length >= 2 &&
    !/[<>;]/.test(name)
  );
}

function validatePrice(price) {
  return typeof price === 'number' && price > 0;
}

function validateUsername(username) {
  return (
    typeof username === 'string' &&
    username.length > 0 &&
    !/\s/.test(username)
  );
}

function validatePassword(password) {
  return (
    typeof password === 'string' &&
    password.length >= 6
  );
}

// --- Safe functions ---
function searchProductSafe(name) {
  if (!validateName(name)) {
    console.error("Error: invalid product name");
    return null;
  }
  const stmt = db.prepare("SELECT * FROM products WHERE name LIKE ?");
  const rows = stmt.all(`%${name}%`);
  return rows;
}

function loginSafe(username, password) {
  if (!validateUsername(username)) {
    console.error("Error: invalid username");
    return null;
  }
  if (!validatePassword(password)) {
    console.error("Error: invalid password");
    return null;
  }
  const stmt = db.prepare("SELECT * FROM users WHERE username=? AND password=?");
  const row = stmt.get(username, password);
  return row;
}

// --- Test cases ---
console.log("Test 1:", searchProductSafe("cement"));        // works normally
console.log("Test 2:", searchProductSafe(""));              // rejected
console.log("Test 3:", searchProductSafe("<script>"));      // rejected
console.log("Test 4:", loginSafe("admin", "admin123"));     // works
console.log("Test 5:", loginSafe("admin", "ab"));           // rejected (too short)
console.log("Test 6:", loginSafe("ad min", "pass123"));     // rejected (space in username)
