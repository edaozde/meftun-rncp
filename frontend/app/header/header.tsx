"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "next/link";
import { styled } from "@mui/material/styles";

// ✅ Header marron foncé pour cohérence avec le footer
const StyledAppBar = styled(AppBar)({
  backgroundColor: "#4E342E", // ✅ Marron foncé
  padding: "10px 0",
});

// ✅ Boutons contrastés or/marron pour lisibilité parfaite
const NavButton = styled(Button)({
  color: "#FFB300", // ✅ Or profond (contraste validé)
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  "&:hover": { color: "#FFA000" }, // ✅ Variation plus foncée
});

// ✅ Titre du site bien visible
const Logo = styled(Typography)({
  color: "#FFFFFF",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "1.3rem",
  "&:hover": { color: "#FFDA44" }, // ✅ Légère surbrillance au survol
});

export default function Header() {
  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Logo component={Link} href="/">MEFTUN</Logo>
          <div>
            <NavButton component={Link} href="/auth/login">Connexion utilisateur</NavButton>
            <NavButton component={Link} href="/auth/admin-login">Connexion administrateur</NavButton>
            <NavButton component={Link} href="/auth/signup">S'inscrire</NavButton>
          </div>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}
