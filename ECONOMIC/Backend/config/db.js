const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "shopzone",
  password: "viji1610",
  port: 5432
});

module.exports = pool;