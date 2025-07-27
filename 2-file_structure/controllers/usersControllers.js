const fs = require("fs");

const createUser = (req, res) => {
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
};

const getUsers = (req, res) => {
  const data = fs.readFileSync("users.json", "utf-8");
  const users = JSON.parse(data);
  res.send(users);
};
const getUserById = (req, res) => {
  const data = fs.readFileSync("users.json", "utf-8");
  const users = JSON.parse(data);
  const user = users.users.find((user) => user.id === req.params.id);
  res.send(user);
};
module.exports = { createUser, getUsers, getUserById };
