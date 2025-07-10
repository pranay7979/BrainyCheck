import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

const ReceptionistDashboard = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Register Patient",
      icon: <PersonAddIcon sx={{ fontSize: 50, color: "#38bdf8" }} />,
      path: "/receptionist/register",
    },
    {
      title: "View Patients",
      icon: <PeopleIcon sx={{ fontSize: 50, color: "#38bdf8" }} />,
      path: "/receptionist/patients",
    },
    {
      title: "Appoint Doctor",
      icon: <AssignmentIndIcon sx={{ fontSize: 50, color: "#38bdf8" }} />,
      path: "/receptionist/appointdoctor",
    },
  ];

  return (
    <>
      <Fade in timeout={600}>
        <Box
          sx={{
            background: "linear-gradient(to right, #0f172a, #1e293b)",
            minHeight: "100vh",
            py: 8,
            px: 2,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                color: "#fff",
                fontWeight: "bold",
                fontFamily: "Poppins, sans-serif",
                mb: 6,
              }}
            >
              Receptionist Dashboard
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {actions.map((action, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      backgroundColor: "#1e293b",
                      color: "#e2e8f0",
                      textAlign: "center",
                      py: 4,
                      borderRadius: 4,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "scale(1.03)"
                      },
                    }}
                  >
                    <CardContent>
                      {action.icon}
                      <Typography
                        variant="h6"
                        sx={{
                          mt: 2,
                          fontWeight: 600,
                          color: "#ffffff",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {action.title}
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => navigate(action.path)}
                        sx={{
                          mt: 3,
                          backgroundColor: "#38bdf8",
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: "#0ea5e9",
                          },
                        }}
                      >
                        &nbsp;→
                      </Button>

                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Fade>
    </>
  );
};

export default ReceptionistDashboard;
