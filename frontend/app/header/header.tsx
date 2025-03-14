"use client";

import { memo, useCallback, useContext, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AuthContext } from "../auth/auth-context";

// Types
type Route = {
  path: string;
  label: string;
  alwaysAccessible?: boolean;
};

type NavigationRoutes = {
  admin: Route[];
  auth: Route[];
};

// Configuration des routes
const NAVIGATION_ROUTES: NavigationRoutes = {
  admin: [
    { path: "/admin/products", label: "Produits" },
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/clients", label: "Clients" },
    { path: "/admin/audit-logs", label: "Logs d'audit" },
  ],
  auth: [
    { path: "/auth/login", label: "Connexion" },
    { path: "/auth/admin-login", label: "Admin" },
    { path: "/auth/signup", label: "S'inscrire", alwaysAccessible: true },
  ],
};

// Styles
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  height: "64px",
  minHeight: "64px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  height: "64px",
  minHeight: "64px",
  padding: "0 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: "0 16px",
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textDecoration: "none",
  fontWeight: 800,
  fontSize: "2rem",
  fontFamily: "'Playfair Display', serif",
  flexGrow: 1,
  letterSpacing: "2px",
  cursor: "pointer",
  position: "relative",
  textTransform: "uppercase",
  background: "linear-gradient(45deg, #FFFFFF 30%, #FFE5E5 90%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    letterSpacing: "3px",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-2px",
    left: "0",
    width: "100%",
    height: "2px",
    background: "linear-gradient(90deg, transparent, #FFFFFF, transparent)",
    transform: "scaleX(0)",
    transition: "transform 0.3s ease",
  },
  "&:hover::after": {
    transform: "scaleX(1)",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
    letterSpacing: "1px",
  },
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontSize: "0.875rem",
  fontWeight: 600,
  textTransform: "none",
  padding: "8px 16px",
  minHeight: "36px",
  transition: "all 0.3s ease",
  fontFamily: "'Montserrat', sans-serif",
  "&:hover": {
    color: theme.palette.primary.contrastText,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "6px 12px",
    fontSize: "0.8rem",
  },
}));

// Sous-composants memoïsés
const AdminNav = memo(
  ({
    onNavigate,
    currentPath,
  }: {
    onNavigate: (path: string) => void;
    currentPath: string;
  }) => (
    <>
      {NAVIGATION_ROUTES.admin.map((route) => (
        <NavButton
          key={route.path}
          onClick={() => onNavigate(route.path)}
          disabled={currentPath === route.path}
          sx={{
            backgroundColor:
              currentPath === route.path
                ? "rgba(183, 110, 121, 0.1)"
                : "transparent",
          }}
        >
          {route.label}
        </NavButton>
      ))}
    </>
  )
);
AdminNav.displayName = "AdminNav";

const AuthNav = memo(
  ({
    onNavigate,
    currentPath,
  }: {
    onNavigate: (path: string) => void;
    currentPath: string;
  }) => (
    <>
      {NAVIGATION_ROUTES.auth.map((route) => (
        <NavButton
          key={route.path}
          onClick={() => onNavigate(route.path)}
          disabled={currentPath === route.path}
          sx={{
            backgroundColor:
              currentPath === route.path
                ? "rgba(183, 110, 121, 0.1)"
                : "transparent",
          }}
        >
          {route.label}
        </NavButton>
      ))}
    </>
  )
);
AuthNav.displayName = "AuthNav";

const MobileMenu = memo(
  ({
    open,
    onClose,
    routes,
    onNavigate,
    currentPath,
  }: {
    open: boolean;
    onClose: () => void;
    routes: Route[];
    onNavigate: (path: string) => void;
    currentPath: string;
  }) => (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 250,
          backgroundColor: (theme) => theme.palette.background.paper,
        },
      }}
    >
      <List>
        {routes.map((route) => (
          <ListItemButton
            key={route.path}
            onClick={() => {
              if (currentPath !== route.path) {
                onNavigate(route.path);
                onClose();
              }
            }}
            selected={currentPath === route.path}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "rgba(183, 110, 121, 0.1)",
              },
            }}
          >
            <ListItemText
              primary={route.label}
              primaryTypographyProps={{
                sx: {
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  )
);
MobileMenu.displayName = "MobileMenu";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, refreshSession } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = useCallback(async () => {
    if (isPending) return;

    try {
      const response = await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        await refreshSession();
        startTransition(() => {
          router.push("/");
        });
      } else {
        console.error("Erreur lors de la déconnexion:", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  }, [refreshSession, router, isPending]);

  const handleNavigation = useCallback(
    (path: string) => {
      if (isPending || pathname === path) return;
      startTransition(() => {
        router.push(path);
      });
    },
    [router, pathname, isPending]
  );

  const handleMobileMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleMobileMenuOpen = useCallback(() => {
    setMobileMenuOpen(true);
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  // Filtrer les routes pour le menu mobile
  const mobileRoutes = isAuthenticated
    ? isAdmin
      ? NAVIGATION_ROUTES.admin
      : [] // Utilisateur connecté non admin : pas de routes spéciales
    : NAVIGATION_ROUTES.auth;

  return (
    <StyledAppBar>
      <Container maxWidth="xl">
        <StyledToolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { md: "none" } }}
            onClick={handleMobileMenuOpen}
            disabled={isPending}
          >
            <MenuIcon />
          </IconButton>

          <Logo
            onClick={() => handleNavigation("/")}
            sx={{ opacity: isPending ? 0.7 : 1 }}
          >
            MEFTUN
          </Logo>

          <Box
            component="nav"
            sx={{
              display: { xs: "none", md: "flex" },
              gap: "8px",
              alignItems: "center",
            }}
          >
            {!loading && (
              <>
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <AdminNav
                        onNavigate={handleNavigation}
                        currentPath={pathname}
                      />
                    )}
                    <NavButton onClick={handleLogout} disabled={isPending}>
                      Déconnexion
                    </NavButton>
                  </>
                ) : (
                  <AuthNav
                    onNavigate={handleNavigation}
                    currentPath={pathname}
                  />
                )}
              </>
            )}
          </Box>
        </StyledToolbar>
      </Container>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        routes={mobileRoutes}
        onNavigate={handleNavigation}
        currentPath={pathname}
      />
    </StyledAppBar>
  );
};

export default memo(Header);
