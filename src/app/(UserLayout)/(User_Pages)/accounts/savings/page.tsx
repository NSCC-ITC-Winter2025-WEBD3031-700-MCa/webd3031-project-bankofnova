'use client';
import { Typography, Grid, CardContent } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import { useEffect, useState } from "react";
import { fetchUserBalance } from "../../../../api/user"; 
import { useSession } from 'next-auth/react'; // Import useSession for session check
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import TransactionTable from "../../../components/overview/TransactionTable";

const SavingsPage = () => {
  const { data: session, status } = useSession();
  const [savingsBalance, setSavingsBalance] = useState<number | null>(null);
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
          setSavingsBalance(response.savings); // Set the balance to state
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
    <PageContainer title="Savings" description="This is your Savings account overview">
      {/* Make sure the Grid container has correct props  bgcolor={"black"}*/}
      <Grid container direction="column" spacing={2}>
     
        <Grid item xs={12}>
          <CardContent>
            <Typography variant="h2">Savings</Typography>
            <Typography variant="body1" color="textSecondary">
              Chequing Account
            </Typography>
          </CardContent>
        </Grid>
            {/* Savings Balance Display */}
        {/* Balance Display */}
        <Grid item sm={12}>
                <CardContent>
                  <Typography variant="h1" fontWeight="700">{formatBalance(savingsBalance)}</Typography>
                  {error && <Typography variant="body2" color="error">{error}</Typography>}
                  <Typography variant="body1" color="textSecondary">Current Balance</Typography>
                </CardContent>
            </Grid>
      </Grid>

      <Grid>
    <TransactionTable accountType="savings" /> {/* Pass account type as prop */}
    </Grid>

    </PageContainer>
  );
};

export default SavingsPage;
