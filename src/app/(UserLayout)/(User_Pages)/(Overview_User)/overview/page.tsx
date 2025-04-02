"use client";

import { Grid, Box, Typography, Tabs, Tab } from "@mui/material";
import PageContainer from '../../../components/container/PageContainer';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUserBalance } from "../../../../api/user";
import MonthlyEarnings from "../../../components/overview/MonthlyEarnings";
import {
  IconHome,
  IconCurrencyDollar,
  IconWallet, // Alternative to IconPiggyBank
} from "@tabler/icons-react";

// Custom TabPanel component
interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const OverviewPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter(); // For redirection to login page if not authenticated
  const [chequing, setChequing] = useState<number | null>(null);
  const [savings, setSavings] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<number>(0); // To manage the selected tab

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login page
      return; // Prevent further code execution if user is not authenticated
    }

    if (session) {
      const getBalances = async () => {
        try {
          const balances = await fetchUserBalance();
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
  }, [session, status, router]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <PageContainer title="Overview" description="this is OVERVIEW">
      {status === "loading" ? (
        <div>Loading...</div>
      ) : session ? (
        <Box>
          <Typography variant="h1" mt={3} mb={2}>Accounts</Typography>
          
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="account-tabs">
            <Tab 
              icon={<IconHome />} 
              label="All" 
            />
            <Tab 
              icon={<IconCurrencyDollar />} 
              label="Spending" 
            />
            <Tab 
              icon={<IconWallet />} 
              label="Saving" 
            />
          </Tabs>
          
          <TabPanel value={selectedTab} index={0}>
            <Grid item xs={12} lg={8} sx={{ marginBottom: 2 }}>
              <MonthlyEarnings title="Chequing" balance={chequing ?? 0} link="/accounts/chequing" />
            </Grid>
            <Grid item xs={12} lg={8}>
              <MonthlyEarnings title="Savings" balance={savings ?? 0} link="/accounts/savings" color="#ff5733" />
            </Grid>
          </TabPanel>

          <TabPanel value={selectedTab} index={1}>
            <Grid item xs={12} lg={8} sx={{ marginBottom: 2 }}>
              <MonthlyEarnings title="Chequing" balance={chequing ?? 0} link="/accounts/chequing" />
            </Grid>
          </TabPanel>

          <TabPanel value={selectedTab} index={2}>
            <Grid item xs={12} lg={8}>
              <MonthlyEarnings title="Savings" balance={savings ?? 0} link="/accounts/savings" color="#ff5733" />
            </Grid>
          </TabPanel>
        </Box>
      ) : (
        <div>You need to be logged in to view this page.</div>
      )}
    </PageContainer>
  );
};

export default OverviewPage;
