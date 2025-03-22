'use client';
import { Box, Typography, Button, Grid, Stack } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const Shadow = () => {
  return (
    <>
      {/* Example of DashboardCard backgroundColor: 'red',   with custom title, subtitle, and action */}
      <Grid container  sx={{padding: 0, mt: 2 }}>
      <Grid
        item
        xs={12}
        sm={6}
        md={6}
        lg={6}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: {
            xs: 0,   // 0px on extra small screens
            md: 'auto',   // 8px * 4 = 32px on medium screens
            lg: 'auto',   // 8px * 6 = 48px on large screens
          },
        }}
      >

          <DashboardCard
            elevation={0}
            borderRadius={0} // Set border radius to 16px
          >
                <Stack>
           <Typography variant="h2" fontWeight="600" mb="20px">
           Open a Bank of Nova Chequing Account</Typography>
            <Box sx={{ mt: 'auto', textAlign: 'left', pt: 1 }}>
              <Button
                variant="contained"
                color="info"
                sx={{ ps: 2, pe: 2, borderRadius: 0 }}
                disableElevation
              >
                Get started
              </Button>
            </Box>
            </Stack>


          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6}>

        </Grid>
      </Grid>

      {/* <DashboardCard elevation={0}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DashboardCard
              title="11111111"
              subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis quibusdam maiores officia explicabo."
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DashboardCard
              title="Test"
              subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis voluptatibus eius neque molestiae magni sapiente."
            />
          </Grid>
        </Grid>
      </DashboardCard> */}
    </>
  );
};

export default Shadow;
