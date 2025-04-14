import { Box, Typography, Button, Stack, Grid } from '@mui/material';
import Link from 'next/link';
import DashboardCard from '@/app/(DASHBOARD_PAGES)/components/shared/DashboardCard';

const CTA = () => {
  return (
    <>
    <DashboardCard elevation={0} borderRadius={0}>
          <Grid container sx={{ padding: 0, 
          mt: 6,
          mb: 0,
      
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
      <Stack>
        <Box
          sx={{
            textAlign: { xs: 'center', md: 'left' }, // Use MUI's responsive styling
            pt: 3,
            
          }}
        >
          <Typography variant="h1" fontWeight="600" mb="20px">
            Open a Bank of Nova Chequing Account
          </Typography>
          <Link href="/register" passHref>
              <Button
                variant="contained"
                color="primary"
                size="large"

                sx={{
                  padding: '17px 21px',
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
      <Grid
    item
    xs={12}
    md={6}
    sx={{
      pointerEvents: 'none',   
      userSelect: 'none',      

    }}
  >
  </Grid>
  </Grid>
    </DashboardCard>
   </>
  );
};

export default CTA;
