'use client';
import { Typography, Card, Box, Grid, CardContent, Divider,Stack, Chip } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import { useEffect, useState } from "react";
import { fetchUserBalance } from "../../../../api/user"; 
import { useSession } from 'next-auth/react'; // Import useSession for session check
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import TransactionTable from "../../../components/overview/TransactionTable";
import PurchaseCategories from "../../../components/blocks/PurchaseCategories";

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

    {/* <Grid item xs={12}>
      <CardContent>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label="Deposit" color="primary" />
          <Chip label="E-Transfer" color="secondary" />
          <Chip label="Move Money" color="success" />
        </Stack>
      </CardContent>
    </Grid> */}

  </Grid>



    <Grid>
    <TransactionTable accountType="chequing" /> {/* Pass account type as prop */}
    </Grid>


    <Grid>
    <Divider />
    <PurchaseCategories 
    chartSeries={[50, 25, 15, 10]} 
    labels={['Groceries', 'Restaurants', 'Online Shopping', 'Transportation']} 
  />
  </Grid>
  <Grid item xs={12}>
    <CardContent>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Chip label="Groceries" color="primary" />
        <Chip label="Restaurants" color="secondary" />
        <Chip label="Online Shopping" color="success" />
        <Chip label="Transportation" color="error" />
        <Chip label="Entertainment" color="warning" />
        {/* Add more chips as needed */}
      </Stack>
    </CardContent>
  </Grid>


  </PageContainer>

  );
};

export default ChequingPage;
