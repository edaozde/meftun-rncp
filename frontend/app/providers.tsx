"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ReactElement } from "react";
import AuthProvider from "./auth/auth-context";

interface ProviderProps {
  children: ReactElement[];
}

export default function Providers({ children }: ProviderProps) {
  return (
    <AppRouterCacheProvider>
      <AuthProvider>{children}</AuthProvider>
    </AppRouterCacheProvider>
  );
}
