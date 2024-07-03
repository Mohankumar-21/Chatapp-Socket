const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const DB = require("./Database/DB");
const Router = require("./Routes/Router");
const cookieparser = require("cookie-parser");
const { app, server } = require("./socket/socket");

// instance
// const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieparser());

//config
env.config();

//Port
const PORT = process.env.PORT || 5000;

//Home page

app.get("/", (req, res) => {
  res.send("Server is running!..");
});

//APi

app.use("/route", Router);

DB();
DB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
});
