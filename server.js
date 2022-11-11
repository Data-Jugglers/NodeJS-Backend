// only require dotenv in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Setting constants, requiring libraries and files
const express = require("express");
const cors = require("cors");
const routes = require("./routes/graphData");

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

// Listening on port specified as environment variable
app.listen(process.env.PORT);
