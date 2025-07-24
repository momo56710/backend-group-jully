const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
app.get("/api/users", (req, res) => {
  if (req.params.lng === "en") {
    res.send("Hello World");
  } else if (req.params.lng === "ru") {
    res.send("Привет Мир");
  } else {
    res.send("Hello World");
  }
  const data = fs.readFileSync("users.json", "utf-8");
  const users = JSON.parse(data);
  if (req.query.name && req.query.age && req.query.city) {
    users.push({
      name: req.query.name,
      age: req.query.age,
      city: req.query.city,
    });
  } else {
    res.status(400).send("need to show all of them");
  }
  fs.writeFileSync("users.json", JSON.stringify(users));
  res.send(users);
});
app.post("/api/users", (req, res) => {
  const data = fs.readFileSync("users.json", "utf-8");
  const users = JSON.parse(data);
  if (req.body.name && req.body.age && req.body.city) {
    users.users.push({
      id: users.count,
      name: req.body.name,
      age: req.body.age,
      city: req.body.city,
    });
    users.count++;
  } else {
    res.status(400).send("need to show all of them");
  }
  fs.writeFileSync("users.json", JSON.stringify(users));
  res.send(users);
});
app.get("/api/posts", (req, res) => {
  const data = fs.readFileSync("users.json", "utf-8");
  const users = JSON.parse(data);
  if (req.query.id) {
    const user = users.users[req.query.id];
    res.send(user);
  } else if (req.query.name) {
    const user = users.users.filter((user) => user.name === req.query.name);
    res.send(user);
  } else {
    console.log(users.users);
    res.send(users.users);
  }
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
