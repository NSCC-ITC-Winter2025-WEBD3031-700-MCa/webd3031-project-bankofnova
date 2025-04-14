"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  useTheme,
  useMediaQuery,
  ClickAwayListener,
  Stack,
  Typography,
  Divider,
  Switch,
  Chip,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { IconUser, IconSettings, IconLogout } from "@tabler/icons-react";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dndMode, setDndMode] = useState(true);
  const [notifications, setNotifications] = useState(false);

  const { data: session } = useSession();
  const pathname = usePathname();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = "/login";
  };

  const stringAvatar = (name: string) => ({
    children: name.split(" ")[0][0].toUpperCase(),
  });

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box>
        {/* Profile Avatar */}
        <IconButton
          size="large"
          aria-label="profile menu"
          color="inherit"
          onClick={handleClick}
          sx={{
              color: "primary.main",
            }}
          >
          {session?.user?.name ? (
            <Avatar
              {...stringAvatar(session.user.name)}
              sx={{
                bgcolor: theme.palette.grey[100], // ✅ Transparent background
                color: 'black',         // ✅ Icon color
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 35,
                height: 35,
                backgroundColor: "transparent",
                color: theme.palette.primary.main, 
                borderRadius: "50%",
              }}
            >
              <ManageAccountsOutlinedIcon />
            </Avatar>
          )}
        </IconButton>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          disableScrollLock
          PaperProps={{
            elevation: 16,
            sx: {
              width: 260,
              borderRadius: "12px",
              padding: "16px",
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          <Box>
            {/* Welcome Text */}
            <Box mb={2}>
  {/* <Typography variant="h6" fontWeight={600}>
    Good Morning,
  </Typography> */}
  <Typography component="span" variant="h6" sx={{ fontWeight: 400 }}>
    {session?.user?.name || "Guest"}
  </Typography>
  <Typography
    variant="subtitle2"
    color="text.secondary"
    sx={{ opacity: 0.7 }}
  >
    {session
      ? session.user.role === "admin"
        ? "Administrator"
        : ""
      : "Please login"}
  </Typography>
</Box>



            {/* Upgrade Plan Card */}
            <Card
              sx={{
                background: theme.palette.warning.light,
                mb: 2,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upgrade your plan
                </Typography>
                <Typography
                  variant="body2"
                  color="grey.900"
                  sx={{ opacity: 0.7 }}
                  gutterBottom
                >
                  70% discount for 1 years subscriptions.
                </Typography>
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  sx={{ boxShadow: "none" }}
                  fullWidth
                >
                  Go Premium
                </Button>
              </CardContent>
            </Card>

            {/* <Card
              sx={{
                bgcolor: theme.palette.primary.light,
                mb: 2,
              }}
            >
              <CardContent>
                <Grid container spacing={2} direction="column">
                  <Grid
                    item
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="subtitle1">Start DND Mode</Typography>
                    <Switch
                      color="primary"
                      checked={dndMode}
                      onChange={(e) => setDndMode(e.target.checked)}
                      size="small"
                    />
                  </Grid>
                  <Grid
                    item
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="subtitle1">
                      Allow Notifications
                    </Typography>
                    <Switch
                      color="primary"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card> */}

            {/* Divider */}
            <Divider sx={{ mb: 1 }} />

            {/* Menu Items */}
            <MenuItem component={Link} href="/profile" onClick={handleClose}>
              <ListItemIcon>
                <IconSettings width={20} />
              </ListItemIcon>
              <ListItemText>Account Settings</ListItemText>
            </MenuItem>

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <IconLogout width={20} />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Box>
        </Menu>
      </Box>
    </ClickAwayListener>
  );
};

export default Profile;
