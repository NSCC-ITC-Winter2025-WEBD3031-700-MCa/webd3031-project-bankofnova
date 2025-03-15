'use client';
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Typography, Button, TextField, MenuItem } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchUserAccounts } from "../../../../api/accounts";

interface Account {
  id: string;
  name: string;
  account_type: string;
  balance: number;
}

export default function ConfirmTransactionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const recipientAccountId = parseInt(searchParams.get("receiverAccount") || "0", 10);
  const senderAccountId = parseInt(searchParams.get("account") || "0", 10);
  
  console.log("Recipient Account ID:", recipientAccountId);
  console.log("Sender Account ID:", senderAccountId);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    const loadAccounts = async () => {
      setIsLoading(true);
      try {
        const userAccounts = await fetchUserAccounts(session.user.id);
        console.log("Fetched Accounts:", userAccounts);
        setAccounts(userAccounts);
    
        // Set the default sender account
        if (userAccounts.length > 0) {
          setValue("fromAccount", userAccounts[0].id);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, [session, router, setValue]);

  const onSubmit = async (data: any) => {
    try {
      if (!session?.user?.id) {
        throw new Error("User is not logged in.");
      }
      
      setIsLoading(true);
      setError(null);

      if (!recipientAccountId || isNaN(Number(recipientAccountId))) {
        throw new Error("Receiver bank account ID is missing or invalid.");
      }

      const transferData = {
        sender_account_id: Number(data.fromAccount),
        receiver_account_id: Number(recipientAccountId),
        amount: Number(data.amount),
        sender_user_id: Number(session.user.id),
      };

      console.log("Sending Transfer Data:", transferData);

      const response = await fetch("/api/user/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transferData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Transaction failed.");
      }

      console.log("Transfer successful:", result);
      router.push("/success"); // Redirect to success page

    } catch (error) {
      setError(error instanceof Error ? error.message : "Transaction failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 3, borderRadius: 2, boxShadow: 3, bgcolor: "white" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Transaction Confirmation
      </Typography>

      <Typography variant="body2" color="textSecondary" mb={2}>
        Please review the details of your transfer.
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: 2 }}>
          {/* From Account Dropdown */}
          <Controller
            name="fromAccount"
            control={control}
            defaultValue=""
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
              >
                {/* Ensure accounts is an array before mapping */}
                {Array.isArray(accounts) && accounts.length > 0 ? (
                  accounts.map((acc) => (
                    <MenuItem key={acc.id} value={acc.id}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <Typography>{acc.name} ({acc.account_type})</Typography>
                        <Typography variant="body2" color="textSecondary">
                          ${Number(acc.balance || 0).toFixed(2)}  {/* Ensure it's a number */}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No accounts available</MenuItem> // Fallback UI if no accounts are available
                )}
              </TextField>
            )}
          />

          {/* Recipient Field (Read-Only) */}
          <TextField
            fullWidth
            label="Recipient Account ID"
            value={recipientAccountId || "Loading..."} // Directly show the recipient ID
            InputProps={{ readOnly: true }}
            margin="normal"
          />

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
                value={field.value || ""}
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
          <Button variant="outlined" color="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Confirm Transfer"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
