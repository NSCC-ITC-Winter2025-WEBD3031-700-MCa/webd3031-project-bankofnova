"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Grid,
  Box,
  Typography,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Slider,
} from "@mui/material";
import PageContainer from "../../../../components/container/PageContainer";
import { Employer } from "../../../../../../lib/types";
// import { fetchUserBalance } from "../../../../api/user";

const Transaction = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<"chequing" | "savings">("chequing");
  const [employers, setEmployers] = useState<Employer[]>([]);

  const [selectedEmployers, setSelectedEmployers] = useState<number[]>([]);

  const [todayDate, setTodayDate] = useState<string>("");

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US"); // Format as MM/DD/YYYY
    setTodayDate(formattedDate);
  }, []);

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const response = await fetch("/api/user/employerWithLimit");
        if (!response.ok) throw new Error("Failed to fetch employers");
        const data = await response.json();
  
        console.log("API Response:", data);
  
        // Map the data to include withdrawalLimit and fallback to balance if it's missing
        const employersWithLimits = data
          .map((employer: { id: number; withdrawal_limit: string | null; balance: string }) => ({
            ...employer,
            withdrawalLimit: employer.withdrawal_limit ? parseFloat(employer.withdrawal_limit) : parseFloat(employer.balance),
            sliderValue: employer.withdrawal_limit ? parseFloat(employer.withdrawal_limit) : parseFloat(employer.balance),
          }))
          .filter(
            (value: { id: number }, index: number, self: { id: number }[]) =>
              index === self.findIndex((t: { id: number }) => t.id === value.id)  // Remove duplicates based on `id`
          );
  
        console.log("Fetched Employers:", employersWithLimits);
  
        setEmployers(employersWithLimits);
      } catch (err) {
        setError("Failed to fetch employers");
      }
    };
  
    fetchEmployers();
  }, []);
  
  

  const handleDeposit = async (
    accountType: "chequing" | "savings",
    employerId: string | null,
    depositAmount: string
  ) => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Invalid amount");
      return;
    }
  
    const employer = employers.find((e) => e.id.toString() === employerId);
    if (employer && amount > employer.withdrawalLimit) {
      setError("Amount exceeds withdrawal limit");
      return;
    }
  
    const roundedAmount = (Math.round(amount * 100) / 100).toFixed(2);
    setError(null);
    setMessage(null);
  
    try {
      const response = await fetch("/api/user/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: roundedAmount,
          accountType,
          employerId,
          sender_account_id: employerId || null, // fallback to null
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setMessage("Deposit successful!");
        router.push("/overview");
      } else {
        throw new Error(data.error || "Deposit failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deposit request failed");
    }
  };
  

  const handleCheckboxToggle = (id: number) => {
    setSelectedEmployers((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const totalSelectedAmount = employers
  .filter((e) => selectedEmployers.includes(e.id))
  .reduce((sum, e) => {
    const amount = Number(e.sliderValue);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);


  const handleSliderChange = (employerId: number, newValue: number) => {
    setEmployers((prevEmployers) =>
      prevEmployers.map((employer) =>
        employer.id === employerId ? { ...employer, sliderValue: newValue } : employer
      )
    );
  };

  const handleBulkDeposit = async () => {
    for (const employer of employers) {
      if (selectedEmployers.includes(employer.id)) {
        await handleDeposit(
          selectedAccount,
          employer.id.toString(),
          (employer.sliderValue ?? 100).toString()
        );
      }
    }
  };

  const handleEmployerClick = (employerId: number) => {
    router.push(`/employer/${employerId}`);
  };

  return (
    <PageContainer title="Deposit" description="This is your Deposit page">
      <Card
        elevation={0}
        sx={{
          p: 2,
          width: "100%",
          mt: "45px",
          mb: "35px",
          "@media (min-width:960px)": {
            width: "90%",
            mx: "auto",
          },
        }}
      >
        {status === "loading" ? (
          <div>Loading...</div>
        ) : session ? (
          <Box>
            <Grid container spacing={2} sx={{ mb: 6 }}>
              <Grid item xs={12}>
                <CardContent>
                  <Typography variant="h2">Deposit</Typography>
                </CardContent>
              </Grid>

              {/* Account Type Select */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ maxWidth: "320px" }}>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value as "chequing" | "savings")}
                    label="Account Type"
                  >
                    <MenuItem value="chequing">Chequing</MenuItem>
                    <MenuItem value="savings">Savings</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Selected Total */}
              <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {selectedEmployers.length > 0 && (
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontWeight: 600 }}>AMOUNT</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: '2rem' }}>
                      ${totalSelectedAmount.toFixed(2)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Button
  variant="outlined"
  color="primary"
  onClick={() => router.push("/EmployerSettings")}
  sx={{ mb: 2 }}
>
  Go to Employer Settings
</Button>
            {/* Employers Table */}
            {employers.length > 0 ? (
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table>
                <TableHead>
  <TableRow>
    <TableCell />
    <TableCell>Employer Name</TableCell>
    <TableCell>Deposit Date</TableCell> {/* New column for Date */}
    <TableCell align="right">Payment</TableCell>
    <TableCell align="right">Amount</TableCell>
  </TableRow>
</TableHead>

<TableBody>
  {employers.map((employer) => {
    // Use the slider value (if available) or fallback to withdrawal limit
    const employerAmount = employer.sliderValue ?? employer.withdrawalLimit;

    return (
      <TableRow key={employer.id}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedEmployers.includes(employer.id)}
            onChange={() => handleCheckboxToggle(employer.id)}
          />
        </TableCell>
        <TableCell>
          <Button onClick={() => handleEmployerClick(employer.id)}>
            {employer.name}
          </Button>
        </TableCell>
        <TableCell>{todayDate}</TableCell> {/* Date */}
        <TableCell align="right">
          <Slider
            value={employerAmount}  // Use the employerAmount as slider value
            onChange={(e, newValue) => handleSliderChange(employer.id, newValue as number)}
            min={50}  // Min value (can be adjusted based on requirements)
            max={employer.withdrawalLimit}  // Set max value based on withdrawal limit
            step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `$${value.toFixed(2)}`}
          />
        </TableCell>
        <TableCell align="right">
          ${Number(employerAmount).toFixed(2)}
        </TableCell>
      </TableRow>
    );
  })}
</TableBody>



                </Table>
              </TableContainer>
            ) : (
              <Typography>No employers available for deposit.</Typography>
            )}

            {/* Bulk Deposit Button */}
            <Button
              variant="contained"
              color="success"
              onClick={handleBulkDeposit}
              sx={{ mb: 2 }}
            >
              Deposit from Selected Employers
            </Button>

            {message && <Typography color="success.main">{message}</Typography>}
            {error && <Typography color="error.main">{error}</Typography>}
          </Box>
        ) : (
          <div>You need to be logged in to view this page.</div>
        )}
      </Card>
    </PageContainer>
  );
};

export default Transaction;
