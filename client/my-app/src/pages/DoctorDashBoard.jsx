import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import { getAuth } from "firebase/auth";
import {doc,updateDoc} from "firebase/firestore"
import {
  getFirestore,
  collection,
  getDocs, // We'll use this for the patient query now too
  query,
  where,
} from "firebase/firestore";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const auth = getAuth();

const completeAppointment = async (id) => {
  try {
    await updateDoc(doc(db, "appointments", id), {
      status: "completed",
    });
    setAppointments((prev) => prev.filter((appt) => appt.id !== id)); // remove from UI
  } catch (error) {
    console.error("Error completing appointment:", error);
    alert("Failed to mark appointment as completed.");
  }
};


  useEffect(() => {
    const fetchAppointmentsAndPatientDetails = async () => { // Renamed for clarity
      try {
        const user = auth.currentUser;
        if (!user) {
          alert("User not logged in");
          return;
        }

        // 1. Fetch the doctor's appointments
        const qAppointments = query(
          collection(db, "appointments"),
          where("doctorId", "==", user.uid)
        );
        const appointmentSnapshot = await getDocs(qAppointments);

        const appointmentData = [];
        const patientIdsToFetch = new Set(); // To store unique patientIds

        // First pass: collect unique patient IDs from appointments
        appointmentSnapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          patientIdsToFetch.add(data.patientId);
          appointmentData.push({
            id: docSnap.id,
            ...data,
            patient: null, // Initialize patient as null, we'll fill this later
          });
        });

        // 2. Fetch patient details in a single query (or batched queries)
        const patientsMap = new Map();
        if (patientIdsToFetch.size > 0) {
          // Firestore 'in' query can handle up to 10 items
          // If you have more than 10 unique patient IDs, you'll need to batch these queries.
          // For simplicity, let's assume max 10 unique patient IDs for now,
          // or you can implement a batching mechanism if needed.
          const patientIdArray = Array.from(patientIdsToFetch);

          // You can query for multiple patientIds at once using `where(field, 'in', array)`
          const qPatients = query(
            collection(db, "patients"),
            where("patientId", "in", patientIdArray)
          );
          const patientSnapshot = await getDocs(qPatients);

          patientSnapshot.docs.forEach((docSnap) => {
            const patientData = docSnap.data();
            patientsMap.set(patientData.patientId, patientData); // Map by the 'patientId' field
          });
        }

        // 3. Attach patient data to appointments
       const finalAppointments = appointmentData
  .filter((appt) => appt.status !== "completed")  // <== filter here
  .map((appt) => ({
    ...appt,
    patient: patientsMap.get(appt.patientId) || { name: "Unknown Patient", contact: "N/A" },
  }));


        setAppointments(finalAppointments);
      } catch (err) {
        console.error("Error fetching appointments or patient details:", err);
        alert("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentsAndPatientDetails();
  }, [auth, db]); // Add auth and db to dependency array

  return (
    <Box sx={{ backgroundColor: "#0f172a", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom sx={{ color: "#38bdf8", mb: 4 }}>
          My Appointments
        </Typography>

        {loading ? (
          <Box textAlign="center" mt={4}>
            <CircularProgress sx={{ color: "#38bdf8" }} />
          </Box>
        ) : appointments.length === 0 ? (
          <Typography align="center" sx={{ color: "#cbd5e1" }}>
            No appointments found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {appointments.map((appt) => (
              <Grid item xs={12} key={appt.id}>
                <Card sx={{ backgroundColor: "#1e293b", color: "#e2e8f0", borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Patient: {appt.patient?.name || "Unknown"}
                    </Typography>
                    <Typography><strong>Age:</strong> {appt.patient?.age || "N/A"}</Typography>
                    <Typography><strong>Gender:</strong> {appt.patient?.gender || "N/A"}</Typography>
                    <Typography><strong>Contact:</strong> {appt.patient?.contact || "N/A"}</Typography>
                    <Typography><strong>Address:</strong> {appt.patient?.address || "N/A"}</Typography>
                    <Typography><strong>Medical Condition:</strong> {appt.patient?.medicalcondition || "N/A"}</Typography>
                    <Box mt={2}>
                      <Typography><strong>Appointment Date:</strong> {appt.date}</Typography>
                      <Typography><strong>Time:</strong> {appt.time}</Typography>
                      {appt.notes && <Typography><strong>Notes:</strong> {appt.notes}</Typography>}
                    </Box>
                    <Box mt={2} display="flex" justifyContent="flex-end">
  <button
    onClick={() => completeAppointment(appt.id)}
    style={{
      backgroundColor: "#38bdf8",
      color: "#0f172a",
      padding: "8px 16px",
      border: "none",
      borderRadius: "8px",
      fontWeight: "bold",
    }}
  >
    Completed
  </button>
</Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default DoctorDashboard;