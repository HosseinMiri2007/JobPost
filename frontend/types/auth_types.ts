import { JobType } from "./job_types";

export type UserType = {
  username: string;
  email: string;
  resume?: string;
  first_name: string;
  last_name: string;
  password: string;
};
export type RegisterUserType = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  username: string;
};

export type LoginType = {
  username: string;
  password: string;
};

export type AuthContextType = {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: UserType | null;
  Login: (credentials: LoginType) => Promise<void>;
  Logout: () => Promise<void>;
  register: (credentials: RegisterUserType) => Promise<void>;
  updateuser: (credentials: RegisterUserType) => Promise<void>;
  uploadresume: (file: File) => Promise<void>;
};
