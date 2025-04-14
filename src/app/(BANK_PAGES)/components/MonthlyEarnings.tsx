// import dynamic from "next/dynamic";
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab, Card } from '@mui/material';
import { IconCurrencyDollar } from '@tabler/icons-react';
import DashboardCard from './shared/DashboardCard';
import Link from 'next/link'; // Import Link from Next.js

interface MonthlyEarningsProps {
  title: React.ReactNode; 
  balance: number;
  link: string;
  color?: string;
  transactions?: any[];
}


const MonthlyEarnings = ({ title, balance, link, color }: MonthlyEarningsProps) => {
  // chart color
  const theme = useTheme();
  // const secondary = theme.palette.secondary.main;
  const secondary = color || theme.palette.secondary.main; // Use prop if provided
  const secondarylight = '#f5fcff';
  

  return (
    
<Link href={link} passHref legacyBehavior>
  <Card
    elevation={0}
    sx={{
      zIndex: 1,
      width: "100%",
      marginTop: '15px',
      boxShadow: 'none !important',
      borderBottom: '1px solid #cdcdcd !important',
      paddingBottom: '25px',
      borderRadius: 0,
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: theme.palette.grey[100],
        cursor: 'pointer',
      },
    }}
  >
      <DashboardCard
        elevation={0}
        title={title}
        action={
          
    <Link href={link} passHref>

          <Fab color="secondary" size="medium" sx={{ color: '#ffffff' }}>
            <IconCurrencyDollar width={24} />
          </Fab>
    </Link>

        }
        
        // footer={
        //   <Typography variant="h3" fontWeight="700" mt="-20px">
        //   ${balance}
        // </Typography>
        // }
      >
       
        
        <>

          <Typography variant="h3" fontWeight="700" mt="-20px">
            ${balance}
          </Typography>

        </>
      </DashboardCard>
      </Card>
      </Link>

  );
};

export default MonthlyEarnings;
