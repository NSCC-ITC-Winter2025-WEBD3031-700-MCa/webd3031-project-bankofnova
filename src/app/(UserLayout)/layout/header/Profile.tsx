import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { IconListCheck, IconUser } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { data: session } = useSession();
  const pathname = usePathname();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

  const pathsWithBlueBackground =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/overview" ||
    pathname === "/accounts/chequing";

  const stringAvatar = (name: string) => {
    return {
      children: `${name.split(" ")[0][0]}`,
    };
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="profile menu"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        onClick={handleClick2}
        disableRipple={!!session}
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
            padding: "0px",
          }),
        }}
      >
        {session?.user?.name ? (
          <Avatar
            variant="square"
            {...stringAvatar(session.user.name)}
            sx={{
              borderRadius: "4px",
              backgroundColor: pathsWithBlueBackground
                ? "primary.main"
                : "primary.main",
              color: pathsWithBlueBackground ? "white" : "white",
              marginRight: "15px",
            }}
          />
        ) : (
          <Avatar
            variant="rounded"
            sx={{
              backgroundColor: "white",
              color: pathsWithBlueBackground ? "#000000" : "#000000",
              borderRadius: "50%",
            }}
          >
            <ManageAccountsOutlinedIcon />
          </Avatar>
        )}
      </IconButton>

      {session ? (
        <>
          <Menu
            id="msgs-menu"
            anchorEl={anchorEl2}
            keepMounted
            open={Boolean(anchorEl2)}
            onClose={handleClose2}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            disableScrollLock={true}
            sx={{
              "& .MuiMenu-paper": {
                width: "200px",
              },
            }}
          >
            <MenuItem>
              <ListItemIcon>
                <IconUser width={20} />
              </ListItemIcon>
              <ListItemText>My Profile</ListItemText>
            </MenuItem>

            {/* ✅ Added Upgrade Option */}
            <MenuItem component={Link} href="/payment">
              <ListItemIcon>
                <IconListCheck width={20} />
              </ListItemIcon>
              <ListItemText>Upgrade to Premium</ListItemText>
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
          </Menu>
        </>
      ) : (
        <>
          <Menu
            id="msgs-menu"
            anchorEl={anchorEl2}
            keepMounted
            open={Boolean(anchorEl2)}
            onClose={handleClose2}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            disableScrollLock={true}
            sx={{
              "& .MuiMenu-paper": {
                width: "200px",
              },
            }}
          >
            <Box py={1} px={2}>
              <Button
                component={Link}
                href="/register"
                variant="outlined"
                color="primary"
                fullWidth
                disableElevation
                sx={{
                  width: "100%",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                Register
              </Button>
            </Box>

            <Box px={2}>
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                color="primary"
                fullWidth
                disableElevation
                sx={{
                  width: "100%",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                Login
              </Button>
            </Box>
          </Menu>
        </>
      )}
    </Box>
  );
};

export default Profile;
