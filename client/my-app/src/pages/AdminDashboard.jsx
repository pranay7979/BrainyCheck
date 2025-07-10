
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Dialog,         // Import Dialog
  DialogTitle,    // Import DialogTitle
  DialogContent,  // Import DialogContent
  DialogActions,  // Import DialogActions
  TextField,      // Import TextField
  Divider,        // Import Divider for the dashboard title
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalDoctors, setTotalDoctors] = useState(null);
  const [totalReceptionists, setTotalReceptionists] = useState(null);
  const [doctorScans, setDoctorScans] = useState([]);
  const [receptionists, setReceptionists] = useState([]);
  const [generalUsers, setGeneralUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the Update Dialog
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '' });

  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          if (user) console.log("Logged in UID:", user.uid);
        });

        // Fetch all users once and categorize them
        const usersCollectionRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollectionRef);

        let allUsersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const doctors = allUsersData.filter(user => user.role === "doctor");
        const receptionists = allUsersData.filter(user => user.role === "receptionist");
        const regularUsers = allUsersData.filter(user => user.role !== "doctor" && user.role !== "receptionist");

        setTotalUsers(allUsersData.length);
        setTotalDoctors(doctors.length);
        setTotalReceptionists(receptionists.length);

        const doctorListForScanCount = doctors.map((doc) => ({
          id: doc.id,
          name: doc.name || "Unknown Doctor",
          email: doc.email,
          phone: doc.phone || "N/A",
          scanCount: 0,
        }));

        const scansSnapshot = await getDocs(collection(db, "scans"));
        const scanCounts = {};
        scansSnapshot.forEach((sDoc) => {
          const scan = sDoc.data();
          const doctorId = scan.uploadedBy;
          if (doctorId) scanCounts[doctorId] = (scanCounts[doctorId] || 0) + 1;
        });

        const enrichedDoctors = doctorListForScanCount.map((doc) => ({
          ...doc,
          scanCount: scanCounts[doc.id] || 0,
        }));

        setDoctorScans(enrichedDoctors);
        setReceptionists(receptionists.map(rec => ({
            id: rec.id,
            name: rec.name,
            email: rec.email,
            phone: rec.phone || "N/A",
        })));
        setGeneralUsers(regularUsers.map(user => ({
            id: user.id,
            name: user.name || "Unknown User",
            email: user.email,
            phone: user.phone || "N/A",
        })));

      } catch (err) {
        console.error("Error loading admin dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [db]);

  // --- Common function to open the update dialog ---
  const openEditDialog = (user) => {
    setCurrentUserToEdit(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    setOpenUpdateDialog(true);
  };

  // --- Handle form field changes in the dialog ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // --- Handle saving updates from the dialog ---
  const handleSaveUpdate = async () => {
    if (!currentUserToEdit || !currentUserToEdit.id) return;

    try {
      await updateDoc(doc(db, "users", currentUserToEdit.id), {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
      });
      alert("User updated successfully!");
      setOpenUpdateDialog(false);
      // Re-fetch data to reflect changes immediately
      // A full page reload is a simple way, or you can update the state directly
      window.location.reload(); // Or recall fetchData()
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  // --- Handle removing users (no change to these functions' logic) ---
  const handleRemoveDoctor = async (doctorId) => {
    const confirm = window.confirm("Are you sure you want to delete this doctor?");
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, "users", doctorId));
      alert("Doctor removed successfully");
      window.location.reload();
    } catch (err) {
      alert("Failed to delete doctor.");
      console.error(err);
    }
  };

  const handleRemoveReceptionist = async (recId) => {
    const confirm = window.confirm("Are you sure you want to delete this receptionist?");
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, "users", recId));
      alert("Receptionist removed successfully");
      window.location.reload();
    } catch (err) {
      alert("Failed to delete receptionist.");
      console.error(err);
    }
  };

  const handleRemoveUser = async (userId) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      alert("User removed successfully");
      window.location.reload();
    } catch (err) {
      alert("Failed to delete user.");
      console.error(err);
    }
  };


  return (
    <Box
      sx={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        padding: "64px 20px",
        color: "#fff",
      }}
    >
      <Paper elevation={6} sx={{ backgroundColor: "#1e293b", p: 4, mb: 4, textAlign: 'left' }}>
        <Typography
          variant="h4" // Changed from h3 back to h4 as requested by earlier user code, but using enhanced styling
          sx={{
            color: '#FFB84C', // A softer, more elegant orange/gold
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            pb: 1,
          }}
          gutterBottom={false}
        >
          Admin Dashboard
        </Typography>
      </Paper>

      {loading ? (
        <Box textAlign="center" mt={5}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {/* Top Cards for Total Counts */}
          <Grid container spacing={4} mb={2}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: "#334155", color: "#fff", p: 2, textAlign: "center" }}>
                <CardContent>
                  <PeopleAltIcon fontSize="large" color="info" />
                  <Typography variant="h6" mt={2}>
                    Total Users
                  </Typography>
                  <Typography variant="h4">{totalUsers}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: "#334155", color: "#fff", p: 2, textAlign: "center" }}>
                <CardContent>
                  <MedicalInformationIcon fontSize="large" color="secondary" />
                  <Typography variant="h6" mt={2}>
                    Total Doctors
                  </Typography>
                  <Typography variant="h4">{totalDoctors}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card sx={{ bgcolor: "#334155", color: "#fff", p: 2, textAlign: "center" }}>
                <CardContent>
                  <SupportAgentIcon fontSize="large" color="success" />
                  <Typography variant="h6" mt={2}>
                    Total Receptionists
                  </Typography>
                  <Typography variant="h4">{totalReceptionists}</Typography>
                </CardContent>
              </Card>
            </Grid>
          
      {/* Buttons Row (Now a vertical stack) */}
      <Box
        sx={{
          display: 'flex',       // Enables flexbox layout
          flexDirection: 'column', // Arranges children vertically
          gap: 2,                  // Adds space between stacked items (MUI spacing unit, 1 unit = 8px)
          mb: 4,  
                  
        }}
      >
         <Button
          fullWidth
          variant="contained"
          sx={{ backgroundColor: "#22c55e", fontWeight: "bold", textAlign: "left"}}
          onClick={() => navigate("/adddoctor")}
        >
          + Add Doctor
        </Button>
        <Button
          fullWidth
          variant="contained"
          sx={{ backgroundColor: "#22c55e", fontWeight: "bold" , textAlign: "left"}}
          onClick={() => navigate("/addreceptionist")}
        >
          + Add Receptionist
        </Button>
       
        <Button
          fullWidth
          variant="contained"
          sx={{ backgroundColor: "#22c55e", fontWeight: "bold" , textAlign: "left"}}
          onClick={() => navigate("/signup")}
        >
          + Add User
        </Button>
      </Box>
          </Grid>
          

          

          {/* User Details Sections (Doctor, Receptionist, General Users) */}
          <Grid container spacing={4} sx={{ width: "100%", mx: 0, paddingTop:"20px" }}> {/* Reduced spacing from 15 to 4 for better visual balance with 3 columns */}
            {/* Doctor Column */}
            <Grid item xs={12} md={4}>
              <Paper elevation={4} sx={{ backgroundColor: "#1e293b", p: 3, height: "100%", color: "white" }}>
                <Typography variant="h5" mb={2}>Doctor Details</Typography>
                {doctorScans.length === 0 ? (
                  <Typography color="gray">No doctor records found.</Typography>
                ) : (
                  doctorScans.map((doc, index) => (
                    <Box key={index} sx={{ backgroundColor: "#334155", borderRadius: 2, p: 2, mb: 2 }}>
                      <Typography><strong>Name:</strong> {doc.name}</Typography>
                      <Typography><strong>Email:</strong> {doc.email}</Typography>
                      <Typography><strong>Phone:</strong> {doc.phone}</Typography>
                      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        {/* Changed onClick to openEditDialog */}
                        <Button variant="contained" color="info" onClick={() => openEditDialog(doc)}>Update</Button>
                        <Button variant="contained" color="error" onClick={() => handleRemoveDoctor(doc.id)}>Remove</Button>
                      </Box>
                    </Box>
                  ))
                )}
              </Paper>
            </Grid>

            {/* Receptionist Column */}
            <Grid item xs={12} md={4}>
              <Paper elevation={4} sx={{ backgroundColor: "#1e293b", p: 3, height: "100%", color: "white" }}>
                <Typography variant="h5" mb={2}>Receptionist Details</Typography>
                {receptionists.length === 0 ? (
                  <Typography color="gray">No receptionist records found.</Typography>
                ) : (
                  receptionists.map((rec, index) => (
                    <Box key={index} sx={{ backgroundColor: "#334155", borderRadius: 2, p: 2, mb: 2 }}>
                      <Typography><strong>Name:</strong> {rec.name}</Typography>
                      <Typography><strong>Email:</strong> {rec.email}</Typography>
                      <Typography><strong>Phone:</strong> {rec.phone}</Typography>
                      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        {/* Changed onClick to openEditDialog */}
                        <Button variant="contained" color="info" onClick={() => openEditDialog(rec)}>Update</Button>
                        <Button variant="contained" color="error" onClick={() => handleRemoveReceptionist(rec.id)}>Remove</Button>
                      </Box>
                    </Box>
                  ))
                )}
              </Paper>
            </Grid>

            {/* General User Column */}
            <Grid item xs={12} md={4}>
              <Paper elevation={4} sx={{ backgroundColor: "#1e293b", p: 3, height: "100%", color: "white" }}>
                <Typography variant="h5" mb={2}>User Details</Typography>
                {generalUsers.length === 0 ? (
                  <Typography color="gray">No user records found.</Typography>
                ) : (
                  generalUsers.map((user, index) => (
                    <Box key={index} sx={{ backgroundColor: "#334155", borderRadius: 2, p: 2, mb: 2 }}>
                      <Typography><strong>Name:</strong> {user.name}</Typography>
                      <Typography><strong>Email:</strong> {user.email}</Typography>
                      <Typography><strong>Phone:</strong> {user.phone}</Typography>
                      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        {/* Changed onClick to openEditDialog */}
                        <Button variant="contained" color="info" onClick={() => openEditDialog(user)}>Update</Button>
                        <Button variant="contained" color="error" onClick={() => handleRemoveUser(user.id)}>Remove</Button>
                      </Box>
                    </Box>
                  ))
                )}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* --- NEW: Update User Dialog --- */}
      <Dialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        PaperProps={{ // Style the Dialog's paper to match your dark theme
          sx: {
            backgroundColor: "#1e293b", // Dark background for the dialog body
            color: "#fff", // White text color
            p: 2, // Add some padding inside the dialog paper
            borderRadius: 2, // Match border radius
          },
        }}
      >
        <DialogTitle sx={{ color: '#FFB84C', fontWeight: 'bold' }}>Edit User Details</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus // Automatically focuses this field when the dialog opens
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editFormData.name}
            onChange={handleFormChange}
            sx={{ // Custom styling for TextField to work well with dark theme
              mb: 2,
              '& .MuiInputBase-input': { color: 'white' }, // Input text color
              '& .MuiInputLabel-root': { color: 'gray' }, // Label color
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'gray' }, // Border color
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'lightgray' }, // Hover border color
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFB84C' }, // Focused border color
            }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={editFormData.email}
            onChange={handleFormChange}
            sx={{
              mb: 2,
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'gray' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'gray' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'lightgray' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFB84C' },
            }}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="tel"
            fullWidth
            variant="outlined"
            value={editFormData.phone}
            onChange={handleFormChange}
            sx={{
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'gray' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'gray' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'lightgray' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFB84C' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#1e293b", p: 2 }}> {/* Dark background for actions as well */}
          <Button onClick={() => setOpenUpdateDialog(false)} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSaveUpdate} color="success" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;