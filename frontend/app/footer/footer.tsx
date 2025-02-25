"use client";

import { Box, Container, Link, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// ✅ Footer qui reste en bas sans chevaucher le contenu
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#1E3A8A", // ✅ Même couleur que le header
  color: "white",
  padding: theme.spacing(3, 0),
  textAlign: "center",
  width: "100%", // ✅ Largeur complète
  marginTop: "auto", // ✅ S'assure qu'il est toujours en bas si peu de contenu
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: "#FFDA44", // ✅ Jaune pour le contraste
  textDecoration: "none",
  fontSize: "0.9rem",
  transition: "color 0.3s ease",
  "&:hover": {
    textDecoration: "underline",
    color: "#FFD700",
  },
}));

export default function Footer() {
  return (
    <FooterContainer component="footer">
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", sm: "row" }}
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
        <Typography variant="body2" sx={{ mt: 2, fontSize: "0.8rem" }}>
          © {new Date().getFullYear()} Meftun. Tous droits réservés.
        </Typography>
      </Container>
    </FooterContainer>
  );
}
