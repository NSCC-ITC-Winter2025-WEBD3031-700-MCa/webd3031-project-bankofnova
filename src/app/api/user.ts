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

// api/user.ts (or wherever your API calls are managed)

export const fetchTransactions = async (accountType: 'chequing' | 'savings') => {
  try {
    const response = await fetch(`/api/user/transactionhistory?accountType=${accountType}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch transactions');
    }

    return data.transactions; // Return the transaction data
  } catch (error: unknown) {
    // Type assertion to check if error is an instance of Error
    if (error instanceof Error) {
      console.error("Error fetching transactions:", error.message);
      throw new Error(error.message || 'An error occurred while fetching transactions');
    } else {
      // In case the error is not an instance of Error, handle it gracefully
      console.error("Unknown error occurred:", error);
      throw new Error('An unknown error occurred while fetching transactions');
    }
  }
};
