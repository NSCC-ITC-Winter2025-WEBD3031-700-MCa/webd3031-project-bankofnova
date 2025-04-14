'use client';
import React from 'react';
import { Container, Box, Grid, Typography, Stack, Button } from '@mui/material';
import Link from 'next/link';
import { useMediaQuery, useTheme } from "@mui/material";

const BankCardTest2 = () => {
    const theme = useTheme();
    const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
    const xlUp = useMediaQuery(theme.breakpoints.up("xl"));
  return (
    <Grid
      container
      sx={{
        borderRadius: '16px',
        // backgroundColor: 'lawngreen',
        marginBottom: '16px',
        marginTop: '60px',
        overflow: 'hidden', // optional: to keep border radius consistent
      }}
    >
      {/* First column */}
      <Grid
        item
        // marginRight={"24px"}
        // marginLeft={xlUp ? '72px' : '0px'}
        xs={12}
        md={6}
        sx={{
          height: '350px',
          maxWidth: xlUp ? '624px !important' : 'auto' ,
          // backgroundColor: 'info.dark',
          // borderRadius: '16px 0 0 16px', 
          display: 'flex',
          alignItems: 'center',
          marginLeft: {
            xs: '0px',
            sm: '0px',
            md: '22px',
            lg: '0px',
            xl: '42px',
          }
        }}
      >
        <Stack sx={{ width: '100%' , 
          
          
          
          p: {
            xs: '0px',
            sm: '0px',
            md: '0px',
            lg: '0px',
            xl: '0px',
          }
          
          }}>
          <Box
            sx={{
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Typography variant="h1" fontWeight="600" mb="20px" fontSize="36px" color="text.primary">
              Open a Bank of Nova Chequing Account
            </Typography>
            <Typography variant="h5" color="text.secondary"  fontSize="24px" paragraph>
            Choose the way you manage your money.
            </Typography>
            <Link href="/register" passHref>
            <Button
                variant="contained"
                color="primary"
                size="large"

                sx={{
                  height: '56px',
                  textTransform: 'none',
                }}
                disableElevation
              >
              <Typography variant="h6">Get started</Typography>
            </Button>
            </Link>
          </Box>
        </Stack>
      </Grid>

     
    </Grid>
  );
};

export default BankCardTest2;
