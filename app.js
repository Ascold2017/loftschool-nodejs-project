const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
require("./db");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", require("./api"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public/index.html"));
});

require("./api/controllers/chat")(io);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

module.exports = { app: app, server: server };
