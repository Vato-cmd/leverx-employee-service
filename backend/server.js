const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "db.json");

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

app.get("/employees", (req, res) => {
  const data = readDB();
  res.json(data.employees);
});

app.get("/employees/:id", (req, res) => {
  const data = readDB();
  const employee = data.employees.find(
    (employee) => employee.id === req.params.id
  );

  if (!employee) return res.status(404).json({ message: "User not found" });

  res.json(employee);
});

app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const data = readDB();
  const user = data.employees.find((user) => user.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials." });
  }
  console.log(user);

  res.json({
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      user_avatar: user.user_avatar,
    },
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
