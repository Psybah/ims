import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiV1 } from '@/lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await apiV1.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return error.response?.data?.message || 'Login failed';
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const register = async (fullName, email, phoneNumber, password) => {
    setIsLoading(true);
    try {
      await apiV1.post('/auth/register', { fullName, email, phoneNumber, password });
      // Automatically log in the user after successful registration
      await login(email, password);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      setIsLoading(false);
      return error.response?.data?.message || 'Registration failed';
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
