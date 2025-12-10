"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/user", async (req, res) => {
    const data = await (0, db_1.readDB)();
    res.json(data.employees);
});
app.get("/user/:id", async (req, res) => {
    const data = await (0, db_1.readDB)();
    const employee = data.employees.find((emp) => emp.id === req.params.id);
    if (!employee)
        return res.status(404).json({ message: "User not found" });
    res.json(employee);
});
app.post("/sign-in", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res
            .status(400)
            .json({ message: "Email and password are required." });
    const data = await (0, db_1.readDB)();
    const user = data.employees.find((u) => u.email === email);
    if (!user)
        return res.status(401).json({ message: "Invalid credentials." });
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials." });
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
    if (!first_name || !last_name || !email || !password)
        return res.status(400).json({ message: "All fields are required." });
    const data = await (0, db_1.readDB)();
    const exists = data.employees.find((u) => u.email === email);
    if (exists)
        return res.status(400).json({ message: "Email already exists." });
    const hashed = await bcrypt_1.default.hash(password, 12);
    const newUser = {
        id: (data.employees.length + 1).toString(),
        role: "Employee",
        first_name,
        middle_name: "",
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
        manager: { id: "0", first_name: "No", last_name: "Manager" },
        visa: [{ type: "National visa type D" }],
    };
    data.employees.push(newUser);
    await (0, db_1.writeDB)(data);
    return res.status(201).json({ message: "Account created successfully" });
});
app.patch("/user/:id", async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const data = await (0, db_1.readDB)();
    const employee = data.employees.find((u) => u.id === id);
    if (!employee)
        return res.status(404).json({ message: "User not found" });
    const oldRole = employee.role;
    const newRole = updates.role ?? employee.role;
    if (updates.date_birth) {
        const cleaned = updates.date_birth.replace(/\s+/g, "");
        const [day, month, year] = cleaned.split("/");
        employee.date_birth = { day, month, year };
    }
    if (updates.manager_name) {
        const managerFullName = updates.manager_name.trim().toLowerCase();
        const [first, last] = managerFullName.split(" ");
        if (!first || !last)
            return res.status(400).json({
                message: "Manager name must be: FirstName LastName",
            });
        const newManager = data.employees.find((u) => u.first_name.toLowerCase() === first &&
            u.last_name.toLowerCase() === last);
        if (!newManager)
            return res.status(404).json({ message: "Manager not found" });
        employee.manager = {
            id: newManager.id,
            first_name: newManager.first_name,
            last_name: newManager.last_name,
        };
        delete updates.manager_name;
    }
    for (const key in updates) {
        if (Object.prototype.hasOwnProperty.call(employee, key) &&
            key !== "date_birth") {
            employee[key] = updates[key];
        }
    }
    if (oldRole === "HR" && newRole === "Employee") {
        data.employees.forEach((u) => {
            if (u.manager?.id === id) {
                u.previous_manager_id = id;
                u.manager = { id: "00", first_name: "No", last_name: "Manager" };
            }
        });
    }
    if (newRole === "HR" && oldRole === "Employee") {
        data.employees.forEach((u) => {
            if (u.previous_manager_id === id) {
                u.manager = {
                    id,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                };
                delete u.previous_manager_id;
            }
        });
    }
    await (0, db_1.writeDB)(data);
    return res.json(employee);
});
app.listen(3000, () => console.log("Server running on port 3000"));
