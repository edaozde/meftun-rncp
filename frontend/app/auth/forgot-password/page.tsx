"use client";

import * as React from "react";
import {
  Box,
  Button,
  CssBaseline,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
  FormControl,
  CircularProgress,
  Link,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import NextLink from "next/link";
import { useFormState } from "react-dom";
import AppTheme from "@/shared-theme/AppTheme";
import { useState } from "react";
import LockResetIcon from "@mui/icons-material/LockReset";

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
  maxWidth: "400px",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[5],
  transition: "all 0.3s ease",
  border: `2px solid ${theme.palette.primary.main}20`,
  "&:hover": { 
    boxShadow: theme.shadows[10],
    borderColor: `${theme.palette.primary.main}40`,
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    maxWidth: "95%",
    margin: theme.spacing(1),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
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
  "&:disabled": { background: theme.palette.grey[500], color: "#FFFFFF" },
}));

export default function ForgotPasswordPage(props: { disableCustomTheme?: boolean }) {
  const [state, formAction] = useFormState(async (formData: FormData) => {
    // TODO: Implémenter l'action de réinitialisation
    return { success: true, message: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation." };
  }, { success: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    await formAction(formData);
    setIsLoading(false);
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <FullScreenContainer>
        <Card 
          variant="outlined" 
          role="form"
          aria-labelledby="forgot-password-title"
        >
          <Typography
            id="forgot-password-title"
            component="h1"
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: theme.palette.primary.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <LockResetIcon sx={{ fontSize: 32 }} />
            Mot de passe oublié
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: "0.9rem",
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          >
            Entrez votre email pour recevoir un lien de réinitialisation.
          </Typography>

          {state.message && (
            <Typography 
              color={state.success ? "success.main" : "error.main"}
              sx={{ 
                textAlign: "center",
                backgroundColor: state.success 
                  ? `${theme.palette.success.main}10`
                  : `${theme.palette.error.main}10`,
                padding: 1,
                borderRadius: 1,
                fontSize: "0.875rem"
              }}
            >
              {state.message}
            </Typography>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
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
                error={!!state.message && !state.success}
                InputProps={{
                  style: {
                    color: theme.palette.text.primary,
                    background: theme.palette.background.default,
                  },
                }}
                InputLabelProps={{
                  style: { color: theme.palette.text.secondary },
                }}
              />
            </FormControl>

            <Stack spacing={2}>
              <StyledButton 
                type="submit" 
                fullWidth 
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
              </StyledButton>

              <Button
                component={NextLink}
                href="/auth/login"
                variant="outlined"
                fullWidth
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  "&:hover": { 
                    background: `${theme.palette.primary.main}10`,
                    borderColor: theme.palette.primary.dark,
                    color: theme.palette.primary.dark,
                  },
                }}
              >
                Retour à la connexion
              </Button>
            </Stack>
          </Box>

          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: "center",
              color: theme.palette.text.secondary,
              fontSize: "0.75rem",
              fontStyle: "italic",
            }}
          >
            Le lien de réinitialisation expirera après 1 heure.
          </Typography>
        </Card>
      </FullScreenContainer>
    </AppTheme>
  );
} 