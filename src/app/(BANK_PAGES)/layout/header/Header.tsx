"use client"; // Ensure this runs only on the client side

import React from "react";
import { Box, Container, AppBar, Toolbar, styled, Stack, IconButton, Button, Typography, Grid } from "@mui/material";
import PropTypes from "prop-types";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"; // Import auth functions
import MenuIcon from "@mui/icons-material/Menu";
import Profile from "./Profile";
import UnauthProfile from "./UnauthProfile";

import { usePathname } from "next/navigation";
import { useMediaQuery, useTheme } from "@mui/material";
import { Logo } from "react-mui-sidebar";
import Image from 'next/image';

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  return <HeaderContent toggleMobileSidebar={toggleMobileSidebar} />;
};

const LogoWithHover = () => {
  const theme = useTheme();
  const isXL = useMediaQuery(theme.breakpoints.up("xl"));
  const isLG = useMediaQuery(theme.breakpoints.up("lg"));
  const isMD = useMediaQuery(theme.breakpoints.up("md"));
  const pathname = usePathname();

  // Responsive left position
  let leftPosition = 16; // default

  if (pathname === "/register" && isXL) {
    leftPosition = 53;
  } else if (isXL) {
    leftPosition = 72;
  } else if (isLG) {
    leftPosition = 0;
  } else if (isMD) {
    leftPosition = 0;
  } else {
    leftPosition = 0;
  }


  // Logo change based on path
  const logoSrc = pathname === "/register" ? "/images/logos/dark-logo4.svg" : "/images/logos/dark-logo3.svg";

  return (
    <Link href="/" passHref>
      <Box
        sx={{
          position: "fixed",
          top: 10,
          left: leftPosition,
          zIndex: 9999,
          width: "auto",
        }}
      >
        <Image
          src={logoSrc}
          alt="Logo"
          width={200} // Adjust width and height as per your design
          height={50}
        />
      </Box>
    </Link>
  );
};



const HeaderContent = ({ toggleMobileSidebar }: ItemType) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const mdUp = useMediaQuery((theme: any) => theme.breakpoints.up("md"));
  const smUp = useMediaQuery((theme: any) => theme.breakpoints.up("sm"));
  const xlUp = useMediaQuery((theme: any) => theme.breakpoints.up("xl"));

  // Define pages where subheader should appear
  const isLargerContainer = [
    "/overview",
    "/transactions/transfer/confirm",
    "/accounts/chequing",
    "/accounts/savings",
    "/transactions/transfer",
    "/transactions/deposit",
    "/transactions/movemoney",
  ].includes(pathname);
  const isMediumContainer = [
    "/",
  ].includes(pathname);

  const isOnAuthPages = pathname === "/login";
  const isOnHomePage = pathname === "/";
  const isOnRegister = pathname === "/register";

  

  const blueBackground = ["/register"].includes(pathname);

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: blueBackground ? theme.palette.primary.main : "white", // Use blueBackground state
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    borderRadius: "none !important",
    position: "sticky", // This will make the header behave as a normal element

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
    // position: "relative",
  }));

  const handleLogout = async () => {
    await signOut({ redirect: false }); // Log out without redirecting
    window.location.href = "/login"; // Manually trigger a page reload
  };

  const handleMyAccountsClick = () => {
    window.location.href = "/overview"; // Navigate to "My Accounts" page
  };

  // if (status === "loading") {
  //   return (
  //     <AppBarStyled position="sticky" color="default">
  //       <ToolbarStyled>
  //         <Box>Loading...</Box>
  //       </ToolbarStyled>
  //     </AppBarStyled>
  //   );
  // }



    return isOnRegister ? (
      <>
    <LogoWithHover /> {/* Add this here for logo on register */}
      <AppBarStyled position="sticky" color="default">
        <ToolbarStyled>
          {/* ...everything inside your ToolbarStyled */}
        </ToolbarStyled>
      </AppBarStyled>
      </>
    ) : (
      <Container
        sx={{
          maxWidth: isLargerContainer
            ? "1600px !important"
            : isMediumContainer && lgUp
            ? "1400px !important"
            : "1200px",
          ...(isMediumContainer && xlUp && {
            padding: "0 !important",
          }),
        }}
      >
      
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>

      {(isOnHomePage || isOnAuthPages) && <LogoWithHover />}

        {/* LEFT SIDE */}
        {/* {(isOnRegister) && <LogoWithHover />} */}
        {isOnRegister && (
          <Link href="/" passHref>
            <Box
              sx={{
                "&:hover": {
                  opacity: 0.8, 
                },
                alignItems: "center",  // Vertically center logo
                // marginTop: '16px',
              }}
            >
                <Image
            src={blueBackground ? "/images/logos/dark-logo4.svg" : "/images/logos/dark-logo3.svg"} 
                alt="Logo"
                width={200} // Adjust width and height as per your design
                height={50}
              />
            </Box>
          </Link>
        )}

        {/* Hamburger Menu */}
       <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            position: "absolute",
            marginTop: "1px",
            left: 33,
            display: isOnAuthPages || !isOnHomePage ? "none" : "none",
          }}
        >
          <MenuIcon sx={{ color: blueBackground ? "white" : "inherit" }} />
        </IconButton> 

        {/* RIGHT SIDE */}
        <Stack spacing={1} direction="row" alignItems="center" 
sx={(theme) => ({
  position: "absolute",
  right: session && !isOnHomePage ? 160 : 72,
  [theme.breakpoints.down('xl')]: {
    right: session && !isOnHomePage ? 160 : 0,
  },
  [theme.breakpoints.down('lg')]: {
    right: session && !isOnHomePage ? 160 : 0,
  },
  [theme.breakpoints.down('md')]: {
    right: session && !isOnHomePage ? 100 : 40, // adjust these values to taste
  },
  [theme.breakpoints.down('sm')]: {
    right: session && !isOnHomePage ? 50 : 35,
  },
})}
          >
{status === "unauthenticated" && !isOnRegister && (
  <>
    {smUp ? (
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
              padding: "10px 20px",
              border: "1px solid white",
              borderColor: blueBackground ? "white" : "primary.main",
              backgroundColor: blueBackground ? "primary.main" : "white",
              color: blueBackground ? "white" : "primary.main",
              "&:hover": {
                backgroundColor: blueBackground ? "" : "white",
              },
            }}
          >
            <Typography variant="h5">Register</Typography>
          </Button>
          <Button
            variant="contained"
            component={Link}
            href="/login"
            color="primary"
            size="large"
            disableElevation
            sx={{
              padding: "10px 20px",
              border: "1px solid white",
              borderColor: blueBackground ? "white" : "white",
              color: blueBackground ? "white" : "white",
              backgroundColor: blueBackground ? "primary.main" : "theme.primary",
            }}
          >
            <Typography variant="h5">Login</Typography>
          </Button>
        </Stack>
      </Box>
        
      ) : (
        <UnauthProfile />
      )}
    </>
  )}
  
  {status === "authenticated" && (isOnAuthPages || isOnHomePage) && (
    <>
      <Button
        variant="outlined"
        onClick={handleLogout}
        color="primary"
        disableElevation
        sx={{
          height: "44px",
          backgroundColor: blueBackground ? "white" : "theme.primary",
          color: blueBackground ? "theme.primary" : "theme.primary",
          "&:hover": {
            backgroundColor: blueBackground ? "white" : "",
            border: blueBackground ? "1px solid #cdcdcd" : "",
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
          height: "44px",
          border: "1px solid white",
          backgroundColor: "theme.primary",
          color: "theme.primary !important",
        }}
      >
        My Accounts
      </Button>
    </>
  )}
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
    </Container>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
