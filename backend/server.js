const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "db.json");

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

app.get("/employees", (req, res) => {
  try {
    const data = readDB();
    res.json(data.employees);
  } catch (err) {
    res.status(500).json({ error: "Failed to read database" });
  }
});

app.get("/employees/:id", (req, res) => {
  try {
    const data = readDB();
    const employee = data.employees.find((e) => e.id === req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: "Failed to read database" });
  }
});

app.post("/employees", (req, res) => {
  try {
    const data = readDB();

    const newEmployee = req.body;
    data.employees.push(newEmployee);

    writeDB(data);

    res.json({ message: "Employee added", employee: newEmployee });
  } catch (err) {
    res.status(500).json({ error: "Failed to save employee" });
  }
});

app.listen(3000, () => {
  console.log("Backend running at http://localhost:3000");
});
