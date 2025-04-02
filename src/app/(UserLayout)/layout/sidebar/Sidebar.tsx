"use client";
import { Box, Drawer } from '@mui/material';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import SidebarItems from './SidebarItems';
import { Profile } from './SidebarProfile';
import { Sidebar, Logo } from 'react-mui-sidebar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import UnauthSidebarItems from './UnautenticatedSidebarItems'; // Corrected import

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
  onMobileSidebarToggle: () => void; // Add this for toggle functionality
}

const LogoWithHover = () => (
  <Link href="/" passHref>
    <Box
      sx={{
        '&:hover': {
          opacity: 0.8, // Change opacity on hover for effect
        },
        display: 'flex',
        justifyContent: 'center', // Center the logo horizontally
        alignItems: 'center', // Center the logo vertically
        width: '100%', // Make sure it takes up full width
      }}
    >
      <Logo img="/images/logos/dark-logo3.svg" />
    </Box>
  </Link>
);

const MSidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
  onMobileSidebarToggle,
}: ItemType) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [lgUp, setLgUp] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1200px)');
    setLgUp(mediaQuery.matches);

    const handleResize = () => setLgUp(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleResize);

    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const shouldRenderAuthenticatedSidebar = status === 'authenticated';
  const shouldRenderUnauthenticatedSidebar = status === 'unauthenticated';
  const isSpecialPage = ['/', '/login', '/register'].includes(pathname);



  // Force mobile sidebar on special pages
  if (isSpecialPage) {
    return (
      <Drawer
        anchor="left" 
        open={isMobileSidebarOpen}
        onClose={onSidebarClose}
        variant="temporary"
        PaperProps={{ sx: { boxShadow: (theme) => theme.shadows[8] } }}
      >
        <Box px={2}>
          <Sidebar width="270px" collapsewidth="80px" isCollapse={false} mode="light" direction="ltr" themeColor="#5d87ff" themeSecondaryColor="#49beff" showProfile={false}>
            <LogoWithHover />
            {shouldRenderUnauthenticatedSidebar ? <UnauthSidebarItems /> : <>
              <Profile />
              <SidebarItems />
            </>}
          </Sidebar>
        </Box>
      </Drawer>
    );
  }

  if (lgUp) {
    return (
      <Box sx={{ width: '270px', flexShrink: 0 }}>
        <Drawer anchor="left" open={isSidebarOpen} variant="permanent">
          <Box sx={{ height: '100%' }}>
            <Sidebar width="270px" collapsewidth="80px" open={isSidebarOpen} themeColor="#5d87ff" themeSecondaryColor="#49beff" showProfile={false}>
              <LogoWithHover />
              {shouldRenderAuthenticatedSidebar ? <>
                <Profile />
                <SidebarItems />
              </> : <UnauthSidebarItems />}
            </Sidebar>
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
    >
      <Box px={2}>
        <Sidebar width="270px" collapsewidth="80px" isCollapse={false} mode="light" direction="ltr" themeColor="#5d87ff" themeSecondaryColor="#49beff" showProfile={false}>
          <LogoWithHover />
          {shouldRenderUnauthenticatedSidebar ? <UnauthSidebarItems /> : <>
            <Profile />
            <SidebarItems />
          </>}
        </Sidebar>
      </Box>
    </Drawer>
  );
};

export default MSidebar;
