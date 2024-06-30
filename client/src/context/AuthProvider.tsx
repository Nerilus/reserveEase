// AuthProvider.tsx

import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import  {jwtDecode, JwtPayload } from 'jwt-decode';

interface AuthContextData {
  isAuthenticated: boolean;
  token: string | null;
  currentUserAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
}

interface DecodedToken extends JwtPayload {
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [currentUserAdmin, setCurrentUserAdmin] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decodedToken = jwtDecode<DecodedToken>(storedToken);
      if (decodedToken.exp && decodedToken.exp * 1000 > Date.now()) {
        setToken(storedToken);
        setIsAuthenticated(true);
        setCurrentUserAdmin(decodedToken.isAdmin || false);
      } else {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
        const response = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        if (data.token) {
            const decodedToken = jwtDecode<DecodedToken>(data.token);
            setToken(data.token);
            setCurrentUserAdmin(decodedToken.isAdmin || false);
            localStorage.setItem('token', data.token);
            setIsAuthenticated(true);
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new Error(err.message);
        } else {
            throw new Error('Login failed');
        }
    }
};


  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setCurrentUserAdmin(false);
    localStorage.removeItem('token');
  };

  const register = async (username: string, email: string, password: string, confirmPassword: string) => {
    try {
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const response = await fetch('http://localhost:8000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        if (data.token) {
            const decodedToken = jwtDecode<DecodedToken>(data.token);
            setToken(data.token);
            setCurrentUserAdmin(decodedToken.isAdmin || false);
            localStorage.setItem('token', data.token);
            setIsAuthenticated(true);
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new Error(err.message);
        } else {
            throw new Error('Registration failed');
        }
    }
};
  return (
    <AuthContext.Provider value={{ isAuthenticated, token, currentUserAdmin, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
