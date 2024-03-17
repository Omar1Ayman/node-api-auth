const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const ApiError = require("./middlewares/ApiError");
const { errorHandler } = require("./middlewares/error");
require("express-async-errors");
require("dotenv").config();

// connect to DB
require("./config/db");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode : ${process.env.NODE_ENV}`);
} else {
  console.log(`Mode : ${process.env.NODE_ENV}`);
}
/// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set("view engine", "ejs");

/// routes
app.get("/", (req, res) => {
  res.send("hello api");
});

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/password", require("./routes/resetPasswordRoutes"));

app.use("*", (req, res, next) => {
  next(new ApiError(`Can not find this route , ${req.originalUrl}`, 404));
});

//global error middlwares for express and predectied
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(
    `Connect to and running in ${process.env.NODE_ENV} visit: http://localhost:${PORT}`
  );
});

// handel database error
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection error ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("shutting down");
    process.exit(1);
  });
});
