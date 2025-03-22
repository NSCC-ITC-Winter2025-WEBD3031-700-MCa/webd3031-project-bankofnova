"use client"; // Ensure this runs only on the client side

import React, { useState, useEffect } from "react";
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Button } from "@mui/material";
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
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Track if component is mounted
  const [isOnAuthPages, setIsOnAuthPages] = useState(false); // Track if on auth-related pages
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg")); // Check for large screens (lg and up)

  useEffect(() => {
    // Set the mounted state to true after the component is mounted
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Set the `isOnAuthPages` state based on the pathname
    if (pathname === "/" || pathname === "/login" || pathname === "/register") {
      setIsOnAuthPages(true);
    } else {
      setIsOnAuthPages(false);
    }
  }, [pathname]);

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
        ? theme.palette.info.main
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

  // const isUserPage = [
  //   "/overview",
  //   "/transactions/transfer/confirm",
  //   "/accounts/chequing",
  //   "/accounts/savings",
  //   "/transactions",
  //   "/transactions/transfer",
  //   "/transactions/deposit",
  //   "/transactions/movemoney",
  // ].includes(pathname);

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
        }}
      >
        <Logo img="/images/logos/dark-logo3.svg" />
      </Box>
    </Link>
  );

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        {/* Logo Component */}
        <LogoWithHover />

        {/* Hamburger Menu */}
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            position: "absolute",
            left: session ? 10 : "auto",
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

{/* Authentication or Profile Options */}
<Stack
  spacing={1}
  direction="row"
  alignItems="center"
  sx={{ position: "absolute", right: session ? 10 : 50 }}
>
  {!session ? (
    <>
      {/* Hide Login and Register buttons on small screens */}
      {lgUp && (
        <>
          <Button
            variant={pathname === '/' ? "contained" : "contained"} // "outlined" only on homepage
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
              border: '1px solid lawngreen',
              color: 'info.main', // Set text color to the "info" color
              '&:hover': {
                borderColor: 'white', // Darken border color on hover
                color: 'white', // Darken text color on hover
              },
            }}
          >
            Register
          </Button>
        </>
      )}
      {/* Conditionally render Profile based on lgUp */}
      {!lgUp && <Profile />}
    </>
  ) : (
    <>
      {isOnAuthPages ? (
        <>
          <Button variant="outlined" onClick={handleLogout} color="info" disableElevation>
            Logout
          </Button>
          <Button
            variant="contained"
            onClick={handleMyAccountsClick}
            color="info"
            disableElevation
          >
            My Accounts
          </Button>
        </>
      ) : (
        <Button variant="outlined" onClick={handleLogout} color="info" disableElevation>
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
