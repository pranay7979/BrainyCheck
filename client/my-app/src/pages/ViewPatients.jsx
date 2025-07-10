import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Box,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

const ViewPatients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const fetchPatients = async () => {
      const snapshot = await getDocs(collection(db, "patients"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPatients(data);
    };
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "patients", id));
      setPatients(patients.filter(patient => patient.id !== id));
    } catch (error) {
      alert("Failed to delete patient.");
      console.error(error);
    }
  };

  const handleEditOpen = (patient) => {
    setEditPatient({ ...patient });
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    setEditPatient({ ...editPatient, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      await updateDoc(doc(db, "patients", editPatient.id), {
        ...editPatient,
      });
      setPatients(patients.map(p => (p.id === editPatient.id ? editPatient : p)));
      setEditDialogOpen(false);
    } catch (error) {
      alert("Failed to update patient.");
      console.error(error);
    }
  };

  const filteredPatients = searchTerm
    ? patients
        .filter(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 1) // Show top match only
    : patients;

  return (
    <Box sx={{ backgroundColor: "#0f172a", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom sx={{ color: "#fff" }}>
          Registered Patients
        </Typography>

        <TextField
          fullWidth
          placeholder="Search patient by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: "#334155",
            input: { color: "#fff" },
            label: { color: "#cbd5e1" },
            mb: 4,
          }}
        />

        {filteredPatients.length === 0 ? (
          <Typography align="center" sx={{ color: "#cbd5e1", mt: 4 }}>
            No matching patients found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredPatients.map((patient) => (
              <Grid item xs={12} sm={6} key={patient.id}>
                <Card
                  sx={{
                    backgroundColor: "#1e293b",
                    color: "#e2e8f0",
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: 350, // 💡 Limit card width
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <CardContent >
                    <Typography variant="h6">{patient.name}</Typography>
                    <Typography>Age: {patient.age}</Typography>
                    <Typography>Gender: {patient.gender}</Typography>
                    <Typography>Contact: {patient.contact}</Typography>
                    <Typography>Medical Condition: {patient.medicalcondition}</Typography>
                    <Typography>Address: {patient.address}</Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", pr: 1 }}>
                    <IconButton onClick={() => handleEditOpen(patient)} sx={{ color: "#38bdf8" }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(patient.id)} sx={{ color: "#f87171" }}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Patient</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="Name"
              name="name"
              value={editPatient?.name || ""}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Age"
              name="age"
              type="number"
              value={editPatient?.age || ""}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Gender"
              name="gender"
              value={editPatient?.gender || ""}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Contact"
              name="contact"
              value={editPatient?.contact || ""}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Medical Condition"
              name="medicalcondition"
              value={editPatient?.medicalcondition || ""}
              onChange={handleEditChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Address"
              name="address"
              value={editPatient?.address || ""}
              onChange={handleEditChange}
              multiline
              rows={2}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleEditSave} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ViewPatients;
