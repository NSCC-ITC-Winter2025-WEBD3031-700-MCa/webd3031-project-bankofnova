import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Grid, Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';

import DashboardCard from '../shared/DashboardCard';

const AllUsers = () => {
  const [userCount, setUserCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);

  useEffect(() => {
    fetch('/api/user/AllUsers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.userCount !== undefined && data.adminCount !== undefined) {
          setUserCount(data.userCount);
          setAdminCount(data.adminCount);
        }
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const theme = useTheme();
  const primary = theme.palette.primary.main;  // Blue color for regular users
  const adminColor = "#FF4560"; // Red color for admins

  const optionscolumnchart: any = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [primary, adminColor],  // Blue for users, Red for admins
    labels: ["Users", "Admin"], // ✅ Updated tooltip labels
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
      y: {
        formatter: (value: number) => `${value} Users`, // Customize tooltip value format
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
  };

  const seriescolumnchart: any = [userCount - adminCount, adminCount]; // Total - Admin for regular users, Admin count for admins

  return (
    <DashboardCard title="User Breakdown">
      <Grid container spacing={3} justifyContent="center" alignItems="center" direction="column">
        {/* Added margin top to create space between User Breakdown and Users count */}
        <Box textAlign="center" mb={2}>
          <Typography variant="h3" fontWeight="700" color={theme.palette.text.primary}>
            {userCount} Users
          </Typography>
        </Box>

        <Grid container justifyContent="center" alignItems="center">
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="donut"
            height={150}
            width="100%"
          />
        </Grid>

        {/* Added spacing to create space between the user count and the breakdown */}
        <Box mt={4} textAlign="center">
          <Typography variant="h6" fontWeight="700" color={theme.palette.text.primary}>
            Breakdown:
          </Typography>
          <Box mt={2}>
            <Typography variant="h5" fontWeight="600" color={theme.palette.text.primary}>
              {userCount - adminCount} Regular Users
            </Typography>
            <Typography variant="h5" fontWeight="600" color={theme.palette.text.primary}>
              {adminCount} Admin Users
            </Typography>
          </Box>
        </Box>
      </Grid>
    </DashboardCard>
  );
};

export default AllUsers;