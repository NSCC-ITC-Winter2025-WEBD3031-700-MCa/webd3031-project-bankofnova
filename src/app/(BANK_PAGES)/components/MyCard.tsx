'use client';

import { Container, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Grid } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useMediaQuery, useTheme } from "@mui/material";

const MyCard3 = () => {
  const theme = useTheme();
  const xlUp = useMediaQuery(theme.breakpoints.up("xl"));

  return (
    <Grid
      container
      p={0}
      m={0}
      sx={{
        borderRadius: '16px',
        marginTop: "20px",
        height: '240px',
        maxWidth: xlUp ? '94% !important' : '100% !important',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: theme.palette.primary.light,
      }}
    >
      {/* Left column (empty or could hold text/image/etc) */}
      <Grid item xs={12} md={6} sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.success.main,
        // Optional: Add content or leave empty
      }}>
        {/* You can put other content here if needed */}
      </Grid>

      {/* Right column with checkbox list */}
      <Grid item xs={12} md={6} sx={{
        display: 'flex',
        alignItems: 'center',
      }}>
        <List>
          {[
            "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          ].map((feature, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckBoxIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

export default MyCard3;
