import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab } from '@mui/material';
import { IconCurrencyDollar } from '@tabler/icons-react';
import DashboardCard from './shared/DashboardCard';
import Link from 'next/link'; // Import Link from Next.js

interface MonthlyEarningsProps {
  title: string;
  balance: number;
  link: string;
  color?: string; // Optional prop for color
}

const MonthlyEarnings = ({ title, balance, link, color }: MonthlyEarningsProps) => {
  // chart color
  const theme = useTheme();
  // const secondary = theme.palette.secondary.main;
  const secondary = color || theme.palette.secondary.main; // Use prop if provided
  const secondarylight = '#f5fcff';
  
  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',   
      toolbar: {
        show: false,
      },
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      colors: [secondarylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };
  const seriescolumnchart: any = [
    {
      name: '',
      color: secondary,
      data: [25, 66, 20, 40, 12, 58, 20],
    },
  ];

  return (
      <DashboardCard
        title={title}
        action={
    <Link href={link} passHref>

          <Fab color="secondary" size="medium" sx={{ color: '#ffffff' }}>
            <IconCurrencyDollar width={24} />
          </Fab>
    </Link>

        }
        footer={
          <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height={60} width={"100%"} />
        }
      >
        <>

          <Typography variant="h3" fontWeight="700" mt="-20px">
            ${balance}
          </Typography>

        </>
      </DashboardCard>
  );
};

export default MonthlyEarnings;
