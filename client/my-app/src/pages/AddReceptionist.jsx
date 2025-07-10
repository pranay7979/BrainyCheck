import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Fade,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const AddReceptionist = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    const { name, email, password, phone } = form;

    if (!name || !email || !password || !phone) {
      alert("Please fill all fields.");
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Save receptionist info in Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid,
        name,
        email,
        phone,
        role: "receptionist",
        createdAt: new Date(),
      });

      alert("Receptionist added successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error adding receptionist:", error.message);
      alert("Failed to add receptionist.");
    }
  };

  return (
    <Fade in timeout={600}>
      <Box sx={styles.pageWrapper}>
        <Container maxWidth="sm">
          <Paper elevation={6} sx={styles.paper}>
            <Typography variant="h4" align="center" sx={{ color: "#fff", mb: 3 }}>
              Add Receptionist
            </Typography>

            <TextField
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
              required
              sx={styles.input}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              required
              sx={styles.input}
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              margin="normal"
              required
              sx={styles.input}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              required
              sx={styles.input}
            />

            <Button
              variant="contained"
              fullWidth
              sx={styles.addButton}
              onClick={handleAdd}
            >
               Add Receptionist
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
    padding: "32px",
    borderRadius: "12px",
    color: "#fff",
  },
  input: {
    backgroundColor: "#334155",
    input: { color: "#fff" },
    label: { color: "#cbd5e1" },
    mb: 2,
  },
  addButton: {
    mt: 3,
    backgroundColor: "#22c55e",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#16a34a",
    },
  },
};

export default AddReceptionist;
