"use client";

import * as React from "react";
import { Box, Button, CssBaseline, FormControl, TextField, Typography, Stack, Card as MuiCard } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useFormState } from "react-dom";
import adminLogin from "./admin-login";
import { FormResponse } from "@/app/common/interfaces/form-response.interface";
import AppTheme from "@/shared-theme/AppTheme";
import { useState } from "react";

// ✅ **Utilisation des couleurs du thème global**
const FullScreenContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
}));

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "420px",
  padding: theme.spacing(4),
  gap: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[5],
  transition: "all 0.3s ease",
  "&:hover": { boxShadow: theme.shadows[10] },
  [theme.breakpoints.down("sm")]: { padding: theme.spacing(3), maxWidth: "90%" },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  transition: "background 0.3s ease, transform 0.2s ease",
  "&:hover": { background: theme.palette.primary.dark, transform: "scale(1.03)" },
  "&:disabled": { background: theme.palette.grey[500], color: "#FFFFFF" },
}));

export default function AdminLoginPage(props: { disableCustomTheme?: boolean }) {
  const [state, formAction] = useFormState<FormResponse>(adminLogin, {});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();

  // ✅ Désactiver le bouton si les champs sont vides
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <FullScreenContainer>
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ textAlign: "center", fontWeight: "bold", color: theme.palette.primary.main }}>
            Connexion Administrateur
          </Typography>

          <Typography sx={{ textAlign: "center", fontSize: "0.9rem", color: theme.palette.text.secondary }}>
            Accès réservé aux administrateurs.
          </Typography>

          <Box component="form" action={formAction} noValidate sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}>
            <TextField name="email" label="Email" required fullWidth onChange={(e) => setEmail(e.target.value)} />
            <TextField name="password" label="Mot de passe" type="password" required fullWidth onChange={(e) => setPassword(e.target.value)} />

            {state.error && <Typography color="error">{state.error}</Typography>}

            <Stack spacing={2}>
              <StyledButton type="submit" fullWidth disabled={!isFormValid}>
                Se connecter
              </StyledButton>
            </Stack>
          </Box>
        </Card>
      </FullScreenContainer>
    </AppTheme>
  );
}
