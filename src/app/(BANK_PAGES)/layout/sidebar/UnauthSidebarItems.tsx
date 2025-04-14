import { Box, List } from "@mui/material";
import NavItem from "./UnauthNavItem";
import NavGroup from "./NavGroup/NavGroup";
import React from "react";
import UnauthMenuItems from "./UnauthMenuItems";
import { usePathname } from "next/navigation";

const UnauthenticatedSidebarItems = ({ toggleMobileSidebar }: any) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  return (
    <Box sx={{ px:0 , gx:0, mx:0, mt:0, mb:0 }}>
      <List sx={{ pt: 18 }} className="sidebarNav" component="div">
        {UnauthMenuItems.map((item) => {
          // {/********SubHeader**********/}
          if (item.subheader) {
            return (
              <NavGroup
                item={item}
                key={item.subheader}
            
              />
            );
          }

          // {/********If Sub Menu**********/}
          else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={toggleMobileSidebar}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default UnauthenticatedSidebarItems;
