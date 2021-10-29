require("dotenv").config();
const express = require("express");
const fs = require('fs');
const https = require('https');


var key = fs.readFileSync('./cert/selfsigned.key','utf8');
var cert = fs.readFileSync('./cert/selfsigned.crt','utf8');
var options = {
  key: key,
  cert: cert
};

const app = require("express")();
const server = https.createServer(options,app);
const userRouter = require("./api/users/user.router");
const cors = require("cors");

app.use("api/*",cors());
app.use(express.json());
app.use(userRouter);


server.listen(process.env.APP_PORT,()=>{
  console.log("Server listening at :" + process.env.APP_PORT);
});

