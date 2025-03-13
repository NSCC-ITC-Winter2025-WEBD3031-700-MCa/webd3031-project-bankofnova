'use client'; // Marking the component as a client component

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Typography, Button, TextField, MenuItem } from "@mui/material";
import { useSession } from "next-auth/react";
import { fetchUserBalance } from "../../../../api/user"; // Assuming this function is available for balance fetching
import { useRouter } from "next/navigation";

export default function ConfirmTransactionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [to, setTo] = useState<string | null>(null);
  const [account, setAccount] = useState<string>(""); // Ensure initial state is a string, not null
  const [chequingBalance, setChequingBalance] = useState<number | null>(null);
  const [savingsBalance, setSavingsBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    // Access the searchParams directly to get query parameters
    const params = new URLSearchParams(window.location.search);
    const accountFromQuery = params.get('account') || ""; // Fallback to empty string
    setTo(params.get('to'));
    
    // Set account to query param if available, matching with the `id`
    setAccount(accountFromQuery === "chequing" || accountFromQuery === "savings" ? accountFromQuery : ""); // Ensure it's either 'chequing' or 'savings'

    // Check if user is authenticated
    if (session) {
      const getBalances = async () => {
        setIsLoading(true);
        try {
          const balances = await fetchUserBalance(); // Ensure this is correct
          console.log("Fetched Balances:", balances);
          setChequingBalance(balances.chequing || 0);
          setSavingsBalance(balances.savings || 0);
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("An unknown error occurred");
          }
        } finally {
          setIsLoading(false);
        }
      };

      getBalances();
    } else {
      router.push("/login");
    }
  }, [session, router]);

  useEffect(() => {
    if (account) {
      // Ensuring the "fromAccount" field is updated with the correct account id
      setValue("fromAccount", account); // Set the form value when `account` changes
    }
  }, [account, setValue]);

  // Dynamically creating accounts based on fetched balances
  const accounts = [
    { id: "chequing", name: "Chequing Account", balance: chequingBalance ?? 0 },
    { id: "savings", name: "Savings Account", balance: savingsBalance ?? 0 },
  ];

  const onSubmit = (data: any) => {
    // Handle the form submission logic here
    console.log(data);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 3, borderRadius: 2, boxShadow: 3, bgcolor: "white" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Transaction Confirmation
      </Typography>
      
      <Typography variant="body2" color="textSecondary" mb={2}>
        Please review the details of your transfer.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: 2 }}>
          <Controller
            name="fromAccount"
            control={control}
            defaultValue={account} // Default value here instead of value
            rules={{ required: "Please select an account" }}
            render={({ field }) => (
              <TextField
                {...field} // spread the field props here
                fullWidth
                select
                label="From Account"
                error={!!errors.fromAccount}
                helperText={errors.fromAccount ? (errors.fromAccount.message as string) : ""}
                margin="normal"
              >
                {accounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Typography>{account.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        ${Number(account.balance).toFixed(2)}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <TextField
            fullWidth
            label="Recipient"
            value={to || "N/A"}
            InputProps={{
              readOnly: true,
            }}
            margin="normal"
          />

          {/* Amount Field with validation */}
          <Controller
            name="amount"
            control={control}
            rules={{ required: "Amount is required", min: { value: 0.01, message: "Amount must be greater than zero" } }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                label="Amount"
                error={!!errors.amount}
                helperText={errors.amount ? (errors.amount.message as string) : ""}
                margin="normal"
              />
            )}
          />
        </Box>

        <Box display="flex" gap={2}>
          <Button variant="outlined" color="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Confirm Transfer
          </Button>
        </Box>
      </form>
    </Box>
  );
}
