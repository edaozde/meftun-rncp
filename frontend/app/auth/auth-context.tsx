"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { getSession } from "./getSession";

interface AuthContextType {
  user: { userId: number; role: string } | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        console.log("🔄 Récupération de la session...");
        const session = await getSession();
        
        if (session) {
          console.log("✅ Session chargée :", session);
        } else {
          console.warn("⚠️ Aucune session trouvée");
        }

        setUser(session);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération de la session :", error);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
