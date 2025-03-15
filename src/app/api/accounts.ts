export async function fetchUserAccounts(userId: string) {
    try {
        const response = await fetch(`/api/user/accounts?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`Error fetching accounts: ${response.statusText}`);
        }
  
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch user accounts:", error);
      return null;
    }
  }
  