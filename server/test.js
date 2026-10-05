const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("FINAL TEST WORKING");
});

app.listen(5555, "127.0.0.1", () => {
  console.log("RUNNING ON 5555");
});