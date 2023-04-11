/*
 * Dependencies
 */

require("dotenv").env;

const express = require("express");

const app = express();

const mongoose = require("mongoose");

const logger = require("morgan");

/*
 *Database
 */
require("./config/database");

/*
 *Globals
 */
const PORT = process.env.PORT || 3001;

/*
 *Middleware
 */

app.use(logger("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use((req, res, next) => {
  res.locals.data = {};
  next();
});
/*
 * Routes
 */

// Put API routes here, before the "catch all" route
app.use("/users", require("./router/user.router"));
app.use("/photos", require("./router/photo.router"));
// Protect the API routes below from anonymous users

app.get("/api", (req, res) => {
  res.json({ message: "The API is alive!!!" });
});

/*
 * Listener
 */
app.listen(PORT, function () {
  console.log(`Express app running on port ${PORT}`);
});
