import express, { Request, Response } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { readDB, writeDB, User } from "./db";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://employee-service-app.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/user", async (req: Request, res: Response) => {
  const data = await readDB();
  res.json(data.employees);
});

app.get("/user/:id", async (req: Request, res: Response) => {
  const data = await readDB();
  const employee = data.employees.find(
    (employee) => employee.id === req.params.id
  );

  if (!employee) return res.status(404).json({ message: "User not found" });

  res.json(employee);
});

app.post("/sign-in", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });

  const data = await readDB();
  const user = data.employees.find((user) => user.email === email);

  if (!user) return res.status(401).json({ message: "Invalid credentials." });

  const isMatch = await bcrypt.compare(password, user.password);
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

app.post("/sign-up", async (req: Request, res: Response) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password)
    return res.status(400).json({ message: "All fields are required." });

  const data = await readDB();
  const exists = data.employees.find((user) => user.email === email);

  if (exists) return res.status(400).json({ message: "Email already exists." });

  const hashed = await bcrypt.hash(password, 12);

  const newUser: User = {
    id: (data.employees.length + 1).toString(),
    role: "Employee",
    first_name,
    middle_name: "",
    last_name,
    email,
    password: hashed,
    user_avatar: "/images/default-avatar.png",
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
  await writeDB(data);

  return res.status(201).json({ message: "Account created successfully" });
});

app.patch("/user/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const data = await readDB();
  const employee = data.employees.find((user) => user.id === id);

  if (!employee) return res.status(404).json({ message: "User not found" });

  const oldRole = employee.role;
  const newRole = updates.role ?? employee.role;

  if (updates.date_birth) {
    const cleaned = updates.date_birth.replace(/\s+/g, "");
    const [day, month, year] = cleaned.split("/");
    employee.date_birth = { day, month, year };
    delete updates.date_birth;
  }

  if (updates.manager_name) {
    const raw = updates.manager_name.trim();
    const [first, ...rest] = raw.split(" ");
    const last = rest.join(" ");

    if (!first || !last)
      return res.status(400).json({
        message: "Manager name must be in format: FirstName LastName",
      });

    const newManager = data.employees.find(
      (user) =>
        user.first_name.toLowerCase() === first.toLowerCase() &&
        user.last_name.toLowerCase() === last.toLowerCase()
    );

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
    if (employee.hasOwnProperty(key)) {
      (employee as any)[key] = updates[key];
    }
  }

  if (oldRole === "HR" && newRole === "Employee") {
    data.employees.forEach((user) => {
      if (user.manager?.id === id) {
        user.previous_manager_id = id;
        user.manager = { id: "00", first_name: "No", last_name: "Manager" };
      }
    });
  }

  if (newRole === "HR" && oldRole === "Employee") {
    data.employees.forEach((user) => {
      if (user.previous_manager_id === id) {
        user.manager = {
          id,
          first_name: employee.first_name,
          last_name: employee.last_name,
        };
        delete user.previous_manager_id;
      }
    });
  }

  await writeDB(data);
  return res.json(employee);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
