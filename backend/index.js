const express = require("express");
const users = require("./mockdata.json");
const fs = require("fs");

const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log("server Started! ");
});

app
  .route("/api/users")
  .get((req, res) => {
    return res.json(users);
  })
  .post((req, res) => {
    const request = req.body;
    users.push({ ...request, id: users.length + 1 });
    fs.writeFile("./mockdata.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "Success" });
    });
  });

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    res.json({ status: "Pending" }); // Implement it
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
    console.log(userIndex);
    if (userIndex === -1) {
      return res.json({ error: "User Index Not Found!" });
    }
    users.splice(userIndex, 1);
    return res.json({ success: "Deleted!" });
  });
