const express = require("express");
const users = require("./mockdata.json");
const fs = require("fs");
const db = require("./database");
const database = require("./database");
const { STATUS_CODES } = require("http");

const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`server Started on PORT: ${PORT}! `);
});

app
  .route("/api/users")
  .get(async (req, res) => {
    try {
      const result = await database.query("SELECT * FROM users");
      if (!result) return res.status(404).json({ status: "Bad Request" });
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ status: "Internal Server Error\nCannot Fetch Data" });
    }
  }) // when the table is empty handle that case
  .post(async (req, res) => {
    try {
      const request = req.body;
      const newUser = [];
      newUser.push(request.first_name);
      newUser.push(request.last_name);
      newUser.push(request.email);
      newUser.push(request.gender);
      newUser.push(request.job_title);
      const result = await database.query(
        `INSERT INTO users (first_name, last_name, email, gender, job_title) values ($1,$2,$3,$4,$5)`,
        newUser
      );
      return res.status(201).json({
        status: `Successfully added a new entry with id!`,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ status: "Internal Server Error\nCannot Add new Entry" });
    }
  });

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    try {
      const id = Number(req.params.id);
      const result = await database.query(
        `SELECT * FROM users WHERE id = ($1)`,
        [id]
      );
      if (result.rowCount === 0)
        return res.status(404).json({ status: "Bad Request" });
      return res.status(201).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "Internal Server Error\nCannot find ID" });
    }
  })
  .patch(async (req, res) => {
    try {
      const id = Number(req.params.id);
      const rowData = await database.query(
        `SELECT * FROM users WHERE id = ($1)`,
        [id]
      );
      if (rowData.rowCount === 0)
        return res.status(404).json({ status: "Bad Request" });
      const request = req.body;
      const newUser = [];
      newUser.push(request.first_name || rowData.rows[0].first_name);
      newUser.push(request.last_name || rowData.rows[0].last_name);
      newUser.push(request.email || rowData.rows[0].email);
      newUser.push(request.gender || rowData.rows[0].gender);
      newUser.push(request.job_title || rowData.rows[0].job_title);
      newUser.push(id);
      const result = await database.query(
        `UPDATE users SET first_name = ($1), last_name = ($2), email = ($3), gender = ($4), job_title = ($5) where id = ($6)`,
        [newUser[0], newUser[1], newUser[2], newUser[3], newUser[4], id]
      );
      return res.status(201).json({ status: "Successful" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "Internal Server Error\nCannot find ID" });
    }
  })
  .put(async (req, res) => {
    try {
      const id = Number(req.params.id);
      const request = req.body;
      const newUser = [];
      newUser.push(request.first_name);
      newUser.push(request.last_name);
      newUser.push(request.email);
      newUser.push(request.gender);
      newUser.push(request.job_title);
      newUser.push(id);
      const result = await database.query(
        `UPDATE users SET first_name = ($1), last_name = ($2), email = ($3), gender = ($4), job_title = ($5) where id = ($6)`,
        newUser
      );
      return res.status(201).json({ status: "Successfully updated!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "Internal Server Error\nCannot find ID to perform put",
      });
    }
  }) // when trying to access id not present value and when dtaa is given less as it requires everything
  .delete(async (req, res) => {
    try {
      const id = Number(req.params.id);
      const result = await database.query(`DELETE FROM users WHERE id = ($1)`, [
        id,
      ]);
      if (result.rowCount === 0)
        return res.status(404).json({ status: "Bad Request" });
      return res.status(201).json({ status: "Deleted Successfully!" });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ status: "Internal Server Error\nCannot find ID To Delete" });
    }
  }); // when id not found

// implement multiple query altogether
// middlewares + multiple thing - middleware
