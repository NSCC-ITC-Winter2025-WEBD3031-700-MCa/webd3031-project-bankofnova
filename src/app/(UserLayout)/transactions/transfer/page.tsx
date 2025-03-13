"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, MenuItem, Typography, Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchUserBalance } from "../../../api/user"; // Assuming this function is available for balance fetching

const contacts = [
  { id: "1", name: "John Doe", email: "john.doe@email.com" },
  { id: "2", name: "Jane Doe", email: "jane.doe@email.com" },
];

export default function TransferPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { handleSubmit, control, watch } = useForm({
    defaultValues: { toContact: "", fromAccount: "" },
  });

  const [chequingBalance, setChequingBalance] = useState<number | null>(null);
  const [savingsBalance, setSavingsBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (session) {
      const getBalances = async () => {
        setIsLoading(true); // Indicate that we are loading balances
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
          setIsLoading(false); // Set loading to false after fetch
        }
      };

      getBalances();
    }
  }, [session, status, router]);

  const onSubmit = (data: any) => {
    // Find the selected contact and account by ID to pass the name
    const selectedContact = contacts.find(contact => contact.id === data.toContact);
    const selectedAccount = accounts.find(account => account.id === data.fromAccount);
  
    // Ensure both contact and account are found, then push to the next page
    if (selectedContact && selectedAccount) {
      // Pass the account id (chequing or savings) instead of the name
      router.push(`/transactions/transfer/confirm?to=${selectedContact.name}&account=${selectedAccount.id}`);
    } else {
      console.error("Selected contact or account not found.");
    }
  }; // This is the correct closing for the function.
  

  // Dynamically creating accounts based on fetched balances
  const accounts = [
    { id: "chequing", name: "Chequing Account", balance: chequingBalance ?? 0 },
    { id: "savings", name: "Savings Account", balance: savingsBalance ?? 0 },
  ];

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 3, borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Interac e-Transfer
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={2}>
        Select a contact and the account to send money from.
      </Typography>

      {isLoading ? (
        <div>Loading balances...</div> // Loading state while fetching balances
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
                  <MenuItem key={account.id} value={account.id}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Typography>{account.name}</Typography>
  <Typography variant="body2" color="textSecondary">
  {/* Convert balance to number and check if it's a valid number */}
  ${Number(account.balance) && !isNaN(Number(account.balance)) 
    ? Number(account.balance).toFixed(2) 
    : "0.00"}
</Typography>

                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* TO Contact */}
          <Controller
            name="toContact"
            control={control}
            rules={{ required: "Please select a recipient" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="To"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                margin="normal"
              >
                {contacts.map((contact) => (
                  <MenuItem key={contact.id} value={contact.id}>
                    {contact.name} ({contact.email})
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Buttons */}
          <Box mt={2} display="flex" gap={2}>
            <Button fullWidth variant="outlined" color="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Next
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
}
