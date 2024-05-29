// Require and configure dotenv
require("dotenv").config();
const http = require("http");
const fs = require("fs");
global.constants = require("./constant");
const express = require("express");
const constant = require("./constant");
const morgan = require("morgan");
const helmet = require("helmet");
const logger = require("./logger.js");
const initSQL = require("./database/mySqlConnection.js");
const routes = require("./createRoutes.js")();
const {startSocketServer} = require("./v1/socket/socketServer");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: process.env.ALLOW_ORIGIN || "http://localhost:3000", // replace with your frontend origin
};



app.use(cors());

app.use(require("./v1/utils/response/responseHandler"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use helmet middleware
app.use(helmet());
app.use("/uploads", express.static("uploads"));

if (app.get("env") === "development") {
  app.use(morgan("dev"));
  console.log("Morgan Enabled - API Request will be logged in terminal.");
}

// app.use( function(req, res, next) {
//   let ipAddress = req.ip;
//   console.log(`\nRequest from IP Address : ${ipAddress}`);
//   // Further processing
//   next();
// });

app.use("/api/" + constants.API_VER, routes);

// Handling Errors
app.use((err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});


app.get("/apin", async (req, res) => {
  console.log("hello there");
  res.json({ message: "**Welcome to next generation Status application." });
});

const SOCKET_PORT = process.env.SOCKET_PORT

// startSocketServer(SOCKET_PORT || 4040);

// set port, listen for requests
const PORT = process.env.PORT || constants.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
