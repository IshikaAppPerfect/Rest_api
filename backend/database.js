const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "0000",
  host: "localhost",
  port: 5432,
  database: "Project",
});

function query(query, params) {
  return pool.query(query, params);
}

function select(tableName, params = null) {
  let query = `SELECT * FROM ${tableName}`;
  if (params !== null) query += ` where id = ($1)`;
  return pool.query(query, params);
}

function insert(tableName, columns, params) {
  const placeholder = columns.map((_, i) => `$${i + 1}`).join(",");
  const query = `INSERT INTO ${tableName} (${columns.join(
    ","
  )}) VALUES (${placeholder})`;
  return pool.query(query, params);
}

function update(tableName, columns, params, id) {
  const placeholder = columns.map((col, i) => `${col} = ($${i + 1})`).join(",");
  const query = `UPDATE ${tableName} SET ${placeholder} WHERE id = ${id}`;
  return pool.query(query, params);
}

function deleteQuery(tableName, params) {
  let query = `DELETE FROM ${tableName} where id = ($1)`;
  return pool.query(query, params);
}

module.exports = { query, select, insert, update, deleteQuery };
