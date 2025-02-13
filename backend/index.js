const express = require("express");
const { logMiddleware, authMiddleware } = require("./middlewares");
const { query, select, insert, update, deleteQuery } = require("./database");

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logMiddleware);

app.listen(PORT, () => {
  console.log(`server Started on PORT: ${PORT}! `);
});

app
  .route("/api/users")
  .get(authMiddleware, async (req, res) => {
    try {
      const result = await select("users");
      if (result.rowCount === 0)
        return res.status(404).json({ status: "Bad Request" });
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "Internal Server Error." });
    }
  })
  .post(async (req, res) => {
    try {
      const request = req.body;
      const newUser = [];
      newUser.push(request.first_name);
      newUser.push(request.last_name);
      newUser.push(request.email);
      newUser.push(request.gender);
      newUser.push(request.job_title);
      const columns = [
        "first_name",
        "last_name",
        "email",
        "gender",
        "job_title",
      ];
      const result = await insert("users", columns, newUser);
      return res.status(201).json({
        status: `Successfully added a new entry!`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "Internal Server Error." });
    }
  })
  .delete(async (req, res) => {
    try {
      await query("BEGIN");
      const request = req.body.ids;
      for (let i = 0; i < request.length; i++) {
        const result = await deleteQuery("users", [request[i]]);
        if (result.rowCount === 0) {
          const result = await query("ROLLBACK");
          return res.json({ status: "Opperation cannot be performed! " });
        }
      }
      await query("COMMIT");
      return res
        .status(200)
        .json({ status: "successfully deleted multiple rows" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "Internal Server Error." });
    }
  });

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    try {
      const id = Number(req.params.id);
      const result = await select("users", [id]);
      if (result.rowCount === 0)
        return res.status(404).json({ status: "Bad Request" });
      return res.status(201).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "Internal Server Error." });
    }
  })
  .patch(async (req, res) => {
    try {
      const id = Number(req.params.id);
      const rowData = await select("users", [id]);
      if (rowData.rowCount === 0)
        return res.status(404).json({ status: "Bad Request" });
      const request = req.body;
      const newUser = [];
      newUser.push(request.first_name || rowData.rows[0].first_name);
      newUser.push(request.last_name || rowData.rows[0].last_name);
      newUser.push(request.email || rowData.rows[0].email);
      newUser.push(request.gender || rowData.rows[0].gender);
      newUser.push(request.job_title || rowData.rows[0].job_title);
      const columns = [
        "first_name",
        "last_name",
        "email",
        "gender",
        "job_title",
      ];
      const result = await update("users", columns, newUser, id);
      return res.status(201).json({ status: "Successful" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "Internal Server Error." });
    }
  })
  .put(async (req, res) => {
    try {
      const id = Number(req.params.id);
      const rowData = await select("users", [id]);
      if (rowData.rowCount === 0)
        return res.status(404).json({ status: "Bad Request" });
      const request = req.body;
      const newUser = [];
      newUser.push(request.first_name);
      newUser.push(request.last_name);
      newUser.push(request.email);
      newUser.push(request.gender);
      newUser.push(request.job_title);
      const columns = [
        "first_name",
        "last_name",
        "email",
        "gender",
        "job_title",
      ];
      const result = await update("users", columns, newUser, id);
      return res.status(201).json({ status: "Successfully updated!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "Internal Server Error.",
      });
    }
  })
  .delete(async (req, res) => {
    try {
      const id = Number(req.params.id);
      const result = await deleteQuery("users", [id]);
      if (result.rowCount === 0)
        return res.status(404).json({ status: "Bad Request" });
      else return res.status(201).json({ status: "Deleted Successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "Internal Server Error." });
    }
  });
