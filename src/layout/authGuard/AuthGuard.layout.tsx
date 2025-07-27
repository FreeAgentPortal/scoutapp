"use client";

import React from "react";
import { useAuth } from "@/layout/authProvider/AuthProvider.layout";
import AppLayout from "@/layout/appLayout/AppLayout.layout";
import LoginView from "@/views/auth/LoginView";
import LoadingView from "@/views/auth/LoadingView";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingView />;
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return <AppLayout>{children}</AppLayout>;
};

export default AuthGuard;
