import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

const getStoredUser = () => {
  const rawUser = localStorage.getItem("teamTaskUser");

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch (_error) {
    localStorage.removeItem("teamTaskUser");
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(localStorage.getItem("teamTaskToken"));

  const persistSession = (payload) => {
    localStorage.setItem("teamTaskToken", payload.token);
    localStorage.setItem("teamTaskUser", JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    persistSession(data);
  };

  const signup = async (values) => {
    const { data } = await api.post("/auth/signup", values);
    persistSession(data);
  };

  const logout = () => {
    localStorage.removeItem("teamTaskToken");
    localStorage.removeItem("teamTaskUser");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAdmin: user?.role === "admin",
      login,
      logout,
      signup
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
