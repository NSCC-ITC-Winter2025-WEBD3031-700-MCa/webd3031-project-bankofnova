"use client";
import { Card } from "@mui/material";
// components
import PageContainer from "../../components/container/PageContainer";
// import Logo from "../layout/shared/logo/Logo";
import AuthLogin from "../../../authentication/auth/AuthLogin";
// import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const Login2 = () => {
  return (
    <PageContainer title="Login" description="this is Login page">
          <Card
            elevation={0}
            sx={{
              p: 2,
              zIndex: 1,
              width: "100%",
              marginTop: '45px',
              marginBottom: '35px',
              // Adding responsive styles for different breakpoints
              "@media (max-width:600px)": {
                p: 0, // Less padding for small screens (phones)
                marginBottom: '25px',
              },
              "@media (max-width:960px)": {
                p: 0, // Adjust padding for medium-sized screens (tablets)
              },
              "@media (min-width:960px)": {
                width: "90%", // Keep the card width at 80% for medium to larger screens
                marginLeft: "auto",
                marginRight: "auto",
              },
              "@media (max-width:1044px)": {
                p: 0, // Adjust padding for medium-sized screens (tablets)
              },
            }}
          >
          <AuthLogin />
        </Card>
    </PageContainer>
  );
};
export default Login2;
