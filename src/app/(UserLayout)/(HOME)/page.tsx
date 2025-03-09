'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '../components/container/PageContainer';
// components
import ProductPerformance from '../components/dashboard/ProductPerformance';


const defaultHome = () => {
  return (
    <PageContainer title="HOME" description="this is HOME">
     <Box>
     <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
     </Box>
    </PageContainer>
  )
}

export default defaultHome;
