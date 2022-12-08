// only require dotenv in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Setting constants, requiring libraries and files
const express = require("express");
const cors = require("cors");
const routes = require("./routes/graphData");
const bcrypt = require("bcrypt");
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

// lets get some posts and gets?? :)
const users = [
  {
    username: "Bob",
    password: "Post 1",
  },
  {
    username: "Alice",
    password: "Post 2",
  },
];
app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);

    const user = { username: req.body.username, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});
app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.username === req.body.username);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    }
  } catch {
    res.status(500).send();
  }
});
// for login

app.get("/login", (req, res) => {});

// Listening on port specified as environment variable
app.listen(process.env.PORT);
