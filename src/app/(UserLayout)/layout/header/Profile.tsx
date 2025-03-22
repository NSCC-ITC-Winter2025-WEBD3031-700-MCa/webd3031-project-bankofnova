import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack, // Import Stack for horizontal layout
} from "@mui/material";
import { IconListCheck, IconMail, IconUser   } from "@tabler/icons-react"; // Import IconUserPlus
import { signOut, useSession } from "next-auth/react"; // Import useSession from next-auth

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { data: session } = useSession(); // Get session data to check if user is logged in
  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  // Handle logout functionality
  const handleLogout = async () => {
    await signOut({ redirect: false }); // Log out without redirecting
    window.location.href = '/login'; // Redirect to the login page manually
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <IconUser   width={35} /> {/* Replace Avatar with IconUserPlus */}
      </IconButton>

      {/* Message Dropdown */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        {session ? ( // Only show the dropdown items when logged in
          <>
            <MenuItem>
              <ListItemIcon>
                <IconUser   width={20} /> {/* Use the same icon here or any other icon */}
              </ListItemIcon>
              <ListItemText>My Profile</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <IconMail width={20} />
              </ListItemIcon>
              <ListItemText>My Account</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <IconListCheck width={20} />
              </ListItemIcon>
              <ListItemText>My Tasks</ListItemText>
            </MenuItem>
            <Box mt={1} py={1} px={2}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleLogout} // Trigger logout when clicked
                fullWidth
              >
                Logout
              </Button>
            </Box>
          </>
        ) : (
          // If not logged in, show login/register buttons in a row
          <Box mt={2}>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                component={Link}
                href="/login"
                color="info"
                disableElevation
              >
                Login
              </Button>
              <Button
                variant="contained"
                component={Link}
                href="/register"
                color="info"
                disableElevation
                sx={{
                  backgroundColor: 'white',
                  border: '1px solid red',
                  color: 'info.main', // Set text color to the "info" color
                  '&:hover': {
                    borderColor: 'white', // Darken border color on hover
                    color: 'white', // Darken text color on hover
                  },
                }}
              >
                Register
              </Button>
            </Stack>
          </Box>
        )}
      </Menu>
    </Box>
  );
};

export default Profile;
