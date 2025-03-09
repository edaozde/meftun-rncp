"use client";

import { ReactNode } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { grey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#9C4A53", // Rose plus foncé pour un meilleur contraste
      light: "#B76E79",
      dark: "#7B2C35", // Plus foncé pour le hover
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#E57373", // Rose plus vif pour un meilleur contraste
      light: "#FF8A80",
      dark: "#C62828",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFF5F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A", // Noir plus foncé pour un meilleur contraste
      secondary: "#4A4A4A", // Gris plus foncé pour un meilleur contraste
    },
    action: {
      active: "#9C4A53",
      hover: "#B76E79",
      selected: "#E57373",
      disabled: "#9E9E9E",
      disabledBackground: "#F5F5F5",
    },
    error: {
      main: "#D32F2F",
      light: "#EF5350",
      dark: "#C62828",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#2E7D32",
      light: "#4CAF50",
      dark: "#1B5E20",
      contrastText: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "'Playfair Display', 'Montserrat', serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#1A1A1A",
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#1A1A1A",
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#1A1A1A",
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      color: "#1A1A1A",
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      color: "#1A1A1A",
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      color: "#1A1A1A",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "#1A1A1A",
      fontFamily: "'Montserrat', sans-serif",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: "#4A4A4A",
      fontFamily: "'Montserrat', sans-serif",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.875rem",
      fontFamily: "'Montserrat', sans-serif",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
      color: "#4A4A4A",
      fontFamily: "'Montserrat', sans-serif",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#9C4A53",
          color: "#FFFFFF",
          padding: "12px 24px",
          fontSize: "0.875rem",
          fontWeight: 600,
          borderRadius: "8px",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "#7B2C35",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(156, 74, 83, 0.2)",
          },
          "&:active": {
            transform: "translateY(0)",
            boxShadow: "none",
          },
          "&:disabled": {
            backgroundColor: "#9E9E9E",
            color: "#FFFFFF",
          },
        },
        outlined: {
          backgroundColor: "transparent",
          border: "2px solid #9C4A53",
          color: "#9C4A53",
          "&:hover": {
            backgroundColor: "rgba(156, 74, 83, 0.1)",
            borderColor: "#7B2C35",
            color: "#7B2C35",
          },
        },
        text: {
          backgroundColor: "transparent",
          color: "#9C4A53",
          "&:hover": {
            backgroundColor: "rgba(156, 74, 83, 0.1)",
            color: "#7B2C35",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#E0E0E0",
            },
            "&:hover fieldset": {
              borderColor: "#9C4A53",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#9C4A53",
            },
          },
          "& .MuiInputLabel-root": {
            "&.Mui-focused": {
              color: "#9C4A53",
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#1A1A1A",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          borderBottom: "1px solid #E0E0E0",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#9C4A53",
          "&:hover": {
            backgroundColor: "rgba(156, 74, 83, 0.1)",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#9C4A53",
          textDecoration: "none",
          "&:hover": {
            color: "#7B2C35",
            textDecoration: "underline",
          },
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
