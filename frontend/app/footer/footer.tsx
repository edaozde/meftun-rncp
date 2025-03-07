"use client";

import { Box, Container, Link, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// ✅ Footer qui reste en bas et s'intègre bien au design
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#4E342E", // ✅ Marron foncé pour uniformité avec le thème
  color: "#FFFFFF", // ✅ Texte blanc pour un contraste élevé
  padding: theme.spacing(3, 0),
  textAlign: "center",
  width: "100%",
  marginTop: "auto", // ✅ Positionne le footer en bas si le contenu est insuffisant
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: "#FFB300", // ✅ Or profond pour une meilleure visibilité
  textDecoration: "none",
  fontSize: "0.9rem",
  transition: "color 0.3s ease",
  fontWeight: "bold",
  "&:hover": {
    textDecoration: "underline",
    color: "#FFA000",
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
