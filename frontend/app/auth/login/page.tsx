"use client";

import * as React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  Divider,
  FormControlLabel,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import NextLink from "next/link";
import { useFormState } from "react-dom";
import login from "./login";
import AppTheme from "@/shared-theme/AppTheme";

// ✅ **Background optimisé pour un meilleur rendu**
const FullScreenContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #eef2ff 0%, #d0d7ff 100%)",
  padding: theme.spacing(2),
}));

// ✅ **Fix du `Card` pour un bon équilibre**
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
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.15)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
    maxWidth: "90%",
  },
}));

// ✅ **Amélioration du bouton pour meilleure lisibilité**
const StyledButton = styled(Button)(({ theme }) => ({
  background: "#2D7DD2",
  color: "#FFFFFF",
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  transition: "background 0.3s ease, transform 0.2s ease",
  "&:hover": {
    background: "#205F9F",
    transform: "scale(1.02)",
  },
  "&:disabled": {
    background: "#7A7A7A", // ✅ Gris plus foncé pour accessibilité
    color: "#FFFFFF",
  },
}));

export default function Login(props: { disableCustomTheme?: boolean }) {
  const [state, formAction] = useFormState(login, { error: "" });
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <FullScreenContainer>
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              textAlign: "center",
              fontSize: "clamp(2rem, 10vw, 2.25rem)",
              fontWeight: "bold",
            }}
          >
            Connexion
          </Typography>
          <Box
            component="form"
            action={formAction}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <TextField
                name="email"
                label="Email"
                variant="outlined"
                type="email"
                autoComplete="email"
                required
                fullWidth
                error={!!state.error}
                helperText={state.error}
              />
            </FormControl>
            <FormControl>
              <TextField
                name="password"
                label="Mot de passe"
                variant="outlined"
                type="password"
                autoComplete="current-password"
                required
                fullWidth
                error={!!state.error}
                helperText={state.error}
              />
            </FormControl>

            {/* ✅ Checkbox "J'accepte les termes et conditions" */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2">
                  J’accepte les{" "}
                  <Link href="/terms-and-conditions" target="_blank" sx={{ color: "#1E5EA8", fontWeight: "bold" }}>
                    Termes et Conditions
                  </Link>
                  .
                </Typography>
              }
            />

            {/* ✅ Stack pour bien aligner les boutons */}
            <Stack spacing={2}>
              <StyledButton type="submit" fullWidth disabled={!acceptedPrivacy}>
                Se connecter
              </StyledButton>

              {/* ✅ Bouton d'inscription sous "Se connecter" */}
              <Button
                component={NextLink}
                href="/auth/signup"
                variant="outlined"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                S&apos;inscrire
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ textAlign: "center", fontSize: "0.9rem" }}>
            Pas encore de compte ?{" "}
            <Link
              component={NextLink}
              href="/auth/signup"
              variant="body2"
              sx={{ fontWeight: "bold", color: "#1E5EA8" }}
            >
              Inscription
            </Link>
          </Typography>
        </Card>
      </FullScreenContainer>
    </AppTheme>
  );
}
