'use client';

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
  CircularProgress, // ✅ Import CircularProgress
} from '@mui/material';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [tab, setTab] = useState(0);
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true); // ✅ Add loading state
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility

  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
          setFormData((prev) => ({
            ...prev,
            name: data.user.name,
            email: data.user.email,
          }));
        }
      })
      .finally(() => setLoading(false)); // ✅ Ensure loading is set to false
  }, []);

  const handleEdit = () => {
    setOpenDialog(true);
    setShowAlert(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setShowAlert(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success) {
      setUser({ name: formData.name, email: formData.email });
      setSnackbar({ open: true, message: 'Profile updated successfully!' });
      setOpenDialog(false);
      setShowAlert(false);
    } else {
      setSnackbar({ open: true, message: 'Error: ' + data.message });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      {loading ? ( // ✅ Conditionally render loading indicator
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 2 }}>
            <Tab label="Details" />
            <Tab label="Edit Profile" />
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

              <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                  {showAlert && (
                    <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
                      You are about to change your login information. This includes your name, email, and password.
                    </Alert>
                  )}

                  <TextField
                    margin="dense"
                    label="Name"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="dense"
                    label="Email"
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="dense"
                    label="New Password"
                    fullWidth
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleSave} variant="contained">
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Box>
  );
}
