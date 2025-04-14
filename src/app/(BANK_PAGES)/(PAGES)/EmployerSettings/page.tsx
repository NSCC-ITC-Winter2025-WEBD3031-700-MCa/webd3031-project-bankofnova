"use client";
import { useState, useEffect } from "react";
import { Button, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, Typography, Box, Card } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

interface Employer {
  id: number;
  name: string;
  withdrawalLimit?: number;
}

const EmployerSettings = () => {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [selectedEmployer, setSelectedEmployer] = useState<number | null>(null);
  const [withdrawalLimit, setWithdrawalLimit] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const response = await fetch("/api/user/employers");
        if (!response.ok) throw new Error("Failed to fetch employers");
  
        // Explicitly type the response as Employer[]
        const data: Employer[] = await response.json();
  
        // Remove duplicates based on the `id` field
        const uniqueEmployers = Array.from(
          new Map(data.map((employer) => [employer.id, employer])).values()
        );
  
        setEmployers(uniqueEmployers);
      } catch (err) {
        setError("Failed to fetch employers");
      }
    };
  
    fetchEmployers();
  }, []);
  

  const handleEmployerChange = (e: SelectChangeEvent<number>) => {
    const employerId = e.target.value;
    setSelectedEmployer(employerId ? Number(employerId) : null);  // Fallback to null if employerId is falsy

    const employer = employers.find((emp: Employer) => emp.id === employerId);
    if (employer) {
      setWithdrawalLimit(employer.withdrawalLimit ?? 100); // Fallback to 100 if no limit is set
    }
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setWithdrawalLimit(value);
  };

  const handleSaveLimit = async () => {
    if (!selectedEmployer) {
      setError("Please select an employer.");
      return;
    }
  
    const requestBody = {
      employerId: selectedEmployer,
      withdrawalLimit,
    };
    console.log("Request Body:", requestBody);  // Log the request data
  
    try {
      const response = await fetch("/api/user/update-limit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update withdrawal limit");
      }
  
      setMessage("Withdrawal limit updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };
  

  return (
    <Card elevation={ 0 } sx={{ padding: 2, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Employer Settings</Typography>
      
      {error && <Typography color="error">{error}</Typography>}
      {message && <Typography color="success.main">{message}</Typography>}

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Employer</InputLabel>
        <Select
          value={selectedEmployer || ""}
          onChange={handleEmployerChange}
          label="Select Employer"
        >
          {employers.map((employer) => (
            <MenuItem key={employer.id} value={employer.id}>
              {employer.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

 
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Set Withdrawal Limit</Typography>
          <RadioGroup
            value={withdrawalLimit.toString()}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="10000" control={<Radio />} label="0 - 10,000" />
            <FormControlLabel value="25000" control={<Radio />} label="10,000 - 25,000" />
            <FormControlLabel value="50000" control={<Radio />} label="25,000 - 50,000" />
          </RadioGroup>
        </Box>
 

      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveLimit}
        sx={{ mt: 3 }}
      >
        Save Limit
      </Button>
    </Card>
  );
};

export default EmployerSettings;
