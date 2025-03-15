'use client';
import { Typography, Box, Grid, CardContent } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import BlankCard from '../../components/shared/BlankCard';
import MonthlyEarnings from "../../components/overview/MonthlyEarnings";
import { useEffect, useState } from "react";
import { fetchUserBalance } from "../../../api/user"; // Assuming this function fetches the user's balance from the backend
import RecentTransactions from "../../components/overview/RecentTransactions";
import { useSession } from 'next-auth/react'; // Import useSession for session check
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { dark } from '@mui/material/styles/createPalette';

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
    {/* Typography Examples for Chequing */}
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

  <Box p={5}> {/* Adds padding of 2 units around the component */}
    <RecentTransactions />
  </Box>

  </Grid>
</PageContainer>

  );
};

export default ChequingPage;
