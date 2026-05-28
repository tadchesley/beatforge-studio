// BeatForge Studio — Auth Context
// Manages user authentication state (localStorage-based for static app)

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'studio';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('bf_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    // Simulate auth — in production this would hit an API
    const stored = localStorage.getItem('bf_users');
    const users: (User & { password: string })[] = stored ? JSON.parse(stored) : [];
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return false;
    const { password: _, ...userData } = found;
    setUser(userData);
    localStorage.setItem('bf_user', JSON.stringify(userData));
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const stored = localStorage.getItem('bf_users');
    const users: (User & { password: string })[] = stored ? JSON.parse(stored) : [];
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) return false;
    const newUser: User & { password: string } = {
      id: crypto.randomUUID(),
      name,
      email,
      plan: 'free',
      createdAt: new Date().toISOString(),
      password,
    };
    users.push(newUser);
    localStorage.setItem('bf_users', JSON.stringify(users));
    const { password: _, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem('bf_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bf_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
