"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/schemas/registerSchema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Stack, TextField } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google'; // Material UI Google Icon
import GitHubIcon from '@mui/icons-material/GitHub'; // GitHub Icon
import { signIn } from "next-auth/react"; // Importing the signIn function

// Define an interface to include subtext and subtitle props
interface RegisterFormProps {
  subtext?: React.ReactNode;
  subtitle?: React.ReactNode;
}

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterForm({ subtext, subtitle }: RegisterFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Registration failed");
      }

      alert("Registration successful! Redirecting to login...");
      router.push("/login");
    } catch (error: any) {
      setServerError(error.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      bgcolor="white"
      p={4}
      width="100%"
      sx={{
        '@media (max-width:800px)': { p:0 }}}
    >
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

      <Typography variant="h2" fontWeight="700" mb="40px">
        Register
      </Typography>

      {subtext && (
        <Box mb={2} textAlign="center">
          {subtext}
        </Box>
      )}

      {serverError && (
        <Typography color="error" textAlign="center" mb={2}>
          {serverError}
        </Typography>
      )}

      {subtitle && (
        <Box mb={2} textAlign="center">
          {subtitle}
        </Box>
      )}

      {/* Name Input */}
      <Stack spacing={2}>
        <Typography variant="h3" fontWeight="700" mb="20px">
          Create your Username and PIN
        </Typography>
        
        <Box>
          <TextField
            label="Name"
            fullWidth
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            variant="outlined"
            placeholder="Enter your name"
            sx={{
              marginBottom: '10px',
              width: '50%', // Default width (50% on larger screens)
              '@media (max-width:800px)': { width: '100%' }, // Full width on small screens (sm and below)
            }}     
          />
        </Box>

        {/* Password Input */}
        <Box>
          <TextField
            label="Password"
            fullWidth
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            variant="outlined"
            placeholder="Enter your password"
            sx={{
              width: '50%', // Default width (50% on larger screens)
              '@media (max-width:800px)': { width: '100%' }, // Full width on small screens (sm and below)
            }}     
          />
        </Box>

        {/* Email Input */}
        <Box>
          <Typography variant="h3" fontWeight="700" mb="20px" mt="10px">
            Enter your email address
          </Typography>
          <TextField
            label="Email"
            fullWidth
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            variant="outlined"
            placeholder="Enter your email"
            sx={{
              width: '50%', // Default width (50% on larger screens)
              '@media (max-width:800px)': { width: '100%' }, // Full width on small screens (sm and below)
            }}     
          />
        </Box>

        <Box mt={2}> {/* Adds spacing between the button and the link */}
          {/* Submit Button */}
          <Button
            color="info"
            variant="contained"
            size="large"
            type="submit"
            disableElevation
            disabled={isSubmitting}
            sx={{
              borderRadius: '16px', // Rounded corners like Chip
              padding: '6px 16px',  // Adjust padding to make it look more like a Chip
              textTransform: 'none', // Prevent text from being capitalized
              marginTop: '10px',
              marginBottom: '10px'


            }}     
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>

          {/* Login Redirect */}
          <Typography textAlign="left" color="textSecondary" variant="body2"    
            sx={{
              width: '50%', // Default width (50% on larger screens)
              '@media (max-width:800px)': { width: '100%' }, // Full width on small screens (sm and below)
            }} > Already have an account?{" "}
            <Typography
              component="a"
              href="/login"
              sx={{ 
                color: "info.main", 
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Sign In
            </Typography>
          </Typography>
        <Stack direction="column" spacing={2} my={2}>

          {/* Google SignUp Button */}
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


          {/* GitHub SignUp Button */}
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

        </Box>
      </Stack>
    </Box>
  );
}
