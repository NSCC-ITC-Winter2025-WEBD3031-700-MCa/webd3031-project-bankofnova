'use client';

import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useTransferContext } from '../../../context/TransferContext';
import { Typography, Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

const SuccessPage = () => {
  const { transferData } = useTransferContext();
  const router = useRouter();

  const formattedDate = transferData.date
    ? new Date(transferData.date).toLocaleDateString()
    : 'N/A';

  return (
    <PageContainer title="Success" description="Transfer completed">
      <DashboardCard title="Transfer Receipt">
        {transferData && transferData.amount ? (
          <Box>
            {/* Title */}
            <Typography variant="h6" gutterBottom>
              ✅ Transfer Successful!
            </Typography>

            {/* Transaction Summary */}
            <Box mb={2}>
              <Typography variant="body1">
                <strong>Transaction Type:</strong> {transferData.transactionType || 'Transfer'}
              </Typography>
              {transferData.transactionId && (
                <Typography variant="body1">
                  <strong>Transaction ID:</strong> {transferData.transactionId}
                </Typography>
              )}
              <Typography variant="body1">
                <strong>Amount:</strong> ${transferData.amount}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {transferData.status || 'Completed'}
              </Typography>
              <Typography variant="body1">
                <strong>Date:</strong> {formattedDate}
              </Typography>
            </Box>

            {/* Sender Details */}
            <Box mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Sender Account</strong>
              </Typography>
              <Typography variant="body2">
                Account Number: {transferData.senderAccountNumber || 'N/A'}
              </Typography>
              <Typography variant="body2">
                Account Type: {transferData.senderAccountType || 'N/A'}
              </Typography>
            </Box>

            {/* Recipient Details */}
            <Box mb={2}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Recipient</strong>
              </Typography>
              <Typography variant="body2">
                Name: {transferData.recipientName || 'N/A'}
              </Typography>
              <Typography variant="body2">
                Email: {transferData.recipientEmail || 'N/A'}
              </Typography>
            </Box>

            {/* Actions */}
            <Box mt={3} display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/overview')}
              >
                Back to Overview
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography>Transfer completed, but details are unavailable.</Typography>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default SuccessPage;
