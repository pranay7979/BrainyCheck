import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Paper,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const Predict = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [diseaseType, setDiseaseType] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageUploaded(!!file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !patientName || !patientAge || !diseaseType) {
      alert("Please fill all fields and select an image.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to predict and save scans.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);
      formData.append("patientName", patientName);
      formData.append("age", patientAge);
      formData.append("diseaseType", diseaseType);

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const prediction = await response.json();

      const newResult = {
        name: patientName,
        age: patientAge,
        diseaseType: diseaseType,
        result: prediction.detectionResult,
        subclass: prediction.subclass,
        confidence: prediction.confidence,
        timestamp: serverTimestamp(),
        userId: user.uid,
      };

      const db = getFirestore();
      await addDoc(collection(db, "scans"), newResult);
      setResult({ ...newResult, time: new Date().toLocaleString() });
    } catch (error) {
      alert("Prediction failed. Check console for details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in={fadeIn} timeout={600}>
      <Box sx={styles.pageWrapper}>
        <Container maxWidth="md">
          <Paper elevation={6} sx={styles.paper}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              align="center"
              gutterBottom
              sx={styles.heading}
            >
              Brain Disease Prediction
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Patient Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                margin="normal"
                required
                sx={styles.input}
              />

              <TextField
                fullWidth
                type="number"
                label="Patient Age"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                margin="normal"
                required
                inputProps={{ min: 14 }}
                sx={styles.input}
              />

              <TextField
                fullWidth
                select
                label="Disease Type"
                value={diseaseType}
                onChange={(e) => setDiseaseType(e.target.value)}
                margin="normal"
                required
                sx={styles.input}
              >
                <MenuItem value="Alzheimer">Alzheimer</MenuItem>
                <MenuItem value="Tumor">Tumor</MenuItem>
              </TextField>

              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={styles.uploadButton}
              >
                {imageUploaded ? "Image Uploaded" : "Upload MRI Image"}
                <input hidden type="file" accept="image/*" onChange={handleImageChange} />
              </Button>

              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={styles.predictButton}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Predict"}
              </Button>
            </Box>
          </Paper>

          {result && (
            <Card sx={styles.resultCard}>
              <CardHeader
                title="Prediction Result"
                sx={{ backgroundColor: "#334155", color: "#ffffff" }}
              />
              <CardContent sx={{ color: "#e2e8f0" }}>
                <Typography><strong>Name:</strong> {result.name}</Typography>
                <Typography><strong>Age:</strong> {result.age}</Typography>
                <Typography><strong>Disease:</strong> {result.diseaseType}</Typography>
                <Typography><strong>Result:</strong> {result.result}</Typography>
                <Typography><strong>Subclass:</strong> {result.subclass}</Typography>
                <Typography><strong>Confidence:</strong> {result.confidence}%</Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  <strong>Time:</strong> {result.time}
                </Typography>
              </CardContent>
            </Card>
          )}
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
  },
  paper: {
    backgroundColor: "#1e293b",
    padding: "32px",
    borderRadius: "16px",
    color: "#fff",
  },
  heading: {
    fontWeight: "bold",
    mb: 3,
  },
  input: {
    backgroundColor: "#334155",
    input: { color: "#fff" },
    label: { color: "#cbd5e1" },
    mb: 2,
  },
  uploadButton: {
    mt: 2,
    backgroundColor: "#38bdf8",
    color: "white",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#0ea5e9",
    },
  },
  predictButton: {
    mt: 3,
    backgroundColor: "#f43f5e",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#e11d48",
    },
  },
  resultCard: {
    mt: 4,
    borderRadius: 3,
    backgroundColor: "#1e293b",
    boxShadow: 6,
  },
};

export default Predict;
