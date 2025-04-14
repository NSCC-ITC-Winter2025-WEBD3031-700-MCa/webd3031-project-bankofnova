import { Box, Drawer, IconButton, AppBar, Toolbar, Backdrop } from "@mui/material";
import SidebarItems from './SidebarItems';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"; // Closed menu icon
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined"; // Open menu icon

import { Sidebar, Logo } from 'react-mui-sidebar';
import Profile from "../header/Profile";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useMediaQuery, useTheme } from "@mui/material";
import { SidebarProfile } from "./SidebarProfile";

const HEADER_HEIGHT = 64; // Adjust based on your design
const SIDEBAR_WIDTH = 200; // Sidebar width when open
const SIDEBAR_COLLAPSED_WIDTH = 65; // Sidebar width when collapsed (skinny)
const SIDEBAR_HEIGHT = 200;
const SIDEBAR_WIDTH_XS = 270; // New width for isXs

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
  onMobileSidebarToggle: () => void;
}

const LogoWithHover = () => (
  <Link href="/" passHref>
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        marginTop: '-2px',
        left: 45,
        zIndex: 9999,
      }}
    >
      <Logo img="/images/logos/dark-logo3.svg" />
    </Box>
  </Link>
);

const MSidebar = ({ isSidebarOpen }: ItemType) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const theme = useTheme();

  // Media queries for breakpoints
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'));
  const isXs = useMediaQuery('(max-width: 900px)'); // Custom xs breakpoint

  const [isSidebarToggled, setIsSidebarToggled] = useState(false);

  // Calculate sidebar width dynamically
  const sidebarWidth = isXs
    ? (isSidebarToggled ? SIDEBAR_WIDTH_XS : 0)
    : (isSidebarToggled ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH);

  const toggleSidebar = () => {
    setIsSidebarToggled((prev) => !prev);
    console.log(isSidebarToggled ? "Sidebar Open" : "Sidebar Collapsed");
  };

  useEffect(() => {
    if (isXlUp) {
      setIsSidebarToggled(true);
    } else if (isMdUp) {
      setIsSidebarToggled(false);
    } else if (isSmUp) {
      setIsSidebarToggled(false);
    }
  }, [isXlUp, isMdUp, isSmUp]);

  const isSpecialPage = ['/', '/login'].includes(pathname || '');

  if (isSpecialPage || status !== 'authenticated') {
    return null;
  }

  const handleBackdropClick = () => {
    setIsSidebarToggled(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          // backgroundColor: "silver",

          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <IconButton
      onClick={toggleSidebar}
      sx={{
        position: 'fixed',
        top: 10,
        left: 10, // Move it to the right of the logo
        zIndex: 9999,
      }}
>
  {isSidebarToggled ? <MenuOpenOutlinedIcon /> : <MenuOutlinedIcon />}
</IconButton>

          <LogoWithHover />

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%", marginRight: '50px' }}>
            <Profile />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          transition: 'margin-left 0.3s ease',
          marginLeft: isMdUp || isXlUp ? `${sidebarWidth}px` : 0,
        }}
      >
        <Drawer
          anchor="left"
          open={isSidebarToggled}
          variant={isMdUp || isXlUp ? 'permanent' : 'persistent'}
          onClose={isMdUp ? () => {} : undefined}
          PaperProps={{
            sx: {
              width: `${sidebarWidth}px`,
              height: `${SIDEBAR_HEIGHT}`,
              boxShadow: 'none',
              borderRight: 'none',
              display: 'flex',
              overflowX: "hidden",
              flexDirection: 'column',
            },
          }}
        >
          <Box sx={{ height: '100%' }}>
            <Sidebar
              width={`${sidebarWidth}px`}
              collapsewidth={`${SIDEBAR_COLLAPSED_WIDTH}px`}
              showProfile={false}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isSidebarToggled && <SidebarProfile />}
              <SidebarItems isSidebarToggled={isSidebarToggled} />
            </Sidebar>
          </Box>
        </Drawer>

        {/* Backdrop for xs screens */}
        {isXs && isSidebarToggled && (
          <Backdrop
            open={isSidebarToggled}
            onClick={handleBackdropClick}
            sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}
          />
        )}
      </Box>
    </Box>
  );
};

export default MSidebar;
