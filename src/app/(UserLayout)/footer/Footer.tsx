import React, { useState } from "react";
import { Box, Container, Grid, Typography, TextField, Button, useTheme, useMediaQuery } from "@mui/material";
import { styled } from "@mui/system";

// Styled components
const NeuralFooter = styled(Box)(({ theme }) => ({
  background: theme.palette.info.main,
  padding: theme.spacing(8, 0),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
    pointerEvents: "none"
  }
}));

const NeuralLink = styled(Typography)(({ theme }) => ({
  color: "#fff",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateX(8px)",
    color: theme.palette.primary.light
  }
}));

const NewsletterInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
    "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
    "&.Mui-focused fieldset": { borderColor: "#fff" }
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" }
}));

const MLFooter = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    console.log("Subscribed:", email);
    setEmail("");
  };

  return (
    <NeuralFooter>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Bank Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="#fff" gutterBottom>
              Bank Of Nova.
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ maxWidth: 300 }}>
              Pioneering the future of Canadian Banking
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" color="#fff" gutterBottom>
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {["About Us", "Services", "Research", "Careers"].map((link) => (
                <NeuralLink key={link} variant="body2">{link}</NeuralLink>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" color="#fff" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              123 Boulevard
              Halifax, Nova Scotia, Canada 94025
              contact@BankOfNova.com
              +1 (123) 123-1231
            </Typography>
          </Grid>

          {/* Newsletter Subscription */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" color="#fff" gutterBottom>
              Stay Connected
            </Typography>
            <Box mb={2}>
              <NewsletterInput
                fullWidth
                label="Subscribe to Newsletter"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                onClick={handleSubscribe}
                sx={{
                  minWidth: "auto", p: 1, color: "#fff",
                  "&:hover": { background: "rgba(255,255,255,0.1)" }
                }}
              >
                Send
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Footer Bottom */}
        <Box mt={8} pt={3} borderTop={1} borderColor="rgba(255,255,255,0.1)">
          <Typography variant="body2" color="rgba(255,255,255,0.7)" align="center">
            © {new Date().getFullYear()} Bank Of Nova. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </NeuralFooter>
  );
};

export default MLFooter;
