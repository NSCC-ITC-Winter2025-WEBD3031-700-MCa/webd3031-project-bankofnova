"use client"; // Ensure this runs only on the client side

import React from "react";
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"; // Import auth functions
import { IconMenu } from "@tabler/icons-react";
import Profile from "./Profile";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@mui/material"; // Import useMediaQuery
import { Logo } from "react-mui-sidebar";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  return <HeaderContent toggleMobileSidebar={toggleMobileSidebar} />;
};

const HeaderContent = ({ toggleMobileSidebar }: ItemType) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const mdUp = useMediaQuery((theme: any) => theme.breakpoints.up("md"));
  const smUp = useMediaQuery((theme: any) => theme.breakpoints.up("sm"));

  const blueBackground = ["/login", "/register",].includes(pathname);

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: blueBackground ? theme.palette.primary.main : "white", // Use blueBackground state
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    position: "relative",  // This will make the header behave as a normal element

    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
  }));

  const handleLogout = async () => {
    await signOut({ redirect: false }); // Log out without redirecting
    window.location.href = "/login"; // Manually trigger a page reload
  };

  const handleMyAccountsClick = () => {
    window.location.href = "/overview"; // Navigate to "My Accounts" page
  };

  if (status === "loading") {
    return (
      <AppBarStyled position="sticky" color="default">
        <ToolbarStyled>
          <Box>Loading...</Box>
        </ToolbarStyled>
      </AppBarStyled>
    );
  }

  const isOnAuthPages = pathname === "/login" || pathname === "/register";
  const isOnHomePage = pathname === "/";
  const isOnRegister = pathname === "/register";
  const isUserPage = [
    "/overview",
    "/transactions/transfer/confirm",
    "/accounts/chequing",
    "/accounts/savings",
    "/transactions/transfer",
    "/transactions/deposit",
    "/transactions/movemoney",
  ].includes(pathname);

  const LogoWithHover = () => (
    <Link href="/" passHref>
      <Box
        sx={{
          "&:hover": {
            opacity: 0.8, // Change opacity on hover
          },
          display: isOnAuthPages || !session ? "flex" : "none", // Show logo on auth pages or if no session
          alignItems: "center", // Center the logo vertically
          width: "100%", // Make sure it takes up full width
          marginLeft: "14px",
        }}
      >
        <Logo img={isOnAuthPages ? "/images/logos/dark-logo4.svg" : "/images/logos/dark-logo3.svg"} />
        </Box>
    </Link>
  );
  // Define restricted paths for the hamburger menu
  const restrictedPaths = ['/overview', '/accounts/chequing', '/accounts/savings', '/transactions'];

  // Check if the current pathname is a restricted path
  const isRestrictedPath = restrictedPaths.includes(pathname);

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        {/* LEFT SIDE */}
        <LogoWithHover />
        {/* Hamburger Menu */}
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            position: "absolute",
            left: 13,
             display: (isUserPage || isOnAuthPages) && lgUp ? "none" : "block",
          }}
        >
          <Box sx={{ color: blueBackground ? "white" : "inherit" }}>
            <IconMenu width="20" height="20" />
          </Box>
        </IconButton>

        {/* RIGHT SIDE */}
        <Stack spacing={1} direction="row" alignItems="center" sx={{ position: "absolute", right: session ? 10 : 50 }}>
          {!session ? (
            <>
              {smUp && (
                <Box mt={2}>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      component={Link}
                      href="/register"
                      color="primary"
                      size="large"
                      disableElevation
                      sx={{
                        border: "1px solid white",
                        borderRadius: "10px",
                        display: isOnRegister ? "none" : "block",
                        borderColor: blueBackground ? "white" : "primary.main",
                        color: blueBackground ? "white" : "primary.main",
                        backgroundColor: blueBackground ? "primary.main" : "white",
                        "&:hover": {
                          backgroundColor: blueBackground ? "" : "white",
                        },
                      }}
                    >
                      <Typography variant="h6">Register</Typography>
                    </Button>
                    <Button
                      variant="contained"
                      component={Link}
                      href="/login"
                      color="primary"
                      size="large"
                      disableElevation
                      sx={{
                        borderRadius: "10px",
                        display: isOnRegister ? "none" : "block",
                        border: "1px solid white",
                        borderColor: blueBackground ? "white" : "white",
                        color: blueBackground ? "white" : "white",
                        backgroundColor: blueBackground ? "primary.main" : "theme.primary",
                      }}
                    >
                      <Typography variant="h6">Login</Typography>
                    </Button>
                  </Stack>
                </Box>
              )}
              {!smUp && <Profile />}
            </>
          ) : (
            <>
              {isOnAuthPages || isOnHomePage ? (
                <>
                  <Button variant="outlined" onClick={handleLogout} 
                  color="primary" 
                  disableElevation
                  
                  sx={{
                    borderRadius: "10px",

                    backgroundColor: blueBackground ? "white" : "theme.primary",
                    color: blueBackground ? "theme.primary" : "theme.primary",
                    "&:hover": {
                      backgroundColor: blueBackground ? "white" : "",
                      border:blueBackground ? "1px solid #cdcdcd" : "",
                    },
                  }}
                  >
                    Logout
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleMyAccountsClick} 
                    color="primary"
                    disableElevation
                    sx={{
                      borderRadius: "10px",

                      border: "1px solid white",
                      backgroundColor: "theme.primary",
                      color: "theme.primary !important",
                 
                    }}
                   >
                    My Accounts
                  </Button>
                </>
              ) : (
                <>


                  {/* <Button
                    variant="outlined"
                    onClick={handleMyAccountsClick}
                    color="primary"
                    disableElevation
                    sx={{
                      backgroundColor: blueBackground ? "white" : "theme.primary",
                      color: blueBackground ? "theme.primary !important" : "theme.primary !important",
                      "&:hover": {
                        backgroundColor: blueBackground ? "white" : "",
                      },
                    }}
                  >
                    My Accounts
                  </Button> */}
                </>
              )}
              <Profile />
            </>
          )}
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
