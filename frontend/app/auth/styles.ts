import { Box, Button, Card as MuiCard } from "@mui/material";
import { styled } from "@mui/material/styles";

export const FullScreenContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
}));

export const AuthCard = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "400px",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[5],
  transition: "all 0.3s ease",
  "&:hover": { boxShadow: theme.shadows[10] },
  [theme.breakpoints.down("sm")]: { 
    padding: theme.spacing(3), 
    maxWidth: "90%" 
  },
}));

export const AuthButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  transition: "all 0.3s ease",
  "&:hover": { 
    background: theme.palette.primary.dark,
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  "&:disabled": { 
    background: theme.palette.grey[500], 
    color: "#FFFFFF" 
  },
}));

export const OutlinedButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1.5),
  transition: "all 0.3s ease",
  "&:hover": { 
    borderColor: theme.palette.primary.dark,
    backgroundColor: `${theme.palette.primary.main}10`,
    transform: "translateY(-1px)",
  },
})); 