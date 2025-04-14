'use client';

import { List, ListItem, ListItemIcon, ListItemText, Grid, Box, Typography } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useMediaQuery, useTheme } from "@mui/material";

const MyCard3 = () => {
  const theme = useTheme();
  const xlUp = useMediaQuery(theme.breakpoints.up("xl"));

  return (
    <Grid
      container
      sx={{
        borderRadius: '16px',
        marginTop: "20px",
        maxWidth: xlUp ? '94% !important' : '100% !important',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: theme.palette.primary.light,
        height: '100%',
        padding: 0, // remove container padding
      }}
    >

      {/* Left column */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%', // ensure full height
        }}
      >
        <Box
          sx={{
            width: '100%', // use full width of Grid item
            maxWidth: '400px', // control max width to keep it clean
            height: '250px',
            backgroundColor: 'white',
            border: '2px solid rgb(33, 39, 205)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '15px'
          }}
        >
          <Typography>Left Column (Empty or Content)</Typography>
        </Box>
      </Grid>

      {/* Right column */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%', // ensure full height
        }}
      >
        <Box
          sx={{
            width: '100%', // use full width of Grid item
            maxWidth: '400px',
            height: '250px',
            backgroundColor: 'white',
            border: '2px solid rgb(0, 255, 76)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography>Right Column (Empty or Content)</Typography>

        </Box>
      </Grid>

    </Grid>
  );
};

export default MyCard3;
