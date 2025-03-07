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
import { styled, useTheme } from "@mui/material/styles";
import NextLink from "next/link";
import { useFormState } from "react-dom";
import login from "./login";
import AppTheme from "@/shared-theme/AppTheme";

// ✅ **Utilisation du thème global**
const FullScreenContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.default, // 🎨 Utilisation du thème
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
  backgroundColor: theme.palette.background.paper, // 🎨 Utilisation du thème
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[5], // ✅ Ombrage cohérent avec le thème
  transition: "all 0.3s ease",
  "&:hover": { boxShadow: theme.shadows[10] },
  [theme.breakpoints.down("sm")]: { padding: theme.spacing(3), maxWidth: "90%" },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main, // 🎨 Utilisation du thème
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  transition: "background 0.3s ease, transform 0.2s ease",
  "&:hover": { background: theme.palette.primary.dark, transform: "scale(1.02)" },
  "&:disabled": { background: theme.palette.grey[500], color: "#FFFFFF" },
}));

export default function Login(props: { disableCustomTheme?: boolean }) {
  const [state, formAction] = useFormState(login, { error: "" });
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const theme = useTheme(); // ✅ Récupération du thème

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
              fontWeight: "bold",
              color: theme.palette.primary.main,
            }}
          >
            Connexion
          </Typography>

          <Box component="form" action={formAction} noValidate sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}>
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
                InputProps={{
                  style: { color: theme.palette.text.primary, background: theme.palette.background.default },
                }}
                InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
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
                InputProps={{
                  style: { color: theme.palette.text.primary, background: theme.palette.background.default },
                }}
                InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
              />
            </FormControl>

            {/* ✅ Checkbox "J'accepte les termes et conditions" */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                  sx={{ color: theme.palette.primary.main }} // 🎨 Cohérence avec le thème
                />
              }
              label={
                <Typography variant="body2">
                  J’accepte les{" "}
                  <Link href="/terms-and-conditions" target="_blank" sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}>
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
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  "&:hover": { background: theme.palette.primary.light },
                }}
              >
                S&apos;inscrire
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ textAlign: "center", fontSize: "0.9rem" }}>
            Pas encore de compte ?{" "}
            <Link component={NextLink} href="/auth/signup" variant="body2" sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
              Inscription
            </Link>
          </Typography>
        </Card>
      </FullScreenContainer>
    </AppTheme>
  );
}
