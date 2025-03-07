"use client";

import { ReactNode } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { grey } from "@mui/material/colors"; 

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#5D4037", contrastText: "#FFFFFF" }, 
    secondary: { main: "#D9822B", contrastText: "#212121" }, 
    background: { default: "#F9F5EC", paper: "#FFFFFF" }, 
    text: { primary: "#3E2723", secondary: grey[800] }, 
    action: { active: "#8D4F32" }, 
  },
  typography: {
    fontFamily: "'Playfair Display', 'Inter', serif", 
    h1: { fontSize: "2.5rem", fontWeight: 700, color: "#5D4037" }, 
    h2: { fontSize: "1.75rem", fontWeight: 600, color: "#5D4037" },
    body1: { fontSize: "1rem", lineHeight: 1.6, color: "#3E2723" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#8D4F32", 
          color: "#FFFFFF",
          padding: "12px 20px",
          fontSize: "1rem",
          fontWeight: "bold",
          borderRadius: "8px", 
          transition: "background 0.3s ease, transform 0.2s ease",
          "&:hover": {
            backgroundColor: "#6D3A2A",
            transform: "scale(1.02)", 
          },
        },
      },
    },
    MuiCard: { 
      styleOverrides: {
        root: {
          borderRadius: "12px", 
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", 
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
    MuiChip: { 
      styleOverrides: {
        root: {
          fontSize: "0.8rem",
          padding: "4px 8px",
          fontWeight: 600,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: "1200px",
          padding: "16px",
        },
      },
    },
  },
});

export default function AppTheme({ children }: { children: ReactNode }) {
  console.log("✅ Thème PREMIUM & ACCESSIBLE appliqué !");
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
