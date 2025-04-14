"use client";

import { Button, Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
interface Account {
  id: number; // number in the DB
  name: string;
  account_type: string;
  balance: number;
}
const OpenSavingsAccountPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleOpenSavingsAccount = async () => {
    try {
      const response = await fetch("/api/user/open-savings", { method: "POST" });
      const data = await response.json();

      if (data.success) {
        // Redirect the user to their overview page after creating the savings account
        router.push("/overview");
      } else {
        alert("Error opening savings account");
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Please log in</div>;

  return (
    <Box>
      <Typography variant="h4">Open Savings Account</Typography>
      <Button
        variant="contained"
        onClick={handleOpenSavingsAccount}
        style={{ marginTop: "20px" }}
      >
        Open Savings Account
      </Button>
    </Box>
  );
};

export default OpenSavingsAccountPage;
