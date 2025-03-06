"use client";

import * as React from "react";
import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useFormState } from "react-dom";
import adminLogin from "./admin-login";
import AppTheme from "@/shared-theme/AppTheme";

// ✅ Mise en page
const FullScreenContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #eef2ff 0%, #d0d7ff 100%)",
  padding: theme.spacing(2),
}));

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "400px",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: "#fff",
  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "#D9534F",
  color: "#FFFFFF",
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  "&:hover": {
    background: "#C9302C",
  },
}));

export default function AdminLogin() {
  const [state, formAction] = useFormState(adminLogin, { error: "" });

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <FullScreenContainer>
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ textAlign: "center" }}>
            Connexion Admin
          </Typography>

          <Box component="form" action={formAction} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl>
              <TextField name="email" label="Email" required fullWidth />
            </FormControl>
            <FormControl>
              <TextField name="password" label="Mot de passe" type="password" required fullWidth />
            </FormControl>

            <Stack spacing={2}>
              <StyledButton type="submit" fullWidth>Se connecter</StyledButton>
            </Stack>
          </Box>
        </Card>
      </FullScreenContainer>
    </AppTheme>
  );
}
