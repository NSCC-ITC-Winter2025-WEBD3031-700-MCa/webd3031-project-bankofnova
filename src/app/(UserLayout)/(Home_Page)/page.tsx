import { Grid } from '@mui/material';
// import Link from 'next/link';
// import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import BankCard from "../components/blocks/BankCard";
import CTA from "../components/blocks/CTA";
import React from "react";

// Dynamically load the Footer component as a Client Component



const HomePage = () => {

  return (
    <>

<Grid container sx={{ padding: 0, mt: 6 }}>
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
    <CTA />
  </Grid>

  {/* Empty Grid with pointer-events and user-select disabled */}
  <Grid
    item
    xs={12}
    md={6}
    sx={{
      pointerEvents: 'none',   // Disables interaction for this grid
      userSelect: 'none',      // Prevents text selection
    }}
  >
    {/* No content here */}
  </Grid>

  <Grid
    item
    xs={12}
    sm={12}
    md={6}
    lg={6}
    sx={{
      pointerEvents: 'none',   // Disables interaction for this grid
      userSelect: 'none',      // Prevents text selection
      display: 'flex',
      flexDirection: 'column',
      marginLeft: {
        xs: 0, // 0px on extra small screens
        md: 'auto',
        lg: 'auto',
      },
    }}
  >
    {/* Another empty Grid */}
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
    <BankCard />
  </Grid>
</Grid>



    </>
  );
};

export default HomePage;
