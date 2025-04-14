import React from 'react';
import { Container, Box, Grid, Typography } from '@mui/material';

const BankCard = () => {
  return (

 
    <Grid container sx={{ 
      backgroundColor: '#cdcdcd',
    }}>

<Container
>
<Grid container sx={{ 
      padding: '24px 0', 
      pointerEvents: 'none',   // Disables interaction for this grid
      userSelect: 'none',      // Prevents text selection
      // backgroundColor: 'success.main',
    }}>

    <Grid
      item
      xs={12}
      sm={12}
      md={6}
      lg={6}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        marginLeft: {
          xs: 0, // 0px on extra small screens
          md: 'auto',
          lg: 'auto',
        },
      }}
    >
    </Grid>
    <Grid
      item
      xs={12}
      md={6}
      sx={{
        display: 'flex',
        justifyContent: 'center !important',
        alignItems: 'center',
      }}
    >
    </Grid>
    <Grid
      item
      xs={12}
      sm={12}
      md={6}
      lg={6}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        marginLeft: {
          xs: 0, // 0px on extra small screens
          md: 'auto',
          lg: 'auto',
        },
      }}
    >
    </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center !important',
                alignItems: 'center',
              }}
            >
  
    </Grid>
            </Grid>
            </Container>
    
          </Grid>

  );
};

export default BankCard;
