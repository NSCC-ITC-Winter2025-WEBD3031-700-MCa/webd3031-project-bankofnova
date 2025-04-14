import PropTypes from "prop-types";
import React from "react";
import { List, ListSubheader, styled, Theme, Box } from "@mui/material";
import NavItem from "../NavItem"; // Ensure the correct path

type NavGroupProps = {
  item: {
    navlabel?: boolean;
    subheader?: string;
    children?: any[]; // Allow grouping of menu items
  };
  sx?: any; // Allow external styles
};

const ListSubheaderStyle = styled((props: Theme | any) => (
  <ListSubheader disableSticky {...props} />
))(({ theme }) => ({
  ...theme.typography.overline,
  fontWeight: "700",
  marginTop: theme.spacing(1),
  // marginBottom: theme.spacing(0),
  color: theme.palette.text.primary,
  lineHeight: "26px",
  padding: "3px 12px",
}));

const NavGroup = ({ item, sx }: NavGroupProps) => {
  return (
    <Box sx={sx}>
      {item.subheader && <ListSubheaderStyle>{item.subheader}</ListSubheaderStyle>}
      <List component="div" disablePadding>
        {item.children?.map((menuItem) => (
          <NavItem key={menuItem.id} item={menuItem} pathDirect="" onClick={() => {}} />
        ))}
      </List>
    </Box>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object.isRequired,
  sx: PropTypes.object,
};

export default NavGroup;
