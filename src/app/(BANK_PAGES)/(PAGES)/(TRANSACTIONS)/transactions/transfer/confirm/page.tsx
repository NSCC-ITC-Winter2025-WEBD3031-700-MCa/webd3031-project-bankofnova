"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Typography, Button, TextField, MenuItem, Card, Grid } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchUserAccounts } from "../../../../../../api/accounts";
import { fetchUserBalance } from "../../../../../../api/user";
import { useTransferContext } from "../../../../../../context/TransferContext";
import PageContainer from "../../../../../components/container/PageContainer";

interface Account {
  id: string;
  account_number: string; // ✅ Add this

  name: string;
  account_type: string;
  balance: number;
}

type FormValues = {
  fromAccount: string;
  amount: string;
};

export default function ConfirmTransactionPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // const { transferData } = useTransferContext();
  const { transferData, setTransferData } = useTransferContext();
  const recipientAccountId = transferData.receiverAccount;
  const recipientEmail = transferData.toContact || "Loading...";
  const senderAccountId = transferData.fromAccount; // ✅ Now from context

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
    defaultValues: {
      fromAccount: "",
      amount: "",
    },
  });

  useEffect(() => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    const loadAccounts = async () => {
      setIsLoading(true);
      try {
        const userAccounts = await fetchUserAccounts(session.user.id);
        const balances = await fetchUserBalance();
    
        const accountsWithBalance: Account[] = userAccounts.map((account: Account) => ({
          ...account,
          balance: balances[account.account_type as 'chequing' | 'savings']
            ? parseFloat(balances[account.account_type as 'chequing' | 'savings'].replace(/,/g, ''))
            : 0,
        }));
    
        console.log("Accounts with Balance:", accountsWithBalance);
    
        const sortedAccounts = accountsWithBalance.sort((a, b) => {
          if (a.account_type === 'chequing' && b.account_type !== 'chequing') return -1;
          if (a.account_type !== 'chequing' && b.account_type === 'chequing') return 1;
          return 0;
        });
    
        setAccounts(sortedAccounts);
    
        // ✅ Autofill selected account from context
        if (sortedAccounts.length > 0 && senderAccountId) {
          const validAccount = sortedAccounts.find(
            (account: Account) => account.id === senderAccountId
          );
    
          if (validAccount) {
            setValue("fromAccount", validAccount.id);
          } else {
            // Optional fallback: set first account
            setValue("fromAccount", sortedAccounts[0].id);
          }
        }
    
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAccounts();
  }, [session, router, setValue, senderAccountId]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (!session?.user?.id) {
        throw new Error("User is not logged in.");
      }

      setIsLoading(true);
      setError(null);
      console.log("Transfer Data Context:", transferData);

      if (!recipientAccountId) {
        throw new Error("Receiver bank account ID is missing or invalid.");
      }

      const transferRequestData = {
        sender_account_id: Number(data.fromAccount),
        receiver_account_id: recipientAccountId,
        amount: Number(data.amount),
        sender_user_id: Number(session.user.id),
      };

      const response = await fetch("/api/user/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transferRequestData),
      });


      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Transaction failed.");
      }
      


      const selectedAccount = accounts.find(acc => acc.id === data.fromAccount);


      // ✅ Set transfer details in context
      setTransferData({
        ...transferData,
        amount: transferRequestData.amount,
        date: new Date().toISOString(),
        status: result.transaction?.status || 'completed',
        transactionId: result.transaction?.id || undefined,
        senderAccountType: selectedAccount?.account_type || 'N/A',
        senderAccountNumber: selectedAccount?.account_number ? Number(selectedAccount.account_number) : undefined,
        recipientName: transferData.recipientName || 'Recipient',
        recipientEmail: transferData.toContact,
        transactionType: 'Transfer',
      });
      
      
      // ✅ Then navigate to success page
      router.push("/success");

    } catch (error) {
      setError(error instanceof Error ? error.message : "Transaction failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
            <PageContainer title="TransferConfirm" description="this is Tansfer confirmation page">
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

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Transaction Confirmation
      </Typography>

      <Typography variant="body2" color="textSecondary" mb={2}>
        Please review the details of your transfer.
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: 2 }}>
          {/* ✅ From Account Dropdown */}
          <Controller
            name="fromAccount"
            control={control}
            rules={{ required: "Please select an account" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="From Account"
                error={!!errors.fromAccount}
                helperText={errors.fromAccount?.message as string}
                margin="normal"
                disabled={isLoading || accounts.length === 0}
              >
                {accounts.length > 0 ? (
                  accounts.map((acc) => (
                    <MenuItem
                    key={acc.id}
                    value={acc.id}
                    disabled={acc.account_type === 'savings' && acc.balance === 0}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Typography>{acc.account_type}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        ${acc.balance && !isNaN(acc.balance)
                          ? acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : "0.00"}
                      </Typography>
                    </Box>
                  </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No accounts available</MenuItem>
                )}
              </TextField>
            )}
          />

          {/* Recipient Email (Read-only) */}
{/* Recipient Details */}
<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
  <TextField
    fullWidth
    label="Recipient Name"
    value={transferData.recipientName || 'Loading...'}
    InputProps={{ readOnly: true }}
    margin="normal"
  />
  <TextField
    fullWidth
    label="Recipient Email"
    value={recipientEmail}
    InputProps={{ readOnly: true }}
    margin="normal"
  />
</Box>


          {/* Amount Field */}
          <Controller
            name="amount"
            control={control}
            rules={{
              required: "Amount is required",
              min: { value: 0.01, message: "Amount must be greater than zero" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                label="Amount"
                error={!!errors.amount}
                helperText={errors.amount?.message as string}
                margin="normal"
                InputProps={{
                  inputProps: { min: 0.01, step: 0.01 },
                }}
              />
            )}
          />
        </Box>

        <Box display="flex" gap={2}>
          <Button variant="outlined" color="inherit" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Confirm Transfer"}
          </Button>
        </Box>
      </form>




      
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
