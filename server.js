// only require dotenv in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Setting constants, requiring libraries and files
const express = require("express");
const cors = require("cors");
const routes = require("./routes/graphData");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./config/db");
// using express
const app = express();

// express/server configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", routes);

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ error: err.message });
  return;
});

// here we get all the users in db, should be deleted later
//when there are no users in db the [] is returned
app.get("/users", async (req, res) => {
  const users = (await db.query("SELECT * FROM users")).rows;
  if (users == []) return res.status(400).send("Cannot find users");
  res.send(users);
});

app.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);

    // const user = { username: req.body.username, password: hashedPassword };
    // users.push(user);
    if (
      (
        await db.query("SELECT * FROM users WHERE username = $1", [
          req.body.username,
        ])
      ).rows.length === 0
    ) {
      await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
        req.body.username,
        hashedPassword,
      ]);
      res.status(201).send();
    } else {
      res.status(400).send("User already exists");
    }
  } catch {
    res.status(500).send();
  }
});
//for checking the login
app.post("/login", async (req, res) => {
  const users = (await db.query("SELECT * FROM users")).rows;
  const user = users.find((user) => user.username === req.body.username);
  console.log(user, " ", req.body)
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(
        { name: req.body.username },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({
        userName: req.body.username,
        accessToken: accessToken,
        id: user.user_id,
      });
    } else {
      res.status(403).send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});
app.delete("/user", async (req, res) => {
  await db.query("DELETE FROM users WHERE user_id = $1", [req.body.id]);
  res.send("User deleted");
});

function authentificateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
// Listening on port specified as environment variable
app.listen(process.env.PORT);
module.exports = authentificateToken;
