import React from "react";
// mui imports
import {
  ListItemIcon,
  ListItem,
  List,
  styled,
  ListItemText,
  useTheme,
  ListItemButton,
  Box
} from "@mui/material";
import Link from "next/link";

type NavGroup = {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: any;
  onClick?: React.MouseEvent<HTMLButtonElement, MouseEvent>;
};

interface ItemType {
  item: NavGroup;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  hideMenu?: any;
  level?: number | any;
  pathDirect: string;
  children?: React.ReactNode;  // Allow children to be passed to the component

}



const NavItem = ({ item, level, pathDirect, onClick, children}: ItemType) => {
  const Icon = item.icon;
  const theme = useTheme();

  // Conditionally set itemIcon only if Icon exists
  const itemIcon = Icon ? <Icon stroke={1.5} size="1.3rem" /> : null;

  const ListItemStyled = styled(ListItem)(() => ({
    padding: 0,
".MuiButtonBase-root": {
  whiteSpace: "nowrap",
  padding: "12px 0px",

  borderLeft: '4px solid transparent',

  // ❌ Do not set 'color' globally here (optional, unless you want it by default)

  // ✅ Text color explicitly
  "& .MuiTab-wrapper": {
    color: theme.palette.primary.main,
  },

  // ✅ Ripple color explicitly
  "& .MuiTouchRipple-root .MuiTouchRipple-rippleVisible": {
    color: theme.palette.primary.main,
  },

  "&:hover": {
    backgroundColor: 'transparent',
    borderLeft: '4px solid grey',

    // ✅ Hover text color
    "& .MuiTab-wrapper": {
      color: theme.palette.primary.main,
    },

    // ✅ Hover ripple color
    "& .MuiTouchRipple-root .MuiTouchRipple-rippleVisible": {
      color: theme.palette.primary.main,
    },
  },

  "&.Mui-selected": {
    borderLeft: '4px solid #5D87FF',
    backgroundColor: 'transparent',

    "& .MuiTab-wrapper": {
      color: theme.palette.primary.main,
    },

    "& .MuiTouchRipple-root .MuiTouchRipple-rippleVisible": {
      color: theme.palette.primary.main,
    },

    "&:hover": {
      backgroundColor: 'transparent',

      "& .MuiTab-wrapper": {
        color: theme.palette.primary.main,
      },

      "& .MuiTouchRipple-root .MuiTouchRipple-rippleVisible": {
        color: theme.palette.primary.main,
      },
    },
  },
},

  }
)
);


  //   ".MuiButtonBase-root": {
  //     whiteSpace: "nowrap",
  //     // marginBottom: "2px",
  //     padding: "12px 0px",
  //     // marginTop: "5px",
  //     borderLeft: '4px solid transparent',

  //     // borderRadius: "8px",
  //     // borderRadius: "4px",
  //     // backgroundColor: level > 1 ? "transparent !important" : "inherit",
  //     color: theme.palette.text.primary,
  //     "&:hover": {
  //       // backgroundColor: theme.palette.primary.light,
  //       color: theme.palette.primary.main,
  //       // color: 'default',
  //       borderLeft: '4px solid grey',
  //       // backgroundColor: theme.palette.primary.light,
  //       backgroundColor: theme.palette.success.light,
        

  //     },
  //     "&.Mui-selected": {
  // // backgroundColor: theme.palette.primary.main,
  // borderLeft: '4px solid 13DEB9',
  // // backgroundColor: theme.palette.primary.main,
  // backgroundColor: 'transparent',

  // // borderLeft:  theme.palette.primary.main,
  //         // backgroundColor: theme.palette.primary.light,
  //       "&:hover": {        
  //           // backgroundColor: theme.palette.primary.light,
  //           // backgroundColor: theme.palette.success.light,
  //           backgroundColor: theme.palette.success.light,
          
  //       color: theme.palette.primary.main,
  //         // borderLeft: '2px solid grey',
  //         // color: "white",
  //       },
  //     },
  //   },
  // }


  return (
    <List component="div" disablePadding key={item.id} >
      <ListItemStyled
      >
        <ListItemButton
          component={Link}
          href={item.href}
          disabled={item.disabled}
          selected={pathDirect === item.href}
          target={item.external ? "_blank" : ""}
          onClick={onClick}

        >
          {/* Render ListItemIcon only if itemIcon is not null */}
          {itemIcon && (
     <ListItemIcon
     sx={{
      color: "inherit",
      //move icon here
       marginLeft: "17px", 
       
       
     }}
   >
     <Box sx={{ display: "flex",
       }}>
       {itemIcon}
     </Box>
   </ListItemIcon>
          )}
          {/* Render children (like title) */}
          {children || (
            <ListItemText>
              <>{item.title}</>
            </ListItemText>
          )}
        </ListItemButton>
      </ListItemStyled>
    </List>
  );
};

export default NavItem;
