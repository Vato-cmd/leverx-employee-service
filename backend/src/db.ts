import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

interface DateBirth {
  day: string;
  month: string;
  year: string;
}

interface Manager {
  id: string;
  first_name: string;
  last_name: string;
}

export interface User {
  id: string;
  role: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  password: string;
  user_avatar: string;
  isRemoteWork: boolean;
  department: string;
  room: string;
  building: string;
  desk_number: string;
  phone: string;
  viber: string;
  cnumber: string;
  citizenship: string;
  date_birth: DateBirth;
  manager: Manager;
  visa: any[];
  previous_manager_id?: string;
}

interface DBData {
  employees: User[];
}

const adapter = new JSONFile<DBData>("db.json");
const db = new Low<DBData>(adapter, { employees: [] });

export async function readDB() {
  await db.read();
  return db.data!;
}

export async function writeDB(data: DBData) {
  db.data = data;
  await db.write();
}

export default db;
