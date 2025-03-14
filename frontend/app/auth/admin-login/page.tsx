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
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import adminLogin from "./admin-login";
import { FormResponse } from "@/app/common/interfaces/form-response.interface";
import AppTheme from "@/shared-theme/AppTheme";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth-context";

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

export default function AdminLoginPage(props: {
  disableCustomTheme?: boolean;
}) {
  const router = useRouter();
  const { refreshSession } = useContext(AuthContext);
  const [state, formAction] = useFormState<FormResponse, FormData>(adminLogin, {
    error: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (state && !state.error) {
      refreshSession().then(() => {
        router.push("/admin/dashboard");
        router.refresh();
      });
    }
  }, [state, router, refreshSession]);

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
          aria-labelledby="admin-login-title"
        >
          <Typography
            id="admin-login-title"
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
            <AdminPanelSettingsIcon sx={{ fontSize: 32 }} />
            Connexion Administrateur
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: "0.9rem",
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          >
            Accès réservé aux administrateurs.
          </Typography>

          {state.error && (
            <Typography
              color="error"
              sx={{
                textAlign: "center",
                backgroundColor: `${theme.palette.error.main}10`,
                padding: 1,
                borderRadius: 1,
                fontSize: "0.875rem",
              }}
            >
              {state.error}
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
                error={!!state.error}
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
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </StyledButton>

              <Button
                component={NextLink}
                href="/auth/login"
                variant="text"
                fullWidth
                sx={{
                  textTransform: "none",
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                ← Retour à la connexion utilisateur
              </Button>
            </Stack>
          </Box>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: "0.75rem",
              color: theme.palette.text.secondary,
              mt: 2,
              fontStyle: "italic",
            }}
          >
            Cette page est sécurisée. Vos informations sont protégées.
          </Typography>
        </Card>
      </FullScreenContainer>
    </AppTheme>
  );
}
