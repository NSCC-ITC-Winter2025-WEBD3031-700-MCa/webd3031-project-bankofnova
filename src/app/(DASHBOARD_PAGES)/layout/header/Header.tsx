"use client"; // Ensure this runs on the client side

import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button } from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"; // Import auth functions
import Profile from './admin_Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const HeaderContent = ({ toggleMobileSidebar }: ItemType) => {
  const { data: session } = useSession(); // Now safe to use

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    // border: '2px solid lawngreen',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));
  
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

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

        {/* <IconButton
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
        >
          <Badge variant="dot" color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        </IconButton> */}
        
        <Box flexGrow={1} />
        
         <Stack spacing={1} direction="row" alignItems="center">
          {!session ? (
            <Button variant="contained" component={Link} href="/login" color="primary">
              Login
            </Button>
          ) : (
            <Button variant="contained" onClick={() => signOut({ callbackUrl: "/" })} color="secondary">
              Logout
            </Button>
          )}
          <Profile />
        </Stack> 
      </ToolbarStyled>
    </AppBarStyled>
  );
};

const Header = ({ toggleMobileSidebar }: ItemType) => {
  return <HeaderContent toggleMobileSidebar={toggleMobileSidebar} />;
};

Header.propTypes = {
  toggleMobileSidebar: PropTypes.func.isRequired,
};

export default Header;
