import React, { createContext, useContext, useEffect, useState } from 'react';

import { AuthResponse } from '../models/auth';


 

type AuthContextType = {

  user: AuthResponse | null;

  login: (data: AuthResponse) => void;

  logout: () => void;

  loading: boolean;

};


 

const AuthContext = createContext<AuthContextType | undefined>(undefined);


 

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<AuthResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const stored = localStorage.getItem('auth');

    if (stored) {

      setUser(JSON.parse(stored));

    }

    setLoading(false);

  }, []);


 

  const login = (data: AuthResponse) => {

    setUser(data);

    localStorage.setItem('auth', JSON.stringify(data));

  };


 

  const logout = () => {

    setUser(null);

    localStorage.removeItem('auth');

  };


 

  return (

    <AuthContext.Provider value={{ user, login, logout, loading }}>

      {children}

    </AuthContext.Provider>

  );

};


 

export const useAuth = (): AuthContextType => {

  const ctx = useContext(AuthContext);

  if (!ctx) {

    throw new Error('useAuth must be used within AuthProvider');

  }

  return ctx;

};



 