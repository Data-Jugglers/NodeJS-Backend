const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authentificateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const name = authHeader && authHeader.split(" ")[0];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    if (name != user.name) {
      return res.sendStatus(403);
    }
    req.user = user.name;
    next();
  });
};
const deleteUser = async (req, res) => {
  await db.query("DELETE FROM users WHERE username = $1", [
    req.headers["authorization"].split(" ")[0],
  ]);
  res.send("User deleted");
};

const login = async (req, res) => {
  const users = (await db.query("SELECT * FROM users")).rows;
  const user = users.find((user) => user.username === req.body.username);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(
        { name: req.body.username },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.status(200).json({
        userName: req.body.username,
        accessToken: accessToken,
        id: user.user_id,
      });
    } else {
      res.status(403).send("Wrong password");
    }
  } catch {
    res.status(500).send();
  }
};

const signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

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
};
module.exports = { authentificateToken, deleteUser, login, signup };
