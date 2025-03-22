"use client";
import Link from "next/link";
import { Grid, Box, Card, Stack, Typography } from "@mui/material";
// components
import PageContainer from "../components/container/PageContainer";
// import Logo from "../layout/shared/logo/Logo";
import AuthLogin from "../../authentication/auth/AuthLogin";
// import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const Login2 = () => {
  return (
    <PageContainer title="Login" description="this is Login page">
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={6}
        >

          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{mt:6, p: 4, zIndex: 1, width: "100%", maxWidth: "1000px" }}
            >
              <Box display="flex" alignItems="center" justifyContent="left">
              <Typography variant="h2" fontWeight="700" mb="40px">
                Log in
              </Typography>
              </Box>
              <AuthLogin
                subtitle={
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="left"
                    mt={3}
                    sx={{
                    width: '50%', // Default width (50% on larger screens)
                    '@media (max-width:800px)': { width: '100%', justifyContent: "center" }}}
                  >
                    <Typography
                      color="textSecondary"
                      variant="h6"
                      fontWeight="500"
                    >
                      New to Bank of Nova?
                    </Typography>
                    <Typography
                      component={Link}
                      href="/register"
                      fontWeight="500"
                      sx={{
                        textDecoration: "none",
                        color: "primary.main",
                      }}
                    >
                      Create an account
                    </Typography>
                  </Stack>
                }
              />
            </Card>
          </Grid>
        </Grid>

    </PageContainer>
  );
};
export default Login2;
