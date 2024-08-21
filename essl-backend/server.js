

var cors = require('cors');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require('helmet');
// const passport = require('passport');
// const { initializingPassport } = require('./passportconfig');
const connection = require("./config/connection");
// const expressSession = require('express-session');
const allRoutes = require('./routes/allroutes.route');


var con = connection.con;

if (!con) {
  console.log("Error connecting to database");
}



app.use(cors('*'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(allRoutes);





app.listen(4000, () => {
  console.log("Server is listening on port : " + 4000);
});