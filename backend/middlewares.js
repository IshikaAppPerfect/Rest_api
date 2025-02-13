const fs = require("fs");

function logMiddleware(req, res, next) {
  console.log(req);
  const path = req.path;
  const ip = req.ip;
  const httpMethod = req.method;
  const time = Date.now();
  const data = `\n Path: ${path} IP: ${ip} HTTP Method: ${httpMethod} Time: ${time}`;
  fs.appendFile("log.txt", data, (err) => {
    if (err) {
      console.log("Error writing Logs!");
      return res.status(404).json({ status: "Error" });
    } else {
      console.log("Logs written in the file log.txt!");
    }
  });
  next();
}

function authMiddleware(req, res, next) {
  req.userCredentials = {
    username: "ishikasoni07",
    password: "12345678",
    role: "user",
  };
  if (req.userCredentials.role === "admin") {
    console.log("Welcome Back, admin");
    next();
  } else {
    console.log("You are not admin");
    return res.status(404).json({ status: "Error" });
  }
}

module.exports = { logMiddleware, authMiddleware };
