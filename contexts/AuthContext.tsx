import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import type { User } from '../types';
import { dummyUsers } from '../data/users';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (aadhaar: string) => boolean;
  policeLogin: (officerId: string, password?: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DUMMY_OFFICER_ID = "POLICE007";
const DUMMY_OFFICER_PASS = "password123";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (aadhaar: string): boolean => {
    const citizenUser = dummyUsers.find(u => u.id === aadhaar && u.type === 'citizen');
    if (citizenUser) {
      sessionStorage.setItem('user', JSON.stringify(citizenUser));
      setUser(citizenUser);
      return true;
    }
    return false;
  };

  const policeLogin = (officerId: string, password?: string): boolean => {
    // Make the check more robust: case-insensitive for ID, and trim both inputs.
    if (
      officerId.trim().toUpperCase() === DUMMY_OFFICER_ID &&
      password?.trim() === DUMMY_OFFICER_PASS
    ) {
      const policeUser: User = { 
          id: officerId.trim(), 
          type: 'police',
          name: 'Officer Smith',
          email: 'officer.smith@police.gov',
          imageUrl: `https://i.pravatar.cc/150?u=${officerId.trim()}`
      };
      sessionStorage.setItem('user', JSON.stringify(policeUser));
      setUser(policeUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = useMemo(() => !!user, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, policeLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
