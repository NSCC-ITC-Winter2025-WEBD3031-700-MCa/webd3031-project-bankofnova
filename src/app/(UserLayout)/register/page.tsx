"use client";
import { Grid, Box, Card, Typography, Stack } from "@mui/material";
// import Link from "next/link";
import PageContainer from "../components/container/PageContainer";
// import Logo from "../layout/shared/logo/Logo";
import AuthRegister from "../../authentication/auth/AuthRegister";

const Register2 = () => (
  <PageContainer title="Register" description="this is Register page">


          <Card
            elevation={9}
            sx={{ p: 4, zIndex: 1, width: "100%", }}
          >
  
            <AuthRegister
              subtitle={
                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={1}
                  mt={3}
                >

                </Stack>
              }
            />
          </Card>
  </PageContainer>
);

export default Register2;
