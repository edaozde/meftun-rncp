"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BrushIcon from "@mui/icons-material/Brush";

export default function Home() {
  const theme = useTheme();

  return (
    <Box
      component="main"
      role="main"
      sx={{
        pt: "64px", // Hauteur du header
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Hero Section */}
      <Box
        component="section"
        aria-labelledby="hero-title"
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.background.paper} 30%, ${theme.palette.background.default} 90%)`,
          color: theme.palette.text.primary,
          py: { xs: 8, md: 12 },
          mb: { xs: 4, md: 6 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                id="hero-title"
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: "300",
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  color: theme.palette.text.primary,
                  fontFamily: "Playfair Display, serif",
                  lineHeight: 1.2,
                }}
              >
                Créations Uniques
                <br />
                <span style={{ color: theme.palette.primary.main }}>
                  à la Main
                </span>
              </Typography>
              <Typography
                variant="h6"
                component="p"
                sx={{
                  mb: 4,
                  color: theme.palette.text.secondary,
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: "300",
                  lineHeight: 1.6,
                }}
              >
                Découvrez notre collection de robes artisanales,
                <br />
                où chaque pièce raconte une histoire
              </Typography>
              <Button
                variant="outlined"
                size="large"
                aria-label="Découvrir la collection de robes"
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: `${theme.palette.primary.main}10`,
                  },
                  px: 4,
                  py: 1.5,
                  borderRadius: 0,
                  textTransform: "none",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
                href="/products"
              >
                Découvrir la Collection
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/hero-image.jpg"
                alt="Une belle robe artisanale faite main, présentée sur un fond élégant"
                sx={{
                  width: "100%",
                  maxWidth: 500,
                  display: "block",
                  mx: "auto",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: { xs: 6, md: 12 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              component="article"
              elevation={0}
              sx={{
                p: 4,
                height: "100%",
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 0,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Stack spacing={3} alignItems="center">
                <BrushIcon
                  sx={{
                    fontSize: 48,
                    color: theme.palette.primary.main,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                  aria-hidden="true"
                />
                <Typography
                  variant="h5"
                  component="h2"
                  align="center"
                  sx={{
                    fontFamily: "Playfair Display, serif",
                    color: theme.palette.text.primary,
                    fontWeight: "400",
                  }}
                >
                  Fait Main avec Amour
                </Typography>
                <Typography
                  variant="body1"
                  component="p"
                  align="center"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    color: theme.palette.text.secondary,
                    lineHeight: 1.8,
                  }}
                >
                  Chaque robe est confectionnée à la main avec attention et
                  passion, garantissant une qualité exceptionnelle et une
                  finition soignée.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              component="article"
              elevation={0}
              sx={{
                p: 4,
                height: "100%",
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 0,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Stack spacing={3} alignItems="center">
                <FavoriteIcon
                  sx={{
                    fontSize: 48,
                    color: theme.palette.primary.main,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                  aria-hidden="true"
                />
                <Typography
                  variant="h5"
                  component="h2"
                  align="center"
                  sx={{
                    fontFamily: "Playfair Display, serif",
                    color: theme.palette.text.primary,
                    fontWeight: "400",
                  }}
                >
                  Pièces Uniques
                </Typography>
                <Typography
                  variant="body1"
                  component="p"
                  align="center"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    color: theme.palette.text.secondary,
                    lineHeight: 1.8,
                  }}
                >
                  Chaque création est unique, porteuse d&apos;une histoire
                  singulière et d&apos;une attention particulière aux détails.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              component="article"
              elevation={0}
              sx={{
                p: 4,
                height: "100%",
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 0,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Stack spacing={3} alignItems="center">
                <LocalShippingIcon
                  sx={{
                    fontSize: 48,
                    color: theme.palette.primary.main,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                  aria-hidden="true"
                />
                <Typography
                  variant="h5"
                  component="h2"
                  align="center"
                  sx={{
                    fontFamily: "Playfair Display, serif",
                    color: theme.palette.text.primary,
                    fontWeight: "400",
                  }}
                >
                  Livraison Soignée
                </Typography>
                <Typography
                  variant="body1"
                  component="p"
                  align="center"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    color: theme.palette.text.secondary,
                    lineHeight: 1.8,
                  }}
                >
                  Vos créations sont emballées avec soin et expédiées rapidement
                  pour une réception parfaite.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export const unauthenticatedRoutes = [
  { title: "Connexion utilisateur", path: "/auth/login" },
  { title: "Connexion administrateur", path: "/auth/admin-login" },
  { title: "S'inscrire", path: "/auth/signup" },
];
