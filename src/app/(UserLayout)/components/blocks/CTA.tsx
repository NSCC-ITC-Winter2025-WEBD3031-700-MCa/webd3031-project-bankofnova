import { Box, Typography, Button, Stack } from '@mui/material';
import Link from 'next/link';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const CTA = () => {
  return (
    <DashboardCard elevation={0} borderRadius={0}>
      <Stack>
        <Box
          sx={{
            textAlign: { xs: 'center', md: 'left' }, // Use MUI's responsive styling
            pt: 3,
          }}
        >
          <Typography variant="h2" fontWeight="600" mb="20px">
            Open a Bank of Nova Chequing Account
          </Typography>
          <Link href="/register" passHref>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  borderRadius: '10px',
                  marginTop: '6px',
                  marginBottom: '4px',
                  height: '44px',
                }}
                disableElevation
              >
              <Typography variant="h6">Get Started</Typography>
            </Button>
          </Link>
        </Box>
      </Stack>
    </DashboardCard>
  );
};

export default CTA;
