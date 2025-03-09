import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import CustomTextField from '../../(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import axios from 'axios';

interface registerType {
    title?: string;
    subtitle?: JSX.Element | JSX.Element[];
    subtext?: JSX.Element | JSX.Element[];
}

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
    // State to store form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    // State to manage loading and error
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Hook for navigation
    const router = useRouter();

    // Handle input field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Send a POST request to register the user
            const response = await axios.post('/api/auth/register', formData);
            
            // If registration is successful, redirect to the login page
            if (response.status === 201) {
                router.push('/login');
            }
        } catch (err) {
            // Handle error (e.g., show error message)
            setError('Error occurred during registration. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
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

            <Box component="form" onSubmit={handleSubmit}>
                <Stack mb={3}>
                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="name" mb="5px">
                        Name
                    </Typography>
                    <CustomTextField
                        id="name"
                        variant="outlined"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="email" mb="5px" mt="25px">
                        Email Address
                    </Typography>
                    <CustomTextField
                        id="email"
                        variant="outlined"
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password" mb="5px" mt="25px">
                        Password
                    </Typography>
                    <CustomTextField
                        id="password"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </Stack>

                {error && (
                    <Typography color="error" variant="body2" mb={2}>
                        {error}
                    </Typography>
                )}

                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </Button>
            </Box>

            {subtitle}
        </>
    );
};

export default AuthRegister;
