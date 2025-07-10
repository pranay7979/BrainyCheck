import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import BrainyCheckLogo from "../assets/logo2.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useAuthState(auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  const navItems = [
    { label: "Predict", path: "/predict", authOnly: true },
    { label: "Previous Scans", path: "/previousscans", authOnly: true },
    { label: "Diseases Info", path: "/diseases-info" },
    { label: "Login", path: "/login", guestOnly: true },
    { label: "Signup", path: "/signup", guestOnly: true },
  ];

  const drawerItems = (
    <Box sx={{ width: 250, bgcolor: "#1e293b", height: "100%", color: "#fff" }}>
      <List>
        {navItems.map(({ label, path, authOnly, guestOnly }) => {
          if ((authOnly && !user) || (guestOnly && user)) return null;
          return (
            <ListItem
              button
              key={label}
              component={Link}
              to={path}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary={label} />
            </ListItem>
          );
        })}
        {!user && (
          <ListItem
            button
            component={Link}
            to="/services"
            onClick={() => setDrawerOpen(false)}
          >
            <SupportAgentIcon sx={{ mr: 1 }} />
            <ListItemText primary="Service" />
          </ListItem>
        )}
        {user && (
          <>
            <Divider sx={{ my: 1, bgcolor: "#475569" }} />
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" sx={{ color: "#f44336" }} />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  const navLinkStyle = {
    color: "#fff",
    textDecoration: "none",
    textTransform: "none",
    "&:hover": {
      color: "#ff9800",
    },
  };

  const activeLinkStyle = {
    color: "#ff9800",
    fontWeight: "bold",
    borderBottom: "2px solid #ff9800",
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#0f172a", boxShadow: 3 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              color: "orange",
              textDecoration: "none",
              fontWeight: "bold",
              fontFamily: "Montserrat, sans-serif",
              display: "flex",
              alignItems: "center",
              "&:hover": {
                color: "white",
                transform: "scale(1.05)",
              },
            }}
          >
            <img
              src={BrainyCheckLogo}
              alt="Brainy Check Logo"
              style={{ height: '45px', marginRight: '10px' }}
            />
            Brainy Check
          </Typography>

          {isMobile ? (
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "#fff" }}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              {navItems.map(({ label, path, authOnly, guestOnly }) => {
                if ((authOnly && !user) || (guestOnly && user)) return null;
                return (
                  <Button
                    key={label}
                    component={Link}
                    to={path}
                    sx={{
                      ...navLinkStyle,
                      ...(location.pathname === path ? activeLinkStyle : {}),
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
              {!user && (
                <Button
                  component={Link}
                  to="/services"
                  startIcon={<SupportAgentIcon />}
                  sx={{
                    color: "#fff",
                    textTransform: "none",
                    "&:hover": { color: "#ff9800" },
                    ...(location.pathname === "/services"
                      ? activeLinkStyle
                      : {}),
                  }}
                >
                  Service
                </Button>
              )}
              {user && (
                <Button
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{
                    borderColor: "#f44336",
                    color: "#f44336",
                    "&:hover": {
                      bgcolor: "#f44336",
                      color: "#fff",
                    },
                  }}
                >
                  Logout
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { backgroundColor: "#1e293b" } }}
      >
        {drawerItems}
      </Drawer>
    </>
  );
};

export default Navbar;
