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
import createUser from "./create-user";
import ColorModeSelect from "@/shared-theme/ColorModeSelect";
import AppTheme from "@/shared-theme/AppTheme";

// ✅ **Fix du Background pour prendre toute la hauteur**
const FullScreenContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #eef2ff 0%, #d0d7ff 100%)",
  padding: theme.spacing(2),
}));

// ✅ **Fix du `Card` pour garder un bon équilibre**
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

// ✅ **Fix du bouton pour un effet plus doux**
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
    background: "#B0B0B0",
    color: "#FFFFFF",
  },
}));

export default function Signup(props: { disableCustomTheme?: boolean }) {
  const [state, formAction] = useFormState(createUser, { error: "" });
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
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
            Inscription
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
                autoComplete="new-password"
                required
                fullWidth
                error={!!state.error}
                helperText={state.error}
              />
            </FormControl>

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
                  <Link href="/terms-and-conditions" target="_blank">
                    Termes et Conditions
                  </Link>
                  .
                </Typography>
              }
            />

            <Stack spacing={2}>
              <StyledButton type="submit" fullWidth disabled={!acceptedPrivacy}>
              S&apos;inscrire
              </StyledButton>

              <Button
                component={NextLink}
                href="/auth/login"
                variant="outlined"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Se connecter
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ textAlign: "center", fontSize: "0.9rem" }}>
            Déjà un compte ?{" "}
            <Link
              component={NextLink}
              href="/auth/login"
              variant="body2"
              sx={{ fontWeight: "bold" }}
            >
              Se connecter
            </Link>
          </Typography>
        </Card>
      </FullScreenContainer>
    </AppTheme>
  );
}
