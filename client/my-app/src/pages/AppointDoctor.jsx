import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  MenuItem,
  Fade,
  Divider,
} from "@mui/material";
import { DesktopDatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { Padding } from "@mui/icons-material";

const AppointDoctor = () => {
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [doctorList, setDoctorList] = useState([]);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [notes, setNotes] = useState("");
  const db = getFirestore();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "doctor"));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || "Unnamed",
        }));
        setDoctorList(docs);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        // Optionally, handle error state or display a message
      }
    };

    fetchDoctors();
  }, [db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId || !doctorId || !date || !time) {
      alert("Please fill all required fields.");
      return;
    }

    // Basic validation for date and time being valid Date objects
    if (!(date instanceof Date && !isNaN(date)) || !(time instanceof Date && !isNaN(time))) {
      alert("Please select a valid date and time.");
      return;
    }

    try {
      const appointment = {
        patientId,
        doctorId, // Ensure doctorId is stored
        date: date.toDateString(),
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes,
        createdAt: new Date(),
      };

      // Changed the path to directly add to a top-level 'appointments' collection
      // and include doctorId as a field, instead of a subcollection.
      // This makes querying appointments across all doctors easier.
      await addDoc(collection(db, "appointments"), appointment); 
      
      alert("Appointment scheduled successfully.");
      setPatientId("");
      setDoctorId("");
      setDate(new Date());
      setTime(new Date());
      setNotes("");
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert("Failed to schedule appointment.");
    }
  };

  return (
    <Fade in timeout={600}>
      <Box sx={styles.pageWrapper}>
        <Container maxWidth="sm">
          <Paper elevation={8} sx={styles.paper}>
            <Box sx={styles.header}>
              <EventAvailableIcon sx={{ fontSize: 38, color: "#38bdf8" }} /> {/* Increased icon size */}
              <Typography variant="h5" sx={styles.heading}>
                Schedule Appointment
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, backgroundColor: "#334155" }} />

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                margin="normal"
                required
                variant="outlined" // Explicitly set variant
                sx={styles.input}
              />

              <TextField
                fullWidth
                select
                label="Select Doctor"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                margin="normal"
                required
                variant="outlined" // Explicitly set variant
                sx={styles.input}
                SelectProps={{ // Styles for the dropdown icon
                  MenuProps: {
                    PaperProps: {
                      sx: { // Style for the dropdown menu paper
                        backgroundColor: '#1e293b', // Match form background
                        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                      },
                    },
                  },
                }}
              >
                {doctorList.map((doc) => (
                  <MenuItem
                    key={doc.id}
                    value={doc.id}
                    sx={{
                      backgroundColor: '#1e293b', // Item background
                      color: '#e2e8f0', // Item text color
                      '&:hover': {
                        backgroundColor: '#334155', // Hover background
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#38bdf8', // Selected background
                        color: '#fff', // Selected text color
                        '&:hover': {
                          backgroundColor: '#0ea5e9', // Darker on selected hover
                        },
                      },
                    }}
                  >
                    {doc.name}
                  </MenuItem>
                ))}
              </TextField>
              
              <LocalizationProvider dateAdapter={AdapterDateFns}>
  <Box display="flex" flexDirection="column" gap={2}>
    <DesktopDatePicker
      label="Appointment Date"
      value={date}
      onChange={(newDate) => setDate(newDate)}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: "#334155",
              borderRadius: "8px",
            },
            '& .MuiInputBase-input': {
              color: "#fff", // Input text color (already white)
              padding: "12px",
            },
            '& .MuiInputLabel-root': {
              color: "#fff", // Label color (default state)
              '&.Mui-focused': {
                color: "#fff", // Label color (focused state)
              },
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: "#fff", // Outline border color (default state)
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: "#fff", // Outline border color (hover state)
              },
              '&.Mui-focused fieldset': {
                borderColor: "#ffffff", // Outline border color (focused state - already white)
                borderWidth: '2px',
              },
            },
            '& .MuiSvgIcon-root': {
              color: "#fff", // Icon color (calendar/clock icon)
            },
          }}
        />
      )}
    />

    <TimePicker
      label="Appointment Time"
      value={time}
      onChange={(newTime) => setTime(newTime)}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: "#334155",
              borderRadius: "8px",
            },
            '& .MuiInputBase-input': {
              color: "#fff", // Input text color (already white)
              padding: "12px",
            },
            '& .MuiInputLabel-root': {
              color: "#fff", // Label color (default state)
              '&.Mui-focused': {
                color: "#fff", // Label color (focused state)
              },
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: "#fff", // Outline border color (default state)
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: "#fff", // Outline border color (hover state)
              },
              '&.Mui-focused fieldset': {
                borderColor: "#ffffff", // Outline border color (focused state - already white)
                borderWidth: '2px',
              },
            },
            '& .MuiSvgIcon-root': {
              color: "#fff", // Icon color (calendar/clock icon)
            },
          }}
        />
      )}
    />
  </Box>
</LocalizationProvider>

            
    
      


              <TextField
                fullWidth
                label="Additional Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                margin="normal"
                multiline
                rows={3}
                variant="outlined" // Explicitly set variant
                sx={styles.input}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={styles.button}
              >
                Confirm Appointment
              </Button>
            </Box>
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
    alignItems: "flex-start", // Align items to the start, not center, for better scroll behavior
  },
  paper: {
    backgroundColor: "#1e293b",
    padding: "32px",
    borderRadius: "18px",
    color: "#fff",
    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
    border: "1px solid #334155", // Subtle border for definition
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    mb: 1,
    color: "#e2e8f0", // Lighter white for header text
  },
  heading: {
    color: "#e2e8f0", // Ensures heading matches the header text color
    fontWeight: "bold",
    fontFamily: "Poppins, sans-serif",
    letterSpacing: 1,
  },
  input: {
    '& .MuiInputBase-root': {
      backgroundColor: "#334155",
      borderRadius: "8px",
      '&.Mui-focused': {
        backgroundColor: '#334155',
      },
    },
    '& .MuiInputBase-input': { // This is the key selector for the input's text color
      color: "white", // <--- CHANGE THIS TO PURE WHITE
    },
    '& .MuiInputLabel-root': {
      color: "#94a3b8",
      '&.Mui-focused': {
        color: "#38bdf8",
      },
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
         color: "white", 
        borderColor: "#475569",
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: "#64748b",
      },
      '&.Mui-focused fieldset': {
        borderColor: "white", // This is already white for the border, which is good
        borderWidth: '2px',
      },
    },
    '& .MuiSvgIcon-root': {
        color: "#94a3b8",
    },
  },
  button: {
    mt: 3,
    backgroundColor: "#38bdf8",
    fontWeight: "bold",
    fontSize: "1rem", // Slightly larger font size
    padding: "12px 0", // More vertical padding
    borderRadius: "8px", // Match input border radius
   
    '&:hover': {
      backgroundColor: "blue", // Darker blue on hover
    },
  },
};

export default AppointDoctor;