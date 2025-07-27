"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@/state/auth";
import IUser from "@/types/IUser";

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  // Get token from localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  const { data: user, isLoading, isError } = useUser(token || undefined);

  // Handle authentication errors
  useEffect(() => {
    if (isError && token) {
      setToken(null);
      localStorage.removeItem("token");
    }
  }, [isError, token]);

  const contextValue: AuthContextType = {
    user: user || null,
    isLoading,
    isAuthenticated: !!user && !!token,
    token,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
