"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Typography, Box, MenuItem, Grid, Card } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { fetchUserBalance } from "../../../../../api/user";
import { fetchUserAccounts } from "../../../../../api/accounts";
import { useTransferContext } from "../../../../../context/TransferContext";
import PageContainer from "../../../../components/container/PageContainer";


interface Account {
  id: string;
  
  name: string;
  account_type: string;
  balance: number;
}

export default function TransferPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: { toContact: "", fromAccount: "" },
  });

  const { setTransferData } = useTransferContext();
  const [isRecipientLoading, setIsRecipientLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<any | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);

  // ✅ New state for accounts (fetched from DB)
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (session?.user?.id) {
      const loadAccounts = async () => {
        setIsLoading(true);
        try {
          const userAccounts = await fetchUserAccounts(session.user.id);
          const balances = await fetchUserBalance();

          const accountsWithBalance = userAccounts.map((account: any) => ({
            ...account,
            balance: balances[account.account_type as 'chequing' | 'savings']
              ? parseFloat(balances[account.account_type as 'chequing' | 'savings'].replace(/,/g, ''))
              : 0,
          }));

          console.log("Fetched accounts with balance:", accountsWithBalance);

          const sortedAccounts = accountsWithBalance.sort((a: Account, b: Account) => {
            if (a.account_type === 'chequing' && b.account_type !== 'chequing') return -1;
            if (a.account_type !== 'chequing' && b.account_type === 'chequing') return 1;
            return 0;
          });
          
          setAccounts(sortedAccounts);

          // Optional: Autofill first account
          if (accountsWithBalance.length > 0) {
            setValue("fromAccount", accountsWithBalance[0].id);
          }
        } catch (error) {
          console.error("Error loading accounts:", error);
          setError("Failed to load accounts");
        } finally {
          setIsLoading(false);
        }
      };

      loadAccounts();
    }
  }, [session, status, router, setValue]);

  const fetchRecipient = async (email: string) => {
    if (email.length < 3) return;
  
    if (session?.user?.email === email) {
      setContactError("You cannot transfer to your own email.");
      setRecipient(null);
      return;
    }
  
    setIsRecipientLoading(true);
    try {
      const response = await fetch(`/api/user/contacts?email=${email}`);
      if (!response.ok) {
        throw new Error("Recipient not found.");
      }
      const contactData = await response.json();
  
      setRecipient(contactData.user);
      setContactError(null);
  
      // ✅ Now inside the try block where contactData is available
      setTransferData(prev => ({
        ...prev,
        recipientName: contactData.user.name,
        recipientEmail: contactData.user.email,
      }));
    } catch (error) {
      setContactError("Recipient not found or error occurred.");
      setRecipient(null);
    } finally {
      setIsRecipientLoading(false);
    }
  };
  

  const handleRecipientBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value.trim();
    if (email) {
      fetchRecipient(email);
    }
  };

  const onSubmit = async (data: any) => {
    if (isRecipientLoading) {
      console.log("Waiting for recipient data...");
      return;
    }
  
    if (!recipient) {
      console.error("Recipient not found. Please check the email.");
      return;
    }
  
    const selectedAccount = accounts.find(account => account.id === data.fromAccount);
  
    if (selectedAccount) {
      const recipientAccount = recipient.bankAccounts.find((account: any) => account.account_type === 'chequing');
  
      if (recipientAccount) {
        setTransferData(prev => ({
          ...prev,
          toContact: data.toContact,
          fromAccount: selectedAccount.id,
          receiverAccount: recipientAccount.id,
        }));
  
        console.log("Transfer data:", {
          toContact: data.toContact,
          fromAccount: selectedAccount.id,
          receiverAccount: recipientAccount.id,
        });
  
        router.push(`/transactions/transfer/confirm`);
      } else {
        console.error("Recipient does not have a chequing account.");
      }
    } else {
      console.error("Sender's account not found.");
    }
  };
  
  return (
        <PageContainer title="Transfer" description="this is Tansfer page">
              <Card
                elevation={0}
                sx={{
                  p: 2,
                  zIndex: 1,
                  width: "100%",
                  marginTop: '15px',
                  boxShadow: 'none !important',
                  border: '1px solid #cdcdcd !important',
                  paddingBottom: '25px',
                  // Adding responsive styles for different breakpoints
                  "@media (max-width:600px)": {
                    p: 4, // Less padding for small screens (phones)
                    marginBottom: '25px',
                    marginLeft: "auto",
                    marginRight: "auto",                  
                  },
                  "@media (max-width:960px)": {
                    p: 0, // Adjust padding for medium-sized screens (tablets)
                  },
                  "@media (min-width:960px)": {
                    width: "90%", // Keep the card width at 80% for medium to larger screens
                    marginLeft: "auto",
                    marginRight: "auto",
                  },
                  "@media (max-width:1044px)": {
                    p: 4, // Adjust padding for medium-sized screens (tablets)
                  },
                  
                }}
              >

    <Box sx={{ flexGrow: 1,  p: 2}}>
      <Grid container spacing={2}>
        {/* Left Column: Form */}
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: 500, p: 3, borderRadius: 2 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Transfer to someone else
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={3} mt={2}>
            Enter the details for your Transfer transactions
            </Typography>

            <Box  mb={3} mt={1}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => router.push("/transactions/transfer/contact")}
              >
                Add Contact
              </Button>
            </Box>

            {isLoading ? (
              <div>Loading balances...</div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* FROM Account */}
                <Controller
                  name="fromAccount"
                  control={control}
                  rules={{ required: "Please select an account" }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="From Account"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      margin="normal"
                    >
   {accounts.map((account) => (
  <MenuItem
    key={account.id}
    value={account.id}
    disabled={account.account_type === 'savings' && account.balance === 0}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
      <Typography>{account.account_type}</Typography>
      <Typography variant="body2" color="textSecondary">
        ${account.balance && !isNaN(account.balance)
          ? account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : "0.00"}
      </Typography>
    </Box>
  </MenuItem>
))}

                    </TextField>
                  )}
                />

                {/* TO Contact (Email input) */}
                <Controller
                  name="toContact"
                  control={control}
                  rules={{
                    required: "Please enter a recipient email",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Please enter a valid email address",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Recipient Email"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      margin="normal"
                      onBlur={handleRecipientBlur}
                    />
                  )}
                />

                {/* Display recipient error if applicable */}
                {contactError && (
                  <Typography variant="body2" color="error" mt={2}>
                    {contactError}
                  </Typography>
                )}

                {/* Buttons */}
                <Box mt={6} display="flex" gap={2}>
                  <Button fullWidth variant="outlined" color="inherit" onClick={() => router.push(`/overview`)}>
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isRecipientLoading || !recipient}
                  >
                    Next
                  </Button>
                </Box>
              </form>
            )}
          </Box>
        </Grid>

        {/* Right Column: Empty */}
        <Grid item xs={12} md={6}></Grid>
      </Grid>
    </Box>
    </Card>
        </PageContainer>
    
  );
}
