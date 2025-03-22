'use client';
import { Typography, Box, Grid, CardContent } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import { useEffect, useState } from "react";
import { fetchUserBalance } from "../../../../api/user"; // Assuming this function fetches the user's balance from the backend
import { useSession } from 'next-auth/react'; // Import useSession for session check
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
// import RecentTransactions from "../../../components/overview/RecentTransactions";
// import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance';
import ProductPerformance2 from "../../../components/overview/TransactionTable";
import PurchaseCategories from "../../../components/blocks/PurchaseCategories";
// import Traffic from "../../../components/overview/Traffic";

const ChequingPage = () => {
  const { data: session, status } = useSession();
  const [chequingBalance, setChequingBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Hook for navigation

  useEffect(() => {
    // Redirect to login page if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);


  useEffect(() => {
    if (session) {
      // Fetch the Chequing balance from API or state only if the user is authenticated
      const getBalance = async () => {
        try {
          const response = await fetchUserBalance(); // Call without passing the userId
          setChequingBalance(response.chequing); // Set the balance to state
        } catch (error) {
          setError("Failed to fetch balance.");
        }
      };
      
      getBalance();
    }
  }, [session]); // Runs when the session changes
  

  const formatBalance = (balance: number | null) => {
    if (balance === null || isNaN(Number(balance))) {
      return 'Loading...'; // Return loading message if balance is null or invalid
    }
    return `$${Number(balance).toFixed(2)}`; // Ensure balance is a number before using toFixed()
  };

  return (
<PageContainer title="Chequing" description="This is your Chequing account overview">
  {/* Make sure the Grid container has correct props  bgcolor={"black"}*/}
  <Grid container direction="column" spacing={2}>
 
    <Grid item xs={12}>
      <CardContent>
        <Typography variant="h2">Chequing</Typography>
        <Typography variant="body1" color="textSecondary">
          Chequing Account
        </Typography>
      </CardContent>
    </Grid>

    {/* Chequing Balance Display */}
    <Grid item xs={12}>
      <CardContent>
        <Typography variant="h1" fontWeight="700">{formatBalance(chequingBalance)}</Typography>
        {error && <Typography variant="body2" color="error">{error}</Typography>}
        <Typography variant="body1" color="textSecondary">Current Balance</Typography>
      </CardContent>
    </Grid>

    
  </Grid>
  <Grid>
  <PurchaseCategories 
  chartSeries={[50, 25, 15, 10]} 
  labels={['Groceries', 'Restaurants', 'Online Shopping', 'Transportation']} 
/>
</Grid>
  <Grid>
              <ProductPerformance2 />
            </Grid>
            {/* <Grid>
              <LatestOrders />
            </Grid> */}
    

    
            {/* <Grid>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid>

      <Grid>
      <PurchaseCategories 
  chartSeries={[50, 25, 15, 10]} 
  labels={['Groceries', 'Restaurants', 'Online Shopping', 'Transportation']} 
/>      </Grid> */}

    </PageContainer>

  );
};

export default ChequingPage;
