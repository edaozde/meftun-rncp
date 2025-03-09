import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./header/header";
import Footer from "./footer/footer";
import Providers from "./providers";
import { Box, CssBaseline } from "@mui/material";
import AppTheme from "@/shared-theme/AppTheme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meftun",
  description: "Application de gestion",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" style={{ height: "100%", overflow: "hidden" }}>
      {/* ✅ Empêche tout scroll global */}
      <body
        className={inter.className}
        style={{
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          height: "100vh", // ✅ Remplit exactement la hauteur de l'écran
          overflow: "hidden", // ✅ Empêche le scroll global
        }}
      >
        <AppTheme>
          <Providers>
            <CssBaseline />

            {/* ✅ HEADER FIXÉ EN HAUT */}
            <Header />

            {/* ✅ CONTENEUR PRINCIPAL QUI PREND TOUT L'ESPACE DISPONIBLE */}
            <Box
              sx={{
                flex: 1, // ✅ Fait grandir le contenu pour occuper tout l'espace restant
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                paddingTop: "64px",
                overflow: "auto", // ✅ Permet un scroll interne au besoin
              }}
            >
              {children}
            </Box>

            {/* ✅ FOOTER TOUJOURS FIXÉ EN BAS */}
            <Box sx={{ width: "100%", flexShrink: 0 }}>
              <Footer />
            </Box>
          </Providers>
        </AppTheme>
      </body>
    </html>
  );
}
