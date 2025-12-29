import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem("phyto_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post("auth/login.php", { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("phyto_user", JSON.stringify(res.data.user));
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      return { success: false, message: "Login failed" };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await API.post("auth/register.php", { name, email, password });
      if (res.data.success) {
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (error) {
      return { success: false, message: "Registration failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("phyto_user");
  };

  const isAdmin = () => user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}