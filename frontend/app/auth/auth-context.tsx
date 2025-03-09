"use client";

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { getSession } from "./getSession";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: { userId: number; role: string } | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshSession: async () => {},
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshSession = useCallback(async () => {
    try {
      setLoading(true);
      const session = await getSession();
      setUser(session);
      router.refresh();
    } catch (error) {
      console.error("Erreur lors du rafraîchissement de la session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}
