"use client"; 

import { Grid, Box, Typography, CardContent } from "@mui/material";
import PageContainer from '../../../components/container/PageContainer';
// import DashboardCard from '../components/shared/DashboardCard';
// import BlankCard from '../components/shared/BlankCard';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchUserBalance } from "../../../../api/user";
import MonthlyEarnings from "../../../components/overview/MonthlyEarnings";

// import RecentTransactions from "../components/overview/RecentTransactions";

const OverviewPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter(); // For redirection to login page if not authenticated
  const [chequing, setChequing] = useState<number | null>(null);
  const [savings, setSavings] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login page
      return; // Prevent further code execution if user is not authenticated
    }

    if (session) {
      const getBalances = async () => {
        try {
          // Pass the user ID from the session to the fetchUserBalance function
          const balances = await fetchUserBalance(); // Call without passing the userId
          // ../../api/user.ts
          setChequing(balances.chequing || 0);  
          setSavings(balances.savings || 0);
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("An unknown error occurred");
          }
        }
      };
      getBalances();
    }
  }, [session, status, router]); // Including router and status in dependency array
   // Including router and status in dependency array

  return (
    <PageContainer title="Overview" description="this is OVERVIEW">
      {status === "loading" ? (
        <div>Loading...</div>
      ) : session ? (
        <Box>
          <Typography variant="h1">Accounts</Typography>
   
          <Grid item xs={12} lg={8}  sx={{marginBottom: 2}}>
          
          <MonthlyEarnings title="Chequing" balance={chequing ?? 0} link="/accounts/chequing"/>
          </Grid>
          <Grid item xs={12} lg={8}>

          <MonthlyEarnings title="Savings" balance={savings ?? 0} link="/accounts/savings" color="#ff5733" />
          </Grid>
        
          
        </Box>
      ) : (
        <div>You need to be logged in to view this page.</div>
      )}
    </PageContainer>
  );
};

export default OverviewPage;
