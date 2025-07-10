import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Box,
  Fade,
  useMediaQuery,
  useTheme
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import alzImg from "../assets/Alzheimer.jpg";
import tumorImg from "../assets/braintumor.jpeg";
import epilepsyImg from "../assets/epilepsy2.jpg";
import strokeImg from "../assets/stroke.png";
import parkinsonImg from "../assets/parkinsons.jpg";

const diseases = [
  {
    name: "Alzheimer's Disease",
    image: alzImg,
    info: "Alzheimer's is a progressive neurological disorder that causes memory loss and cognitive decline.",
    symptoms: ["Memory loss", "Confusion", "Difficulty recognizing people", "Mood swings"],
    precautions: ["Stay mentally active", "Exercise regularly", "Eat a balanced diet", "Manage blood pressure"]
  },
  {
    name: "Parkinson's Disease",
    image: parkinsonImg,
    info: "Parkinson's disease is a neurodegenerative disorder that affects movement and coordination.",
    symptoms: ["Tremors", "Muscle rigidity", "Slowed movement", "Balance problems", "Speech changes"],
    precautions: ["Regular exercise", "Healthy diet", "Avoid toxins", "Regular neurological checkups"]
  },
  {
    name: "Epilepsy",
    image: epilepsyImg,
    info: "Epilepsy is a central nervous system disorder in which brain activity becomes abnormal, causing seizures.",
    symptoms: ["Seizures", "Confusion", "Staring spells", "Jerking movements", "Loss of awareness"],
    precautions: ["Avoid known triggers", "Take medications on time", "Wear medical alert ID", "Avoid driving alone"]
  },
  {
    name: "Brain Tumor",
    image: tumorImg,
    info: "A brain tumor is an abnormal growth of tissue in the brain that can be benign or malignant.",
    symptoms: ["Headaches", "Seizures", "Nausea", "Vision problems", "Balance issues"],
    precautions: ["Avoid radiation exposure", "Maintain a healthy lifestyle", "Seek early medical attention for symptoms"]
  },
  {
    name: "Stroke",
    image: strokeImg,
    info: "A stroke occurs when the blood supply to part of the brain is interrupted or reduced, causing brain damage.",
    symptoms: ["Sudden weakness", "Confusion", "Trouble speaking", "Vision problems", "Loss of coordination"],
    precautions: ["Control blood pressure and diabetes", "Avoid smoking and alcohol", "Eat a heart-healthy diet", "Exercise regularly"]
  }
];

const DiseaseInfo = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Fade in timeout={600}>
      <Box sx={styles.pageWrapper}>
        <Container maxWidth="md" sx={styles.container}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            align="center"
            gutterBottom
            sx={{ color: "#fff", fontWeight: "bold", mb: 4 }}
          >
            Brain Disease Information
          </Typography>

          {diseases.map((disease, index) => (
            <Accordion
              key={index}
              sx={{
                mb: 3,
                backgroundColor: "#1e293b",
                borderRadius: 2,
                color: "#cbd5e1",
                "& .MuiAccordionSummary-content": { fontWeight: "bold", color: "#fff" },
                "&:before": { display: "none" },
                boxShadow: 4,
                "&:hover": { boxShadow: 8 },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
                <Typography variant="h6">{disease.name}</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Card
                  sx={{
                    backgroundColor: "#0f172a",
                    color: "#e2e8f0",
                    borderRadius: 2,
                    boxShadow: 3,
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={disease.image}
                    alt={disease.name}
                    sx={{
                      width: "100%",
                      height: isMobile ? "200px" : "350px",
                      objectFit: "cover",
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                  />
                  <CardContent>
                    <Typography variant="body1" gutterBottom>{disease.info}</Typography>

                    <Typography variant="body1" gutterBottom fontWeight="bold">
                      Symptoms:
                    </Typography>
                    <List dense>
                      {disease.symptoms.map((symptom, i) => (
                        <ListItem key={i} sx={{ pl: 2 }}>
                          <ListItemText primary={`• ${symptom}`} />
                        </ListItem>
                      ))}
                    </List>

                    <Typography variant="body1" gutterBottom fontWeight="bold">
                      Precautions:
                    </Typography>
                    <List dense>
                      {disease.precautions.map((precaution, i) => (
                        <ListItem key={i} sx={{ pl: 2 }}>
                          <ListItemText primary={`• ${precaution}`} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>
    </Fade>
  );
};

const styles = {
  pageWrapper: {
    backgroundColor: "#0f172a",
    minHeight: "100vh",
    width: "100%",
    paddingTop: "80px",
    paddingBottom: "32px",
  },
  container: {
    color: "#fff",
    paddingLeft: { xs: 2, sm: 4 },
    paddingRight: { xs: 2, sm: 4 },
  }
};

export default DiseaseInfo;
