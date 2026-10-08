import axios from "axios";
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  AuthContextType,
  LoginType,
  RegisterUserType,
  UserType,
} from "@/types/auth_types";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // login the user

  async function Login({ username, password }: LoginType) {
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/login", {
        username,
        password,
      });
      if (res.data.success) {
        setIsAuthenticated(true);
        setLoading(false);
        await LoadUser();
        router.push("/");
      }
    } catch (err) {
      setLoading(false);

      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail ??
          err.response?.data?.error ??
          "خطای ناشناخته";

        setError(message);

        toast.error(message);
      } else {
        setError("خطای ناشناخته");
      }
    }
  }

  // load user after login (generate access/refresh tokens)
  const LoadUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/auth/user/");
      if (res.data) {
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error),
      );
    }
  }, []);

  // logout function
  async function Logout() {
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/logout/");

      if (res.data) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        router.push("/auth/login/");
      }
    } catch (error) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error),
      );
    }
  }

  // sign up user
  async function register({
    first_name,
    last_name,
    email,
    password,
  }: RegisterUserType) {
    const res = await axios.post(`/api/auth/register`, {
      first_name,
      last_name,
      email,
      password,
    });
    if (res.data) {
      router.push("/auth/login/");
    }
  }

  // update user
  async function updateuser({
    first_name,
    last_name,
    email,
    username,
    password,
  }: RegisterUserType) {
    const res = await axios.put(`/api/auth/updateuser/`, {
      first_name,
      last_name,
      email,
      username,
      password,
    });
    // if (res.data) {
    //   router.push("/auth/login/");
    // }
    if (res.status == 200) {
      toast.success("پروفایل با موفقیت به‌روزرسانی شد");
      await LoadUser();
      router.push("/");
    }
  }

  // upload resume

  async function uploadresume(file: File) {
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file);
      const req = await axios.put(`/api/auth/uploadresume/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (req.status == 200) {
        toast.success("رزومه با موفقیت آپلود شد");
        await LoadUser();
        router.push("/");
      }
    } catch (error) {
      console.error("Upload error:", error);

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || "خطا در آپلود رزومه";
        toast.error(message);
      } else {
        toast.error("خطای ناشناخته");
      }
    } finally {
      setLoading(false);
    }
  }

  // user the access token to load the user without everytime signing in and login
  useEffect(() => {
    if (!user) {
      LoadUser();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        error,
        isAuthenticated,
        user,
        Login,
        Logout,
        register,
        updateuser,
        uploadresume,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth باید داخل AuthProvider استفاده بشه");
  }
  return context;
}
