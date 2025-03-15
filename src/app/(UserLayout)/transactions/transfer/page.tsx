'use client'; // This makes the component a Client Component

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, MenuItem, Typography, Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchUserBalance } from "../../../api/user"; // Assuming this function is available for balance fetching

export default function TransferPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { handleSubmit, control } = useForm({
    defaultValues: { toContact: "", fromAccount: "" },
  });

  const [chequingBalance, setChequingBalance] = useState<number | null>(null);
  const [savingsBalance, setSavingsBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<any[]>([]); // This will hold the fetched contacts

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (session) {
      const getBalances = async () => {
        setIsLoading(true);
        try {
          const balances = await fetchUserBalance();
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

      const getContacts = async () => {
        try {
          const response = await fetch('/api/user/contacts');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Fetched Contacts:", data); // Ensure contacts now include bank accounts
          setContacts(data.users); // Ensure 'users' contains the bank account details
        } catch (error) {
          console.error('Error fetching contacts:', error);
        }
      };
      

      getBalances();
      getContacts(); // Fetch contacts as well
    }
  }, [session, status, router]);

  const accounts = [
    { id: "1", name: "Chequing Account", balance: chequingBalance ?? 0 },
    { id: "2", name: "Savings Account", balance: savingsBalance ?? 0 },
  ];
  
  const onSubmit = (data: any) => {
    const selectedContact = contacts.find(contact => contact.id === data.toContact);
    const selectedAccount = accounts.find(account => account.id === data.fromAccount);
  
    if (selectedContact && selectedAccount) {
      // Find the correct bank account for the recipient
      const recipientAccount = selectedContact.bankAccounts.find((account: any) => account.account_type === 'chequing');
  
      if (recipientAccount) {
        const receiverAccountId = recipientAccount.id;  // This is the recipient's bank account ID
        console.log("Recipient Bank Account ID:", receiverAccountId);
  
        // Proceed with the transfer logic, using receiverAccountId (which is the bank account ID)
        router.push(`/transactions/transfer/confirm?to=${selectedContact.id}&account=${selectedAccount.id}&email=${selectedContact.email}&receiverAccount=${receiverAccountId}`);
      } else {
        console.error("Recipient has no 'chequing' account.");
      }
    } else {
      console.error("Selected contact or account not found.");
    }
  };
  
  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 3, borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Interac e-Transfer
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={2}>
        Select a contact and the account to send money from.
      </Typography>

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
                  <MenuItem key={account.id} value={account.id}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <Typography>{account.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
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
                {Array.isArray(contacts) && contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <MenuItem key={contact.id} value={contact.id}>
                      {contact.name} ({contact.email})
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No contacts available</MenuItem>
                )}
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
