"use client"; // Ensure this runs only on the client side

import React, { useState, useEffect } from "react";
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"; // Import auth functions
import { IconMenu} from "@tabler/icons-react";
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
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Track if component is mounted
  const [isOnAuthPages, setIsOnAuthPages] = useState(false); // Track if on auth-related pages
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg")); 
  const mdUp = useMediaQuery((theme: any) => theme.breakpoints.up('md'));

  useEffect(() => {
    // Set the mounted state to true after the component is mounted
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Set the `isOnAuthPages` state based on the pathname
    if (pathname === "/login" || pathname === "/register") {
      setIsOnAuthPages(true);
    } else {
      setIsOnAuthPages(false);
    }
  }, [pathname]);

  const isOnHomePage = pathname === '/'; // Check if it's the home page
  const isOnRegister = pathname === '/register'; // Check if it's the home page

  useEffect(() => {
    // Reset loading state when session status changes
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status]);
  const AppBarStyled = styled(AppBar)(({ theme }) => {
    const pathsWithBlueBackground = ["/login", "/register"];
    
    return {
      boxShadow: "none",
      background: pathsWithBlueBackground.includes(pathname)
        ? theme.palette.primary.main
        : "white", // White on homepage, blue on specified paths
      justifyContent: "center",
      backdropFilter: "blur(4px)",
      [theme.breakpoints.up("lg")]: {
        minHeight: "70px",
      },
    };
  });

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
    display: "flex",
    justifyContent: "flex-start", // Aligns children to the left
    alignItems: "center", // Keeps items centered vertically
    position: "relative", // Ensures elements don't overlap
  }));

  const handleLogout = async () => {
    await signOut({ redirect: false }); // Log out without redirecting
    window.location.href = "/login"; // Manually trigger a page reload
  };

  const handleMyAccountsClick = () => {
    window.location.href = "/overview"; // Navigate to "My Accounts" page
  };

  if (!isMounted || status === "loading") {
    return (
      <AppBarStyled position="sticky" color="default">
        <ToolbarStyled>
          {/* Show a loading indicator or just nothing while session is loading */}
          <Box>Loading...</Box>
        </ToolbarStyled>
      </AppBarStyled>
    );
  }

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
        {/* Conditionally render the logo */}
        <Logo img={isOnAuthPages ? "/images/logos/dark-logo4.svg" : "/images/logos/dark-logo3.svg"} />
      </Box>
    </Link>
  );
  
  // Define restricted paths for the hamburger menu
  const restrictedPaths = ['/overview', '/accounts/chequing', '/accounts/savings', '/transactions'];

  // Check if the current pathname is a restricted path
  const isRestrictedPath = restrictedPaths.includes(pathname);

  // Check if the current page is a user page
  return (
    <AppBarStyled position="sticky" color="default">
    <ToolbarStyled>
      {/* LEFT SIDE*/}

      {/* Logo Component */}
      <LogoWithHover />
      {/* Hamburger Menu */}
      <IconButton
        color="inherit"
        aria-label="menu"
        onClick={toggleMobileSidebar}
        sx={{
        position: "absolute",
        left: 13,
        display: (isUserPage) && lgUp ? "none" : "block", // Hide on large screens for user pages or auth pages
        // display: (isUserPage || isOnAuthPages) && lgUp ? "none" : "block", // Hide on large screens for user pages or auth pages
      }}
      >

      <Box sx={{ color: isOnAuthPages ? "white" : "inherit" }}>
        <IconMenu width="20" height="20" />
      </Box>

      </IconButton>

{/* RIGHT SIDE*/}
{/* Authentication or Profile Options */}

<Stack
  spacing={1}
  direction="row"
  alignItems="center"
  sx={{ position: "absolute", right: session ? 10 : 50 }}
>
  {!session ? (
  <>
  {mdUp && (
    <>
      <Box mt={2}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            component={Link}
            href="/register"
            color="primary"
            size= "large"
            disableElevation
            sx={{
              border: "1px solid white",
              borderRadius: '10px' ,
              display: isOnRegister ? "none" : "block",
              borderColor: isOnAuthPages ? "white" : "primary.main", // Only white border on auth pages
              color: isOnAuthPages ? "white" : "primary.main", // White text on auth pages, primary color otherwise
              backgroundColor: isOnAuthPages ? "primary.main" : "white", // Transparent background on auth pages
              "&:hover": {
                backgroundColor: isOnAuthPages ? "" : "white", // Transparent background on auth pages
              }
            }}
          >
            <Typography variant="h6">
              Register
            </Typography>
          </Button>
          <Button
            variant="contained"
            component={Link}
            href="/login"
            color="primary"
            size= "large"

            disableElevation
            sx={{
            borderRadius: '10px' ,
            display: isOnRegister ? "none" : "block",
            border: "1px solid white",
            borderColor: isOnAuthPages ? "white" : "white", // Only white border on auth pages
            color: isOnAuthPages ? "white" : "white", // White text on auth pages, primary color otherwise
            backgroundColor: isOnAuthPages ? "primary.main" : "theme.primary", // Transparent background on auth pages
            }}
          >
            <Typography variant="h6">
              Login
            </Typography>
          </Button>
        </Stack>
      </Box>
    </>
    )}
    {/* Conditionally render Profile based on lgUp */}
    {!mdUp && <Profile />}
    </>
    ) : (
    <>
      {isOnAuthPages || isOnHomePage ? (
        <>
          <Button variant="outlined" onClick={handleLogout} color="primary" disableElevation>
            Logout
          </Button>
          <Button
            variant="contained"
            onClick={handleMyAccountsClick}
            color="primary"
            disableElevation
          >
            My Accounts
          </Button>
        </>
        ) : (
        <Button variant="outlined" onClick={handleLogout} color="primary" disableElevation>
          Logout
        </Button>
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
