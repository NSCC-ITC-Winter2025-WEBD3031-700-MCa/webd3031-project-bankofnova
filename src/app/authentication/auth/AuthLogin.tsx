"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Stack, Chip } from "@mui/material";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // For navigation
import CustomTextField from "../../(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import GoogleIcon from '@mui/icons-material/Google'; // Material UI Google Icon
import GitHubIcon from '@mui/icons-material/GitHub'; // GitHub Icon

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
        router.push("/overview");
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

      <form onSubmit={handleLogin} autoComplete="off" // Disable autofill for the entire form
      >
          {/* Hidden Dummy Inputs to Trick Browsers for Autofill Prevention */}
          {/* Some browsers ignore autoComplete="off", so adding dummy fields can help */}
          <input
            type="text"
            name="fakeUsername"
            style={{ display: 'none' }}
            autoComplete="username"
          />
          <input
            type="password"
            name="fakePassword"
            style={{ display: 'none' }}
            autoComplete="new-password"
          />

        <Stack>
          <Box>
            <CustomTextField
              label="Email or Login ID"
              type="login"
              variant="outlined"
              sx={{
                width: '50%', // Default width (50% on larger screens)
                '@media (max-width:800px)': { width: '100%' }, // Full width on small screens (sm and below)
              }}              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIdentifier(e.target.value)
              }
              error={!!identifierError} // Apply error styling if validation fails
              helperText={identifierError} // Show validation error message
            />
          </Box>
          <Box mt="25px">
            <CustomTextField
              label="Password"
              type="password"
              variant="outlined"
              sx={{
                width: '50%', // Default width (50% on larger screens)
                '@media (max-width:800px)': { width: '100%' }, // Full width on small screens (sm and below)
              }}              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </Box>

          {error && (
            <Typography color="error" mt={2} textAlign="left">
              {error}
            </Typography>
          )}
        </Stack>

        <Box mt={2}>
          <Button
            color="info"
            variant="contained"
            size="large"
            type="submit"
            disableElevation
            sx={{
              borderRadius: '16px', // Rounded corners like Chip
              padding: '6px 16px',  // Adjust padding to make it look more like a Chip
              textTransform: 'none' // Prevent text from being capitalized
            }}
          >
            Sign In
          </Button>

          <Box mt={2}> {/* Adds spacing between the button and the link */}
            <Typography
              component="a"
              href="/authentication/forgot-password"
              fontWeight="500"
              sx={{
                textDecoration: 'none',
                color: 'info.main',
                display: 'block', // Ensures the link is treated as a block element, stacking it vertically
              }}
            >
              Forgot Password?
            </Typography>
          </Box>
        </Box>

        <Stack direction="column" spacing={2} my={2}>
          {/* Google Login Button */}
          <Button
            variant="outlined"
            color="info"
            onClick={() => signIn("google")}
            sx={{
              width: '50%', // Default width (50% on larger screens)
              '@media (max-width:800px)': { width: '100%' }, // Full width on small screens (sm and below)
            }}   
            startIcon={<GoogleIcon />}
          >
            Sign up with Google
          </Button>

          {/* GitHub SignIn Button */}
          <Button
            variant="outlined"
            color="info"
            onClick={() => signIn("github")}
            sx={{
              width: '50%', // Default width (50% on larger screens)
              '@media (max-width:800px)': { width: '100%' }, // Full width on small screens (sm and below)
            }}  
            startIcon={<GitHubIcon />}
          >
            Sign in with GitHub
          </Button>
        </Stack>
      </form>

      {subtitle}
    </>
  );
};

export default AuthLogin;
