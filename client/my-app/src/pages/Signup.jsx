import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Fade,
  useMediaQuery,
  Container,
  useTheme,
} from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSignup = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await setDoc(doc(db, "users", userCred.user.uid), {
        name: form.name,
        email: form.email,
        address: form.address,
        phone: form.phone,
        uid: userCred.user.uid,
        createdAt: new Date(),
        role: "user", // default user role
      });

      navigate("/login");
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <Fade in timeout={500}>
        <Box sx={styles.wrapper}>
          <Container maxWidth="xs">
            <Paper elevation={10} sx={styles.paper}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                mb={3}
                color="white"
                fontWeight="bold"
              >
                Create Account
              </Typography>

              {["name", "email", "password", "address", "phone"].map((field, idx) => (
                <TextField
                  key={idx}
                  fullWidth
                  variant="filled"
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  type={field === "password" ? "password" : "text"}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  sx={styles.input}
                />
              ))}

              <Button
                fullWidth
                variant="contained"
                sx={styles.button}
                onClick={handleSignup}
              >
                Signup
              </Button>

              <Typography mt={2} color="gray" fontSize="0.9rem">
                Already have an account?{" "}
                <span style={styles.link} onClick={() => navigate("/login")}>
                  Login
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

export default Signup;
