"use client"; // Ensure this runs on the client side

import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button } from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"; // Import auth functions
import { IconBellRinging, IconMenu } from '@tabler/icons-react';
import Profile from './Profile';

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
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));
  
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  const handleLogout = async () => {
    await signOut({ redirect: false }); // Log out without redirecting
    // Optionally you can redirect to login page after logout
    window.location.href = '/login'; // Manually trigger a page reload
  };

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        <IconButton
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
        >
          <Badge variant="dot" color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        </IconButton>

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          {!session ? (
            <Button variant="contained" component={Link} href="/login" color="primary">
              Login
            </Button>
          ) : (
            <Button variant="contained" onClick={handleLogout} color="secondary">
              Logout
            </Button>
          )}
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
