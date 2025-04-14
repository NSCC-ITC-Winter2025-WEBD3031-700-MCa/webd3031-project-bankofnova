'use client';

import { useForm, Controller } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, TextField, Button, Card, Grid, Typography } from '@mui/material';
import PageContainer from '../../../../../components/container/PageContainer';

const AddContactPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const prefillEmail = searchParams.get('email') || '';

  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      email: prefillEmail,
      nickname: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/user/addContact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          nickname: data.nickname,
        }),
      });

      if (!response.ok) throw new Error('Failed to add contact');

      alert('Contact added successfully!');
      router.push(redirect || '/transactions/transfer');
    } catch (error) {
      console.error(error);
      alert('Error adding contact. Please try again.');
    }
  };

  return (
    <PageContainer title="Add Contact" description="Add a new contact to your list">
      <Card
        elevation={0}
        sx={{
          p: 2,
          zIndex: 1,
          width: "100%",
          marginTop: '15px',
          boxShadow: 'none !important',
          border: '1px solid #cdcdcd !important',
          paddingBottom: '25px',
          "@media (max-width:600px)": {
            p: 4,
            marginBottom: '25px',
            marginLeft: "auto",
            marginRight: "auto",
          },
          "@media (max-width:960px)": {
            p: 0,
          },
          "@media (min-width:960px)": {
            width: "90%",
            marginLeft: "auto",
            marginRight: "auto",
          },
          "@media (max-width:1044px)": {
            p: 4,
          },
        }}
      >
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Grid container spacing={2}>
            {/* Left Column: Form */}
            <Grid item xs={12} md={6}>
              <Box sx={{ maxWidth: 500, p: 3, borderRadius: 2 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  Add contact
                </Typography>
                <Typography variant="body1" color="textSecondary" mb={2}>
                  Fill out the details below to add a new contact.
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Box sx={{ mb: 2 }}>
                  
                                {/* Nickname Field */}
                                <Controller
                      name="nickname"
                      control={control}
                      rules={{
                        required: 'Nickname is required',
                        minLength: {
                          value: 2,
                          message: 'Nickname should be at least 2 characters',
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Nickname"
                          margin="normal"
                          error={!!errors.nickname}
                          helperText={errors.nickname?.message || ''}
                        />
                      )}
                    />
                  
                  
                  
                    {/* Email Field */}
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: 'Email is required',
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: 'Please enter a valid email address',
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Contact Email"
                          margin="normal"
                          error={!!errors.email}
                          helperText={errors.email?.message || ''}
                        />
                      )}
                    />

      
                  </Box>

                  {/* Buttons */}
                  <Box mt={6} display="flex" gap={2}>
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => router.push(redirect || '/transactions/transfer')}
                      fullWidth
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Add Contact
                    </Button>
                  </Box>
                </form>
              </Box>
            </Grid>

            {/* Right Column: Empty for now (reserved for future use) */}
            <Grid item xs={12} md={6}></Grid>
          </Grid>
        </Box>
      </Card>
    </PageContainer>
  );
};

export default AddContactPage;
