import "./styles.scss";
type DateBirth = {
  year: number | string;
  month: number | string;
  day: number | string;
};

type Manager = {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
};

type Visa = {
  issuing_country: string;
  type: string;
  start_date: number;
  end_date: number;
};

type Employee = {
  id: string;
  isRemoteWork: boolean;
  middle_name: string;
  user_avatar: string;
  first_name: string;
  last_name: string;
  department: string;
  building: string;
  room: string;
  date_birth: DateBirth;
  desk_number: number;
  manager: Manager;
  phone: string;
  email: string;
  viber: string;
  cnumber: string;
  citizenship: string;
  visa: Visa[];
  fullname?: string;
};

const loggedUserAvatar = document.getElementById(
  "logged-user-avatar"
) as HTMLImageElement;
const hiddenNavImage = document.getElementById(
  "hidden-nav-image"
) as HTMLImageElement;
const loggedUserName = document.getElementById(
  "logged-user-name"
) as HTMLElement;

const storedUser =
  sessionStorage.getItem("user") || localStorage.getItem("user");
console.log(storedUser);

if (!storedUser) {
  window.location.href = "signin.html";
}

const loggedUser = JSON.parse(storedUser!);
