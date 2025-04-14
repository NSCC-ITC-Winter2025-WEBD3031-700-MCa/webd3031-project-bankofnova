import React from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List, Divider, Typography } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";

const SidebarItems = ({ toggleMobileSidebar, isSidebarToggled }: any) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  return (
    // <Box sx={{ px: 3 }}>
    //TODO:
    <Box
    sx={{ 
      marginTop: isSidebarToggled ? '0px' : "80px",
      paddingRight: isSidebarToggled ? '0px' : "0px",
      paddingLeft: isSidebarToggled ? '0px' : "0px",
      overflowX: "hidden",
      maxWidth: isSidebarToggled ? '100% !important' : '100% !important',

     }}
  >
      <List  className="sidebarNav" component="div">
        {Menuitems.map((item, index) => {
          // If item has subheader, use NavGroup // marginLeft: "10px",

          // if (item.subheader) {
          //   return (
          //     <NavGroup
          //       item={item}
          //       key={item.subheader}
          //       sx={{
          //         display: isSidebarToggled ? "block" : "none",
          //       }}
          //     />
          //   );
          // }

          // Divider before "Settings"
          if ((item.title === "Transfer" || item.title === "Settings") && index > 0) {
            return (
              <React.Fragment key={item.id || `divider-${index}`}>
                <Divider sx={{ my: 1 }} />
                <NavItem
                  item={item}
                  key={item.id || `navitem-${index}`}
                  pathDirect={pathDirect}
                  onClick={toggleMobileSidebar}
                >
                  <Box 
                  sx={{ display: isSidebarToggled ? "block" : "none" }}>
                         <Typography
              variant="body2"
              fontSize={14}
              fontWeight="400"
                sx={{
                  
                  marginLeft: isSidebarToggled ? '-10px' : "10px",
                  // marginLeft: "10px",
                  display: isSidebarToggled ? "block" : "none",
                }}
              >
                    
                    {item.title}
                    </Typography>

                  </Box>
                </NavItem>
              </React.Fragment>
            );
          }
          

          return (
            <NavItem
              item={item}
              key={item.id || `navitem-${index}`}
              pathDirect={pathDirect}
              onClick={toggleMobileSidebar}
            >
              <Typography
              variant="body2"
              fontSize={14}
              fontWeight="400"
                sx={{
                  
                  marginLeft: isSidebarToggled ? '-10px' : "10px",
                  // marginLeft: "10px",
                  display: isSidebarToggled ? "block" : "none",
                }}
              >
                {item.title}
              </Typography>
            </NavItem>
          );
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
