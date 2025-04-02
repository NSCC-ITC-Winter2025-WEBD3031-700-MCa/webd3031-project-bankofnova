"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/schemas/registerSchema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Stack, TextField, Card, Divider, Stepper, Step, StepLabel } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import { signIn } from "next-auth/react";

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
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<RegisterFormData | null>(null); // Store form data for confirmation
  const steps = ["Create Username and Password", "Confirm Details"];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Handle Step 1 (no form submission, just move to step 2)
  const onNextStep = (data: RegisterFormData) => {
    setFormData(data); // Store form data for confirmation
    setActiveStep(1); // Move to step 2 (confirmation step)
  };

  // Handle Step 2 (final form submission)
  const onSubmitFinal = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
      {/* Horizontal Stepper */}
      <Stepper activeStep={activeStep} orientation="horizontal" sx={{ mb: 3 }}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Registration Form Card */}
      <Card
        elevation={9}
        sx={{
          p: 6,
          zIndex: 1,
          width: "100%",
          // Adding responsive styles for different breakpoints
          "@media (max-width:600px)": {
            p: 4, // Less padding for small screens (phones)
            marginBottom: "25px",
            marginLeft: "auto",
            marginRight: "auto",
          },
          "@media (max-width:1044px)": {
            p: 4, // Adjust padding for medium-sized screens (tablets)
          },
        }}
      >
        {/* Form Section */}
        <Box
          component="form"
          onSubmit={handleSubmit(activeStep === 0 ? onNextStep : onSubmitFinal)} // On step 1, just move to step 2
          display="flex"
          flexDirection="column"
          width="100%"
        >
          <input
            type="text"
            name="fakeUsername"
            style={{ display: "none" }}
            autoComplete="username"
          />
          <input
            type="password"
            name="fakePassword"
            style={{ display: "none" }}
            autoComplete="new-password"
          />

          {activeStep === 0 && (
            <>
              <Typography variant="h3" fontWeight="700" mb="33px">
                Register
              </Typography>

              {subtext && (
                <Box mb={2} textAlign="center">
                  {subtext}
                </Box>
              )}

              <Typography variant="h3" fontWeight="700" mb="25px">
                Create your Username and PIN
              </Typography>

              <Stack spacing={2} width="100%" maxWidth="400px">
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

                <TextField
                  label="Name"
                  fullWidth
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  variant="outlined"
                  placeholder="Enter your name"
                  sx={{ maxWidth: "320px" }}
                />

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
                    maxWidth: "320px",
                    marginBottom: "25px !important",
                    marginTop: "25px !important",
                  }}
                />

                <Typography variant="h3" fontWeight="700">
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
                    marginBottom: "15px !important", // Adjust the value to your preference
                    maxWidth: "320px",
                    marginTop: "25px !important",
                  }}
                />

                <Button
                  color="primary"
                  variant="contained"
                  type="submit" // This submits only the form on step 1, doesn't redirect
                  disableElevation
                  disabled={isSubmitting}
                  sx={{
                    width: "80px",
                    height: "44px",
                    marginBottom: "20px !important",
                    borderRadius: "10px",
                    marginTop: "6px",
                  }}
                >
                  <Typography variant="h6">
                  Next
                  </Typography>
                </Button>
              </Stack>
              <Divider sx={{ maxWidth: "406px", marginTop: "20px", display: "flex", alignItems: "center" }}>
        <Typography sx={{ padding: "0 10px" }}>or</Typography>
      </Divider>

      {/* Third-party Logins */}
      <Stack direction="column" spacing={2} mt={4} width="100%">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => signIn("google")}
          startIcon={<GoogleIcon />}
          sx={{ maxWidth: "406px" }}
        >
          Sign up with Google
        </Button>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => signIn("github")}
          startIcon={<GitHubIcon />}
          sx={{ maxWidth: "406px" }}
        >
          Sign in with GitHub
        </Button>
      </Stack>
            </>
          )}

          {activeStep === 1 && formData && (
            <>
              <Typography variant="h3" fontWeight="700" mb="33px">
                Confirm Your Details
              </Typography>

              <Stack spacing={2} width="100%" maxWidth="400px">
                <Typography variant="h6">Name: {formData.name}</Typography>
                <Typography variant="h6">Email: {formData.email}</Typography>
                
                
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
  {/* Back Button */}
  <Button
    color="primary"
    variant="contained"
    onClick={() => setActiveStep(0)} // Go back to step 1
    disableElevation
    sx={{
      width: "120px",
      height: "44px",
      borderColor: "primary.main",
      textTransform: "none", // Disable uppercase text for a clean look

      marginRight: 2, // Add spacing between Back and Next buttons
    }}
  >
    <Typography variant="h6">
      Back
    </Typography>
  </Button>

  {/* Spacer to push buttons to opposite ends */}
  <Box sx={{ flex: '1 1 auto' }} />

  {/* Submit Button */}
  <Stack spacing={2} width="100%" maxWidth="400px">
    <Button
      color="primary"
      variant="contained"
      onClick={onSubmitFinal} // Submit the form
      disableElevation
      sx={{
        width: "120px",
        height: "44px",
        marginBottom: "20px !important",
        marginTop: "6px",
        
      }}
    >
      <Typography variant="h6">
        {isSubmitting ? "Registering..." : "Submit"}
      </Typography>
    </Button>
  </Stack>
</Box>
              </Stack>
            </>
          )}

        </Box>

      </Card>

    </Box>
  );
}
