import React from 'react';
import { Container, Box, Grid, Typography } from '@mui/material';

const BankCard = () => {
  return (

 
    <Grid container sx={{ 
      backgroundColor: 'black',
    }}>

<Container
>
<Grid container sx={{ 
      padding: '64px 0', 
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
    <Box
      sx={{
        width: '300px',
        height: '180px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #5D87FF,rgb(100, 100, 100))',
        padding: '16px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Card Top */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: '500' }}>
          Bank of Nova
        </Typography>
      </Box>

      {/* Card Middle */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="subtitle1">**** **** **** 1234</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontSize: '12px' }}>
            VALID THRU
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
            12/28
          </Typography>
        </Box>
      </Box>

      {/* Card Bottom */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontSize: '16px' }}>
          JOHN DOE
        </Typography>
        <Box
          sx={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '12px',
              color: '#0077b6',
            }}
          >
            {/* TEXT */}
          </Typography>
        </Box>
      </Box>
    </Box>
    </Grid>
            </Grid>
            </Container>
    
          </Grid>

  );
};

export default BankCard;
