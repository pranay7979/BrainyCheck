import React, { useState, useEffect } from "react"; // Import useEffect
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Container,
  MenuItem,
  Fade,
} from "@mui/material";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
// import Navbar from "../components/Navbar"; // Assuming Navbar is used elsewhere if needed

const PatientRegistration = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [patient, setPatient] = useState({
    patientId: "", // Add patientId to the state
    name: "",
    age: "",
    gender: "",
    contact: "",
    medicalcondition: "",
    address: "",
  });

  const db = getFirestore();

  useEffect(() => setFadeIn(true), []); // Use useEffect for the fade-in effect

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Include patientId in the validation
    if (
      !patient.patientId ||
      !patient.name ||
      !patient.age ||
      !patient.gender ||
      !patient.contact ||
      !patient.address
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "patients"), {
        ...patient,
        timestamp: serverTimestamp(),
      });
      alert("Patient registered successfully!");
      setPatient({ // Clear the patientId field as well
        patientId: "",
        name: "",
        age: "",
        gender: "",
        contact: "",
        medicalcondition: "",
        address: "",
      });
    } catch (error) {
      console.error("Error adding patient: ", error);
      alert("Failed to register patient.");
    }
  };

  return (
    <>
      <Fade in={fadeIn} timeout={600}>
        <Box sx={{ backgroundColor: "#0f172a", minHeight: "100vh", py: 8 }}>
          <Container maxWidth="sm">
            <Paper elevation={6} sx={{ p: 4, borderRadius: 4, backgroundColor: "#1e293b" }}>
              <Typography variant="h4" align="center" sx={{ color: "#fff", mb: 3 }}>
                Patient Registration
              </Typography>
              <form onSubmit={handleSubmit}>
                {/* Patient ID TextField */}
                <TextField
                  fullWidth
                  label="Patient ID"
                  name="patientId"
                  value={patient.patientId}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={inputStyle}
                />
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={patient.name}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={inputStyle}
                />
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={patient.age}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={inputStyle}
                />
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  name="gender"
                  value={patient.gender}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={inputStyle}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="Medical Condition"
                  name="medicalcondition"
                  value={patient.medicalcondition}
                  onChange={handleChange}
                  margin="normal"
                  required
                  multiline
                  rows={3}
                  sx={inputStyle}
                />
                <TextField
                  fullWidth
                  label="Contact Number"
                  name="contact"
                  value={patient.contact}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={inputStyle}
                />
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={patient.address}
                  onChange={handleChange}
                  margin="normal"
                  required
                  multiline
                  rows={3}
                  sx={inputStyle}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
                    backgroundColor: "#38bdf8",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#0ea5e9" },
                  }}
                >
                  Register
                </Button>
              </form>
            </Paper>
          </Container>
        </Box>
      </Fade>
    </>
  );
};

const inputStyle = {
  backgroundColor: "#334155",
  color: "#fff",
  input: { color: "#fff" },
  label: { color: "#cbd5e1" },
  mb: 2,
};

export default PatientRegistration;