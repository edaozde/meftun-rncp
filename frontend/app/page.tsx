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
          background: `linear-gradient(135deg, 
            ${theme.palette.background.paper} 0%,
            ${theme.palette.background.default} 100%)`,
          color: theme.palette.text.primary,
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "url('/pattern.png')", // Vous devrez ajouter cette image
            opacity: 0.03,
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative" }}>
                <Typography
                  id="hero-title"
                  variant="h1"
                  component="h1"
                  sx={{
                    fontWeight: "300",
                    fontSize: { xs: "2.75rem", md: "4rem" },
                    color: "black",
                    fontFamily: "Playfair Display, serif",
                    lineHeight: 1.2,
                    marginBottom: "0.5rem",
                  }}
                >
                  Créations
                  <br />
                  Uniques
                </Typography>
                <Typography
                  variant="h2"
                  component="span"
                  sx={{
                    display: "block",
                    fontWeight: "300",
                    fontSize: { xs: "2rem", md: "3rem" },
                    color: "#9e6f6f",
                    fontFamily: "Playfair Display, serif",
                    fontStyle: "italic",
                    marginBottom: "2rem",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: "-10px",
                      left: 0,
                      width: "60px",
                      height: "2px",
                      backgroundColor: "#9e6f6f",
                    },
                  }}
                >
                  à la Main
                </Typography>
                <Typography
                  variant="h6"
                  component="p"
                  sx={{
                    mb: 6,
                    color: theme.palette.text.secondary,
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: "300",
                    lineHeight: 1.8,
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    maxWidth: "90%",
                  }}
                >
                  Découvrez notre collection de robes artisanales, où chaque
                  pièce raconte une histoire unique et intemporelle
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
                      transform: "translateY(-2px)",
                    },
                    px: 6,
                    py: 2,
                    borderRadius: "2px",
                    borderWidth: "2px",
                    textTransform: "none",
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "1.1rem",
                    fontWeight: 500,
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      backgroundColor: theme.palette.primary.main,
                      transform: "scaleX(0)",
                      transition: "transform 0.3s ease",
                      transformOrigin: "right",
                    },
                    "&:hover::after": {
                      transform: "scaleX(1)",
                      transformOrigin: "left",
                    },
                  }}
                  href="/products"
                >
                  Découvrir la Collection
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/hero-image.jpg"
                alt="Une belle robe artisanale faite main, présentée sur un fond élégant"
                sx={{
                  width: "100%",
                  maxWidth: 600,
                  display: "block",
                  mx: "auto",
                  boxShadow:
                    "20px 20px 60px rgba(0,0,0,0.1), -20px -20px 60px rgba(255,255,255,0.5)",
                  borderRadius: "8px",
                  transition: "all 0.5s ease",
                  transform: "perspective(1000px) rotateY(-5deg)",
                  "&:hover": {
                    transform:
                      "perspective(1000px) rotateY(0deg) translateY(-8px)",
                    boxShadow:
                      "30px 30px 80px rgba(0,0,0,0.15), -30px -30px 80px rgba(255,255,255,0.6)",
                  },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 8, md: 12 },
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100px",
            height: "3px",
            background: `linear-gradient(to right, transparent, ${theme.palette.primary.main}, transparent)`,
          },
        }}
      >
        <Grid container spacing={4}>
          {[
            {
              icon: BrushIcon,
              title: "Fait Main avec Amour",
              description:
                "Chaque robe est confectionnée à la main avec attention et passion, garantissant une qualité exceptionnelle et une finition soignée.",
            },
            {
              icon: FavoriteIcon,
              title: "Pièces Uniques",
              description:
                "Chaque création est unique, porteuse d'une histoire singulière et d'une attention particulière aux détails.",
            },
            {
              icon: LocalShippingIcon,
              title: "Livraison Soignée",
              description:
                "Vos créations sont emballées avec soin et expédiées rapidement pour une réception parfaite.",
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                component="article"
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  backgroundColor: "transparent",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "4px",
                  transition: "all 0.4s ease",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, transparent 100%)`,
                    opacity: 0,
                    transition: "opacity 0.4s ease",
                  },
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                    borderColor: theme.palette.primary.main,
                    "&::before": {
                      opacity: 0.1,
                    },
                  },
                }}
              >
                <Stack
                  spacing={3}
                  alignItems="center"
                  sx={{ position: "relative" }}
                >
                  <feature.icon
                    sx={{
                      fontSize: 56,
                      color: theme.palette.primary.main,
                      transition: "all 0.4s ease",
                      "&:hover": {
                        transform: "scale(1.1) rotate(5deg)",
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
                      fontWeight: "500",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: "-8px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "40px",
                        height: "2px",
                        backgroundColor: theme.palette.primary.main,
                        opacity: 0.7,
                      },
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    align="center"
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      color: theme.palette.text.secondary,
                      lineHeight: 1.8,
                      fontSize: "1rem",
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
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
