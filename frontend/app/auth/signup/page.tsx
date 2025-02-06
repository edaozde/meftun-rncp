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

// Style du formulaire et de la carte
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  maxWidth: "450px",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const FormContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(4),
  alignItems: "center",
  justifyContent: "center",
}));

export default function Signup(props: { disableCustomTheme?: boolean }) {
  const [state, formAction] = useFormState(createUser, { error: "" });
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <FormContainer>
        <Card variant="outlined">
          <Typography component="h1" variant="h4" align="center">
            Inscription
          </Typography>
          <Box component="form" action={formAction} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              control={<Checkbox checked={acceptedPrivacy} onChange={(e) => setAcceptedPrivacy(e.target.checked)} />}
              label="J'accepte la politique de confidentialité"
            />
            <Button type="submit" fullWidth variant="contained" disabled={!acceptedPrivacy}>
              S'inscrire
            </Button>
          </Box>
          <Divider />
          <Typography align="center">
            Déjà un compte ?{" "}
            <Link component={NextLink} href="/auth/login">
              Se connecter
            </Link>
          </Typography>
        </Card>
      </FormContainer>
    </AppTheme>
  );
}
