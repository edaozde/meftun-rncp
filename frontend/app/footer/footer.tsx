"use client";

import { Box, Container, Link, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

// ✅ Footer avec HAUTEUR FIXE et bien positionné
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
  height: "60px", // ✅ Hauteur FIXÉE
  minHeight: "60px",
  display: "flex",
  alignItems: "center", // ✅ Centre le contenu verticalement
  justifyContent: "center", // ✅ Centre horizontalement
  width: "100%",
  marginTop: "auto", // ✅ Fixe en bas
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontSize: "0.8rem", // ✅ Texte plus petit pour un footer discret
  fontWeight: "500",
  margin: "0 8px", // ✅ Espacement entre les liens
  transition: "all 0.3s ease",
  opacity: 0.9,
  "&:hover": {
    opacity: 1,
    textDecoration: "underline",
  },
}));

export default function Footer() {
  const theme = useTheme();

  return (
    <FooterContainer component="footer" role="contentinfo">
      <Container maxWidth="xl">
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <FooterLink href="/about" aria-label="À propos">À propos</FooterLink>
          <FooterLink href="/legal" aria-label="Mentions légales">Mentions légales</FooterLink>
          <FooterLink href="/privacy-policy" aria-label="Politique de confidentialité">
            Politique de confidentialité
          </FooterLink>
        </Stack>
      </Container>
    </FooterContainer>
  );
}
