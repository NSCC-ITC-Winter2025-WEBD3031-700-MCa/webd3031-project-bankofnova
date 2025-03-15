"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/schemas/registerSchema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Stack, TextField } from "@mui/material";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterForm() {
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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="20vh" bgcolor="grey.100">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        bgcolor="white"
        boxShadow={3}
        borderRadius={2}
        p={4}
        width="100%"
        maxWidth="400px"
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={2}>
          Register
        </Typography>

        {serverError && (
          <Typography color="error" textAlign="center" mb={2}>
            {serverError}
          </Typography>
        )}

        {/* Name Input */}
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="name">
              Name
            </Typography>
            <TextField
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              variant="outlined"
              placeholder="Enter your name"
            />
          </Box>

          {/* Email Input */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="email">
              Email
            </Typography>
            <TextField
              fullWidth
              type="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              variant="outlined"
              placeholder="Enter your email"
            />
          </Box>

          {/* Password Input */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password">
              Password
            </Typography>
            <TextField
              fullWidth
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              variant="outlined"
              placeholder="Enter your password"
            />
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>

          {/* Login Redirect */}
          <Typography textAlign="center" color="textSecondary" variant="body2">
            Already have an account?{" "}
            <Typography
              component="a"
              href="/login"
              sx={{ color: "primary.main", textDecoration: "none", fontWeight: "bold" }}
            >
              Sign In
            </Typography>
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}