import { Grid } from '@mui/material';
// import Link from 'next/link';
// import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
// import BankCard from "../components/blocks/BankCard";
// import CTA from "../components/blocks/CTA";
import React from "react";
import MuiQuickstart from "../components/MyCard";
import InfoPage from "../components/MyCard2";
// Dynamically load the Footer component as a Client Component
// import BankCardRow from "../components/blocks/BankCardRow";
import BankCardTest2 from "../components/BankCardTest2";
import MyCard3 from "../components/MyCard3";
import BankCardTest5 from "../components/BankCardTes5";
// import CardComparison from "../components/blocks/Compare";


const HomePage = () => {

  return (
  <>
  {/* <CTA /> */}

  {/* BankCardTest2 is new CTA */}
  <BankCardTest2 />
  {/* BankCardTest2 is new CTA */}

  <BankCardTest5 />
  <MuiQuickstart /> 
  
  <MyCard3 />



  {/* <CardComparison /> */}


  {/* <BankCard /> */}

  
           {/* <Grid item xs={12} lg={8}>
            <InfoPage />
            </Grid>    */}

    </>
  );
};

export default HomePage;
