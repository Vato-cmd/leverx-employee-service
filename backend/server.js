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

  res.json({
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      user_avatar: user.user_avatar,
      role: user.role,
      managerId: user.manager ? user.manager.id : null,
    },
  });
});

app.post("/sign-up", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const data = readDB();
  const exists = data.employees.find((user) => user.email === email);

  if (exists) {
    return res.status(400).json({ message: "Email already exists." });
  }

  const hashed = await bcrypt.hash(password, 12);

  const newUser = {
    id: (data.employees.length + 1).toString(),
    role: "Employee",
    first_name,
    last_name,
    email,
    password: hashed,
    user_avatar: "images/default-avatar.png",
    isRemoteWork: false,
    department: "",
    room: "",
    building: "",
    desk_number: "",
    phone: "",
    viber: "",
    cnumber: "",
    citizenship: "",
    date_birth: { day: "00", month: "00", year: "00" },
    manager: { id: "00", first_name: "00", last_name: "00" },
    visa: [],
  };

  data.employees.push(newUser);

  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

  return res.status(201).json({ message: "Account created successfully" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.patch("/employees/:id", (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: "Role is required" });
  }

  const data = readDB();
  const employee = data.employees.find((user) => user.id === id);

  if (!employee) {
    return res.status(404).json({ message: "User not founde" });
  }
  employee.role = role;

  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

  res.json({ message: "Role updated successfully", employee });
});
