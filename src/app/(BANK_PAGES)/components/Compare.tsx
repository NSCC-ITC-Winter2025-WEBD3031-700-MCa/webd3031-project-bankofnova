'use client';
import {
  Box,
  Grid,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import LockIcon from '@mui/icons-material/Lock';

const features = [
  {
    label: 'No monthly fees or minimum balance',
    credit: true,
    debit: true,
  },
  {
    label: 'Deposits up to $250,000 daily',
    credit: true,
    debit: true,
  },
  {
    label: 'Move money between accounts instantly',
    credit: true,
    debit: true, 
  },
  {
    label: 'Send checks & transfer money for free',
    credit: true,
    debit: true,
  },
  {
    label: 'Build credit history from Day 1',
    credit: true,
    debit: 'lock',
  },
  {
    label: 'No credit check required for sign up',
    credit: true,
    debit: 'lock',
  },
  {
    label: 'Cost per year',
    credit: '$0',
    debit: '$0',
    isCost: true,
  },
];

export default function SableComparison() {
  return (
    <Box sx={{ py: 10, }}>
      {/* Top Card Images + Titles */}
{/* Headers Row */}
<Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  py={2}
  borderBottom="2px solid #000"
>
  <Typography flex={1}></Typography>
  <Box flex={0.5} textAlign="center">
    <Typography fontWeight={600} fontSize={18}>
      Bank of Nova<br />Credit
    </Typography>
  </Box>
  <Box flex={0.5} textAlign="center">
    <Typography fontWeight={600} fontSize={18}>
      Bank of Nova<br />Debit
    </Typography>
  </Box>
</Box>


      {/* Feature Comparison Rows */}
      <Box mt={6}  mx="auto">
        {features.map((item, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            py={2}
            borderBottom={index < features.length - 1 ? '1px solid #222' : 'none'}
          >
            <Typography flex={1}>{item.label}</Typography>

            <Box flex={0.5} textAlign="center">
              {item.credit === true ? (
                <CheckIcon sx={{ color: '#2a2a2a' }} />
              ) : item.credit === 'lock' ? (
                <LockIcon sx={{ color: '#777' }} />
              ) : (
                <Typography fontWeight="bold">{item.credit}</Typography>
              )}
            </Box>

            <Box flex={0.5} textAlign="center">
              {item.debit === true ? (
                <CheckIcon sx={{ color: '#2a2a2a' }} />
              ) : item.debit === 'lock' ? (
                <LockIcon sx={{ color: '#777' }} />
              ) : (
                <Typography fontWeight="bold">{item.debit}</Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Buttons */}
      <Grid container spacing={6} justifyContent="center" mt={6}>
        <Grid item xs={12} md={3} textAlign="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#53e3e1',
              color: '#000',
              borderRadius: 5,
              fontWeight: 600,
              px: 4,
              '&:hover': {
                backgroundColor: '#3ed1d0',
              },
            }}
          >
            GET CREDIT & DEBIT
          </Button>
        </Grid>
        <Grid item xs={12} md={3} textAlign="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#53e3e1',
              color: '#000',
              borderRadius: 5,
              fontWeight: 600,
              px: 4,
              '&:hover': {
                backgroundColor: '#3ed1d0',
              },
            }}
          >
            GET DEBIT
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
