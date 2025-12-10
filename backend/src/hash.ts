import bcrypt from "bcrypt";

async function hashPassword(password: string) {
  const hashed = await bcrypt.hash(password, 12);
  console.log("Hashed password:", hashed);
}

hashPassword("your-password-here");
