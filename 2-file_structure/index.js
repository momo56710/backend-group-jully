const express = require("express");
const usersRoutes = require("./routes/usersRoutes");
const postsRoutes = require("./routes/postsRoutes");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
