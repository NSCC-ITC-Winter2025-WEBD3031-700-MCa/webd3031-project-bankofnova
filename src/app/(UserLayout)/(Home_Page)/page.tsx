'use client';
import { Box, Typography, Grid, CardContent } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const Shadow = () => {
  return (
    <PageContainer title="Homepage" description="This is Homepage">
      {/* Example of DashboardCard with custom title, subtitle, and action */}
      <DashboardCard
        elevation={0}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DashboardCard
              title="11111111"
              subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis quibusdam maiores officia explicabo."
            >
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DashboardCard
              title="Test"
              subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis voluptatibus eius neque molestiae magni sapiente."
            >
            </DashboardCard>
          </Grid>
        </Grid>
      </DashboardCard>

    
      {/* Another DashboardCard with a custom action */}
      <DashboardCard
        title="Card 3"
        subtitle="This is card 3 with a custom action"
        action={<Typography variant="body2" color="primary">More Info</Typography>}
        elevation={5}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DashboardCard
              title="12345678"
              subtitle="Quisquam praesentium similique voluptatibus odio dignissimos recusandae voluptatum."
              elevation={0}
            >
  
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DashboardCard
              title="Sample"
              subtitle="Consectetur adipiscing elit. Nunc auctor tristique libero, ac auctor magna."
              elevation={0}
            >
 
            </DashboardCard>
          </Grid>
        </Grid>
      </DashboardCard>
    </PageContainer>
  );
};

export default Shadow;
