import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  Fade,
} from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const AddDoctor = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
  });

  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddDoctor = async () => {
    const { name, email, password, phone, specialization } = form;
    if (!name || !email || !password || !phone || !specialization) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, "users", uid), {
        name,
        email,
        phone,
        specialization,
        role: "doctor",
        uid,
        createdAt: new Date(),
      });

      alert("Doctor added successfully!");
      setForm({ name: "", email: "", password: "", phone: "", specialization: "" });
    } catch (err) {
      console.error("Error adding doctor:", err);
      alert("Failed to add doctor. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in={fadeIn} timeout={600}>
      <Box sx={styles.pageWrapper}>
        <Container maxWidth="sm">
          <Paper elevation={6} sx={styles.paper}>
            <Typography variant="h4" sx={styles.heading} gutterBottom>
              Add Doctor
            </Typography>

            {["name", "email", "password", "phone", "specialization"].map((field, index) => (
              <TextField
                key={index}
                fullWidth
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                type={field === "password" ? "password" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                sx={styles.input}
                margin="normal"
                required
              />
            ))}

            <Button
              fullWidth
              variant="contained"
              onClick={handleAddDoctor}
              sx={styles.addButton}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Doctor"}
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
    paddingTop: "64px",
    paddingBottom: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  paper: {
    backgroundColor: "#1e293b",
    padding: "32px",
    borderRadius: "16px",
    color: "#fff",
  },
  heading: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    mb: 2,
  },
  input: {
    backgroundColor: "#334155",
    input: { color: "#fff" },
    label: { color: "#cbd5e1" },
    mb: 2,
  },
  addButton: {
    mt: 2,
    backgroundColor: "#38bdf8",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#0ea5e9",
    },
  },
};

export default AddDoctor;
