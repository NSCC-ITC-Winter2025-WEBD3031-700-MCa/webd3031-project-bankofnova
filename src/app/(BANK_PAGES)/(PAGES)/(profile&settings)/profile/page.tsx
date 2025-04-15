"use client";

import {
  Box,
  Typography,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

// Define the type for the form data
interface ProfileFormData {
  name: string;
  email: string;
  password: string;
}

export default function ProfilePage() {
  const [tab, setTab] = useState(0);
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [showAlert, setShowAlert] = useState(false);
  const [integrations, setIntegrations] = useState({
    githubLinked: false,
    googleLinked: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>(); // Specify the form data type

  useEffect(() => {
    // Fetching user profile info
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Profile Data: ", data);
          setUser(data.user);
          reset({
            name: data.user.name,
            email: data.user.email,
            password: "",
          });
        } else {
          console.log("Failed to fetch profile data");
        }
      })
      .finally(() => setLoading(false));

    // Fetching integration status for Google and GitHub
    fetch("/api/user/account-intigration")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Integration Data: ", data);
          setIntegrations(data.data);
        } else {
          console.log("Failed to fetch integrations");
        }
      });
  }, [reset]);

  const handleEdit = () => {
    reset({
      name: user.name,
      email: user.email,
      password: "",
    });
    setOpenDialog(true);
    setShowAlert(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setShowAlert(false);
  };

  const onSubmit = async (data: ProfileFormData) => { // Use the ProfileFormData type here
    const res = await fetch("/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.success) {
      setUser({ name: data.name, email: data.email });
      setSnackbar({ open: true, message: "Profile updated successfully!" });
      setOpenDialog(false);
      setShowAlert(false);
    } else {
      setSnackbar({ open: true, message: "Error: " + result.message });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 2 }}>
            <Tab label="Details" />
            <Tab label="Edit Profile" />
            <Tab label="Linked Accounts" />
          </Tabs>

          {tab === 0 && (
            <Box>
              <Typography variant="h6">Name</Typography>
              <Typography sx={{ mb: 2 }}>{user.name}</Typography>
              <Typography variant="h6">Email</Typography>
              <Typography sx={{ mb: 2 }}>{user.email}</Typography>
            </Box>
          )}

          {tab === 1 && (
            <Box>
              <Button variant="contained" onClick={handleEdit}>
                Edit Info
              </Button>

              <Dialog
                open={openDialog}
                onClose={(event, reason) => {
                  if (reason === "backdropClick" || reason === "escapeKeyDown") return;
                  handleClose();
                }}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { transition: "none" } }}
              >
                <DialogTitle>Edit Profile</DialogTitle>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <DialogContent>
                    {showAlert && (
                      <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
                        You are about to change your login information. This includes your name, email, and password.
                      </Alert>
                    )}

                    <Stack spacing={2} mt={1}>
                      <TextField
                        margin="dense"
                        label="Name"
                        fullWidth
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name ? String(errors.name.message) : undefined}
                      />

                      <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        disabled
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email ? String(errors.email.message) : undefined}
                      />

                      <TextField
                        margin="dense"
                        label="New Password"
                        type="password"
                        fullWidth
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password ? String(errors.password.message) : undefined}
                      />
                    </Stack>
                  </DialogContent>

                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                      Save
                    </Button>
                  </DialogActions>
                </Box>
              </Dialog>
            </Box>
          )}

          {tab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Linked Accounts
              </Typography>
              <Stack spacing={2} mt={2}>
                <Box>
                  <Typography>Google</Typography>
                  <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                    <Chip
                      icon={integrations.googleLinked ? <CheckCircleOutlineIcon color="success" /> : undefined}
                      label={integrations.googleLinked ? "Google Linked" : "Google Not Linked"}
                      color={integrations.googleLinked ? "success" : "default"}
                      variant="outlined"
                    />
                  </Stack>
                </Box>

                <Box>
                  <Typography>GitHub</Typography>
                  <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                    <Chip
                      icon={integrations.githubLinked ? <CheckCircleOutlineIcon color="success" /> : undefined}
                      label={integrations.githubLinked ? "GitHub Linked" : "GitHub Not Linked"}
                      color={integrations.githubLinked ? "success" : "default"}
                      variant="outlined"
                    />
                  </Stack>
                </Box>
              </Stack>
            </Box>
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            maxWidth: "90vw",
            width: "auto",
            textAlign: "center",
          },
        }}
      />
    </Box>
  );
}
