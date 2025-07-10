import React from "react";
import {
  Typography,
  Button,
  Box,
  Container,
  Paper,
  Fade,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Navbar from "../components/Navbar";
import "swiper/css/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay, Navigation } from "swiper/modules";

// Images
import slide1 from "../assets/homepage2.jpg";
import slide2 from "../assets/homepage8.jpg";
import slide3 from "../assets/homepage6.jpg";
import slide4 from "../assets/homepage7.jpg";

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <Fade in timeout={600}>
        <Box sx={styles.wrapper}>
          {/* Image Slider */}
          <Swiper
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop
            navigation
            style={styles.slider}
          >
            {[slide1, slide2, slide3, slide4].map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img}
                  alt={`slide-${i}`}
                  style={{
                    width: "100%",
                    height: isMobile ? "220px" : "450px",
                    objectFit: "cover",
                    borderBottom: "4px solid #38bdf8",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Main CTA Card */}
          <Container maxWidth="md">
            <Paper elevation={12} sx={styles.card}>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                gutterBottom
                color="white"
                sx={{ fontWeight: "bold" }}
              >
                Welcome to <span style={{ color: "#38bdf8" }}>Brainy Check</span>
              </Typography>

              <Typography
                variant="h6"
                color="gray"
                mb={4}
                sx={{ fontSize: isMobile ? "1rem" : "1.2rem" }}
              >
                Get early insights on Alzheimer’s and Brain Tumor conditions using MRI scans.
              </Typography>

              {!user ? (
                <Stack direction={isMobile ? "column" : "row"} spacing={2} justifyContent="center">
                  <Button
                    variant="contained"
                    sx={styles.buttonPrimary}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    sx={styles.buttonSecondary}
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </Button>
                </Stack>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </Paper>
          </Container>
        </Box>
      </Fade>
    </>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#0f172a",
    minHeight: "100vh",
    pb: 8,
  },
  slider: {
    width: "100%",
    maxHeight: "500px",
    marginBottom: "15px",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: { xs: "24px", sm: "40px" },
    borderRadius: "16px",
    mt: 2,
    textAlign: "center",
  },
  buttonPrimary: {
    backgroundColor: "#f43f5e",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#fb7185",
    },
  },
  buttonSecondary: {
    color: "#38bdf8",
    borderColor: "#38bdf8",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#0f172a",
      borderColor: "#7dd3fc",
    },
  },
};

export default Home;
