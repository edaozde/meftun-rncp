import { createTheme } from "@mui/material/styles";
import { blue, deepOrange, grey } from "@mui/material/colors";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: blue[700], // ✅ Bleu accessible
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: deepOrange[500], // ✅ Orange contrasté
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F5F5F5", // ✅ Gris clair agréable
      paper: "#FFFFFF",
    },
    text: {
      primary: "#212121", // ✅ Noir pour bon contraste
      secondary: "#616161", // ✅ Gris foncé lisible
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontWeight: 700, fontSize: "2rem", color: blue[700] },
    h2: { fontWeight: 600, fontSize: "1.75rem" },
    body1: { fontSize: "1rem" },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: blue[300], // ✅ Bleu clair pour contraste sur fond foncé
      contrastText: "#000000",
    },
    secondary: {
      main: deepOrange[300], // ✅ Orange clair accessible
      contrastText: "#000000",
    },
    background: {
      default: "#121212", // ✅ Noir profond
      paper: "#1E1E1E",
    },
    text: {
      primary: "#FFFFFF", // ✅ Blanc pur pour contraste
      secondary: grey[400], // ✅ Gris lisible sur fond sombre
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontWeight: 700, fontSize: "2rem", color: blue[300] },
    h2: { fontWeight: 600, fontSize: "1.75rem" },
    body1: { fontSize: "1rem" },
  },
});

export { lightTheme, darkTheme };
