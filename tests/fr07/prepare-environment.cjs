#!/usr/bin/env node
/**
 * prepare-environment.cjs
 * Creates isolated backend copy and test fixtures, guarding working database.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function parseArgs() {
  const args = process.argv.slice(2);
  let rootDir = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--root' && i + 1 < args.length) {
      rootDir = path.resolve(args[++i]);
    }
  }
  if (!rootDir) {
    console.error('Usage: node prepare-environment.cjs --root <isolated_directory_path>');
    process.exit(1);
  }
  return { rootDir };
}

function getFileHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

async function main() {
  const { rootDir } = parseArgs();
  const repoRoot = path.resolve(__dirname, '../..');
  const workingBackendDir = path.resolve(repoRoot, 'backend');
  const workingDbPath = path.resolve(workingBackendDir, 'database.sqlite');

  console.log('=== FR-07 Environment Preparation ===');
  console.log(`Repo Root: ${repoRoot}`);
  console.log(`Working Backend: ${workingBackendDir}`);
  console.log(`Target Isolated Root: ${rootDir}`);

  // Safety checks
  const realWorkingBackend = fs.realpathSync(workingBackendDir);
  if (path.resolve(rootDir) === realWorkingBackend || path.resolve(rootDir).startsWith(realWorkingBackend)) {
    console.error('CRITICAL SAFETY VIOLATION: Target root cannot be inside working backend!');
    process.exit(1);
  }

  const initialWorkingDbHash = getFileHash(workingDbPath);
  console.log(`Working DB Initial SHA-256: ${initialWorkingDbHash}`);

  const isolatedBackendDir = path.join(rootDir, 'backend');
  fs.mkdirSync(isolatedBackendDir, { recursive: true });

  // Copy server files
  const filesToCopy = ['server.js', 'database.js', 'package.json'];
  for (const file of filesToCopy) {
    const src = path.join(workingBackendDir, file);
    const dest = path.join(isolatedBackendDir, file);
    fs.copyFileSync(src, dest);
  }

  // Symlink node_modules
  const workingNodeModules = path.join(workingBackendDir, 'node_modules');
  const destNodeModules = path.join(isolatedBackendDir, 'node_modules');
  if (fs.existsSync(destNodeModules)) {
    fs.rmSync(destNodeModules, { recursive: true, force: true });
  }
  fs.symlinkSync(workingNodeModules, destNodeModules, 'dir');

  // Ensure database.sqlite in isolated is NOT a symlink
  const isolatedDbPath = path.join(isolatedBackendDir, 'database.sqlite');
  if (fs.existsSync(isolatedDbPath)) {
    const stat = fs.lstatSync(isolatedDbPath);
    if (stat.isSymbolicLink()) {
      console.error('CRITICAL SAFETY VIOLATION: Isolated DB cannot be a symlink!');
      process.exit(1);
    }
    fs.unlinkSync(isolatedDbPath);
  }

  // Initialize and seed isolated database
  const sqlite3 = require(path.join(isolatedBackendDir, 'node_modules/sqlite3')).verbose();
  const db = new sqlite3.Database(isolatedDbPath);

  await new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create tables
      db.run('DROP TABLE IF EXISTS categories');
      db.run('DROP TABLE IF EXISTS products');
      db.run('DROP TABLE IF EXISTS users');
      db.run('DROP TABLE IF EXISTS orders');

      db.run(`CREATE TABLE categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      )`);

      db.run(`CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price INTEGER,
        description TEXT,
        category_id INTEGER,
        imageUrl TEXT
      )`);

      db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user'
      )`);

      db.run(`CREATE TABLE orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        total_amount INTEGER,
        status TEXT,
        shipping_address TEXT
      )`);

      // Seed categories
      db.run("INSERT INTO categories (id, name) VALUES (1, 'Điện tử')");

      // Seed products A and B
      db.run(
        "INSERT INTO products (id, name, price, description, category_id, imageUrl) VALUES (1, 'Sản phẩm A', 100000, 'Mô tả sản phẩm A chất lượng cao', 1, 'https://picsum.photos/400/400?random=1')"
      );
      db.run(
        "INSERT INTO products (id, name, price, description, category_id, imageUrl) VALUES (2, 'Sản phẩm B', 250000, 'Mô tả sản phẩm B cao cấp', 1, 'https://picsum.photos/400/400?random=2')"
      );

      // Seed standard test user
      db.run(
        "INSERT INTO users (id, name, email, password, role) VALUES (1, 'Test User', 'testuser@example.com', 'password123', 'user')",
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  });

  // Read-back verification
  const products = await new Promise((resolve, reject) => {
    db.all('SELECT id, name, price FROM products ORDER BY id ASC', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
  console.log(`Seeded and verified ${products.length} products:`, products);

  db.close();

  // Safety check: Verify working DB was untouched
  const finalWorkingDbHash = getFileHash(workingDbPath);
  console.log(`Working DB Final SHA-256: ${finalWorkingDbHash}`);
  if (initialWorkingDbHash !== finalWorkingDbHash) {
    console.error('CRITICAL ERROR: Working DB was modified during preparation!');
    process.exit(1);
  }
  console.log('Safety check PASSED: Working DB is completely untouched.');
  console.log(`Isolated environment successfully prepared at ${isolatedBackendDir}`);
}

main().catch((err) => {
  console.error('Environment preparation failed:', err);
  process.exit(1);
});
