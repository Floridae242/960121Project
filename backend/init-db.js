const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

async function init() {
  const dbConfig = {
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
  };

  const dbName = process.env.DB_NAME || "panglaong";

  if (process.env.DB_SOCKET) {
    dbConfig.socketPath = process.env.DB_SOCKET;
  }

  console.log("Connecting to MySQL server with config:", {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    socketPath: dbConfig.socketPath,
  });

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("✓ Connected to MySQL server.");
  } catch (err) {
    console.error("✗ Failed to connect to MySQL server. Please make sure MySQL is running in XAMPP.");
    console.error(err.message);
    process.exit(1);
  }

  try {
    // 1. Create database
    console.log(`Creating database "${dbName}" if it does not exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`✓ Database "${dbName}" created or already exists.`);

    // Use database
    await connection.query(`USE \`${dbName}\`;`);

    // 2. Read and run schema.sql
    console.log("Running schema.sql...");
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    await executeSqlStatements(connection, schemaSql);
    console.log("✓ Schema created successfully.");

    // 3. Read and run seed.sql
    console.log("Running seed.sql...");
    const seedPath = path.join(__dirname, "seed.sql");
    const seedSql = fs.readFileSync(seedPath, "utf8");
    await executeSqlStatements(connection, seedSql);
    console.log("✓ Seed data inserted successfully.");

    console.log("\n★ Database initialization completed successfully! ★");
  } catch (err) {
    console.error("✗ Error initializing database:", err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function executeSqlStatements(connection, sqlText) {
  // Remove comments and split by semicolon
  const statements = sqlText
    .split(";")
    .map((statement) => {
      // Remove SQL comments starting with --
      return statement
        .split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim();
    })
    .filter((statement) => statement.length > 0);

  for (const statement of statements) {
    try {
      await connection.query(statement);
    } catch (err) {
      console.error(`✗ Error executing statement:\n${statement}`);
      throw err;
    }
  }
}

init();
