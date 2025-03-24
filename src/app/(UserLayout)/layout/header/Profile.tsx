import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname for current route detection
import {
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography
} from "@mui/material";
import { IconListCheck, IconMail, IconUser } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { data: session } = useSession();
  const pathname = usePathname(); // Get the current route

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = "/login";
  };

  // Check if the current route is specifically /login or /register
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="profile menu"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && { color: "primary.main" }),
        }}
        onClick={handleClick2}
      >
        <IconUser
          width={35}
          style={{
            color: isAuthPage ? "#FFFFFF" : "inherit", // White on /login and /register, default elsewhere
          }}
        />
      </IconButton>

      {/* Dropdown menu */}
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
        {session ? (
          <>
            <MenuItem>
              <ListItemIcon>
                <IconUser width={20} />
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
                onClick={handleLogout}
                fullWidth
              >
                Logout
              </Button>
            </Box>
          </>
        ) : (
          <Box mt={2}>
            <Stack direction="row" spacing={2} justifyContent="center">
             
            <Button
                variant="outlined"
                component={Link}
                href="/register"
                color="info"
                size= "large"
                disableElevation
                sx={{
                  backgroundColor: "white",
                }}
              >
                Register
              </Button>
             
              <Button
                variant="contained"
                
                component={Link}
                size= "large"
                href="/login"
                color="info"
                disableElevation
        
              >
                Login
              </Button>

            </Stack>
          </Box>
        )}
      </Menu>
    </Box>
  );
};

export default Profile;
