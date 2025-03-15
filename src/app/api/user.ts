export async function fetchUserBalance() {
  const response = await fetch("/api/user/balance");

  if (!response.ok) {
    throw new Error("Failed to fetch balance");
  }

  const data = await response.json();

  // Ensure the response has the expected structure before returning balances
  if (data && data.balances) {
    return data.balances; // Return balances if available
  } else {
    return { chequing: 0, savings: 0 }; // Default empty balances if not found
  }
}

// Corrected fetchAccountByAccountNumber function
// Assuming this function fetches the account from the database based on account number and account type
export async function fetchAccountByAccountNumber(accountNumber: string, accountType: string) {
  try {
    const response = await fetch(`/api/getBankAccount?accountNumber=${accountNumber}&accountType=${accountType}`);
    if (!response.ok) {
      throw new Error("Failed to fetch account information");
    }
    const account = await response.json();
    return account; // Return the account data
  } catch (error) {
    console.error("Error fetching account:", error);
    throw error; // Rethrow the error to be caught in the onAccountChange function
  }
}

