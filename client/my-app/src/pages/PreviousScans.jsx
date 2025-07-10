import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { format } from "date-fns";

const PreviousScans = () => {
  const [scans, setScans] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchScans = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Get role from users collection
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? userDoc.data().role : "user";

      let q;
      if (role === "doctor") {
        q = query(collection(db, "scans")); // All scans
      } else {
        q = query(collection(db, "scans"), where("userId", "==", user.uid)); // Only own scans
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setScans(data);
    };

    fetchScans();
  }, []);

  const filteredScans = scans.filter((scan) =>
    filter === "All" ? true : scan.result === filter
  );

  const sortedScans = filteredScans.sort((a, b) => {
    if (sort === "Newest") return new Date(b.timestamp?.seconds * 1000) - new Date(a.timestamp?.seconds * 1000);
    if (sort === "Oldest") return new Date(a.timestamp?.seconds * 1000) - new Date(b.timestamp?.seconds * 1000);
    if (sort === "Confidence") return b.confidence - a.confidence;
    return 0;
  });

  return (
    <Box sx={{ backgroundColor: "#0f172a", minHeight: "100vh", px: 3, py: 5 }}>
      <Typography variant="h4" sx={{ color: "#fff", mb: 4 }}>
        Previous Scans
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: "#fff" }}>Filter</InputLabel>
          <Select
            value={filter}
            label="Filter"
            onChange={(e) => setFilter(e.target.value)}
            sx={{ color: "#fff", borderColor: "#fff", backgroundColor: "#1e293b" }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Alzheimer">Alzheimer</MenuItem>
            <MenuItem value="Tumor">Tumor</MenuItem>
            <MenuItem value="No Disease Detected">No Disease Detected</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: "#fff" }}>Sort</InputLabel>
          <Select
            value={sort}
            label="Sort"
            onChange={(e) => setSort(e.target.value)}
            sx={{ color: "#fff", backgroundColor: "#1e293b" }}
          >
            <MenuItem value="Newest">Newest</MenuItem>
            <MenuItem value="Oldest">Oldest</MenuItem>
            <MenuItem value="Confidence">Confidence</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {sortedScans.length === 0 ? (
        <Typography sx={{ color: "#cbd5e1" }}>No scan records found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {sortedScans.map((scan) => (
            <Grid item xs={12} md={6} lg={4} key={scan.id}>
              <Card
                sx={{
                  backgroundColor: "#1e293b",
                  color: "#fff",
                  p: 2,
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                {scan.imageUrl && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={scan.imageUrl}
                    alt="MRI Scan"
                    sx={{ borderRadius: 2, mb: 1 }}
                  />
                )}
                <CardContent>
                  <Typography><strong>Name:</strong> {scan.name}</Typography>
                  <Typography><strong>Age:</strong> {scan.age}</Typography>
                  <Typography><strong>Result:</strong> {scan.result}</Typography>
                  <Typography><strong>Subclass:</strong> {scan.subclass}</Typography>
                  <Typography><strong>Confidence:</strong> {scan.confidence}%</Typography>
                  <Typography variant="caption">
                    <strong>Time:</strong>{" "}
                    {scan.timestamp?.seconds
                      ? format(new Date(scan.timestamp.seconds * 1000), "dd MMM yyyy, hh:mm a")
                      : "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PreviousScans;
