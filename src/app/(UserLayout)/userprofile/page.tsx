"use client"; // Mark the component as client-side component

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for client-side routing

const UserProfile = () => {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState<string | null>(null); // State for storing the balance
  const [error, setError] = useState<string | null>(null); // State for any error during the balance fetch

  useEffect(() => {
    if (session) {
      // Fetch balance when the session is available
      const fetchBalance = async () => {
        try {
          const response = await fetch("/api/user/balance");
          const data = await response.json();
          
          if (response.ok) {
            setBalance(data.balance); // Set balance if the response is successful
          } else {
            setError(data.error || "Failed to fetch balance"); // Set error if there is an issue
          }
        } catch (error) {
          setError("Failed to fetch balance"); // Handle any unexpected errors
        }
      };

      fetchBalance(); // Call the function to fetch balance
    }
  }, [session]); // Run this effect when the session changes

  if (status === "loading" || !session) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>Email: {session?.user?.email || "No email"}</p>
      <p>Balance: {balance !== null ? `$${balance}` : "Loading balance..."}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UserProfile;
