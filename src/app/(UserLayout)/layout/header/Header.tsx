"use client"; // Ensure this runs only on the client side

import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Button } from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"; // Import auth functions
import { IconMenu } from '@tabler/icons-react';
import Profile from './Profile';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from '@mui/material'; // Import useMediaQuery
import { Logo } from 'react-mui-sidebar';

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  return (
    <HeaderContent toggleMobileSidebar={toggleMobileSidebar} />
  );
};

const HeaderContent = ({ toggleMobileSidebar }: ItemType) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Track if component is mounted
  const [isOnAuthPages, setIsOnAuthPages] = useState(false); // Track if on auth-related pages
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg')); // Check for large screens (lg and up)

  useEffect(() => {
    // Set the mounted state to true after the component is mounted
    setIsMounted(true);
  }, []); // This will run only once after the component mounts

  useEffect(() => {
    // Set the `isOnAuthPages` state based on the pathname
    if (pathname === '/' || pathname === '/login' || pathname === '/register') {
      setIsOnAuthPages(true);
    } else {
      setIsOnAuthPages(false);
    }
  }, [pathname]); // Runs whenever the pathname changes

  useEffect(() => {
    // Reset loading state when session status changes
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status]);

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: session ? theme.palette.background.paper : theme.palette.background.paper  , // Change color if logged in
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));


  //Position
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
    display: 'flex',
    justifyContent: 'flex-start', // Aligns children to the left
    alignItems: 'center', // Keeps items centered vertically
    position: 'relative', // Ensures elements don't overlap
  }));

  const handleLogout = async () => {
    await signOut({ redirect: false }); // Log out without redirecting
    // Optionally you can redirect to login page after logout
    window.location.href = '/login'; // Manually trigger a page reload
  };

  const handleMyAccountsClick = () => {
    window.location.href = '/overview'; // Navigate to "My Accounts" page using location.href
  };

  // Only render after the component is mounted on the client
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

  // Define restricted paths for the hamburger menu
  const restrictedPaths = ['/overview', '/accounts/chequing', '/accounts/savings', '/transactions'];

  // Check if the current pathname is a restricted path
  const isRestrictedPath = restrictedPaths.includes(pathname);

  // Check if the current page is a user page
  const isUserPage = ['/overview', '/transactions/transfer/confirm', '/accounts/chequing', '/accounts/savings', '/transactions', '/transactions/transfer', '/transactions/deposit', '/transactions/movemoney'].includes(pathname);
  
  const LogoWithHover = () => {
    return (
      <Link href="/" passHref>
      <Box
        sx={{
          '&:hover': {
            opacity: 0.8, // Change opacity on hover for effect
          },
          display: isOnAuthPages || !session ? 'flex' : 'none', // Show logo on auth pages or if no session
          alignItems: 'center', // Center the logo vertically
          width: '100%', // Make sure it takes up full width
        }}
      >
        <Logo img="/images/logos/dark-logo-new1.svg" />
      </Box>
    </Link>
  );
};
  
  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        {/* Wrap everything in a Box for margin on large screens */}
        {/* Render the LogoWithHover component */}
        <LogoWithHover />

        {/* Hamburger Menu for Mobile */}
        {/* Hide on /overview page when lgUp, show on restricted paths or small screens */}
        <IconButton
        color="inherit"
        aria-label="menu"
        onClick={toggleMobileSidebar}
        sx={{
          position: 'absolute',
          left: session ? 10 : 'auto', // Move left if logged in
          right: !session && isOnAuthPages ? 10 : 'auto', // Keep right if not logged in and on auth pages
          display: (session && isOnAuthPages) ? 'none' : (isUserPage || isOnAuthPages) && lgUp ? "none" : "block", // Hide on auth pages if logged in, and on user/auth pages for large screens
        }}
      >
        <IconMenu width="20" height="20" />
      </IconButton>

        {/* Right side: Login/Logout, Profile, or My Accounts */}
        {/* Stack for non-authenticated users (Login/Register) */}
        <Stack spacing={1} direction="row" alignItems="center" sx={{ position: 'absolute', right: 50 }}>
          {!session && (
            <>
              <Button variant="contained" component={Link} href="/login" color="primary" disableElevation>
                Login
              </Button>
              <Button variant="contained" component={Link} href="/register" color="primary" disableElevation>
                Register
              </Button>
            </>
          )}
        </Stack>

        {/* Separate Stack for authenticated users (My Accounts/Logout) */}
        <Stack spacing={1} direction="row" alignItems="center" sx={{ position: 'absolute', right: 10 }}>
          {session && (
            <>
              {isOnAuthPages ? (
                <>
                <Button variant="outlined" onClick={handleLogout} color="secondary" disableElevation>
                Logout
                </Button>
                <Button variant="contained" onClick={handleMyAccountsClick} color="primary" disableElevation>
                  My Accounts
                </Button>
                </>

              ) : (
                <Button variant="outlined" onClick={handleLogout} color="secondary" disableElevation>
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
