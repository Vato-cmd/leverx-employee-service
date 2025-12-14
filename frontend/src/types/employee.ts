export interface Manager {
  id: string;
  first_name: string;
  last_name: string;
}

export interface DateBirth {
  day: string | number;
  month: string | number;
  year: string | number;
}

export interface Visa {
  type: string;
}

export interface Employee {
  id: string;
  role: string;
  isRemoteWork: boolean;
  first_name: string;
  middle_name: string;
  last_name: string;
  user_avatar: string;
  department: string;
  building: string;
  room: string;
  desk_number: number;
  phone: string;
  email: string;
  viber: string;
  cnumber: string;
  citizenship: string;
  date_birth: DateBirth;
  visa: Visa[];
  manager: Manager;
}
