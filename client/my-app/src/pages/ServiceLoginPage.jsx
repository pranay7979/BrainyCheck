import React, { useState } from "react";
import {
  Container,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Button,
  Box,
  Fade,
  TextField,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase"; // 🔁 Make sure firebase is initialized in this file

const ServiceLoginPage = () => {
  const [role, setRole] = useState("admin");
  const [fadeIn, setFadeIn] = useState(true);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleChange = (_, newRole) => {
    if (newRole) setRole(newRole);
  };

  const handleLogin = async () => {
    if (!id || !password) {
      alert("Please enter both ID and password.");
      return;
    }

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, id, password);
      const uid = userCredential.user.uid;

      // Fetch role from Firestore
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("User record not found.");
        return;
      }

      const userData = userSnap.data();
      if (userData.role !== role) {
        alert(`You are not authorized as a ${role}.`);
        return;
      }

      // Redirect based on role
      if (role === "admin") navigate("/admin");
      else if (role === "doctor") navigate("/doctor");
      else if (role === "receptionist") navigate("/receptionist");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please check your email and password.");
    }
  };

  return (
    <Fade in={fadeIn} timeout={600}>
      <Box sx={styles.pageWrapper}>
        <Container maxWidth="sm">
          <Paper elevation={6} sx={styles.paper}>
            <Typography variant="h4" align="center" sx={styles.heading}>
              Login Portal
            </Typography>

            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={handleChange}
              fullWidth
              sx={{ mt: 3 }}
            >
              <ToggleButton value="admin" sx={styles.toggleBtn}>
                <AdminPanelSettingsIcon sx={{ mr: 1 }} />
                Admin
              </ToggleButton>
              <ToggleButton value="doctor" sx={styles.toggleBtn}>
                <LocalHospitalIcon sx={{ mr: 1 }} />
                Doctor
              </ToggleButton>
              <ToggleButton value="receptionist" sx={styles.toggleBtn}>
                <SupportAgentIcon sx={{ mr: 1 }} />
                Receptionist
              </ToggleButton>
            </ToggleButtonGroup>

            <TextField
              fullWidth
              variant="filled"
              label="Email"
              type="email"
              value={id}
              onChange={(e) => setId(e.target.value)}
              sx={styles.input}
            />

            <TextField
              fullWidth
              variant="filled"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={styles.input}
            />

            <Button
              variant="contained"
              fullWidth
              sx={styles.loginBtn}
              onClick={handleLogin}
            >
              Login as {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>
          </Paper>
        </Container>
      </Box>
    </Fade>
  );
};

const styles = {
  pageWrapper: {
    backgroundColor: "#0f172a",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "80px",
  },
  paper: {
    backgroundColor: "#1e293b",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
    color: "#fff",
  },
  heading: {
    fontWeight: "bold",
    color: "#fff",
  },
  toggleBtn: {
    color: "#fff",
    borderColor: "#334155",
    backgroundColor: "#334155",
    "&.Mui-selected": {
      backgroundColor: "#38bdf8",
      color: "#000",
      fontWeight: "bold",
    },
    "&:hover": {
      backgroundColor: "orange",
    },
  },
  input: {
    backgroundColor: "#334155",
    borderRadius: "6px",
    input: { color: "#fff" },
    label: { color: "#cbd5e1" },
    "& .MuiFilledInput-root": {
      backgroundColor: "#334155",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#475569",
      },
      "&.Mui-focused": {
        backgroundColor: "#475569",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#cbd5e1",
    },
    mt: 2,
  },
  loginBtn: {
    mt: 4,
    backgroundColor: "#38bdf8",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#0ea5e9",
    },
  },
};

export default ServiceLoginPage;
