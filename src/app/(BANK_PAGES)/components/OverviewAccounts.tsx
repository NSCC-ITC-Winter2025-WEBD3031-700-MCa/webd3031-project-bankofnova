'use client';

import { Grid, Box, Typography, Tabs, Tab, CardContent } from "@mui/material";
import PageContainer from "./container/PageContainer";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUserBalance } from "../../api/user";
import { fetchUserAccounts } from "../../api/accounts";
import MonthlyEarnings from "./MonthlyEarnings";
import {
  IconHome,
  IconCurrencyDollar,
  IconWallet,
} from "@tabler/icons-react";

/* ----------------------------------- */
/* 🔧 Helpers + Components */
/* ----------------------------------- */

// Helper: Mask account number
const maskAccountNumber = (accountNumber: string | null) => {
  if (!accountNumber || accountNumber.length < 4) return '****';
  return '****' + accountNumber.slice(-4);
};

// TabPanel component
interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const AccountTabs = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [chequing, setChequing] = useState<number | null>(null);
  const [savings, setSavings] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [chequingAccountNumber, setChequingAccountNumber] = useState<string | null>(null);
  const [savingsAccountNumber, setSavingsAccountNumber] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      const getBalancesAndAccounts = async () => {
        try {
          const balances = await fetchUserBalance();
          setChequing(balances.chequing || 0);
          setSavings(balances.savings ?? null);

          const accounts = await fetchUserAccounts(session.user.id);
          const chequingAccount = accounts.find((acc: any) => acc.account_type === 'chequing');
          const savingsAccount = accounts.find((acc: any) => acc.account_type === 'savings');

          if (chequingAccount) setChequingAccountNumber(chequingAccount.account_number);
          if (savingsAccount) setSavingsAccountNumber(savingsAccount.account_number);

        } catch (error) {
          console.error('Failed to load account data:', error);
        }
      };
      getBalancesAndAccounts();
    }
  }, [session]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (

    <PageContainer title="Accounts" description="This is your accounts overview">


    <Grid item xs={12} lg={12}>


    <Grid container direction="column" spacing={2}>

<Grid item xs={12}>

      <Typography variant="h2"
       fontWeight={700} 
      mt={3} mb={2}>
        Accounts
      </Typography>

    </Grid>

    </Grid>



      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="account-tabs"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab icon={<IconHome />} label="All" />
        <Tab icon={<IconCurrencyDollar />} label="Spending" />
        {savings !== null && <Tab icon={<IconWallet />} label="Saving" />}
      </Tabs>

      {/* All Accounts */}
      <TabPanel value={selectedTab} index={0}>
        <Grid item xs={12} lg={12} sx={{ marginBottom: 2 }}>
          <MonthlyEarnings
            title={
              <>
                Chequing{' '}
                <Typography component="span" variant="subtitle2" color="textSecondary" fontFamily="monospace">
                  {chequingAccountNumber ? maskAccountNumber(chequingAccountNumber) : ''}
                </Typography>
              </>
            }
            balance={chequing ?? 0}
            link="/accounts/chequing"
          />
        </Grid>

        {savings === null ? (
          <Grid item xs={12} lg={12}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={120}
              border="1px dashed #ccc"
              borderRadius={2}
            >
              <button
                style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}
                onClick={() => router.push('/OpenSavings')}
              >
                Open a Savings Account
              </button>
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12} lg={12}>
            <MonthlyEarnings
              title={
                <>
                  Savings{' '}
                  <Typography component="span" variant="subtitle2" color="textSecondary" fontFamily="monospace">
                    {savingsAccountNumber ? maskAccountNumber(savingsAccountNumber) : ''}
                  </Typography>
                </>
              }
              balance={savings}
              link="/accounts/savings"
              color="#ff5733"
            />
          </Grid>
        )}
      </TabPanel>

      {/* Spending Tab */}
      <TabPanel value={selectedTab} index={1}>
        <Grid item xs={12} lg={12} sx={{ marginBottom: 2 }}>
          <MonthlyEarnings
            title={
              <>
                Chequing{' '}
                <Typography component="span" variant="subtitle2" color="textSecondary" fontFamily="monospace">
                  {chequingAccountNumber ? maskAccountNumber(chequingAccountNumber) : ''}
                </Typography>
              </>
            }
            balance={chequing ?? 0}
            link="/accounts/chequing"
          />
        </Grid>
      </TabPanel>

      {/* Savings Tab */}
      {savings !== null && (
        <TabPanel value={selectedTab} index={2}>
          <Grid item xs={12} lg={12}>
            <MonthlyEarnings
              title={
                <>
                  Savings{' '}
                  <Typography component="span" variant="subtitle2" color="textSecondary" fontFamily="monospace">
                    {savingsAccountNumber ? maskAccountNumber(savingsAccountNumber) : ''}
                  </Typography>
                </>
              }
              balance={savings}
              link="/accounts/savings"
              color="#ff5733"
            />
          </Grid>
        </TabPanel>
      )}
    </Grid>
      </PageContainer>
    
  );
};

export default AccountTabs;