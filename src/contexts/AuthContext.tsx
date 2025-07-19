import React, { createContext, useContext, useState, useEffect } from "react";
import { apiV1 } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [token]);

  const login = async (email, password, role: "admin" | "member" = "admin") => {
    setIsLoading(true);
    try {
      const endpoint = role === "admin" ? `/auth/login` : `/auth/member/login`;
      const response = await apiV1.post(endpoint, { email, password });
      const { user, token } = response.data.data;
      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Request data:", { email, password: "***" });
      setIsLoading(false);

      // Try to get detailed error message
      if (error.response?.data?.message) {
        return error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = error.response.data.errors
          .map((err) => err.message || err)
          .join(", ");
        return errorMessages;
      } else if (error.response?.status === 422) {
        return "Invalid email or password format. Please check your credentials.";
      } else {
        return error.message || "Login failed";
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const register = async (fullName, email, phoneNumber, password) => {
    setIsLoading(true);
    try {
      await apiV1.post("/auth/register", {
        fullName,
        email,
        phoneNumber,
        password,
      });
      navigate("/");
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      setIsLoading(false);
      return error.response?.data?.message || "Registration failed";
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
