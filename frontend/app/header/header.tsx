"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { AuthContext } from "../auth/auth-context";
import { MouseEvent, useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { routes, unauthenticatedRoutes } from "../common/constants/route";
import { styled } from "@mui/material/styles";

// ✅ **Fix du Header - Couleurs et Responsive**
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#1E3A8A", // ✅ Bleu foncé élégant
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  position: "fixed", // ✅ Fixe le header pour éviter le trou blanc
  top: 0,
  width: "100%",
  zIndex: theme.zIndex.drawer + 1,
}));

const NavButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: "bold",
  fontSize: "1rem",
  color: "#FFFFFF",
  transition: "color 0.3s ease, transform 0.2s ease",
  "&:hover": {
    color: "#FACC15", // ✅ Jaune doré pour contraste
    transform: "scale(1.05)",
  },
}));

export default function Header({ logout }: { logout: () => Promise<void> }) {
  const isAuthenticated = useContext(AuthContext);
  const router = useRouter();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const pages = isAuthenticated ? routes : unauthenticatedRoutes;

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <StyledAppBar>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* ✅ Logo à gauche */}
          <ShoppingBasketIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1, color: "white" }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "white",
              textDecoration: "none",
              transition: "color 0.3s ease",
              "&:hover": { color: "#FACC15" },
            }}
          >
            MEFTUN
          </Typography>

          {/* ✅ Menu Burger sur mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="Menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.title}
                  onClick={() => {
                    router.push(page.path);
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* ✅ Liens Navbar */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <NavButton
                key={page.title}
                onClick={() => {
                  router.push(page.path);
                  handleCloseNavMenu();
                }}
              >
                {page.title}
              </NavButton>
            ))}
          </Box>

          {/* ✅ Menu Profil utilisateur */}
          {isAuthenticated && <Settings logout={logout} />}
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}

// ✅ **Fix du menu utilisateur**
const Settings = ({ logout }: { logout: () => Promise<void> }) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Paramètres">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="Profil" src="/static/images/avatar/2.jpg" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem
          key="Logout"
          onClick={async () => {
            await logout();
            handleCloseUserMenu();
          }}
        >
          <Typography textAlign="center">Déconnexion</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};
