import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Fade,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogin = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/predict");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      <Navbar />
      <Fade in timeout={500}>
        <Box sx={styles.wrapper}>
          <Container maxWidth="xs">
            <Paper elevation={10} sx={styles.paper}>
              <Typography variant={isMobile ? "h5" : "h4"} mb={3} color="white">
                Welcome Back
              </Typography>

              {["email", "password"].map((field, idx) => (
                <TextField
                  key={idx}
                  fullWidth
                  variant="filled"
                  label={field === "email" ? "Email" : "Password"}
                  type={field === "password" ? "password" : "text"}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  sx={styles.input}
                />
              ))}

              {error && (
                <Typography color="error" fontSize="0.9rem" mt={1}>
                  {error}
                </Typography>
              )}

              <Button
                fullWidth
                variant="contained"
                sx={styles.button}
                onClick={handleLogin}
              >
                Login
              </Button>

              <Typography mt={2} color="gray" fontSize="0.9rem">
                Don't have an account?{" "}
                <span style={styles.link} onClick={() => navigate("/signup")}>
                  Sign up
                </span>
              </Typography>
            </Paper>
          </Container>
        </Box>
      </Fade>
    </>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#0f172a",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    py: 4,
  },
  paper: {
    backgroundColor: "#1e293b",
    padding: "32px",
    borderRadius: "12px",
    textAlign: "center",
  },
  input: {
    mb: 2,
    backgroundColor: "#334155",
    input: { color: "#fff" },
    label: { color: "#cbd5e1" },
    "& .MuiFilledInput-root": {
      backgroundColor: "#334155",
      "&:hover": {
        backgroundColor: "#475569",
      },
      "&.Mui-focused": {
        backgroundColor: "#475569",
      },
    },
  },
  button: {
    mt: 2,
    backgroundColor: "#10b981",
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#34d399" },
  },
  link: {
    color: "#38bdf8",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;
