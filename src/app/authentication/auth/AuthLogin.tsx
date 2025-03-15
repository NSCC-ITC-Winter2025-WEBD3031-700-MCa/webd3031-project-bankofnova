"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { signIn, getSession } from "next-auth/react"; 
import { useRouter } from "next/navigation"; // For navigation
import CustomTextField from "../../(DashboardLayout)/components/forms/theme-elements/CustomTextField";

interface LoginProps {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: LoginProps) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [identifierError, setIdentifierError] = useState(""); // State for validation error
  const router = useRouter();

  // Function to check if input is a valid email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Function to check if input is a valid 10-digit number
  const isValidAccountNumber = (accountNumber: string) => {
    return /^\d{10}$/.test(accountNumber);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the identifier (it must be either a 10-digit number or a valid email)
    if (!isValidAccountNumber(identifier) && !isValidEmail(identifier)) {
      setIdentifierError("Enter a valid 10-digit account number or a valid email address.");
      return;
    } else {
      setIdentifierError(""); // Clear error if valid
    }

    const res = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
    });

    if (res?.error) {
      setError(res.error);
      console.log("Login failed", res.error);
    } else {
      setError("");
      console.log("Login successful", res);

      // Fetch session data to get user role
      const session = await getSession();
      console.log("Session after login:", session);

      if (session?.user?.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/userprofile");
      }
    }
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      <form onSubmit={handleLogin}>
        <Stack>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="email"
              mb="5px"
            >
              Email or Account Number
            </Typography>
            <CustomTextField
              variant="outlined"
              fullWidth
              value={identifier}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIdentifier(e.target.value)
              }
              error={!!identifierError} // Apply error styling if validation fails
              helperText={identifierError} // Show validation error message
            />
          </Box>
          <Box mt="25px">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              Password or PIN
            </Typography>

            <CustomTextField
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </Box>

          {error && (
            <Typography color="error" mt={2} textAlign="center">
              {error}
            </Typography>
          )}

          <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
            <Typography
              component="a"
              href="/authentication/forgot-password"
              fontWeight="500"
              sx={{ textDecoration: "none", color: "primary.main" }}
            >
              Forgot Password?
            </Typography>
          </Stack>
        </Stack>

        <Box>
          <Button color="primary" variant="contained" size="large" fullWidth type="submit">
            Sign In
          </Button>
        </Box>
      </form>

      {subtitle}
    </>
  );
};

export default AuthLogin;
