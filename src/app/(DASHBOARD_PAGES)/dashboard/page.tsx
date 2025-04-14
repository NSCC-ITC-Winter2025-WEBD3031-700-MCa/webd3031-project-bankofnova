'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '../components/container/PageContainer';
import dynamic from 'next/dynamic';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import ProductPerformance from '../components/dashboard/ProductPerformance';
import MonthlyEarnings from '../components/dashboard/MonthlyEarnings';

// Dynamically import components with SSR disabled
const SalesOverview = dynamic(() => import('../components/dashboard/UserRegistration'), { ssr: false });
const YearlyBreakup = dynamic(() => import('../components/dashboard/AllUsers'), { ssr: false });

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
          <RecentTransactions />
           </Grid>
           <Grid item xs={12} lg={8}>
             <ProductPerformance />
           </Grid>
           <Grid item xs={12}>
             {/* <Blog /> */}
           </Grid>
        </Grid>
      </Box>
    </PageContainer>
  )
}

export default Dashboard;
